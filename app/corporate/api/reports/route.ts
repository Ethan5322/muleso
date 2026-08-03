import { NextResponse, type NextRequest } from 'next/server';
import { getMessagingIdentity, corpIdentityFailure } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

interface DeptReport {
  id: number;
  name: string;
  headcount: number;
  open: number;
  in_progress: number;
  blocked: number;
  done: number;
  overdue: number;
  total: number;
  completion: number; // % done of all-time tasks
}

// Per-department performance for the main admin. Super/main only.
export async function GET(req: NextRequest) {
  const id = await getMessagingIdentity(req);
  // No identity at all can mean "not signed in" or "service-role key missing";
  // corpIdentityFailure(req) tells those apart. A real identity that just is not
  // super is a genuine permission answer.
  if (!id) return corpIdentityFailure(req);
  if (!id.isSuper) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const [{ data: depts }, { data: admins }, { data: tasks }] = await Promise.all([
    supabaseAdmin.from('corp_departments').select('id, name, active').order('id', { ascending: true }),
    supabaseAdmin.from('corp_department_admins').select('department_id, status'),
    supabaseAdmin.from('corp_tasks').select('department_id, status, due_date'),
  ]);

  const today = new Date(new Date().toDateString());
  const headcount: Record<number, number> = {};
  (admins ?? []).forEach((a) => {
    if (a.department_id != null && a.status === 'active') headcount[a.department_id] = (headcount[a.department_id] || 0) + 1;
  });

  const reports: DeptReport[] = (depts ?? [])
    .filter((d) => d.active)
    .map((d) => {
      const dt = (tasks ?? []).filter((t) => t.department_id === d.id);
      const done = dt.filter((t) => t.status === 'done').length;
      const total = dt.length;
      return {
        id: d.id,
        name: d.name,
        headcount: headcount[d.id] || 0,
        open: dt.filter((t) => t.status === 'open').length,
        in_progress: dt.filter((t) => t.status === 'in_progress').length,
        blocked: dt.filter((t) => t.status === 'blocked').length,
        done,
        overdue: dt.filter((t) => t.status !== 'done' && t.due_date && new Date(t.due_date) < today).length,
        total,
        completion: total ? Math.round((done / total) * 100) : 0,
      };
    });

  // Unassigned tasks (no department) — surfaced so they don't get lost.
  const unassigned = (tasks ?? []).filter((t) => t.department_id == null && t.status !== 'done').length;

  const totals = {
    departments: reports.length,
    open: reports.reduce((s, r) => s + r.open + r.in_progress + r.blocked, 0),
    done: reports.reduce((s, r) => s + r.done, 0),
    overdue: reports.reduce((s, r) => s + r.overdue, 0),
    unassigned,
  };

  return NextResponse.json({ reports, totals });
}
