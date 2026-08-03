import { NextResponse, type NextRequest } from 'next/server';
import { getMessagingIdentity, writeAudit, corpIdentityFailure } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// GET — list departments with headcount + open-task counts.
export async function GET(req: NextRequest) {
  const id = await getMessagingIdentity(req);
  if (!id) return corpIdentityFailure(req);

  const [{ data: depts }, { data: admins }, { data: tasks }] = await Promise.all([
    supabaseAdmin.from('corp_departments').select('*').order('id', { ascending: true }),
    supabaseAdmin.from('corp_department_admins').select('department_id, status'),
    supabaseAdmin.from('corp_tasks').select('department_id, status'),
  ]);

  const headcount: Record<number, number> = {};
  (admins ?? []).forEach((a) => {
    if (a.department_id != null && a.status === 'active') headcount[a.department_id] = (headcount[a.department_id] || 0) + 1;
  });
  const openTasks: Record<number, number> = {};
  (tasks ?? []).forEach((t) => {
    if (t.department_id != null && t.status !== 'done') openTasks[t.department_id] = (openTasks[t.department_id] || 0) + 1;
  });

  const departments = (depts ?? []).map((d) => ({
    ...d,
    headcount: headcount[d.id] || 0,
    open_tasks: openTasks[d.id] || 0,
  }));

  return NextResponse.json({ departments, isSuper: id.isSuper });
}

// POST — create or rename a department (super / main admin only).
export async function POST(req: NextRequest) {
  const id = await getMessagingIdentity(req);
  if (!id?.isSuper) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const name = (body.name || '').toString().trim();
  if (!name) return NextResponse.json({ error: 'Department name is required.' }, { status: 400 });

  if (body.id != null) {
    // rename / edit existing
    const { data, error } = await supabaseAdmin
      .from('corp_departments')
      .update({ name, description: (body.description || '').toString().trim() || null, active: body.active !== false })
      .eq('id', Number(body.id))
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await writeAudit(id.adminId, 'department.update', null, { id: body.id, name });
    return NextResponse.json({ department: data });
  }

  // create new: next id above current max
  const { data: max } = await supabaseAdmin.from('corp_departments').select('id').order('id', { ascending: false }).limit(1).maybeSingle();
  const nextId = (max?.id ?? 0) + 1;
  const { data, error } = await supabaseAdmin
    .from('corp_departments')
    .insert({ id: nextId, name, description: (body.description || '').toString().trim() || null })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await writeAudit(id.adminId, 'department.create', null, { id: nextId, name });
  return NextResponse.json({ department: data });
}
