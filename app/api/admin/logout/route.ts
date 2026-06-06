import { NextRequest, NextResponse } from 'next/server';

/**
 * Logout endpoint - clears admin session
 */
export async function POST(request: NextRequest) {
  try {
    // Create response that clears the session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear the admin_session cookie
    response.cookies.delete('admin_session');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
