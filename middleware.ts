import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to protect admin routes
 * Redirects unauthenticated requests to login page
 */
export function middleware(request: NextRequest) {
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

    try {
      // Validate session data
      const sessionData = JSON.parse(session.value);

      // Check if session is valid
      if (
        !sessionData ||
        sessionData.authenticated !== true ||
        !sessionData.timestamp ||
        typeof sessionData.passwordHash !== 'string'
      ) {
        // Invalid session, redirect to login
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('admin_session');
        return response;
      }

      // Check if session is older than 24 hours
      const sessionAge = Date.now() - sessionData.timestamp;
      const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours

      if (sessionAge > maxSessionAge) {
        // Session expired, redirect to login
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('admin_session');
        return response;
      }

      // Session is valid, allow request
      return NextResponse.next();
    } catch (error) {
      // Invalid session JSON, redirect to login
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_session');
      return response;
    }
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
