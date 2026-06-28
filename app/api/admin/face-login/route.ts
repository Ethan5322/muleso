import { NextRequest, NextResponse } from 'next/server';
import {
  getReferenceDescriptor,
  getThreshold,
  euclideanDistance,
  FACE_DESCRIPTOR_LENGTH,
} from '@/lib/faceMatch';

/**
 * Face login: the phone sends a 128-float face descriptor; the server
 * compares it to the enrolled reference and, on a match, issues the same
 * admin_session cookie that the password+2FA flow uses.
 */
export async function POST(request: NextRequest) {
  try {
    const { descriptor } = await request.json();

    if (!Array.isArray(descriptor) || descriptor.length !== FACE_DESCRIPTOR_LENGTH) {
      return NextResponse.json({ success: false, error: 'Invalid face data' }, { status: 400 });
    }

    const reference = getReferenceDescriptor();
    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Face login is not set up yet. Enroll a face first.' },
        { status: 503 }
      );
    }

    const distance = euclideanDistance(descriptor.map(Number), reference);
    const threshold = getThreshold();

    if (distance > threshold) {
      return NextResponse.json(
        { success: false, error: 'Face not recognized. Please try again or use password login.' },
        { status: 401 }
      );
    }

    // Match — issue the admin session cookie (same shape middleware expects)
    const session = {
      authenticated: true,
      timestamp: Date.now(),
      passwordHash: Math.random().toString(36).substring(2, 15),
      method: 'face',
    };

    const response = NextResponse.json({ success: true, distance });
    response.cookies.set({
      name: 'admin_session',
      value: JSON.stringify(session),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60,
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('Face login error:', error);
    return NextResponse.json({ success: false, error: 'Face login failed' }, { status: 500 });
  }
}
