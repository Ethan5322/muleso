import { NextResponse, type NextRequest } from 'next/server';
import { requireCorp, adminHasCapability } from '@/lib/corp/api';
import { createCorpServerClient } from '@/lib/corp/supabaseServer';

export const dynamic = 'force-dynamic';

// Post a channel message or a threaded reply. Capability-gated (can_post_channel).
export async function POST(req: NextRequest) {
  const { ctx, error } = await requireCorp();
  if (error) return error;
  if (ctx.admin.is_visitor) {
    return NextResponse.json({ error: 'Read-only visitor access — you cannot post.' }, { status: 403 });
  }

  const { channel_id, body, parent_message_id } = await req.json();
  const text = typeof body === 'string' ? body.trim() : '';
  if (!channel_id || !text) {
    return NextResponse.json({ error: 'channel and message required' }, { status: 400 });
  }

  if (!ctx.admin.is_super_admin) {
    const allowed = await adminHasCapability(ctx.admin.id, 'can_post_channel');
    if (!allowed) {
      return NextResponse.json({ error: 'You do not have permission to post here.' }, { status: 403 });
    }
  }

  const supabase = await createCorpServerClient();
  const { data, error: insErr } = await supabase
    .from('corp_team_channel_messages')
    .insert({
      channel_id,
      sender_id: ctx.admin.id,
      body: text,
      parent_message_id: parent_message_id || null,
    })
    .select()
    .single();

  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });
  return NextResponse.json({ ok: true, message: data });
}
