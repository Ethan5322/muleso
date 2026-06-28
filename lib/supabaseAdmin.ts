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

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '[supabaseAdmin] SUPABASE_SERVICE_ROLE_KEY not set — falling back to anon key. ' +
      'Set it in your environment to fully secure admin writes with RLS.'
  );
}

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
