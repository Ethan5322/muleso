import { NextRequest, NextResponse } from 'next/server';
import {
  getAllReferences,
  getThreshold,
  robustDistance,
  addAdaptiveSample,
  FACE_DESCRIPTOR_LENGTH,
} from '@/lib/faceMatch';

const median = (arr: number[]) => {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/**
 * Face login: the phone sends a 128-float face descriptor; the server
 * compares it to the enrolled reference and, on a match, issues the same
 * admin_session cookie that the password+2FA flow uses.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Accept a single descriptor (legacy) or an array of frame descriptors (robust).
    const frames: number[][] = Array.isArray(body?.descriptors)
      ? body.descriptors
      : Array.isArray(body?.descriptor)
        ? [body.descriptor]
        : [];
    const valid = frames.filter((d) => Array.isArray(d) && d.length === FACE_DESCRIPTOR_LENGTH).map((d) => d.map(Number));

    if (valid.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid face data' }, { status: 400 });
    }

    const references = await getAllReferences();
    if (references.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Face login is not set up yet. Enroll a face first.' },
        { status: 503 }
      );
    }

    const threshold = getThreshold();
    // Distance per frame, then require the MEDIAN to pass AND most frames to pass.
    const dists = valid.map((f) => robustDistance(f, references));
    const distance = median(dists);
    const passing = dists.filter((d) => d <= threshold).length;
    const enoughFrames = passing >= Math.ceil(valid.length / 2);

    if (distance > threshold || !enoughFrames) {
      return NextResponse.json(
        { success: false, error: 'Face not recognized. Please try again or use password login.' },
        { status: 401 }
      );
    }

    // Adaptive learning: remember the clearest frame of this successful login so
    // the template tracks the person's current appearance over time. Best-effort.
    try {
      const bestFrame = valid.reduce(
        (best, f) => {
          const d = robustDistance(f, references);
          return d < best.d ? { d, f } : best;
        },
        { d: Infinity, f: valid[0] }
      ).f;
      await addAdaptiveSample(bestFrame);
    } catch {
      /* non-fatal */
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
