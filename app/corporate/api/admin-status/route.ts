import { NextResponse, type NextRequest } from 'next/server';
import { requireManager, writeAudit } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Manager: suspend or reactivate a department admin (never touches their password).
export async function POST(req: NextRequest) {
  const { actorId, error } = await requireManager(req);
  if (error) return error;

  const { department_admin_id, status } = await req.json();
  if (!department_admin_id || !['active', 'suspended'].includes(status)) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }
  if (actorId && department_admin_id === actorId) {
    return NextResponse.json({ error: 'You cannot suspend your own account.' }, { status: 400 });
  }

  const { error: updErr } = await supabaseAdmin
    .from('corp_department_admins')
    .update({ status })
    .eq('id', department_admin_id)
    .eq('is_super_admin', false); // never suspend a super admin via this route

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

  await writeAudit(
    actorId,
    status === 'suspended' ? 'account_suspended' : 'account_reactivated',
    department_admin_id,
    { status }
  );

  return NextResponse.json({ ok: true });
}
