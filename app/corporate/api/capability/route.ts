import { NextResponse, type NextRequest } from 'next/server';
import { requireSuperAdmin, writeAudit } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Super Admin: toggle a capability for a department admin.
export async function POST(req: NextRequest) {
  const { ctx, error } = await requireSuperAdmin();
  if (error) return error;

  const { department_admin_id, capability_key, enabled } = await req.json();
  if (!department_admin_id || !capability_key || typeof enabled !== 'boolean') {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }

  const { error: upsertError } = await supabaseAdmin
    .from('corp_admin_capabilities')
    .upsert(
      {
        department_admin_id,
        capability_key,
        enabled,
        updated_by: ctx.admin.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'department_admin_id,capability_key' }
    );

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  await writeAudit(ctx.admin.id, 'capability_toggled', department_admin_id, {
    capability_key,
    enabled,
  });

  return NextResponse.json({ ok: true });
}
