import { NextResponse, type NextRequest } from 'next/server';
import { requireManager, writeAudit } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Manager: permanently delete a department admin (Auth user + all corp data via cascade).
export async function POST(req: NextRequest) {
  const { actorId, error } = await requireManager(req);
  if (error) return error;

  const { department_admin_id } = await req.json();
  if (!department_admin_id) {
    return NextResponse.json({ error: 'missing admin id' }, { status: 400 });
  }
  if (actorId && department_admin_id === actorId) {
    return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 });
  }

  // Never delete another super admin through this route.
  const { data: target } = await supabaseAdmin
    .from('corp_department_admins')
    .select('is_super_admin, display_name')
    .eq('id', department_admin_id)
    .maybeSingle();
  if (target?.is_super_admin) {
    return NextResponse.json({ error: 'Cannot delete a super admin.' }, { status: 400 });
  }

  // Deleting the Auth user cascades corp_department_admins (FK on delete cascade)
  // and everything referencing it (secrets, capabilities, messages, reactions).
  const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(department_admin_id);
  if (delErr) {
    // Fallback: remove the roster row directly (also cascades corp tables).
    await supabaseAdmin.from('corp_department_admins').delete().eq('id', department_admin_id);
  }

  await writeAudit(actorId, 'admin_deleted', null, {
    deleted_admin_id: department_admin_id,
    display_name: target?.display_name ?? null,
  });

  return NextResponse.json({ ok: true });
}
