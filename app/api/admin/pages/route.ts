import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isAdminRequest } from '@/lib/adminAuth';

const unauthorized = () =>
  NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

// Admin-only: this runs on the service-role key, so it bypasses RLS and
// returns UNPUBLISHED drafts too. The public site never calls this — only
// PageManager and PageEditor do — so it must not answer anonymous callers.
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  try {
    const { data, error } = await supabaseAdmin
      .from('pages')
      .select('*')
      .order('order', { ascending: true });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  try {
    const body = await req.json();
    const { data, error } = await supabaseAdmin
      .from('pages')
      .insert({
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select();
    if (error) throw error;
    return NextResponse.json(data?.[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  try {
    const { id, ...fields } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const { data, error } = await supabaseAdmin
      .from('pages')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return NextResponse.json(data?.[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const { error } = await supabaseAdmin.from('pages').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
