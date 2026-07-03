import { NextResponse, type NextRequest } from 'next/server';
import { getMessagingIdentity } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Mark the current admin's channel mentions as read.
export async function POST(req: NextRequest) {
  const id = await getMessagingIdentity(req);
  if (!id) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  await supabaseAdmin
    .from('corp_channel_mentions')
    .update({ read_at: new Date().toISOString() })
    .eq('mentioned_admin_id', id.adminId)
    .is('read_at', null);

  return NextResponse.json({ ok: true });
}
