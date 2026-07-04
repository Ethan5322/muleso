import 'server-only';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Auto-task bridge: turn inbound public activity (a new lead / booking) into a
 * task for the right department, so each department has real work to act on.
 *
 * Department is matched by NAME keyword against corp_departments (names are
 * admin-defined, so we can't hardcode ids). If nothing matches, the task is
 * created UNASSIGNED — the main admin sees it on /admin → Tasks and can route it.
 *
 * Everything here is best-effort: it must NEVER break the public contact/booking
 * flow, so all failures are swallowed and logged.
 */

async function findDepartmentByKeywords(keywords: string[]): Promise<number | null> {
  try {
    const { data } = await supabaseAdmin.from('corp_departments').select('id, name').eq('active', true);
    if (!data?.length) return null;
    const lower = keywords.map((k) => k.toLowerCase());
    const hit = data.find((d) => lower.some((k) => (d.name || '').toLowerCase().includes(k)));
    return hit ? (hit.id as number) : null;
  } catch {
    return null;
  }
}

export async function createAutoTask(opts: {
  title: string;
  detail?: string;
  departmentKeywords: string[];
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  dueInDays?: number;
}): Promise<void> {
  try {
    const department_id = await findDepartmentByKeywords(opts.departmentKeywords);
    const due_date =
      opts.dueInDays != null
        ? new Date(Date.now() + opts.dueInDays * 86_400_000).toISOString().slice(0, 10)
        : null;

    await supabaseAdmin.from('corp_tasks').insert({
      title: opts.title,
      detail: opts.detail ?? null,
      department_id,
      priority: opts.priority ?? 'normal',
      due_date,
      status: 'open',
    });
  } catch (e) {
    // corp module may be disabled or tables absent — never surface to the public.
    console.error('[autoTask] skipped:', e);
  }
}

/** A new website enquiry → a follow-up task for the Sales department. */
export async function autoTaskFromLead(lead: {
  name: string;
  email?: string | null;
  service?: string | null;
  budget?: string | null;
  details?: string | null;
}): Promise<void> {
  const parts = [
    lead.email && `Email: ${lead.email}`,
    lead.service && `Service: ${lead.service}`,
    lead.budget && `Budget: ${lead.budget}`,
    lead.details && `\n${lead.details}`,
  ].filter(Boolean);
  await createAutoTask({
    title: `Follow up lead: ${lead.name}`,
    detail: parts.join(' · '),
    departmentKeywords: ['sales', 'lead', 'business development', 'client'],
    priority: 'high',
    dueInDays: 1,
  });
}

/** A new booking → an onboarding task for the Operations / Support department. */
export async function autoTaskFromBooking(booking: {
  name: string;
  service?: string | null;
  timeline?: string | null;
  reference?: string | null;
  phone?: string | null;
}): Promise<void> {
  const parts = [
    booking.reference && `Ref: ${booking.reference}`,
    booking.service && `Service: ${booking.service}`,
    booking.timeline && `Timeline: ${booking.timeline}`,
    booking.phone && `Phone: ${booking.phone}`,
  ].filter(Boolean);
  await createAutoTask({
    title: `Onboard booking: ${booking.name}`,
    detail: parts.join(' · '),
    departmentKeywords: ['operation', 'booking', 'project', 'delivery', 'support'],
    priority: 'high',
    dueInDays: 2,
  });
}
