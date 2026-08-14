import { NextRequest, NextResponse } from 'next/server';

const SESSION_SECRET = process.env.SESSION_SIGNING_SECRET || '';
const MAX_SESSION_AGE = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Verify the HMAC on an admin session cookie.
 *
 * This runs in the Edge runtime, which has no node:crypto — hence Web Crypto
 * rather than the createHmac used in lib/sessionCrypto.ts. The payload is
 * re-serialised exactly as signSession built it: the session fields in their
 * original insertion order, with _sig removed.
 *
 * Previously this file only JSON.parsed the cookie and never checked the
 * signature at all, so the HMAC was decorative and a hand-written cookie would
 * have been accepted.
 */
async function verifySessionCookie(
  value: string
): Promise<{ authenticated?: boolean; timestamp?: number } | null> {
  if (!SESSION_SECRET) return null; // fail closed rather than trust anything
  try {
    const parsed = JSON.parse(value);
    const { _sig, ...session } = parsed ?? {};
    if (typeof _sig !== 'string') return null;

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(SESSION_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signed = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(JSON.stringify(session))
    );
    const expected = Array.from(new Uint8Array(signed))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    // Constant-time compare — length first, since an early return on a length
    // mismatch leaks nothing the attacker does not already control.
    if (expected.length !== _sig.length) return null;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) {
      diff |= expected.charCodeAt(i) ^ _sig.charCodeAt(i);
    }
    return diff === 0 ? session : null;
  } catch {
    return null;
  }
}

/**
 * Middleware to protect admin routes
 * Redirects unauthenticated requests to login page
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public admin routes (their own login UIs)
  const publicAdminRoutes = ['/admin/login', '/admin/face-login'];

  // Protect all /admin routes except the public login pages
  if (pathname.startsWith('/admin') && !publicAdminRoutes.includes(pathname)) {
    // Get session from cookies (more secure than localStorage)
    const session = request.cookies.get('admin_session');

    // If no session, redirect to login
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const sessionData = await verifySessionCookie(session.value);

    // The shape checked here must match what /api/admin/login actually signs:
    // { authenticated, timestamp }. This used to also demand a `passwordHash`
    // field that the login route has never issued, so every freshly logged-in
    // admin was bounced straight back to /admin/login. Because the browser was
    // already sitting on /admin/login, the page never unmounted and its success
    // panel ("Admin panel is loading…") stayed on screen indefinitely — it read
    // as a hang, but it was this redirect firing over and over.
    if (!sessionData || sessionData.authenticated !== true || !sessionData.timestamp) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_session');
      return response;
    }

    if (Date.now() - sessionData.timestamp > MAX_SESSION_AGE) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_session');
      return response;
    }

    // Session is valid, allow request
    return NextResponse.next();
  }

  // Allow all other routes
  return NextResponse.next();
}

/**
 * Configure which routes the middleware applies to
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - api routes (let API handle auth)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|api|favicon.ico|public).*)',
  ],
};
