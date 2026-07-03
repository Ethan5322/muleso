import { NextResponse, type NextRequest } from 'next/server';
import { getMessagingIdentity } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Team channel feed — department-aware. Reliable delivery via service-role.
export async function GET(req: NextRequest) {
  const id = await getMessagingIdentity(req);
  if (!id) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data: channels } = await supabaseAdmin
    .from('corp_team_channels')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1);
  const channel = channels?.[0] ?? null;

  const admins =
    (
      await supabaseAdmin
        .from('corp_department_admins')
        .select('id, display_name, department_id, department_name, status')
    ).data ?? [];

  const nameById: Record<string, string> = {};
  admins.forEach((a) => (nameById[a.id] = a.display_name || 'Admin'));

  // department directory (number = reference, name shown)
  const departments: { id: number; name: string }[] = [];
  const seen = new Set<number>();
  admins.forEach((a) => {
    if (a.department_id != null && !seen.has(a.department_id)) {
      seen.add(a.department_id);
      departments.push({ id: a.department_id, name: a.department_name || `Dept ${a.department_id}` });
    }
  });
  const deptNameById: Record<number, string> = {};
  departments.forEach((d) => (deptNameById[d.id] = d.name));

  const roster = admins
    .filter((a) => a.id !== id.adminId && a.display_name && a.status === 'active')
    .map((a) => ({ id: a.id, display_name: a.display_name as string }));

  if (!channel) {
    return NextResponse.json({ channel: null, messages: [], reactions: [], nameById, deptNameById, roster, departments, me: id.adminId, isSuper: id.isSuper });
  }

  const [{ data: allMsgs }, { data: reactions }] = await Promise.all([
    supabaseAdmin
      .from('corp_team_channel_messages')
      .select('*')
      .eq('channel_id', channel.id)
      .order('created_at', { ascending: true })
      .limit(500),
    supabaseAdmin.from('corp_message_reactions').select('*'),
  ]);

  // Visibility: super/main admin sees all; others see all-staff (null) + their department.
  const messages = (allMsgs ?? []).filter(
    (m) => id.isSuper || m.target_department_id == null || m.target_department_id === id.departmentId
  );

  return NextResponse.json({
    channel,
    messages,
    reactions: reactions ?? [],
    nameById,
    deptNameById,
    roster,
    departments,
    me: id.adminId,
    isSuper: id.isSuper,
  });
}
