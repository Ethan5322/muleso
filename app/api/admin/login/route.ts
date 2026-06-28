import { NextRequest, NextResponse } from 'next/server';
import { verifyTwoFactorCode } from '@/lib/twoFactorUtils';

function getAdminPassword(): string | null {
  let p = process.env.ADMIN_PASSWORD;
  if (!p) return null;
  p = p.trim();
  if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
    p = p.slice(1, -1);
  }
  return p;
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mulukenendashaw68@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const { password, twoFactorCode } = await request.json();
    const ADMIN_PASSWORD = getAdminPassword();

    // Server misconfiguration guard
    if (!ADMIN_PASSWORD) {
      console.error('ADMIN_PASSWORD env var is not set');
      return NextResponse.json(
        { success: false, error: 'Server not configured' },
        { status: 500 }
      );
    }

    // Step 1: Verify password (server-side only)
    const submitted = typeof password === 'string' ? password.trim() : '';
    if (!submitted || submitted !== ADMIN_PASSWORD) {
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

    // Mark 2FA code as used (only after successful verification)
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
      await supabase
        .from('two_factor_codes')
        .update({ used: true })
        .eq('email', ADMIN_EMAIL)
        .eq('code', twoFactorCode)
        .eq('used', false);
    } catch (error) {
      console.error('Error marking 2FA code as used:', error);
      // Don't fail login if this fails - code is already verified
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
