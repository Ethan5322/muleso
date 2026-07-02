import { NextResponse, type NextRequest } from 'next/server';
import { requireCorp } from '@/lib/corp/api';
import { createCorpServerClient } from '@/lib/corp/supabaseServer';

export const dynamic = 'force-dynamic';

// Toggle an emoji reaction on a channel message.
export async function POST(req: NextRequest) {
  const { ctx, error } = await requireCorp();
  if (error) return error;
  if (ctx.admin.is_visitor) {
    return NextResponse.json({ error: 'Read-only visitor access.' }, { status: 403 });
  }

  const { message_id, emoji } = await req.json();
  if (!message_id || !emoji) {
    return NextResponse.json({ error: 'message and emoji required' }, { status: 400 });
  }

  const supabase = await createCorpServerClient();
  const { data: existing } = await supabase
    .from('corp_message_reactions')
    .select('id')
    .eq('message_id', message_id)
    .eq('department_admin_id', ctx.admin.id)
    .eq('emoji', emoji)
    .maybeSingle();

  if (existing) {
    await supabase.from('corp_message_reactions').delete().eq('id', existing.id);
    return NextResponse.json({ ok: true, removed: true });
  }

  const { error: insErr } = await supabase
    .from('corp_message_reactions')
    .insert({ message_id, department_admin_id: ctx.admin.id, emoji });
  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });
  return NextResponse.json({ ok: true, added: true });
}
