import { NextResponse } from 'next/server';
import { requireCorp } from '@/lib/corp/api';
import { createCorpServerClient } from '@/lib/corp/supabaseServer';

export const dynamic = 'force-dynamic';

// Current admin's DMs (RLS returns only rows where they are sender/recipient)
// + the roster of other admins for the recipient dropdown.
export async function GET() {
  const { ctx, error } = await requireCorp();
  if (error) return error;

  const supabase = await createCorpServerClient();

  const [{ data: messages }, { data: roster }] = await Promise.all([
    supabase
      .from('corp_direct_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(1000),
    supabase
      .from('corp_department_admins')
      .select('id, display_name, department_name, department_id, status, is_super_admin')
      .neq('id', ctx.admin.id)
      .eq('status', 'active'),
  ]);

  return NextResponse.json({
    me: ctx.admin.id,
    messages: messages ?? [],
    contacts: roster ?? [],
  });
}
