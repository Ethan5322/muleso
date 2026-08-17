import { NextRequest, NextResponse } from 'next/server';
import { sendBookingConfirmation } from '@/lib/sendWhatsAppMessage';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

function generateVerificationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
    if ((i + 1) % 4 === 0 && i !== 11) code += '-';
  }
  return code;
}

/**
 * Records a booking and confirms it to the client only — nothing here treats
 * the booking as real yet.
 *
 * The owner's WhatsApp alert and the deposit-payment email used to fire right
 * here, unconditionally, the moment the client clicked "I Agree" — before any
 * money had changed hands. A booking with no intention of ever paying looked
 * identical to a paying customer, right down to alerting the owner. Both of
 * those now fire only from app/api/paystack/verify/route.ts, once Paystack
 * has actually confirmed the R100 booking fee — see lib/bookingPayment.ts for
 * why that split exists and what happens on each side of it.
 */
export async function POST(req: NextRequest) {
  try {
    const {
      fullName,
      phoneNumber,
      nationality,
      service,
      usageType,
      timeline,
      clientID,
      clientIDType,
      email,
      company,
      budget,
      contactMethod,
      projectDetails,
    } = await req.json();

    // Validate required fields
    if (!fullName || !phoneNumber || !nationality || !service || !usageType || !timeline) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Save to Supabase if configured.
    //
    // This previously ran through a plain anon-key client and every insert
    // was silently rejected: `bookings` has row-level security enabled with
    // no policy allowing the anon role to write, so Postgres returned
    // 42501 "new row violates row-level security policy" on every booking.
    // The route only logged that error and moved on (by design — a DB hiccup
    // must never block a client's booking), so the client always saw success,
    // got their WhatsApp confirmation, and the booking simply never existed
    // in bookings: no admin dashboard record, and nothing for the deposit
    // email to reconcile against once paid. supabaseAdmin uses the
    // service-role key and bypasses RLS, matching the pattern already used
    // for privileged writes in contact/route.ts and paystack/verify/route.ts.
    let bookingId: string | null = null;
    if (hasSupabase) {
      const { data: inserted, error } = await supabaseAdmin
        .from('bookings')
        .insert({
          name: fullName,
          email: email || '',
          phone: phoneNumber,
          country: nationality,
          company: company || null,
          service: service,
          budget: budget || null,
          timeline: timeline,
          contact_method: contactMethod || null,
          verification_code: verificationCode,
          status: 'Pending',
          payment_status: 'unpaid',
          // client_id, client_id_type and usage_type are collected by the chat
          // widget but have no columns on `bookings`. Sending them made
          // PostgREST reject the whole insert with PGRST204 ("Could not find
          // the 'client_id' column"), so every booking failed on this too —
          // independently of the RLS problem above. They are folded into
          // project_description instead of being dropped, so the detail the
          // client typed still reaches whoever works the booking. Add real
          // columns later if this needs to be queryable.
          project_description: [
            projectDetails || '',
            usageType ? `Usage type: ${usageType}` : '',
            clientIDType ? `ID type: ${clientIDType}` : '',
            clientID ? `ID: ${clientID}` : '',
          ]
            .filter(Boolean)
            .join('\n'),
        })
        .select();

      if (error) {
        console.error('Supabase error:', error);
      } else {
        bookingId = inserted?.[0]?.id ?? null;
      }
    }

    // Auto-create an onboarding task for the Operations/Support department (best-effort).
    try {
      const { autoTaskFromBooking } = await import('@/lib/corp/autoTask');
      await autoTaskFromBooking({
        name: fullName,
        service,
        timeline,
        reference: verificationCode,
        phone: phoneNumber,
      });
    } catch (e) {
      console.error('Booking auto-task failed (continuing):', e);
    }

    console.log('Chatbot booking received (awaiting booking fee):', {
      fullName,
      email,
      phoneNumber,
      service,
      verificationCode,
      timestamp: new Date().toISOString(),
    });

    // Confirm receipt to the CLIENT only — an acknowledgement that their
    // details were captured, not a claim the booking is confirmed. It says as
    // much: the owner alert and the deposit email are deliberately withheld
    // until the booking fee clears.
    try {
      await sendBookingConfirmation(phoneNumber, fullName, service, verificationCode, {
        email: email || undefined,
        company: company || undefined,
        country: nationality,
        budget: budget || undefined,
        timeline,
        projectDescription: projectDetails || undefined,
        bookingReference: verificationCode,
        contactMethod: contactMethod || undefined,
      });
      console.log('✅ WhatsApp confirmation sent to customer with full details');
    } catch (error) {
      console.error('⚠️ Failed to send WhatsApp confirmation:', error);
      // Don't fail the entire request if WhatsApp fails
    }

    return NextResponse.json(
      {
        message: 'Booking received! Pay the R100 booking fee in the chat to confirm your slot.',
        verificationCode: verificationCode,
        bookingId,
        booking: {
          fullName,
          email,
          phoneNumber,
          service,
          timeline,
        },
        whatsappSent: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Chatbot booking error:', error);
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    );
  }
}
