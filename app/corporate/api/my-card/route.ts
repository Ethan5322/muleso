import { NextResponse, type NextRequest } from 'next/server';
import { requireManager } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { makeVerificationCode, makeQrToken } from '@/lib/corp/identity';

export const dynamic = 'force-dynamic';

// Returns the current manager's own ID-card data (main admin or corp super admin),
// creating credentials on first request. Used to download their staff ID.
export async function GET(req: NextRequest) {
  const { actorId, error } = await requireManager(req);
  if (error) return error;

  // Main admin (cookie session, no corp row) — identity stored in corp_config.
  if (actorId === null) {
    const { data: cfg } = await supabaseAdmin
      .from('corp_config')
      .select('value')
      .eq('key', 'main_admin_card')
      .maybeSingle();

    let card = (cfg?.value as Record<string, string>) || {};
    if (!card.verification_code) {
      card = {
        staff_number: 'MSD-0001',
        display_name: 'Main Administrator',
        department_name: 'Executive',
        verification_code: makeVerificationCode(),
        qr_token: makeQrToken(),
      };
      await supabaseAdmin.from('corp_config').upsert({ key: 'main_admin_card', value: card });
    }
    return NextResponse.json({ card });
  }

  // Corp super admin — from their row + secrets (create secrets if missing).
  const { data: admin } = await supabaseAdmin
    .from('corp_department_admins')
    .select('display_name, department_name, staff_number, photo_data_url')
    .eq('id', actorId)
    .maybeSingle();

  let { data: secret } = await supabaseAdmin
    .from('corp_admin_secrets')
    .select('verification_code, qr_token')
    .eq('department_admin_id', actorId)
    .maybeSingle();

  if (!secret) {
    secret = { verification_code: makeVerificationCode(), qr_token: makeQrToken() };
    await supabaseAdmin.from('corp_admin_secrets').upsert({ department_admin_id: actorId, ...secret });
  }

  return NextResponse.json({
    card: {
      staff_number: admin?.staff_number || 'MSD-0001',
      display_name: admin?.display_name || 'Administrator',
      department_name: admin?.department_name || 'Executive',
      verification_code: secret.verification_code,
      qr_token: secret.qr_token,
      photo_data_url: admin?.photo_data_url || null,
    },
  });
}
