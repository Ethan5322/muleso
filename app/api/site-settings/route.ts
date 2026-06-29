import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isAdminRequest } from '@/lib/adminAuth';
import { DEFAULT_SETTINGS, mergeSettings } from '@/lib/siteSettings';

const ROW_ID = 'main';
const FIELDS = ['phone', 'email', 'whatsapp', 'address', 'hours', 'linkedin', 'twitter', 'instagram'] as const;

// Public read — used by the footer and contact page.
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('*')
      .eq('id', ROW_ID)
      .maybeSingle();
    if (error) throw error;
    return NextResponse.json(mergeSettings(data));
  } catch {
    // Never break the public site — fall back to defaults
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

// Admin-only update.
export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const update: Record<string, string> = { id: ROW_ID };
    for (const f of FIELDS) {
      if (typeof body[f] === 'string') update[f] = body[f].trim();
    }
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .upsert({ ...update, updated_at: new Date().toISOString() })
      .select()
      .maybeSingle();
    if (error) throw error;
    return NextResponse.json(mergeSettings(data));
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Save failed' }, { status: 500 });
  }
}
