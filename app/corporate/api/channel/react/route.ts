import { NextResponse, type NextRequest } from 'next/server';
import { getMessagingIdentity } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Toggle an emoji reaction on a channel message.
export async function POST(req: NextRequest) {
  const id = await getMessagingIdentity(req);
  if (!id) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (id.isVisitor) return NextResponse.json({ error: 'Read-only visitor access.' }, { status: 403 });

  const { message_id, emoji } = await req.json();
  if (!message_id || !emoji) return NextResponse.json({ error: 'message and emoji required' }, { status: 400 });

  const { data: existing } = await supabaseAdmin
    .from('corp_message_reactions')
    .select('id')
    .eq('message_id', message_id)
    .eq('department_admin_id', id.adminId)
    .eq('emoji', emoji)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin.from('corp_message_reactions').delete().eq('id', existing.id);
    return NextResponse.json({ ok: true, removed: true });
  }

  const { error } = await supabaseAdmin
    .from('corp_message_reactions')
    .insert({ message_id, department_admin_id: id.adminId, emoji });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, added: true });
}
