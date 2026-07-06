import { NextRequest, NextResponse } from 'next/server';
import { findProductBySlug } from '@/lib/storeProducts';

/**
 * Starts a Paystack transaction for a store guide and returns the hosted
 * checkout URL. The client redirects the buyer to it (card / Instant EFT).
 * Price is taken from the server catalogue — never trusted from the client.
 */
export async function POST(req: NextRequest) {
  try {
    const { slug, email } = await req.json();

    const product = findProductBySlug(String(slug || ''));
    if (!product) return NextResponse.json({ error: 'Unknown product' }, { status: 400 });

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: 'A valid email is required for delivery.' }, { status: 400 });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { error: 'Payments are not fully set up yet. Please contact us to buy this guide.' },
        { status: 503 }
      );
    }

    const origin = process.env.NEXT_PUBLIC_URL || new URL(req.url).origin;
    const callbackUrl = `${origin}/store/success?product=${encodeURIComponent(product.slug)}`;

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        amount: Math.round(product.price * 100),
        currency: 'ZAR',
        reference: `MULE-STORE-${Date.now()}`,
        callback_url: callbackUrl,
        metadata: {
          product_slug: product.slug,
          product_name: product.name,
          custom_fields: [{ display_name: 'Product', variable_name: 'product', value: product.name }],
        },
      }),
    });

    const data = await res.json();
    if (!data.status || !data.data?.authorization_url) {
      console.error('store/checkout: initialize failed:', data);
      return NextResponse.json({ error: 'Could not start the payment. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ url: data.data.authorization_url, reference: data.data.reference });
  } catch (error) {
    console.error('store/checkout error:', error);
    return NextResponse.json({ error: 'Could not start the payment. Please try again.' }, { status: 500 });
  }
}
