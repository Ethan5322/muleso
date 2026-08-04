import { NextRequest, NextResponse, after } from 'next/server';
import {
  getAllReferences,
  getThreshold,
  robustDistance,
  addAdaptiveSample,
  FACE_DESCRIPTOR_LENGTH,
  ADAPTIVE_INGEST_RATIO,
  MAX_LOGIN_FRAMES,
} from '@/lib/faceMatch';
import { isIPLocked, recordFailedAttempt, resetRateLimit } from '@/lib/rateLimit';

const median = (arr: number[]) => {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

function clientIp(request: NextRequest): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Face login: the phone sends 128-float face descriptors; the server compares
 * them to the enrolled reference and, on a match, issues the same admin_session
 * cookie that the password+2FA flow uses.
 *
 * A biometric endpoint with unlimited attempts is a brute-force oracle, so every
 * failure is rate-limited by IP exactly like the password login.
 */
export async function POST(request: NextRequest) {
  const ip = clientIp(request);

  const locked = isIPLocked(ip);
  if (locked.locked) {
    return NextResponse.json(
      {
        success: false,
        error: `Too many failed attempts. Try again in ${Math.ceil(locked.remainingSeconds / 60)} minute(s), or use password login.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    // Accept a single descriptor (legacy) or an array of frame descriptors (robust).
    const frames: number[][] = Array.isArray(body?.descriptors)
      ? body.descriptors
      : Array.isArray(body?.descriptor)
        ? [body.descriptor]
        : [];
    const valid = frames
      .slice(0, MAX_LOGIN_FRAMES)
      .filter((d) => Array.isArray(d) && d.length === FACE_DESCRIPTOR_LENGTH)
      .map((d) => d.map(Number))
      .filter((d) => d.every((n) => Number.isFinite(n)));

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
      const fail = recordFailedAttempt(ip);
      return NextResponse.json(
        {
          success: false,
          error: fail.locked
            ? 'Too many failed attempts. Face login is temporarily locked — use password login.'
            : 'Face not recognized. Please try again or use password login.',
        },
        { status: fail.locked ? 429 : 401 }
      );
    }

    resetRateLimit(ip);

    // Match — issue the signed admin session cookie
    const { signSession } = await import('@/lib/sessionCrypto');
    const session = {
      authenticated: true,
      timestamp: Date.now(),
      method: 'face',
    };
    const signedSession = signSession(session);

    const response = NextResponse.json({ success: true, distance });
    response.cookies.set({
      name: 'admin_session',
      value: signedSession,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60,
      path: '/',
    });

    // Adaptive learning runs AFTER the response flushes — the user is no longer
    // waiting on an insert + select + prune round-trip to Supabase.
    //
    // Only a comfortably-matching frame is ingested. Frames that merely scraped
    // under the threshold would drift the template toward whatever produced them.
    const bestIdx = dists.reduce((best, d, i) => (d < dists[best] ? i : best), 0);
    if (dists[bestIdx] <= threshold * ADAPTIVE_INGEST_RATIO) {
      const bestFrame = valid[bestIdx];
      after(async () => {
        try {
          await addAdaptiveSample(bestFrame);
        } catch (e) {
          console.error('adaptive face sample failed (non-fatal):', e);
        }
      });
    }

    return response;
  } catch (error) {
    console.error('Face login error:', error);
    return NextResponse.json({ success: false, error: 'Face login failed' }, { status: 500 });
  }
}
