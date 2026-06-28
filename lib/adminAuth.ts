import { NextRequest } from 'next/server';

/**
 * Validates the admin session cookie on the server (route handlers).
 * Mirrors the checks in middleware.ts so individual admin APIs can
 * reject unauthenticated mutations even if middleware is bypassed.
 */
export function isAdminRequest(req: NextRequest): boolean {
  const cookie = req.cookies.get('admin_session');
  if (!cookie) return false;

  try {
    const session = JSON.parse(cookie.value);
    if (
      !session ||
      session.authenticated !== true ||
      typeof session.timestamp !== 'number'
    ) {
      return false;
    }
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    if (Date.now() - session.timestamp > maxAge) return false;
    return true;
  } catch {
    return false;
  }
}
