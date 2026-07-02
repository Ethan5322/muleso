import { NextResponse, type NextRequest } from 'next/server';
import { requireCorp } from '@/lib/corp/api';
import { createCorpServerClient } from '@/lib/corp/supabaseServer';

export const dynamic = 'force-dynamic';

// Mark messages from a given admin -> me as read.
export async function POST(req: NextRequest) {
  const { ctx, error } = await requireCorp();
  if (error) return error;

  const { with: withId } = await req.json();
  if (!withId) return NextResponse.json({ error: 'missing sender' }, { status: 400 });

  const supabase = await createCorpServerClient();
  await supabase
    .from('corp_direct_messages')
    .update({ read_at: new Date().toISOString() })
    .eq('recipient_id', ctx.admin.id)
    .eq('sender_id', withId)
    .is('read_at', null);

  return NextResponse.json({ ok: true });
}
