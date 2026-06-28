import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

/**
 * Creates a Stripe Checkout session for a digital product.
 * If Stripe isn't configured yet, returns { fallback: true } so the
 * client can fall back to a WhatsApp order — the store still works.
 */
export async function POST(req: NextRequest) {
  try {
    const { productName, amount } = await req.json();

    if (!productName || !amount) {
      return NextResponse.json({ error: 'Missing product details' }, { status: 400 });
    }

    // Stripe not set up yet → tell the client to use the WhatsApp fallback
    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json({ fallback: true });
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const baseUrl = process.env.NEXT_PUBLIC_URL || new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'zar',
            product_data: { name: productName },
            unit_amount: Math.round(Number(amount) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/store`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('create-checkout error:', error);
    return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 500 });
  }
}
