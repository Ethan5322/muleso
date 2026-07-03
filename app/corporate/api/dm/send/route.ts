import { NextResponse, type NextRequest } from 'next/server';
import { getMessagingIdentity, adminHasCapability } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Send a private DM (reliable service-role delivery).
export async function POST(req: NextRequest) {
  const id = await getMessagingIdentity(req);
  if (!id) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (id.isVisitor) return NextResponse.json({ error: 'Read-only visitor access — you cannot send messages.' }, { status: 403 });

  const { recipient_id, body } = await req.json();
  const text = typeof body === 'string' ? body.trim() : '';
  if (!recipient_id || !text) return NextResponse.json({ error: 'recipient and message required' }, { status: 400 });
  if (recipient_id === id.adminId) return NextResponse.json({ error: 'cannot message yourself' }, { status: 400 });

  if (!id.isSuper) {
    const allowed = await adminHasCapability(id.adminId, 'can_send_dm');
    if (!allowed) return NextResponse.json({ error: 'You do not have permission to send messages.' }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from('corp_direct_messages')
    .insert({ sender_id: id.adminId, recipient_id, body: text })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, message: data });
}
