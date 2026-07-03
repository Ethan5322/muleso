import { NextResponse, type NextRequest } from 'next/server';
import { getMessagingIdentity, adminHasCapability } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Post a channel message / reply, optionally targeted to one department.
export async function POST(req: NextRequest) {
  const id = await getMessagingIdentity(req);
  if (!id) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (id.isVisitor) return NextResponse.json({ error: 'Read-only visitor access — you cannot post.' }, { status: 403 });

  const { channel_id, body, parent_message_id, target_department_id } = await req.json();
  const text = typeof body === 'string' ? body.trim() : '';
  if (!channel_id || !text) return NextResponse.json({ error: 'channel and message required' }, { status: 400 });

  if (!id.isSuper) {
    const allowed = await adminHasCapability(id.adminId, 'can_post_channel');
    if (!allowed) return NextResponse.json({ error: 'You do not have permission to post here.' }, { status: 403 });
  }

  const target =
    target_department_id != null && target_department_id !== '' && !Number.isNaN(Number(target_department_id))
      ? Number(target_department_id)
      : null;

  const { data, error } = await supabaseAdmin
    .from('corp_team_channel_messages')
    .insert({
      channel_id,
      sender_id: id.adminId,
      body: text,
      parent_message_id: parent_message_id || null,
      target_department_id: target,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // @mentions → notify matched active admins.
  try {
    const { data: admins } = await supabaseAdmin
      .from('corp_department_admins')
      .select('id, display_name')
      .eq('status', 'active');
    const mentioned = (admins ?? []).filter(
      (a) => a.display_name && a.id !== id.adminId && text.includes('@' + a.display_name)
    );
    if (mentioned.length) {
      await supabaseAdmin
        .from('corp_channel_mentions')
        .insert(mentioned.map((a) => ({ message_id: data.id, mentioned_admin_id: a.id })));
    }
  } catch (e) {
    console.error('mention parse failed (continuing):', e);
  }

  return NextResponse.json({ ok: true, message: data });
}
