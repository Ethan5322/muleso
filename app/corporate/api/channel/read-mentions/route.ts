import { NextResponse } from 'next/server';
import { requireCorp } from '@/lib/corp/api';
import { createCorpServerClient } from '@/lib/corp/supabaseServer';

export const dynamic = 'force-dynamic';

// Mark the current admin's channel mentions as read (called when they open the channel).
export async function POST() {
  const { ctx, error } = await requireCorp();
  if (error) return error;

  const supabase = await createCorpServerClient();
  await supabase
    .from('corp_channel_mentions')
    .update({ read_at: new Date().toISOString() })
    .eq('mentioned_admin_id', ctx.admin.id)
    .is('read_at', null);

  return NextResponse.json({ ok: true });
}
