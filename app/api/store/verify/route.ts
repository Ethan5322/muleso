import { NextRequest, NextResponse } from 'next/server';
import { findProductBySlug } from '@/lib/storeProducts';
import { sendPurchaseNotification } from '@/lib/sendWhatsAppMessage';

/**
 * Verifies a store payment with Paystack, then alerts the owner. Returns the
 * product so the confirmation page can offer the download.
 */
export async function POST(req: NextRequest) {
  try {
    const { reference, product: slug } = await req.json();
    if (!reference) return NextResponse.json({ error: 'Missing reference' }, { status: 400 });

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) return NextResponse.json({ error: 'Payments not configured' }, { status: 503 });

    const pr = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const pj = await pr.json();

    if (!pj.status || pj.data?.status !== 'success') {
      return NextResponse.json(
        { error: 'Payment could not be verified. If money left your account, contact us on WhatsApp.' },
        { status: 400 }
      );
    }

    const product =
      findProductBySlug(String(slug || '')) || findProductBySlug(String(pj.data?.metadata?.product_slug || ''));
    const amountPaid = (pj.data.amount || 0) / 100;
    const buyerEmail = pj.data.customer?.email;

    // Alert the owner (best-effort — never fail the buyer's confirmation).
    try {
      await sendPurchaseNotification({
        productName: product?.name || pj.data?.metadata?.product_name,
        amount: amountPaid,
        buyerEmail,
        reference,
      });
    } catch (e) {
      console.error('store/verify: owner alert failed (continuing):', e);
    }

    return NextResponse.json({
      success: true,
      amount: amountPaid,
      product: product ? { name: product.name, slug: product.slug } : null,
    });
  } catch (error) {
    console.error('store/verify error:', error);
    return NextResponse.json({ error: 'Verification failed. Please contact us on WhatsApp.' }, { status: 500 });
  }
}
