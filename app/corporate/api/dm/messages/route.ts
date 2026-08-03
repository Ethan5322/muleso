import { NextResponse, type NextRequest } from 'next/server';
import { getMessagingIdentity, corpIdentityFailure } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Current admin's DMs + the roster of other admins (for the recipient list).
export async function GET(req: NextRequest) {
  const id = await getMessagingIdentity(req);
  if (!id) return corpIdentityFailure(req);

  const [{ data: messages }, { data: roster }] = await Promise.all([
    supabaseAdmin
      .from('corp_direct_messages')
      .select('*')
      .or(`sender_id.eq.${id.adminId},recipient_id.eq.${id.adminId}`)
      .order('created_at', { ascending: true })
      .limit(1000),
    supabaseAdmin
      .from('corp_department_admins')
      .select('id, display_name, department_name, department_id, status, is_super_admin')
      .neq('id', id.adminId)
      .eq('status', 'active'),
  ]);

  return NextResponse.json({
    me: id.adminId,
    messages: messages ?? [],
    contacts: roster ?? [],
  });
}
