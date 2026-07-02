import { NextResponse, type NextRequest } from 'next/server';
import { requireSuperAdmin, writeAudit } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Super Admin: suspend or reactivate a department admin (never touches their password).
export async function POST(req: NextRequest) {
  const { ctx, error } = await requireSuperAdmin();
  if (error) return error;

  const { department_admin_id, status } = await req.json();
  if (!department_admin_id || !['active', 'suspended'].includes(status)) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }
  if (department_admin_id === ctx.admin.id) {
    return NextResponse.json({ error: 'You cannot suspend your own account.' }, { status: 400 });
  }

  const { error: updErr } = await supabaseAdmin
    .from('corp_department_admins')
    .update({ status })
    .eq('id', department_admin_id)
    .eq('is_super_admin', false); // never suspend a super admin via this route

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

  await writeAudit(
    ctx.admin.id,
    status === 'suspended' ? 'account_suspended' : 'account_reactivated',
    department_admin_id,
    { status }
  );

  return NextResponse.json({ ok: true });
}
