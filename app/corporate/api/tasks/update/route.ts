import { NextResponse, type NextRequest } from 'next/server';
import { getMessagingIdentity, writeAudit } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// POST — claim / move status / reprioritise / reassign a task.
// Sub-admins may act on tasks in their department or assigned to them.
// Super/main admin may act on anything and reassign to anyone.
export async function POST(req: NextRequest) {
  const id = await getMessagingIdentity(req);
  if (!id) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (id.isVisitor) return NextResponse.json({ error: 'Visitors are read-only.' }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const taskId = body.task_id;
  if (!taskId) return NextResponse.json({ error: 'task_id required' }, { status: 400 });

  const { data: task } = await supabaseAdmin.from('corp_tasks').select('*').eq('id', taskId).maybeSingle();
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

  // Authorisation for non-super actors.
  if (!id.isSuper) {
    const mine = task.assignee_id === id.adminId || task.department_id === id.departmentId;
    if (!mine) return NextResponse.json({ error: 'This task is not in your department.' }, { status: 403 });
  }

  const patch: Record<string, unknown> = {};

  if (body.action === 'claim') {
    patch.assignee_id = id.adminId;
    if (task.status === 'open') patch.status = 'in_progress';
  } else {
    if (body.status && ['open', 'in_progress', 'blocked', 'done'].includes(body.status)) {
      patch.status = body.status;
      patch.completed_at = body.status === 'done' ? new Date().toISOString() : null;
    }
    if (body.priority && ['low', 'normal', 'high', 'urgent'].includes(body.priority)) patch.priority = body.priority;
    if (body.due_date !== undefined) patch.due_date = body.due_date || null;
    // Reassign / retarget department — super/main only.
    if (id.isSuper) {
      if (body.assignee_id !== undefined) patch.assignee_id = body.assignee_id || null;
      if (body.department_id !== undefined) patch.department_id = body.department_id != null ? Number(body.department_id) : null;
    }
  }

  if (Object.keys(patch).length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });

  const { data, error } = await supabaseAdmin.from('corp_tasks').update(patch).eq('id', taskId).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await writeAudit(id.adminId, 'task.update', task.assignee_id, { task_id: taskId, ...patch });
  return NextResponse.json({ task: data });
}

// DELETE — remove a task (super/main only).
export async function DELETE(req: NextRequest) {
  const id = await getMessagingIdentity(req);
  if (!id) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!id.isSuper) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get('id');
  if (!taskId) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const { error } = await supabaseAdmin.from('corp_tasks').delete().eq('id', taskId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await writeAudit(id.adminId, 'task.delete', null, { task_id: taskId });
  return NextResponse.json({ ok: true });
}
