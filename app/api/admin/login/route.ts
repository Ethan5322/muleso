import { NextRequest, NextResponse } from 'next/server';
import { verifyTwoFactorCode } from '@/lib/twoFactor';

const ADMIN_PASSWORD = 'M53223344m.&.M';
const ADMIN_EMAIL = 'mulukenendashaw68@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const { password, twoFactorCode } = await request.json();

    // Step 1: Verify password
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Step 2: Verify 2FA code
    if (!twoFactorCode) {
      return NextResponse.json(
        { success: false, error: '2FA code required' },
        { status: 401 }
      );
    }

    const verifyResult = await verifyTwoFactorCode(ADMIN_EMAIL, twoFactorCode);
    if (!verifyResult.success) {
      return NextResponse.json(
        { success: false, error: verifyResult.error || 'Invalid 2FA code' },
        { status: 401 }
      );
    }

    // Step 3: Create session
    const session = {
      authenticated: true,
      timestamp: Date.now(),
      passwordHash: Math.random().toString(36).substring(2, 15),
    };

    // Create response with success message
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
    });

    // Set secure HTTP-only cookie (server-side)
    response.cookies.set({
      name: 'admin_session',
      value: JSON.stringify(session),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
