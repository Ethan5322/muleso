import { NextResponse, type NextRequest } from 'next/server';
import { requireSuperAdmin, writeAudit } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { makeVerificationCode, makeQrToken } from '@/lib/corp/identity';
import { CAPABILITIES } from '@/lib/corp/constants';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Super Admin: register a new department admin (creates the Auth user, captures
// face + photo, issues staff number / verification code / QR token, seeds caps).
export async function POST(req: NextRequest) {
  const { ctx, error } = await requireSuperAdmin();
  if (error) return error;

  const body = await req.json();
  const {
    email,
    password,
    display_name,
    department_id,
    department_name,
    capabilities, // string[] of enabled capability keys
    photo_data_url,
    face_descriptor, // number[] (128) or null
  } = body || {};

  if (!email || !password || !display_name) {
    return NextResponse.json({ error: 'email, password and name are required' }, { status: 400 });
  }
  if (String(password).length < 8) {
    return NextResponse.json({ error: 'password must be at least 8 characters' }, { status: 400 });
  }

  // 1) Create the Supabase Auth user (email confirmed so they can log in immediately).
  const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
    email: String(email).trim().toLowerCase(),
    password,
    email_confirm: true,
    user_metadata: { display_name },
  });
  if (createErr || !created?.user) {
    return NextResponse.json({ error: createErr?.message || 'could not create user' }, { status: 400 });
  }
  const userId = created.user.id;

  // 2) Issue staff number + credentials.
  const { data: staffData } = await supabaseAdmin.rpc('corp_next_staff');
  const staff_number = (staffData as string) || `MSD-${Date.now()}`;
  const verification_code = makeVerificationCode();
  const qr_token = makeQrToken();

  // 3) Roster row.
  const { error: rowErr } = await supabaseAdmin.from('corp_department_admins').insert({
    id: userId,
    department_id: department_id ?? null,
    department_name: department_name ?? null,
    display_name,
    email: String(email).trim().toLowerCase(),
    staff_number,
    photo_data_url: photo_data_url ?? null,
    status: 'active',
    is_super_admin: false,
  });
  if (rowErr) {
    await supabaseAdmin.auth.admin.deleteUser(userId); // rollback
    return NextResponse.json({ error: rowErr.message }, { status: 500 });
  }

  // 4) Secrets (service-role only table).
  await supabaseAdmin.from('corp_admin_secrets').insert({
    department_admin_id: userId,
    verification_code,
    qr_token,
    face_descriptor: Array.isArray(face_descriptor) ? face_descriptor : null,
  });

  // 5) Capabilities.
  const enabledSet = new Set<string>(Array.isArray(capabilities) ? capabilities : CAPABILITIES.map((c) => c.key));
  await supabaseAdmin.from('corp_admin_capabilities').insert(
    CAPABILITIES.map((c) => ({
      department_admin_id: userId,
      capability_key: c.key,
      enabled: enabledSet.has(c.key),
      updated_by: ctx.admin.id,
    }))
  );

  await writeAudit(ctx.admin.id, 'admin_registered', userId, { display_name, staff_number });

  return NextResponse.json({
    ok: true,
    admin: { id: userId, display_name, department_name, staff_number, email },
    staff_number,
    verification_code,
    qr_token,
  });
}
