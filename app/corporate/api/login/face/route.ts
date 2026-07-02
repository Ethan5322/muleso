import { NextResponse, type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { establishCorpSession } from '@/lib/corp/session';
import { euclideanDistance, getThreshold, FACE_DESCRIPTOR_LENGTH } from '@/lib/faceMatch';

export const dynamic = 'force-dynamic';

// Biometric login: match the presented face descriptor to an enrolled admin.
export async function POST(req: NextRequest) {
  const { descriptor } = await req.json();
  if (!Array.isArray(descriptor) || descriptor.length !== FACE_DESCRIPTOR_LENGTH) {
    return NextResponse.json({ error: 'No usable face captured.' }, { status: 400 });
  }

  const [{ data: secrets }, { data: admins }] = await Promise.all([
    supabaseAdmin.from('corp_admin_secrets').select('department_admin_id, face_descriptor').not('face_descriptor', 'is', null),
    supabaseAdmin.from('corp_department_admins').select('id, email, status'),
  ]);

  const byId: Record<string, { email: string | null; status: string }> = {};
  (admins ?? []).forEach((a) => (byId[a.id] = { email: a.email, status: a.status }));

  const threshold = getThreshold();
  let best = { dist: Infinity, email: null as string | null };
  for (const s of secrets ?? []) {
    const ref = s.face_descriptor as unknown as number[];
    if (!Array.isArray(ref) || ref.length !== FACE_DESCRIPTOR_LENGTH) continue;
    const d = euclideanDistance(descriptor, ref);
    const a = byId[s.department_admin_id];
    if (d < best.dist && a && a.status === 'active' && a.email) {
      best = { dist: d, email: a.email };
    }
  }

  if (!best.email || best.dist > threshold) {
    return NextResponse.json({ error: 'Face not recognised. Try again or use your code.' }, { status: 401 });
  }

  const ok = await establishCorpSession(best.email);
  if (!ok) return NextResponse.json({ error: 'Could not sign you in.' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
