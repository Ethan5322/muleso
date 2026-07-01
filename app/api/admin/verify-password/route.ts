import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword } from '@/lib/adminPassword';

/**
 * Step 1 of admin login: verify the password server-side ONLY.
 * Returns { configured: false } when no password is set (DB or env), so the
 * client can show a helpful message instead of treating it as a wrong password.
 */
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const { valid, configured } = await verifyAdminPassword(password);

    if (!configured) {
      return NextResponse.json(
        { valid: false, configured: false, error: 'Admin password is not configured.' },
        { status: 503 }
      );
    }
    if (!valid) {
      return NextResponse.json({ valid: false, configured: true }, { status: 401 });
    }
    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('verify-password error:', error);
    return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 });
  }
}
