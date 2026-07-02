import { NextResponse, type NextRequest } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

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

  return NextResponse.json({
    admin_session_seen: authed,
    service_role_key_present: !!serviceKey,
    service_role_key_role: keyRole(serviceKey), // should be "service_role"
    anon_key_role: keyRole(anonKey), // should be "anon"
    supabase_url_present: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hint:
      keyRole(serviceKey) === 'service_role'
        ? 'Key looks correct. If registration still fails, redeploy after setting it.'
        : 'SUPABASE_SERVICE_ROLE_KEY is NOT the service_role secret — set it from Supabase → Project Settings → API → service_role, then Redeploy.',
  });
}
