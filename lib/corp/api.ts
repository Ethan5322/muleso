import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { getCorpContext, type CorpContext } from '@/lib/corp/auth';
import { supabaseAdmin, serviceRoleConfigured, SERVICE_ROLE_HINT } from '@/lib/supabaseAdmin';
import { isAdminRequest } from '@/lib/adminAuth';

/**
 * The response for "getMessagingIdentity() gave us nothing".
 *
 * Distinguishes the two causes that used to be indistinguishable. A genuinely
 * unauthenticated caller still gets 401 'unauthorized'. But when the
 * service-role key is missing, identity lookup fails for a completely
 * different reason — the query silently returned no rows — and reporting that
 * as 'unauthorized' sent everyone hunting for a login problem. Say what is
 * actually wrong; the UI renders `error` verbatim.
 *
 * The remedy names an env var and an internal diagnostic route, so it is shown
 * only to the verified owner. That check reads the admin cookie and never
 * touches Supabase, so it still works in exactly the broken state it reports
 * on. Anonymous callers get the bare fact and nothing to enumerate.
 */
export function corpIdentityFailure(req: NextRequest): NextResponse {
  if (!serviceRoleConfigured) {
    const detail = isAdminRequest(req)
      ? `Server misconfigured. ${SERVICE_ROLE_HINT}`
      : 'This service is temporarily unavailable.';
    return NextResponse.json({ error: detail }, { status: 503 });
  }
  return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
}

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
    // The verified owner (admin_session cookie) is the highest authority. Make
    // them self-sufficient: if no super-admin corp row exists yet, provision one
    // so tasks/messaging/reports never silently fail for the owner.
    return await ensureMainAdminIdentity();
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

/** Find an existing auth user id by email (listUsers is paginated). */
async function findAuthUserByEmail(email: string): Promise<string | null> {
  const target = email.toLowerCase();
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
    if (error || !data?.users?.length) break;
    const u = data.users.find((x) => (x.email || '').toLowerCase() === target);
    if (u) return u.id;
    if (data.users.length < 200) break;
  }
  return null;
}

/**
 * Resolve (and if necessary CREATE) the main admin's super-admin corp row.
 * corp_department_admins.id references auth.users(id), so we back it with an
 * auth user for ADMIN_EMAIL (reused if it already exists). Idempotent: only
 * provisions when no super-admin row is present.
 */
export async function ensureMainAdminIdentity(): Promise<MsgIdentity | null> {
  const { data: existing } = await supabaseAdmin
    .from('corp_department_admins')
    .select('id, department_id')
    .eq('is_super_admin', true)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (existing) return { adminId: existing.id, departmentId: existing.department_id, isSuper: true, isVisitor: false };

  const email = (process.env.ADMIN_EMAIL || 'owner@mulesoo.app').toLowerCase();
  try {
    let userId = await findAuthUserByEmail(email);
    if (!userId) {
      const password = `${globalThis.crypto.randomUUID()}Aa9!`;
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { display_name: 'Main Admin' },
      });
      if (error || !created?.user) {
        console.error('[corp] could not provision main-admin auth user:', error?.message);
        return null;
      }
      userId = created.user.id;
    }

    let staff_number: string | null = null;
    try {
      const { data: staff } = await supabaseAdmin.rpc('corp_next_staff');
      staff_number = (staff as string) || null;
    } catch {
      /* staff sequence optional */
    }

    const { data: row, error: rowErr } = await supabaseAdmin
      .from('corp_department_admins')
      .upsert(
        {
          id: userId,
          display_name: 'Main Admin',
          email,
          is_super_admin: true,
          status: 'active',
          department_name: 'Executive',
          staff_number,
        },
        { onConflict: 'id' }
      )
      .select('id, department_id')
      .single();
    if (rowErr) {
      console.error('[corp] could not provision main-admin corp row:', rowErr.message);
      return null;
    }
    return { adminId: row.id, departmentId: row.department_id, isSuper: true, isVisitor: false };
  } catch (e) {
    console.error('[corp] ensureMainAdminIdentity failed:', e);
    return null;
  }
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
