import { NextResponse, type NextRequest } from 'next/server';
import { getMessagingIdentity, adminHasCapability, writeAudit, corpIdentityFailure } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Any "manage" capability lets a sub-admin create work inside their department.
const WORK_CAPS = [
  'can_manage_bookings',
  'can_manage_leads',
  'can_manage_customers',
  'can_manage_content',
  'can_manage_payments',
  'can_respond_support',
];

async function departmentDirectory() {
  // Canonical departments; fall back to the distinct ones referenced by admins.
  const { data: depts } = await supabaseAdmin
    .from('corp_departments')
    .select('id, name, active')
    .order('id', { ascending: true });
  if (depts && depts.length) {
    return depts.filter((d) => d.active).map((d) => ({ id: d.id as number, name: d.name as string }));
  }
  const { data: admins } = await supabaseAdmin
    .from('corp_department_admins')
    .select('department_id, department_name');
  const seen = new Set<number>();
  const out: { id: number; name: string }[] = [];
  (admins ?? []).forEach((a) => {
    if (a.department_id != null && !seen.has(a.department_id)) {
      seen.add(a.department_id);
      out.push({ id: a.department_id, name: a.department_name || `Dept ${a.department_id}` });
    }
  });
  return out;
}

// GET — the task board, scoped to who's asking.
export async function GET(req: NextRequest) {
  const id = await getMessagingIdentity(req);
  if (!id) return corpIdentityFailure(req);

  let q = supabaseAdmin.from('corp_tasks').select('*').order('created_at', { ascending: false }).limit(500);
  if (!id.isSuper) {
    // own department OR personally assigned
    q = q.or(`department_id.eq.${id.departmentId ?? -1},assignee_id.eq.${id.adminId}`);
  }
  const { data: tasks } = await q;

  const { data: admins } = await supabaseAdmin
    .from('corp_department_admins')
    .select('id, display_name, department_id, department_name, status');
  const nameById: Record<string, string> = {};
  (admins ?? []).forEach((a) => (nameById[a.id] = a.display_name || 'Admin'));

  const departments = await departmentDirectory();
  const deptNameById: Record<number, string> = {};
  departments.forEach((d) => (deptNameById[d.id] = d.name));

  // roster for assignee pickers (active, named)
  const roster = (admins ?? [])
    .filter((a) => a.display_name && a.status === 'active')
    .map((a) => ({ id: a.id as string, display_name: a.display_name as string, department_id: a.department_id as number | null }));

  return NextResponse.json({
    tasks: tasks ?? [],
    nameById,
    deptNameById,
    departments,
    roster,
    me: id.adminId,
    isSuper: id.isSuper,
    departmentId: id.departmentId,
  });
}

// POST — create/assign a task.
export async function POST(req: NextRequest) {
  const id = await getMessagingIdentity(req);
  if (!id) return corpIdentityFailure(req);
  if (id.isVisitor) return NextResponse.json({ error: 'Visitors are read-only.' }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const title = (body.title || '').toString().trim();
  if (!title) return NextResponse.json({ error: 'A task title is required.' }, { status: 400 });

  let departmentId: number | null = body.department_id != null ? Number(body.department_id) : null;
  let assigneeId: string | null = body.assignee_id || null;

  if (!id.isSuper) {
    // Sub-admins need a work responsibility, and can only create inside their own department.
    const canWork = await Promise.all(WORK_CAPS.map((c) => adminHasCapability(id.adminId, c)));
    if (!canWork.some(Boolean)) {
      return NextResponse.json({ error: 'You do not have a responsibility that allows creating work.' }, { status: 403 });
    }
    departmentId = id.departmentId ?? null;
  }

  const priority = ['low', 'normal', 'high', 'urgent'].includes(body.priority) ? body.priority : 'normal';
  const due_date = body.due_date || null;

  const { data, error } = await supabaseAdmin
    .from('corp_tasks')
    .insert({
      title,
      detail: (body.detail || '').toString().trim() || null,
      department_id: departmentId,
      assignee_id: assigneeId,
      created_by: id.adminId,
      priority,
      due_date,
      status: 'open',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await writeAudit(id.adminId, 'task.create', assigneeId, { task_id: data.id, department_id: departmentId, title });
  return NextResponse.json({ task: data });
}
