import { NextResponse, type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Resolves a staff ID-card QR token to the correct admin-panel login.
// (The QR chooser shows Public site vs Admin panel; "Admin panel" goes here.)
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') || '';
  if (!token) return NextResponse.json({ kind: 'invalid' });

  // Main admin token → main admin panel (password + 2FA / face).
  try {
    const { data: cfg } = await supabaseAdmin
      .from('corp_config')
      .select('value')
      .eq('key', 'main_admin_card')
      .maybeSingle();
    const mainToken = (cfg?.value as { qr_token?: string } | null)?.qr_token;
    if (mainToken && token === mainToken) {
      return NextResponse.json({ kind: 'main', loginUrl: '/admin/login' });
    }
  } catch {
    /* ignore */
  }

  // Sub-admin / visitor token → corporate panel (one-tap QR + other methods).
  const { data: secret } = await supabaseAdmin
    .from('corp_admin_secrets')
    .select('department_admin_id')
    .eq('qr_token', token)
    .maybeSingle();

  if (secret) {
    const { data: admin } = await supabaseAdmin
      .from('corp_department_admins')
      .select('status, expires_at')
      .eq('id', secret.department_admin_id)
      .maybeSingle();
    const expired = admin?.expires_at && new Date(admin.expires_at).getTime() < Date.now();
    if (admin && admin.status === 'active' && !expired) {
      return NextResponse.json({
        kind: 'corp',
        loginUrl: `/corporate/login?token=${encodeURIComponent(token)}`,
      });
    }
    // Don't leak whether token is expired, inactive, or non-existent. Return the same error.
    return NextResponse.json({ kind: 'invalid' });
  }

  // Token not found. Return the same error to prevent information leakage.
  return NextResponse.json({ kind: 'invalid' });
}
