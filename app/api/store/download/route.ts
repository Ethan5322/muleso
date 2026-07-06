import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { findProductBySlug } from '@/lib/storeProducts';

/**
 * Delivers a paid guide — but ONLY after re-verifying the Paystack reference,
 * so files can't be downloaded without paying. The PDFs live in a PRIVATE
 * Supabase Storage bucket ("guides"); we hand the buyer a short-lived signed
 * URL. Files are never in the repo or publicly reachable.
 */
export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get('reference') || '';
  const slug = req.nextUrl.searchParams.get('product') || '';

  const product = findProductBySlug(slug);
  if (!reference || !product) {
    return NextResponse.json({ error: 'Invalid download request.' }, { status: 400 });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: 'Payments not configured.' }, { status: 503 });

  // Gate: the reference must be a real, successful Paystack payment.
  try {
    const pr = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const pj = await pr.json();
    if (!pj.status || pj.data?.status !== 'success') {
      return NextResponse.json({ error: 'Payment not verified.' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'Could not verify payment.' }, { status: 502 });
  }

  // Hand back a short-lived signed URL to the private file (forces download).
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('guides')
      .createSignedUrl(product.file, 300, { download: product.file });
    if (error || !data?.signedUrl) {
      console.error('store/download: signed URL failed:', error?.message);
      return NextResponse.json(
        { error: 'Your guide is being prepared — please WhatsApp us and we will email it right away.' },
        { status: 404 }
      );
    }
    return NextResponse.redirect(data.signedUrl);
  } catch (e) {
    console.error('store/download error:', e);
    return NextResponse.json(
      { error: 'Your guide is being prepared — please WhatsApp us and we will email it right away.' },
      { status: 500 }
    );
  }
}
