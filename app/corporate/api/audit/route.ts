import { NextResponse, type NextRequest } from 'next/server';
import { requireManager } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Manager: recent governance audit entries (joined with admin display names).
export async function GET(req: NextRequest) {
  const { error } = await requireManager(req);
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
