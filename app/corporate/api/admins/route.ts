import { NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/corp/api';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Super Admin: list all department admins + their capability grants.
export async function GET() {
  const { ctx, error } = await requireSuperAdmin();
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
    me: ctx.admin.id,
  });
}
