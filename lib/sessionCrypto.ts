import crypto from 'crypto';

// Session signing secret — must be stored in environment and never committed
const SESSION_SECRET = process.env.SESSION_SIGNING_SECRET || '';

if (!SESSION_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('SESSION_SIGNING_SECRET environment variable is required in production');
}

export interface AdminSession {
  authenticated: boolean;
  timestamp: number;
  userId?: string;
}

/**
 * Sign a session object with HMAC-SHA256.
 * Returns a JSON string with the session data and an appended signature.
 */
export function signSession(session: AdminSession): string {
  const payload = JSON.stringify(session);
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');
  return JSON.stringify({ ...session, _sig: signature });
}

/**
 * Verify and parse a signed session.
 * Returns the session object if signature is valid, null otherwise.
 */
export function verifySession(sessionStr: string): AdminSession | null {
  try {
    const parsed = JSON.parse(sessionStr);
    const signature = parsed._sig;

    if (!signature) return null;

    // Reconstruct the original payload (without the signature)
    const { _sig, ...sessionData } = parsed;
    const payload = JSON.stringify(sessionData);

    // Verify the signature
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payload)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    return sessionData as AdminSession;
  } catch {
    return null;
  }
}
