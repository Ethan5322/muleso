import { NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Super Admin: recent governance audit entries (joined with admin display names).
export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { data: logs } = await supabaseAdmin
    .from('corp_admin_audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  const { data: admins } = await supabaseAdmin
    .from('corp_department_admins')
    .select('id, display_name');

  const nameById: Record<string, string> = {};
  (admins ?? []).forEach((a) => {
    nameById[a.id] = a.display_name || 'Unknown';
  });

  return NextResponse.json({ logs: logs ?? [], nameById });
}
