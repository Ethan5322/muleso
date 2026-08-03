import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client for privileged admin operations.
 * Uses the service-role key when available (bypasses RLS) so that admin
 * tables can have RLS locked down against the public anon key.
 * Falls back to the anon key if the service-role key is not configured.
 *
 * NEVER import this into a client component.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/** Read a Supabase JWT's `role` claim without ever logging the key itself. */
function keyRole(key: string): string {
  if (!key) return 'empty';
  try {
    return JSON.parse(Buffer.from(key.split('.')[1], 'base64').toString('utf8')).role || 'unknown';
  } catch {
    // Supabase's newer API keys (sb_secret_… / sb_publishable_…) are opaque,
    // not JWTs, so there is no role claim to read.
    return 'opaque';
  }
}

/**
 * Whether the configured key can serve as the service role.
 *
 * This matters more than "is the variable set". With RLS enabled, the anon-key
 * fallback below does not error — it returns ZERO ROWS. So a missing or
 * mistyped key looks exactly like "the database is empty", which is the worst
 * possible failure mode. Callers use this to say so out loud instead.
 *
 * Deliberately fails only on PROOF of breakage — an empty key, or a legacy JWT
 * whose role is something other than service_role (usually the anon key pasted
 * into the wrong variable). An opaque `sb_secret_…` key cannot be inspected, so
 * it is trusted: guessing wrong there would 503 a perfectly healthy site the
 * day these keys get rotated to the current format.
 */
const configuredRole = keyRole(process.env.SUPABASE_SERVICE_ROLE_KEY || '');
export const serviceRoleConfigured = configuredRole === 'service_role' || configuredRole === 'opaque';

export const SERVICE_ROLE_HINT =
  'SUPABASE_SERVICE_ROLE_KEY is missing or is not the service_role secret. ' +
  'With RLS on, every query silently returns no rows. Set it from Supabase → ' +
  'Project Settings → API → service_role, then redeploy. Visit ' +
  '/corporate/api/health for a full diagnosis.';

if (!serviceRoleConfigured) {
  console.error(
    `[supabaseAdmin] MISCONFIGURED — key role is "${configuredRole}", expected "service_role". ${SERVICE_ROLE_HINT}`
  );
}

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
