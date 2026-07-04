import { NextResponse, type NextRequest } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Main admin only: resolve a scanned ID — either the barcode (verification code)
// OR the QR token — to the staff member's full details.
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let rawCode = (req.nextUrl.searchParams.get('code') || '').trim();
  let token = (req.nextUrl.searchParams.get('token') || '').trim();

  // If a details URL was scanned (…/admin/id/<code> or …/id/<code>), pull the code out.
  const idMatch = rawCode.match(/\/id\/([^/?#\s]+)/i);
  if (idMatch) rawCode = decodeURIComponent(idMatch[1]);

  // If a login QR/URL was scanned, pull the token out of it.
  if (!token && /token=/.test(rawCode)) {
    token = rawCode.split('token=')[1]?.split(/[&\s]/)[0] || '';
  }
  const code = token ? '' : rawCode.toUpperCase();

  if (!code && !token) return NextResponse.json({ found: false });

  // Main admin's own card (matches by code or token)
  try {
    const { data: cfg } = await supabaseAdmin
      .from('corp_config')
      .select('value')
      .eq('key', 'main_admin_card')
      .maybeSingle();
    const mc = cfg?.value as Record<string, string> | null;
    if (mc && ((code && mc.verification_code?.toUpperCase() === code) || (token && mc.qr_token === token))) {
      return NextResponse.json({
        found: true,
        staff: {
          display_name: mc.display_name || 'Main Administrator',
          staff_number: mc.staff_number || 'MSD-0001',
          department_name: mc.department_name || 'Executive',
          role_title: 'Main Administrator',
          status: 'active',
          is_super_admin: true,
          photo_data_url: mc.photo_data_url || null,
        },
      });
    }
  } catch {
    /* ignore */
  }

  // Sub-admin / visitor — match the secret by code OR token
  let query = supabaseAdmin.from('corp_admin_secrets').select('department_admin_id');
  query = token ? query.eq('qr_token', token) : query.eq('verification_code', code);
  const { data: secret } = await query.maybeSingle();
  if (!secret) return NextResponse.json({ found: false });

  const { data: staff } = await supabaseAdmin
    .from('corp_department_admins')
    .select('id, display_name, staff_number, department_name, role_title, status, is_visitor, expires_at, suspended_until, email, photo_data_url, created_at')
    .eq('id', secret.department_admin_id)
    .maybeSingle();

  return NextResponse.json({ found: !!staff, staff });
}
