import { NextResponse, type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { establishCorpSession } from '@/lib/corp/session';
import { robustDistance, getThreshold, FACE_DESCRIPTOR_LENGTH } from '@/lib/faceMatch';

/** Normalise a stored face_descriptor into an array of 128-float samples. */
function toRefs(fd: unknown): number[][] {
  if (!Array.isArray(fd)) return [];
  if (fd.length && Array.isArray(fd[0])) {
    return (fd as number[][]).filter((d) => Array.isArray(d) && d.length === FACE_DESCRIPTOR_LENGTH);
  }
  if (fd.length === FACE_DESCRIPTOR_LENGTH) return [fd as number[]];
  return [];
}

export const dynamic = 'force-dynamic';

// Biometric login: match the presented face(s) to exactly one enrolled admin.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const frames: number[][] = Array.isArray(body?.descriptors)
    ? body.descriptors
    : Array.isArray(body?.descriptor)
      ? [body.descriptor]
      : [];
  const valid = frames.filter((d) => Array.isArray(d) && d.length === FACE_DESCRIPTOR_LENGTH).map((d) => d.map(Number));
  if (valid.length === 0) {
    return NextResponse.json({ error: 'No usable face captured.' }, { status: 400 });
  }
  // Average the frames into one clean descriptor.
  const probe = new Array(FACE_DESCRIPTOR_LENGTH).fill(0);
  for (const f of valid) for (let i = 0; i < FACE_DESCRIPTOR_LENGTH; i++) probe[i] += f[i];
  for (let i = 0; i < FACE_DESCRIPTOR_LENGTH; i++) probe[i] /= valid.length;

  const [{ data: secrets }, { data: admins }] = await Promise.all([
    supabaseAdmin.from('corp_admin_secrets').select('department_admin_id, face_descriptor').not('face_descriptor', 'is', null),
    supabaseAdmin.from('corp_department_admins').select('id, email, status'),
  ]);

  const byId: Record<string, { email: string | null; status: string }> = {};
  (admins ?? []).forEach((a) => (byId[a.id] = { email: a.email, status: a.status }));

  const threshold = getThreshold();
  // Rank ALL active admins by robust distance so we can enforce a uniqueness margin.
  const scored: { dist: number; email: string }[] = [];
  for (const s of secrets ?? []) {
    const refs = toRefs(s.face_descriptor);
    if (refs.length === 0) continue;
    const a = byId[s.department_admin_id];
    if (!a || a.status !== 'active' || !a.email) continue;
    scored.push({ dist: robustDistance(probe, refs), email: a.email });
  }
  scored.sort((x, y) => x.dist - y.dist);

  const best = scored[0];
  const second = scored[1];
  // Must be within threshold AND clearly closer than the next-best admin.
  const MARGIN = 0.06;
  if (!best || best.dist > threshold || (second && second.dist - best.dist < MARGIN)) {
    return NextResponse.json({ error: 'Face not recognised. Try again or use your code.' }, { status: 401 });
  }

  const ok = await establishCorpSession(best.email);
  if (!ok) return NextResponse.json({ error: 'Could not sign you in.' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
