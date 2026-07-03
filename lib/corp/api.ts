import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { getCorpContext, type CorpContext } from '@/lib/corp/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isAdminRequest } from '@/lib/adminAuth';

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

/**
 * Authorize a corporate MANAGEMENT action. Accepts either:
 *  - the existing MAIN admin (via the /admin `admin_session` cookie), or
 *  - a corporate Super Admin (Supabase session).
 * Returns the actor's corp id (null for the main admin, who has no corp row).
 */
export async function requireManager(
  req: NextRequest
): Promise<{ actorId: string | null; error?: undefined } | { actorId?: undefined; error: NextResponse }> {
  if (isAdminRequest(req)) return { actorId: null }; // main admin — highest authority
  const ctx = await getCorpContext();
  if (ctx?.admin.is_super_admin) return { actorId: ctx.admin.id };
  return { error: NextResponse.json({ error: 'forbidden' }, { status: 403 }) };
}

/**
 * Require an active corp admin who holds a specific responsibility (capability).
 * Super admins always pass. Used to gate the department operational workspace.
 */
export async function requireCapability(
  key: string
): Promise<{ ctx: CorpContext; error?: undefined } | { ctx?: undefined; error: NextResponse }> {
  const ctx = await getCorpContext();
  if (!ctx) return { error: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };
  if (ctx.admin.is_super_admin) return { ctx };
  const ok = await adminHasCapability(ctx.admin.id, key);
  if (!ok) return { error: NextResponse.json({ error: 'You do not have this responsibility.' }, { status: 403 }) };
  return { ctx };
}

export interface MsgIdentity {
  adminId: string;
  departmentId: number | null;
  isSuper: boolean; // main admin (cookie) OR corp super admin
  isVisitor: boolean;
}

/**
 * Resolve the messaging identity from EITHER the main-admin cookie (acts as the
 * seeded super admin) OR a corporate session. Messaging routes use this + the
 * service-role client so delivery never depends on per-user RLS/session quirks.
 */
export async function getMessagingIdentity(req: NextRequest): Promise<MsgIdentity | null> {
  if (isAdminRequest(req)) {
    const { data } = await supabaseAdmin
      .from('corp_department_admins')
      .select('id, department_id')
      .eq('is_super_admin', true)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();
    if (data) return { adminId: data.id, departmentId: data.department_id, isSuper: true, isVisitor: false };
    return null; // super admin not seeded yet
  }
  const ctx = await getCorpContext();
  if (!ctx) return null;
  return {
    adminId: ctx.admin.id,
    departmentId: ctx.admin.department_id,
    isSuper: ctx.admin.is_super_admin,
    isVisitor: ctx.admin.is_visitor,
  };
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
  actorId: string | null,
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
