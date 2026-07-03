import 'server-only';
import { createCorpServerClient } from '@/lib/corp/supabaseServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { CorpAdmin } from '@/lib/corp/constants';

/**
 * Read the module kill-switch. Uses the service-role client so it works before
 * a user is authenticated. Defaults to ENABLED if the row/table is missing.
 */
export async function isCorpModuleEnabled(): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from('corp_config')
      .select('value')
      .eq('key', 'module_enabled')
      .maybeSingle();
    if (error) return true;
    if (data == null) return true;
    return data.value === true || data.value === 'true';
  } catch {
    return true;
  }
}

export interface CorpContext {
  userId: string;
  email: string | null;
  admin: CorpAdmin;
}

/**
 * Returns the authenticated corporate admin, or null if not logged in / not a
 * registered, active corporate admin.
 */
export async function getCorpContext(): Promise<CorpContext | null> {
  const supabase = await createCorpServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: admin } = await supabase
    .from('corp_department_admins')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!admin) return null;

  // Timed suspension: auto-lift once the suspension period has passed.
  if (admin.status === 'suspended') {
    if (admin.suspended_until && new Date(admin.suspended_until).getTime() < Date.now()) {
      await supabaseAdmin
        .from('corp_department_admins')
        .update({ status: 'active', suspended_until: null })
        .eq('id', admin.id);
      admin.status = 'active';
      admin.suspended_until = null;
    } else {
      return null; // still suspended
    }
  }

  // Temporary access: block once expired (main admin controls the date).
  if (admin.expires_at && new Date(admin.expires_at).getTime() < Date.now()) return null;

  return { userId: user.id, email: user.email ?? null, admin: admin as CorpAdmin };
}
