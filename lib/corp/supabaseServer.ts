import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Supabase client for the CORPORATE module, authenticated as the logged-in
 * department admin via cookies. RLS applies (auth.uid() works). Use this in
 * server components / route handlers for the /corporate area.
 */
export async function createCorpServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // called from a Server Component — cookie writes are handled by
            // the browser client / route handlers; safe to ignore here.
          }
        },
      },
    }
  );
}
