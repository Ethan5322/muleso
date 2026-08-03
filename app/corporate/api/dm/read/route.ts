import { NextResponse, type NextRequest } from 'next/server';
import { getMessagingIdentity, corpIdentityFailure } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Mark messages from a given admin -> me as read.
export async function POST(req: NextRequest) {
  const id = await getMessagingIdentity(req);
  if (!id) return corpIdentityFailure(req);

  const { with: withId } = await req.json();
  if (!withId) return NextResponse.json({ error: 'missing sender' }, { status: 400 });

  await supabaseAdmin
    .from('corp_direct_messages')
    .update({ read_at: new Date().toISOString() })
    .eq('recipient_id', id.adminId)
    .eq('sender_id', withId)
    .is('read_at', null);

  return NextResponse.json({ ok: true });
}
