import 'server-only';
import { NextResponse } from 'next/server';
import { getCorpContext, type CorpContext } from '@/lib/corp/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/** Require any active corporate admin. Returns ctx or an error response. */
export async function requireCorp(): Promise<
  { ctx: CorpContext; error?: undefined } | { ctx?: undefined; error: NextResponse }
> {
  const ctx = await getCorpContext();
  if (!ctx) return { error: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };
  return { ctx };
}

/** Require the Super Admin. */
export async function requireSuperAdmin(): Promise<
  { ctx: CorpContext; error?: undefined } | { ctx?: undefined; error: NextResponse }
> {
  const ctx = await getCorpContext();
  if (!ctx) return { error: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };
  if (!ctx.admin.is_super_admin)
    return { error: NextResponse.json({ error: 'forbidden' }, { status: 403 }) };
  return { ctx };
}

/** Server-side capability gate (second layer beyond RLS). */
export async function adminHasCapability(adminId: string, key: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('corp_admin_capabilities')
    .select('enabled')
    .eq('department_admin_id', adminId)
    .eq('capability_key', key)
    .maybeSingle();
  return data?.enabled === true;
}

/** Append a governance audit entry (service-role — bypasses RLS on insert). */
export async function writeAudit(
  actorId: string,
  action: string,
  targetAdminId: string | null,
  detail: Record<string, unknown> = {}
): Promise<void> {
  try {
    await supabaseAdmin.from('corp_admin_audit_log').insert({
      actor_id: actorId,
      action,
      target_admin_id: targetAdminId,
      detail,
    });
  } catch (e) {
    console.error('[corp audit] failed to write', e);
  }
}
