import { NextResponse, type NextRequest } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Every table the corporate layer needs. Probed with a head-count so we can
// report exactly what exists in Supabase and what's missing (nothing skipped).
const REQUIRED_TABLES = [
  'corp_department_admins',
  'corp_admin_secrets',
  'corp_admin_capabilities',
  'corp_direct_messages',
  'corp_team_channels',
  'corp_team_channel_messages',
  'corp_message_reactions',
  'corp_channel_mentions',
  'corp_admin_audit_log',
  'corp_config',
  'corp_departments',
  'corp_tasks',
  'corp_task_comments',
  'corp_task_mentions',
];

async function checkSchema() {
  const result: Record<string, string> = {};
  const missing: string[] = [];
  await Promise.all(
    REQUIRED_TABLES.map(async (t) => {
      const { error } = await supabaseAdmin.from(t).select('*', { count: 'exact', head: true });
      if (error) {
        result[t] = 'MISSING';
        missing.push(t);
      } else {
        result[t] = 'ok';
      }
    })
  );
  return { result, missing };
}

/** Decode a Supabase JWT's role claim (service_role / anon) without exposing the key. */
function keyRole(key: string): string {
  try {
    const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64').toString('utf8'));
    return payload.role || 'unknown';
  } catch {
    return key ? 'not-a-jwt' : 'empty';
  }
}

// Diagnostic: confirms your admin session is seen AND that the service-role key
// is really the service_role secret. Visit while logged into /admin.
export async function GET(req: NextRequest) {
  const authed = isAdminRequest(req);
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const keyOk = keyRole(serviceKey) === 'service_role';
  let schema: { result: Record<string, string>; missing: string[] } = { result: {}, missing: [] };
  let departmentCount = 0;
  if (keyOk) {
    schema = await checkSchema();
    if (!schema.missing.includes('corp_departments')) {
      const { count } = await supabaseAdmin.from('corp_departments').select('*', { count: 'exact', head: true });
      departmentCount = count ?? 0;
    }
  }

  return NextResponse.json({
    admin_session_seen: authed,
    service_role_key_present: !!serviceKey,
    service_role_key_role: keyRole(serviceKey), // should be "service_role"
    anon_key_role: keyRole(anonKey), // should be "anon"
    supabase_url_present: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    tables: schema.result,
    tables_missing: schema.missing,
    departments_seeded: departmentCount,
    all_tables_present: keyOk && schema.missing.length === 0,
    hint: !keyOk
      ? 'SUPABASE_SERVICE_ROLE_KEY is NOT the service_role secret — set it from Supabase → Project Settings → API → service_role, then Redeploy.'
      : schema.missing.length
        ? `Missing tables: ${schema.missing.join(', ')}. Run the matching migrations in migrations/ (corporate_admin*.sql) in Supabase → SQL Editor.`
        : departmentCount === 0
          ? 'All tables exist but no departments yet — run corporate_admin_v7.sql to seed the essential departments.'
          : 'All corporate tables exist and departments are seeded. ✅',
  });
}
