import { NextResponse } from 'next/server';
import { requireCorp } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// The logged-in sub-admin's own ID-card data (so they can re-print their badge).
export async function GET() {
  const { ctx, error } = await requireCorp();
  if (error) return error;

  const { data: admin } = await supabaseAdmin
    .from('corp_department_admins')
    .select('display_name, department_name, staff_number, photo_data_url')
    .eq('id', ctx.admin.id)
    .maybeSingle();

  const { data: secret } = await supabaseAdmin
    .from('corp_admin_secrets')
    .select('verification_code, qr_token')
    .eq('department_admin_id', ctx.admin.id)
    .maybeSingle();

  return NextResponse.json({
    card: {
      staff_number: admin?.staff_number || 'MSD-0000',
      display_name: admin?.display_name || 'Staff',
      department_name: admin?.department_name || 'MuleSoo Team',
      verification_code: secret?.verification_code || '',
      qr_token: secret?.qr_token || '',
      photo_data_url: admin?.photo_data_url || null,
    },
  });
}
