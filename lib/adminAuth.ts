import { NextRequest } from 'next/server';
import { verifySession } from './sessionCrypto';

/**
 * Validates the admin session cookie on the server (route handlers).
 * Verifies both the signature and timestamp to prevent forged cookies.
 * Mirrors the checks in middleware.ts so individual admin APIs can
 * reject unauthenticated mutations even if middleware is bypassed.
 */
export function isAdminRequest(req: NextRequest): boolean {
  const cookie = req.cookies.get('admin_session');
  if (!cookie) return false;

  try {
    // Verify signature and parse the session
    const session = verifySession(cookie.value);
    if (!session || session.authenticated !== true) {
      return false;
    }

    // Check timestamp (24 hour expiration)
    const maxAge = 24 * 60 * 60 * 1000;
    if (Date.now() - session.timestamp > maxAge) return false;

    return true;
  } catch {
    return false;
  }
}
