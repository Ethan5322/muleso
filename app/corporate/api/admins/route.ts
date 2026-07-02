import { NextResponse, type NextRequest } from 'next/server';
import { requireManager } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Manager (main admin or corp super admin): list admins + capability grants.
export async function GET(req: NextRequest) {
  const { actorId, error } = await requireManager(req);
  if (error) return error;

  const [{ data: admins }, { data: caps }] = await Promise.all([
    supabaseAdmin
      .from('corp_department_admins')
      .select('*')
      .order('is_super_admin', { ascending: false })
      .order('department_id', { ascending: true }),
    supabaseAdmin.from('corp_admin_capabilities').select('*'),
  ]);

  return NextResponse.json({
    admins: admins ?? [],
    capabilities: caps ?? [],
    me: actorId, // null for the main admin
  });
}
