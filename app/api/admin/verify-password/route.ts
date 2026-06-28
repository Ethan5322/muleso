import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

/**
 * Step 1 of admin login: verify the password server-side ONLY.
 * The password is never shipped to or compared in the client bundle.
 * On success the client proceeds to the 2FA step.
 */
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!ADMIN_PASSWORD) {
      console.error('ADMIN_PASSWORD env var is not set');
      return NextResponse.json(
        { valid: false, error: 'Server not configured' },
        { status: 500 }
      );
    }

    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('verify-password error:', error);
    return NextResponse.json(
      { valid: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
