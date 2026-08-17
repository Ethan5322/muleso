import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendAdminNotification, sendDepositPaidNotification } from '@/lib/sendWhatsAppMessage';
import { sendDepositPaymentEmail, BOOKING_FEE_ZAR } from '@/lib/bookingPayment';

/**
 * Verifies a Paystack transaction server-side and marks the booking as paid.
 *
 * The client (ChatbotWidget or the emailed link's /booking/pay page) opens
 * Paystack with a reference, and on success passes us that reference. We
 * re-check it against Paystack's own API using the SECRET key — never trust
 * the client's word that a payment succeeded, and never trust anything the
 * client sends about WHICH payment this is either: `payment_type` is read
 * back from Paystack's own verified transaction metadata (`pj.data.metadata`),
 * not from the request body, so a client cannot claim a deposit payment was
 * really a booking fee or vice versa.
 *
 * This endpoint is the single gate for two different events on the same
 * booking, distinguished by that metadata:
 *
 *   'booking_fee' — the flat R100, paid in the widget while the client is
 *     still in the chat. This is the moment the booking becomes real: the
 *     owner's WhatsApp alert fires for the first time here, and the deposit
 *     email (the next payment) is sent for the first time here. Before this,
 *     nothing about the booking has been communicated to the owner at all —
 *     see app/api/chatbot-booking/route.ts.
 *
 *   'deposit' (or absent, for anything initialized before this split existed)
 *     — the 50% project deposit, paid via the link in that email. Existing
 *     behaviour: mark paid, alert the owner it landed.
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
    // Server-verified, not client-supplied — see the module comment above.
    const paymentType: 'booking_fee' | 'deposit' =
      pj.data.metadata?.payment_type === 'booking_fee' ? 'booking_fee' : 'deposit';

    // 2. Mark the booking as paid (best-effort — never fail the client's
    //    confirmation just because the DB update hiccups; the payment is real
    //    and Paystack keeps its own record).
    let updatedRow: any = null;
    try {
      const patch =
        paymentType === 'booking_fee'
          ? {
              // Two-stage progression: unpaid -> booking_fee_paid -> paid.
              // The project deposit hasn't happened yet, so payment_status is
              // deliberately not 'paid' — that value is reserved for the
              // deposit, further down. `status` uses the admin dashboard's
              // own existing vocabulary (app/admin/bookings/page.tsx only
              // recognises Pending/Confirmed/Completed/Cancelled) rather than
              // a new string the dashboard's stat counts and filter tabs
              // don't know about — a booking that has paid its fee genuinely
              // is "Confirmed" in that vocabulary.
              payment_status: 'booking_fee_paid',
              payment_reference: reference,
              amount_paid: amountPaid,
              paid_at: paidAt,
              status: 'Confirmed',
            }
          : {
              payment_status: 'paid',
              payment_reference: reference,
              amount_paid: amountPaid,
              paid_at: paidAt,
              status: 'Paid',
            };

      if (bookingId) {
        const { data, error } = await supabaseAdmin.from('bookings').update(patch).eq('id', bookingId).select().maybeSingle();
        if (error) console.error('paystack/verify: update by id failed:', error.message);
        else updatedRow = data;
      }
      if (!updatedRow && bookingReference) {
        const { data, error } = await supabaseAdmin
          .from('bookings')
          .update(patch)
          .eq('verification_code', bookingReference)
          .select()
          .maybeSingle();
        if (error) console.error('paystack/verify: update by reference failed:', error.message);
        else updatedRow = data;
      }
    } catch (dbErr: any) {
      console.error('paystack/verify: DB update threw (continuing):', dbErr?.message);
    }

    if (paymentType === 'booking_fee') {
      // The booking becomes real right here. Everything below is best-effort
      // and must never turn a confirmed R100 payment into an error response.

      // Alert the owner — the first and only alert for this booking, now that
      // it is no longer just an abandoned form submission.
      try {
        await sendAdminNotification(
          updatedRow?.name || '(name on file)',
          updatedRow?.service || '(service on file)',
          updatedRow?.verification_code || bookingReference || '',
          updatedRow?.budget || 'Not specified',
          {
            email: updatedRow?.email,
            phone: updatedRow?.phone,
            company: updatedRow?.company,
            country: updatedRow?.country,
            timeline: updatedRow?.timeline,
            contactMethod: updatedRow?.contact_method,
            projectDescription: updatedRow?.project_description,
            bookingReference: updatedRow?.verification_code || bookingReference,
            paymentStatus: `booking fee paid (R${BOOKING_FEE_ZAR}) — deposit pending`,
          }
        );
      } catch (notifyErr: any) {
        console.error('paystack/verify: owner alert failed (continuing):', notifyErr?.message);
      }

      // Send the deposit-payment email — the client's next step — only now.
      if (updatedRow?.email) {
        try {
          const origin = process.env.NEXT_PUBLIC_URL || new URL(req.url).origin;
          const result = await sendDepositPaymentEmail({
            origin,
            email: updatedRow.email,
            fullName: updatedRow.name || '',
            service: updatedRow.service || '',
            bookingId: updatedRow.id || bookingId || null,
            verificationCode: updatedRow.verification_code || bookingReference || '',
          });
          if (!result.sent) console.error('paystack/verify: deposit email not sent:', result.reason);
        } catch (emailErr: any) {
          console.error('paystack/verify: deposit email threw (continuing):', emailErr?.message);
        }
      }
    } else {
      // Deposit paid — existing behaviour, unchanged.
      try {
        await sendDepositPaidNotification({
          clientName: updatedRow?.name,
          service: updatedRow?.service,
          amount: amountPaid,
          bookingReference: updatedRow?.verification_code || bookingReference,
          verificationCode: updatedRow?.verification_code || bookingReference,
          phone: updatedRow?.phone,
          email: updatedRow?.email,
        });
      } catch (notifyErr: any) {
        console.error('paystack/verify: owner deposit alert failed (continuing):', notifyErr?.message);
      }
    }

    return NextResponse.json({ success: true, amount: amountPaid, reference, paymentType });
  } catch (error: any) {
    console.error('paystack/verify error:', error);
    return NextResponse.json({ error: 'Verification failed. Please contact us on WhatsApp.' }, { status: 500 });
  }
}
