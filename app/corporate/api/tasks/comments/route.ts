import { NextResponse, type NextRequest } from 'next/server';
import { getMessagingIdentity, corpIdentityFailure } from '@/lib/corp/api';
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
  if (!id) return corpIdentityFailure(req);
  const taskId = new URL(req.url).searchParams.get('task_id');
  if (!taskId) return NextResponse.json({ error: 'task_id required' }, { status: 400 });
  if (!(await canSeeTask(taskId, id))) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const { data: comments } = await supabaseAdmin
    .from('corp_task_comments')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })
    .limit(200);

  const { data: admins } = await supabaseAdmin
    .from('corp_department_admins')
    .select('id, display_name, status');
  const nameById: Record<string, string> = {};
  (admins ?? []).forEach((a) => (nameById[a.id] = a.display_name || 'Admin'));
  // Teammates available to @mention (active, named, not me).
  const roster = (admins ?? [])
    .filter((a) => a.display_name && a.status === 'active' && a.id !== id.adminId)
    .map((a) => ({ id: a.id as string, display_name: a.display_name as string }));

  // Opening the thread clears any @mentions on this task for me.
  await supabaseAdmin
    .from('corp_task_mentions')
    .update({ read_at: new Date().toISOString() })
    .eq('task_id', taskId)
    .eq('mentioned_admin_id', id.adminId)
    .is('read_at', null);

  return NextResponse.json({ comments: comments ?? [], nameById, roster, me: id.adminId });
}

// POST — add a comment to a task.
export async function POST(req: NextRequest) {
  const id = await getMessagingIdentity(req);
  if (!id) return corpIdentityFailure(req);
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

  // @mentions → notify matched active admins (same convention as the channel).
  try {
    const { data: admins } = await supabaseAdmin
      .from('corp_department_admins')
      .select('id, display_name')
      .eq('status', 'active');
    const mentioned = (admins ?? []).filter(
      (a) => a.display_name && a.id !== id.adminId && text.includes('@' + a.display_name)
    );
    if (mentioned.length) {
      await supabaseAdmin.from('corp_task_mentions').insert(
        mentioned.map((a) => ({ task_id: taskId, comment_id: data.id, mentioned_admin_id: a.id }))
      );
    }
  } catch (e) {
    console.error('task mention parse failed (continuing):', e);
  }

  return NextResponse.json({ comment: data });
}
