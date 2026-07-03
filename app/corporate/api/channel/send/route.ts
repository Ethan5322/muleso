import { NextResponse, type NextRequest } from 'next/server';
import { requireCorp, adminHasCapability } from '@/lib/corp/api';
import { createCorpServerClient } from '@/lib/corp/supabaseServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

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

  // Parse @mentions (match active admins' display names) and notify them.
  try {
    const { data: admins } = await supabaseAdmin
      .from('corp_department_admins')
      .select('id, display_name')
      .eq('status', 'active');
    const mentioned = (admins ?? []).filter(
      (a) => a.display_name && a.id !== ctx.admin.id && text.includes('@' + a.display_name)
    );
    if (mentioned.length) {
      await supabaseAdmin.from('corp_channel_mentions').insert(
        mentioned.map((a) => ({ message_id: data.id, mentioned_admin_id: a.id }))
      );
    }
  } catch (e) {
    console.error('mention parse failed (continuing):', e);
  }

  return NextResponse.json({ ok: true, message: data });
}
