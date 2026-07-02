import { NextResponse, type NextRequest } from 'next/server';
import { requireManager } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { makeVerificationCode, makeQrToken } from '@/lib/corp/identity';

export const dynamic = 'force-dynamic';

// Manager: fetch a specific sub-admin's ID-card data so it can be re-downloaded
// (e.g. the sub-admin lost their card). Credentials are stored, not reset.
export async function GET(req: NextRequest) {
  const { error } = await requireManager(req);
  if (error) return error;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

  const { data: admin } = await supabaseAdmin
    .from('corp_department_admins')
    .select('display_name, department_name, staff_number, photo_data_url')
    .eq('id', id)
    .maybeSingle();

  if (!admin) return NextResponse.json({ error: 'admin not found' }, { status: 404 });

  let { data: secret } = await supabaseAdmin
    .from('corp_admin_secrets')
    .select('verification_code, qr_token')
    .eq('department_admin_id', id)
    .maybeSingle();

  // Keep the SAME credentials on the reissued card (don't reset the person's login).
  if (!secret) {
    secret = { verification_code: makeVerificationCode(), qr_token: makeQrToken() };
    await supabaseAdmin.from('corp_admin_secrets').upsert({ department_admin_id: id, ...secret });
  }

  return NextResponse.json({
    card: {
      staff_number: admin.staff_number || 'MSD-0000',
      display_name: admin.display_name || 'Staff',
      department_name: admin.department_name || 'MuleSoo Team',
      verification_code: secret.verification_code,
      qr_token: secret.qr_token,
      photo_data_url: admin.photo_data_url || null,
    },
  });
}
