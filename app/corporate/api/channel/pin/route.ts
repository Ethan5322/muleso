import { NextResponse, type NextRequest } from 'next/server';
import { requireCorp } from '@/lib/corp/api';
import { createCorpServerClient } from '@/lib/corp/supabaseServer';

export const dynamic = 'force-dynamic';

// Pin / unpin a channel message (author or Super Admin — enforced by RLS).
export async function POST(req: NextRequest) {
  const { error } = await requireCorp();
  if (error) return error;

  const { message_id, pinned } = await req.json();
  if (!message_id || typeof pinned !== 'boolean') {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }

  const supabase = await createCorpServerClient();
  const { error: updErr } = await supabase
    .from('corp_team_channel_messages')
    .update({ pinned })
    .eq('id', message_id);

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
