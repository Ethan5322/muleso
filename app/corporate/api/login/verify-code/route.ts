import { NextResponse, type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { establishCorpSession } from '@/lib/corp/session';

export const dynamic = 'force-dynamic';

// Log in with the verification code printed on the ID card.
export async function POST(req: NextRequest) {
  const { code } = await req.json();
  const clean = typeof code === 'string' ? code.trim().toUpperCase() : '';
  if (!clean) return NextResponse.json({ error: 'Enter your verification code.' }, { status: 400 });

  const { data: secret } = await supabaseAdmin
    .from('corp_admin_secrets')
    .select('department_admin_id')
    .eq('verification_code', clean)
    .maybeSingle();

  if (!secret) return NextResponse.json({ error: 'Invalid verification code.' }, { status: 401 });

  const { data: admin } = await supabaseAdmin
    .from('corp_department_admins')
    .select('email, status')
    .eq('id', secret.department_admin_id)
    .maybeSingle();

  if (!admin?.email) return NextResponse.json({ error: 'Account not found.' }, { status: 401 });
  if (admin.status !== 'active') return NextResponse.json({ error: 'Access suspended.' }, { status: 403 });

  const ok = await establishCorpSession(admin.email);
  if (!ok) return NextResponse.json({ error: 'Could not sign you in. Try password login.' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
