import { NextRequest, NextResponse } from 'next/server';
import { findProductBySlug } from '@/lib/storeProducts';
import { generateBuyerGuide } from '@/lib/guides/deliver';

export const runtime = 'nodejs';

/**
 * Serves a paid guide — but ONLY after re-verifying the Paystack reference,
 * so files can't be downloaded without paying. The PDF is generated on demand
 * with the buyer's watermark + password (never stored, never in the repo).
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
  let buyerEmail = 'buyer';
  try {
    const pr = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const pj = await pr.json();
    if (!pj.status || pj.data?.status !== 'success') {
      return NextResponse.json({ error: 'Payment not verified.' }, { status: 403 });
    }
    buyerEmail = pj.data.customer?.email || 'buyer';
  } catch {
    return NextResponse.json({ error: 'Could not verify payment.' }, { status: 502 });
  }

  const item = generateBuyerGuide(slug, reference, buyerEmail);
  if (!item) {
    return NextResponse.json(
      { error: 'This guide is being prepared — please WhatsApp us and we will email it right away.' },
      { status: 404 }
    );
  }

  return new NextResponse(item.pdf as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${item.filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
