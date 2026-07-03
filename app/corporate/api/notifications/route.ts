import { NextResponse } from 'next/server';
import { requireCorp } from '@/lib/corp/api';
import { createCorpServerClient } from '@/lib/corp/supabaseServer';

export const dynamic = 'force-dynamic';

// Lightweight unread counts for in-app badges.
export async function GET() {
  const { ctx, error } = await requireCorp();
  if (error) return error;

  const supabase = await createCorpServerClient();
  const [{ count: dmCount }, { count: mentionCount }] = await Promise.all([
    supabase
      .from('corp_direct_messages')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', ctx.admin.id)
      .is('read_at', null),
    supabase
      .from('corp_channel_mentions')
      .select('id', { count: 'exact', head: true })
      .eq('mentioned_admin_id', ctx.admin.id)
      .is('read_at', null),
  ]);

  return NextResponse.json({ unreadDM: dmCount ?? 0, unreadMentions: mentionCount ?? 0 });
}
