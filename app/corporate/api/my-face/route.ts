import { NextResponse, type NextRequest } from 'next/server';
import { requireCorp } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { FACE_DESCRIPTOR_LENGTH } from '@/lib/faceMatch';

export const dynamic = 'force-dynamic';

// Whether the current admin has enrolled their biometric.
export async function GET() {
  const { ctx, error } = await requireCorp();
  if (error) return error;
  const { data } = await supabaseAdmin
    .from('corp_admin_secrets')
    .select('face_descriptor')
    .eq('department_admin_id', ctx.admin.id)
    .maybeSingle();
  const fd = data?.face_descriptor;
  const enrolled = Array.isArray(fd) && fd.length > 0;
  return NextResponse.json({ enrolled });
}

// The admin enrols/updates their OWN face biometric (and optionally ID photo).
// Identity (staff no. / verification code / QR) is never changed.
export async function POST(req: NextRequest) {
  const { ctx, error } = await requireCorp();
  if (error) return error;

  const { descriptors, photo } = await req.json();
  const valid =
    Array.isArray(descriptors) &&
    descriptors.length >= 1 &&
    descriptors.every((d: unknown) => Array.isArray(d) && d.length === FACE_DESCRIPTOR_LENGTH);
  if (!valid) {
    return NextResponse.json({ error: 'No usable face samples captured.' }, { status: 400 });
  }

  const { error: updErr } = await supabaseAdmin
    .from('corp_admin_secrets')
    .update({ face_descriptor: descriptors })
    .eq('department_admin_id', ctx.admin.id);
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

  if (typeof photo === 'string' && photo.startsWith('data:')) {
    await supabaseAdmin
      .from('corp_department_admins')
      .update({ photo_data_url: photo })
      .eq('id', ctx.admin.id);
  }

  return NextResponse.json({ ok: true });
}
