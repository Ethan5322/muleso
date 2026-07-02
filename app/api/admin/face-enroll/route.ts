import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isAdminRequest } from '@/lib/adminAuth';
import { FACE_DESCRIPTOR_LENGTH } from '@/lib/faceMatch';
import { makeVerificationCode, makeQrToken } from '@/lib/corp/identity';

/**
 * Store/refresh the main admin's ID photo on their card WITHOUT changing their
 * identity (staff number / verification code / QR stay the same). So re-enrolling
 * a face only updates the picture, not the ID.
 */
async function updateMainAdminPhoto(photo: string) {
  try {
    const { data: cfg } = await supabaseAdmin
      .from('corp_config')
      .select('value')
      .eq('key', 'main_admin_card')
      .maybeSingle();
    const existing = (cfg?.value as Record<string, string>) || {};
    const card = {
      staff_number: existing.staff_number || 'MSD-0001',
      display_name: existing.display_name || 'Main Administrator',
      department_name: existing.department_name || 'Executive',
      verification_code: existing.verification_code || makeVerificationCode(),
      qr_token: existing.qr_token || makeQrToken(),
      photo_data_url: photo, // only the photo changes
    };
    await supabaseAdmin.from('corp_config').upsert({ key: 'main_admin_card', value: card });
  } catch (e) {
    console.error('main_admin_card photo update failed (continuing):', e);
  }
}

/**
 * Saves the admin's reference face samples (replaces any previous ones).
 * Guarded: only a logged-in admin can enroll.
 */
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { descriptors, photo } = await req.json();

    if (!Array.isArray(descriptors) || descriptors.length === 0) {
      return NextResponse.json({ success: false, error: 'No face samples provided' }, { status: 400 });
    }

    const valid = descriptors.filter(
      (d: unknown) => Array.isArray(d) && d.length === FACE_DESCRIPTOR_LENGTH
    );
    if (valid.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid face data' }, { status: 400 });
    }

    // Replace previous enrollment
    await supabaseAdmin
      .from('admin_face_descriptors')
      .delete()
      .not('id', 'is', null);

    const rows = valid.map((d: number[], i: number) => ({
      label: `sample_${i + 1}`,
      descriptor: d.map((n) => Number(Number(n).toFixed(5))),
    }));

    const { error } = await supabaseAdmin.from('admin_face_descriptors').insert(rows);
    if (error) throw error;

    // Also refresh the main admin's ID photo (identity preserved).
    if (typeof photo === 'string' && photo.startsWith('data:')) {
      await updateMainAdminPhoto(photo);
    }

    return NextResponse.json({ success: true, count: rows.length });
  } catch (error: any) {
    console.error('Face enroll error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Enrollment failed' },
      { status: 500 }
    );
  }
}

/** Clear all enrolled faces. */
export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { error } = await supabaseAdmin
      .from('admin_face_descriptors')
      .delete()
      .not('id', 'is', null);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
