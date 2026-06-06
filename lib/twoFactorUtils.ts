import { supabase } from './supabase';

/**
 * Generate a random 6-digit 2FA code
 */
export function generateTwoFactorCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store 2FA code in database
 */
export async function storeTwoFactorCode(
  email: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('two_factor_codes')
      .insert({
        email,
        code,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
        used: false,
      });

    if (error) {
      console.error('Supabase error:', error);
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
    // Get the most recent unused code
    const { data: codes, error: fetchError } = await supabase
      .from('two_factor_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError) {
      return { success: false, error: fetchError.message };
    }

    if (!codes || codes.length === 0) {
      return { success: false, error: 'Invalid code' };
    }

    const codeRecord = codes[0];

    // Check if code is expired
    if (new Date() > new Date(codeRecord.expires_at)) {
      return { success: false, error: 'Code has expired' };
    }

    // Mark code as used
    const { error: updateError } = await supabase
      .from('two_factor_codes')
      .update({ used: true })
      .eq('id', codeRecord.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Verify 2FA code error:', error);
    return { success: false, error: 'Failed to verify code' };
  }
}
