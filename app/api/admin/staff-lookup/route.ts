import { NextResponse, type NextRequest } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Main admin only: resolve a scanned verification code (barcode) to a staff member.
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const code = (req.nextUrl.searchParams.get('code') || '').trim().toUpperCase();
  if (!code) return NextResponse.json({ found: false });

  // Main admin's own card?
  try {
    const { data: cfg } = await supabaseAdmin
      .from('corp_config')
      .select('value')
      .eq('key', 'main_admin_card')
      .maybeSingle();
    const mc = cfg?.value as Record<string, string> | null;
    if (mc?.verification_code && mc.verification_code.toUpperCase() === code) {
      return NextResponse.json({
        found: true,
        staff: {
          display_name: mc.display_name || 'Main Administrator',
          staff_number: mc.staff_number || 'MSD-0001',
          department_name: mc.department_name || 'Executive',
          status: 'active',
          is_super_admin: true,
          photo_data_url: mc.photo_data_url || null,
        },
      });
    }
  } catch {
    /* ignore */
  }

  const { data: secret } = await supabaseAdmin
    .from('corp_admin_secrets')
    .select('department_admin_id')
    .eq('verification_code', code)
    .maybeSingle();
  if (!secret) return NextResponse.json({ found: false });

  const { data: staff } = await supabaseAdmin
    .from('corp_department_admins')
    .select('id, display_name, staff_number, department_name, status, is_visitor, expires_at, email, photo_data_url, created_at')
    .eq('id', secret.department_admin_id)
    .maybeSingle();

  return NextResponse.json({ found: !!staff, staff });
}
