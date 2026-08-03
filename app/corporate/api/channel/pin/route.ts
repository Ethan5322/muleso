import { NextResponse, type NextRequest } from 'next/server';
import { getMessagingIdentity, corpIdentityFailure } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Pin / unpin a channel message (author or super/main admin).
export async function POST(req: NextRequest) {
  const id = await getMessagingIdentity(req);
  if (!id) return corpIdentityFailure(req);
  if (id.isVisitor) return NextResponse.json({ error: 'Read-only visitor access.' }, { status: 403 });

  const { message_id, pinned } = await req.json();
  if (!message_id || typeof pinned !== 'boolean') {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }

  // Only the author or a super/main admin can pin.
  if (!id.isSuper) {
    const { data: msg } = await supabaseAdmin
      .from('corp_team_channel_messages')
      .select('sender_id')
      .eq('id', message_id)
      .maybeSingle();
    if (!msg || msg.sender_id !== id.adminId) {
      return NextResponse.json({ error: 'Not allowed.' }, { status: 403 });
    }
  }

  const { error } = await supabaseAdmin
    .from('corp_team_channel_messages')
    .update({ pinned })
    .eq('id', message_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
