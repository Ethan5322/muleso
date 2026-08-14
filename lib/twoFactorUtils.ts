import { supabase } from './supabase';

/**
 * How long an issued code stays valid, in minutes.
 *
 * 20, not the previous 10, because the practical window is much smaller than
 * the nominal one: the code must clear Resend and Gmail (10–30s observed) before
 * it can be read, and on an unstable connection a submission that never returns
 * still consumes the code, forcing a fresh one. Twenty minutes leaves room for a
 * retry without turning a short outage into a lockout.
 *
 * Override with TWO_FACTOR_TTL_MINUTES — an env var rather than a constant so
 * the window can be changed from the Vercel dashboard in seconds, without a
 * rebuild.
 */
export const TWO_FACTOR_TTL_MINUTES = (() => {
  const raw = Number(process.env.TWO_FACTOR_TTL_MINUTES);
  return Number.isFinite(raw) && raw > 0 ? raw : 20;
})();

/**
 * Generate a random 6-digit 2FA code
 */
export function generateTwoFactorCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Parse a Postgres timestamp as the UTC instant it actually represents.
 *
 * `two_factor_codes.expires_at` is `timestamp WITHOUT time zone`, so PostgREST
 * returns it bare — "2026-08-14T05:48:15.383", no Z and no offset. JavaScript
 * parses a bare date-time as *local* time, so in Johannesburg (UTC+2) every
 * code was read as expiring two hours before it was issued, and looked expired
 * the moment it arrived. We write these values with toISOString(), so they are
 * always UTC — label them as such before parsing.
 */
function parseUtc(value: string | Date): Date {
  if (value instanceof Date) return value;
  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/.test(value.trim());
  return new Date(hasZone ? value : `${value.trim().replace(' ', 'T')}Z`);
}

/**
 * Store 2FA code in database
 */
export async function storeTwoFactorCode(
  email: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Expiry is computed server-side in UTC and written as an ISO string.
    const expiresAt = new Date(Date.now() + TWO_FACTOR_TTL_MINUTES * 60 * 1000).toISOString();

    const { error } = await supabase
      .from('two_factor_codes')
      .insert({
        email,
        code,
        expires_at: expiresAt,
        used: false,
      });

    console.log('Storing 2FA code. Expires at:', expiresAt);

    if (error) {
      console.error('Supabase INSERT error:', JSON.stringify(error, null, 2));
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Store 2FA code error:', error);
    return { success: false, error: 'Failed to store code' };
  }
}

/**
 * Verify 2FA code
 */
export async function verifyTwoFactorCode(
  email: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Trim whitespace from code
    const trimmedCode = code.trim();

    console.log('Verify 2FA - Email:', email, 'Code (trimmed):', trimmedCode);

    // Get the most recent unused code
    const { data: codes, error: fetchError } = await supabase
      .from('two_factor_codes')
      .select('*')
      .eq('email', email)
      .eq('code', trimmedCode)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1);

    console.log('Fetched codes:', codes);

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return { success: false, error: fetchError.message };
    }

    if (!codes || codes.length === 0) {
      // Debug: show all codes for this email
      const { data: allCodes } = await supabase
        .from('two_factor_codes')
        .select('*')
        .eq('email', email);
      console.log('No matching code. All codes for email:', allCodes);
      return { success: false, error: 'Invalid code' };
    }

    const codeRecord = codes[0];

    console.log('Code record:', codeRecord);
    console.log('Current time:', new Date());
    console.log('Expires at:', new Date(codeRecord.expires_at));

    // Check if the 2FA code has expired. Both sides are compared as UTC
    // instants — see parseUtc for why the raw column value cannot be trusted
    // to new Date() directly.
    const now = new Date();
    const expiresAt = parseUtc(codeRecord.expires_at);
    if (now > expiresAt) {
      console.log('2FA code has expired');
      return { success: false, error: '2FA code has expired. Please request a new one.' };
    }

    console.log('Code is valid! (API will mark as used)');

    // Don't mark as used here - let the API do it to avoid double-verification
    return { success: true };
  } catch (error) {
    console.error('Verify 2FA code error:', error);
    return { success: false, error: 'Failed to verify code' };
  }
}
