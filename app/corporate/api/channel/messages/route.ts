import { NextResponse } from 'next/server';
import { requireCorp } from '@/lib/corp/api';
import { createCorpServerClient } from '@/lib/corp/supabaseServer';

export const dynamic = 'force-dynamic';

// Default team channel feed + reactions + admin names.
export async function GET() {
  const { ctx, error } = await requireCorp();
  if (error) return error;

  const supabase = await createCorpServerClient();

  const { data: channels } = await supabase
    .from('corp_team_channels')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1);
  const channel = channels?.[0] ?? null;

  if (!channel) {
    return NextResponse.json({ channel: null, messages: [], reactions: [], nameById: {}, me: ctx.admin.id });
  }

  const [{ data: messages }, { data: reactions }, { data: admins }] = await Promise.all([
    supabase
      .from('corp_team_channel_messages')
      .select('*')
      .eq('channel_id', channel.id)
      .order('created_at', { ascending: true })
      .limit(500),
    supabase.from('corp_message_reactions').select('*'),
    supabase.from('corp_department_admins').select('id, display_name'),
  ]);

  const nameById: Record<string, string> = {};
  (admins ?? []).forEach((a) => (nameById[a.id] = a.display_name || 'Admin'));
  const roster = (admins ?? [])
    .filter((a) => a.id !== ctx.admin.id && a.display_name)
    .map((a) => ({ id: a.id, display_name: a.display_name as string }));

  return NextResponse.json({
    channel,
    messages: messages ?? [],
    reactions: reactions ?? [],
    nameById,
    roster,
    me: ctx.admin.id,
    isSuper: ctx.admin.is_super_admin,
  });
}
