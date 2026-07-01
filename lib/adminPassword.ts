import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';
import { supabaseAdmin } from './supabaseAdmin';

/**
 * Admin password verification. Prefers a hashed password stored in the
 * admin_config table (set via "Change Password"); falls back to the
 * ADMIN_PASSWORD env var if none is stored. Match happens server-side only.
 */

function envPassword(): string | null {
  let p = process.env.ADMIN_PASSWORD;
  if (!p) return null;
  p = p.trim();
  if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
    p = p.slice(1, -1);
  }
  return p;
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyHash(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const hashBuf = Buffer.from(hash, 'hex');
  const testBuf = scryptSync(password, salt, 64);
  return hashBuf.length === testBuf.length && timingSafeEqual(hashBuf, testBuf);
}

async function getStoredHash(): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_config')
      .select('value')
      .eq('key', 'password_hash')
      .maybeSingle();
    if (error || !data) return null;
    return data.value || null;
  } catch {
    return null;
  }
}

export async function verifyAdminPassword(
  input: string
): Promise<{ valid: boolean; configured: boolean }> {
  const storedHash = await getStoredHash();
  const env = envPassword();
  const configured = !!storedHash || !!env;
  if (!configured) return { valid: false, configured: false };

  const submitted = typeof input === 'string' ? input.trim() : '';
  if (!submitted) return { valid: false, configured: true };

  const valid = storedHash ? verifyHash(submitted, storedHash) : submitted === env;
  return { valid, configured: true };
}

export async function setAdminPassword(newPassword: string): Promise<void> {
  const hash = hashPassword(newPassword);
  const { error } = await supabaseAdmin
    .from('admin_config')
    .upsert({ key: 'password_hash', value: hash, updated_at: new Date().toISOString() });
  if (error) throw error;
}
