import 'server-only';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createCorpServerClient } from '@/lib/corp/supabaseServer';

/**
 * Establish a real Supabase Auth session for an admin WITHOUT their password,
 * used by the alternate login methods (face / verification code / QR).
 * Generates a one-time magic-link token (service-role) and verifies it on the
 * cookie-backed SSR client so RLS (auth.uid) works exactly as a normal login.
 */
export async function establishCorpSession(email: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });
  const tokenHash = data?.properties?.hashed_token;
  if (error || !tokenHash) {
    console.error('[corp session] generateLink failed', error);
    return false;
  }

  const supabase = await createCorpServerClient();
  // Try the two accepted OTP types for token_hash verification.
  let vErr = (await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'email' })).error;
  if (vErr) {
    vErr = (await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'magiclink' })).error;
  }
  if (vErr) {
    console.error('[corp session] verifyOtp failed', vErr);
    return false;
  }
  return true;
}
