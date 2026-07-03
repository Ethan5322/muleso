import { NextResponse, type NextRequest } from 'next/server';
import { getMessagingIdentity } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Unread counts for badges (works for sub-admins and the main admin).
export async function GET(req: NextRequest) {
  const id = await getMessagingIdentity(req);
  if (!id) return NextResponse.json({ unreadDM: 0, unreadMentions: 0 });

  const [{ count: dmCount }, { count: mentionCount }] = await Promise.all([
    supabaseAdmin
      .from('corp_direct_messages')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', id.adminId)
      .is('read_at', null),
    supabaseAdmin
      .from('corp_channel_mentions')
      .select('id', { count: 'exact', head: true })
      .eq('mentioned_admin_id', id.adminId)
      .is('read_at', null),
  ]);

  return NextResponse.json({ unreadDM: dmCount ?? 0, unreadMentions: mentionCount ?? 0 });
}
