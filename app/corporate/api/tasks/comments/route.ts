import { NextResponse, type NextRequest } from 'next/server';
import { getMessagingIdentity } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Is this task visible to the actor? (super/main sees all; else own dept or assigned.)
async function canSeeTask(taskId: string, id: { isSuper: boolean; departmentId: number | null; adminId: string }) {
  if (id.isSuper) return true;
  const { data: t } = await supabaseAdmin.from('corp_tasks').select('department_id, assignee_id').eq('id', taskId).maybeSingle();
  if (!t) return false;
  return t.assignee_id === id.adminId || t.department_id === id.departmentId;
}

// GET ?task_id= — comments for one task, oldest first.
export async function GET(req: NextRequest) {
  const id = await getMessagingIdentity(req);
  if (!id) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const taskId = new URL(req.url).searchParams.get('task_id');
  if (!taskId) return NextResponse.json({ error: 'task_id required' }, { status: 400 });
  if (!(await canSeeTask(taskId, id))) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const { data: comments } = await supabaseAdmin
    .from('corp_task_comments')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })
    .limit(200);

  const { data: admins } = await supabaseAdmin.from('corp_department_admins').select('id, display_name');
  const nameById: Record<string, string> = {};
  (admins ?? []).forEach((a) => (nameById[a.id] = a.display_name || 'Admin'));

  return NextResponse.json({ comments: comments ?? [], nameById, me: id.adminId });
}

// POST — add a comment to a task.
export async function POST(req: NextRequest) {
  const id = await getMessagingIdentity(req);
  if (!id) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (id.isVisitor) return NextResponse.json({ error: 'Visitors are read-only.' }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const taskId = body.task_id;
  const text = (body.body || '').toString().trim();
  if (!taskId || !text) return NextResponse.json({ error: 'task_id and body required' }, { status: 400 });
  if (!(await canSeeTask(taskId, id))) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from('corp_task_comments')
    .insert({ task_id: taskId, author_id: id.adminId, body: text })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ comment: data });
}
