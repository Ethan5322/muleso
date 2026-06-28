import { NextRequest, NextResponse } from 'next/server';

/** Reads ADMIN_PASSWORD and cleans common mistakes (whitespace / wrapping quotes). */
function getAdminPassword(): string | null {
  let p = process.env.ADMIN_PASSWORD;
  if (!p) return null;
  p = p.trim();
  if (
    (p.startsWith('"') && p.endsWith('"')) ||
    (p.startsWith("'") && p.endsWith("'"))
  ) {
    p = p.slice(1, -1);
  }
  return p;
}

/**
 * Step 1 of admin login: verify the password server-side ONLY.
 * Returns { configured: false } when ADMIN_PASSWORD isn't set, so the client
 * can show a helpful message instead of treating it as a wrong password.
 */
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminPassword = getAdminPassword();

    if (!adminPassword) {
      return NextResponse.json(
        { valid: false, configured: false, error: 'Admin password is not configured on the server.' },
        { status: 503 }
      );
    }

    const submitted = typeof password === 'string' ? password.trim() : '';
    if (!submitted || submitted !== adminPassword) {
      return NextResponse.json({ valid: false, configured: true }, { status: 401 });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('verify-password error:', error);
    return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 });
  }
}
