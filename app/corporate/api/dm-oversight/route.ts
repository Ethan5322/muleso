import { NextResponse, type NextRequest } from 'next/server';
import { requireManager } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Super Admin / main admin oversight: DM METADATA ONLY (who → whom, when, read).
// The `body` column is never selected, so message contents remain private.
export async function GET(req: NextRequest) {
  const { error } = await requireManager(req);
  if (error) return error;

  const { data: items } = await supabaseAdmin
    .from('corp_direct_messages')
    .select('id, sender_id, recipient_id, read_at, created_at') // NOTE: no `body`
    .order('created_at', { ascending: false })
    .limit(150);

  const { data: admins } = await supabaseAdmin.from('corp_department_admins').select('id, display_name');
  const nameById: Record<string, string> = {};
  (admins ?? []).forEach((a) => (nameById[a.id] = a.display_name || 'Admin'));

  return NextResponse.json({ items: items ?? [], nameById });
}
