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

  // 1) Remove ALL corporate data first — the roster row cascades to secrets,
  //    capabilities, direct messages, channel messages, reactions and mentions
  //    (every corp_ FK is ON DELETE CASCADE). This is the source of truth for
  //    "shows in Team", so deleting it guarantees they disappear everywhere.
  const { error: rowErr } = await supabaseAdmin
    .from('corp_department_admins')
    .delete()
    .eq('id', department_admin_id);
  if (rowErr) {
    return NextResponse.json({ error: `Could not delete: ${rowErr.message}` }, { status: 500 });
  }

  // 2) Remove their login account too (best-effort — the row is already gone).
  try {
    await supabaseAdmin.auth.admin.deleteUser(department_admin_id);
  } catch (e) {
    console.error('auth user delete failed (row already removed):', e);
  }

  await writeAudit(actorId, 'admin_deleted', null, {
    deleted_admin_id: department_admin_id,
    display_name: target?.display_name ?? null,
  });

  return NextResponse.json({ ok: true });
}
