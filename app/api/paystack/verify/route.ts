import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Verifies a Paystack transaction server-side and marks the booking as paid.
 *
 * The client (ChatbotWidget) opens the Paystack inline popup with the PUBLIC
 * key, and on success passes us the transaction `reference`. We re-check that
 * reference against Paystack's API using the SECRET key — never trust the
 * client's word that a payment succeeded.
 *
 * Body: { reference, bookingId?, bookingReference? }
 *  - bookingId        = bookings.id (returned by /api/chatbot-booking)
 *  - bookingReference = the MULE-XXXX verification code, used as a fallback
 *                       lookup if we don't have the row id.
 */
export async function POST(req: NextRequest) {
  try {
    const { reference, bookingId, bookingReference } = await req.json();

    if (!reference) {
      return NextResponse.json({ error: 'Missing payment reference' }, { status: 400 });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      console.error('paystack/verify: PAYSTACK_SECRET_KEY is not set');
      return NextResponse.json(
        { error: 'Payments are not fully configured yet. Please contact us on WhatsApp.' },
        { status: 503 }
      );
    }

    // 1. Verify the transaction with Paystack
    const pr = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secret}` } }
    );
    const pj = await pr.json();

    if (!pj.status || pj.data?.status !== 'success') {
      return NextResponse.json(
        { error: 'Payment could not be verified. If money left your account, contact us on WhatsApp.' },
        { status: 400 }
      );
    }

    const amountPaid = (pj.data.amount || 0) / 100; // Paystack returns cents
    const paidAt = pj.data.paid_at || new Date().toISOString();

    // 2. Mark the booking as paid (best-effort — never fail the client's
    //    confirmation just because the DB update hiccups; the payment is real
    //    and Paystack keeps its own record).
    try {
      const patch = {
        payment_status: 'paid',
        payment_reference: reference,
        amount_paid: amountPaid,
        paid_at: paidAt,
        status: 'Paid',
      };

      let updated = false;
      if (bookingId) {
        const { error } = await supabaseAdmin.from('bookings').update(patch).eq('id', bookingId);
        updated = !error;
        if (error) console.error('paystack/verify: update by id failed:', error.message);
      }
      if (!updated && bookingReference) {
        const { error } = await supabaseAdmin
          .from('bookings')
          .update(patch)
          .eq('verification_code', bookingReference);
        if (error) console.error('paystack/verify: update by reference failed:', error.message);
      }
    } catch (dbErr: any) {
      console.error('paystack/verify: DB update threw (continuing):', dbErr?.message);
    }

    return NextResponse.json({ success: true, amount: amountPaid, reference });
  } catch (error: any) {
    console.error('paystack/verify error:', error);
    return NextResponse.json({ error: 'Verification failed. Please contact us on WhatsApp.' }, { status: 500 });
  }
}
