import { NextResponse, type NextRequest } from 'next/server';
import { requireCorp, adminHasCapability } from '@/lib/corp/api';
import { createCorpServerClient } from '@/lib/corp/supabaseServer';

export const dynamic = 'force-dynamic';

// Send a private DM. Capability-gated server-side; RLS also enforces sender = me.
export async function POST(req: NextRequest) {
  const { ctx, error } = await requireCorp();
  if (error) return error;

  const { recipient_id, body } = await req.json();
  const text = typeof body === 'string' ? body.trim() : '';
  if (!recipient_id || !text) {
    return NextResponse.json({ error: 'recipient and message required' }, { status: 400 });
  }
  if (recipient_id === ctx.admin.id) {
    return NextResponse.json({ error: 'cannot message yourself' }, { status: 400 });
  }

  // Second-layer capability gate (super admin always allowed).
  if (!ctx.admin.is_super_admin) {
    const allowed = await adminHasCapability(ctx.admin.id, 'can_send_dm');
    if (!allowed) {
      return NextResponse.json({ error: 'You do not have permission to send messages.' }, { status: 403 });
    }
  }

  const supabase = await createCorpServerClient();
  const { data, error: insErr } = await supabase
    .from('corp_direct_messages')
    .insert({ sender_id: ctx.admin.id, recipient_id, body: text })
    .select()
    .single();

  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });
  return NextResponse.json({ ok: true, message: data });
}
