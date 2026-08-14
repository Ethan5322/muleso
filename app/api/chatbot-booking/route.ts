import { NextRequest, NextResponse } from 'next/server';
import { sendBookingConfirmation, sendAdminNotification } from '@/lib/sendWhatsAppMessage';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ''));

/**
 * Deposit pricing, kept deliberately in sync with the `SERVICES` table and
 * `getServiceDeposit()` in components/ChatbotWidget.tsx (50% of the ZAR
 * starting price; a flat fee for Custom/Other). It is duplicated here rather
 * than imported because that file is a client component — importing it would
 * pull the entire chat widget into this server route's bundle. If a price
 * changes in one place, it must change in the other.
 */
const SERVICE_ZAR_PRICE: Record<string, number> = {
  'Design Website': 3500,
  'Fix Website': 3500,
  'Design Widget': 3500,
  'Build AI Chatbot': 3500,
  'Build AI Automation': 5000,
  'All in One Website': 7500,
};
const DEPOSIT_PERCENT = 0.5;
const CUSTOM_DEPOSIT_ZAR = 1500;

function depositForService(serviceName: string): number {
  const price = SERVICE_ZAR_PRICE[serviceName];
  return price ? Math.round(price * DEPOSIT_PERCENT) : CUSTOM_DEPOSIT_ZAR;
}

/**
 * Starts a Paystack transaction for a booking's deposit and emails the client
 * a direct link to Paystack's hosted checkout — pre-filled with their email
 * and the exact deposit amount for this booking, so paying is one click with
 * no extra steps. Mirrors the pattern already proven in
 * app/api/store/checkout/route.ts. Best-effort: a failure here must never
 * fail the booking itself, since the booking and WhatsApp alerts are already
 * confirmed by the time this runs.
 */
async function sendPaymentLinkEmail(opts: {
  origin: string;
  email: string;
  fullName: string;
  service: string;
  bookingId: string | null;
  verificationCode: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return { sent: false, reason: 'PAYSTACK_SECRET_KEY not set' };
  if (!process.env.RESEND_API_KEY) return { sent: false, reason: 'RESEND_API_KEY not set' };

  const deposit = depositForService(opts.service);
  const callbackUrl = `${opts.origin}/booking/pay?bookingId=${encodeURIComponent(opts.bookingId || '')}&ref=${encodeURIComponent(opts.verificationCode)}`;

  const initRes = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: opts.email,
      amount: Math.round(deposit * 100), // Paystack expects the smallest unit (cents)
      currency: 'ZAR',
      reference: `MULE-BOOKING-${opts.verificationCode}`,
      callback_url: callbackUrl,
      metadata: {
        booking_id: opts.bookingId,
        verification_code: opts.verificationCode,
        service: opts.service,
        custom_fields: [{ display_name: 'Booking', variable_name: 'booking', value: opts.verificationCode }],
      },
    }),
  });
  const initData = await initRes.json();
  const payUrl = initData?.data?.authorization_url;
  if (!initData?.status || !payUrl) {
    return { sent: false, reason: `Paystack initialize failed: ${JSON.stringify(initData).slice(0, 300)}` };
  }

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    body: JSON.stringify({
      from: 'chatbot@mulesoo.com',
      to: opts.email,
      subject: `Complete your ${opts.service} booking — pay your deposit`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#0A0F1E;max-width:520px;margin:0 auto">
          <h2 style="color:#7FB3FF">Hi ${escapeHtml(opts.fullName)}, you're almost booked in!</h2>
          <p>Your <b>${escapeHtml(opts.service)}</b> booking is saved. Reference: <b>${escapeHtml(opts.verificationCode)}</b></p>
          <p>Pay your deposit of <b>R${deposit.toLocaleString('en-ZA')}</b> to confirm your slot:</p>
          <p style="margin:24px 0">
            <a href="${payUrl}" style="background:#00C8FF;color:#050810;padding:14px 28px;border-radius:8px;
              text-decoration:none;font-weight:bold;display:inline-block">Pay Deposit Now</a>
          </p>
          <p style="font-size:13px;color:#666">Or paste this link in your browser: ${payUrl}</p>
          <p style="font-size:13px;color:#666">This link is unique to your booking — no need to re-enter your details.</p>
        </div>`,
    }),
  });
  if (!emailRes.ok) {
    return { sent: false, reason: `Resend rejected send: ${emailRes.status} ${(await emailRes.text()).slice(0, 300)}` };
  }
  return { sent: true };
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function generateVerificationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
    if ((i + 1) % 4 === 0 && i !== 11) code += '-';
  }
  return code;
}

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
    // in bookings: no admin dashboard record, and (before this fix) nothing
    // for the payment-link email below to reconcile against once paid.
    // supabaseAdmin uses the service-role key and bypasses RLS, matching the
    // pattern already used for privileged writes in contact/route.ts and
    // paystack/verify/route.ts.
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
          project_description: projectDetails || '',
          verification_code: verificationCode,
          client_id: clientID || null,
          client_id_type: clientIDType || null,
          status: 'Pending',
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

    console.log('Chatbot booking received:', {
      fullName,
      email,
      phoneNumber,
      service,
      verificationCode,
      timestamp: new Date().toISOString(),
    });

    // Send WhatsApp confirmation to customer with all booking details
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

    // Send admin notification (full professional record)
    try {
      await sendAdminNotification(fullName, service, verificationCode, budget || 'Not specified', {
        email,
        phone: phoneNumber,
        company,
        country: nationality,
        usageType,
        timeline,
        contactMethod,
        projectDescription: projectDetails,
        bookingReference: verificationCode,
        clientID,
        clientIDType,
        paymentStatus: 'pending',
      });
      console.log('✅ Admin notification sent');
    } catch (error) {
      console.error('⚠️ Failed to send admin notification:', error);
    }

    // Email the client a direct Paystack payment link for their deposit.
    // This was missing entirely — the only payment path was the inline
    // Paystack popup inside the chat widget, which only works if the client
    // stays in that browser tab. Anyone who closed the chat and came back
    // later had no way to pay. Best-effort: never fail the booking over it.
    let paymentEmailSent = false;
    if (email && validateEmail(email)) {
      try {
        const origin = process.env.NEXT_PUBLIC_URL || new URL(req.url).origin;
        const result = await sendPaymentLinkEmail({
          origin,
          email,
          fullName,
          service,
          bookingId,
          verificationCode,
        });
        paymentEmailSent = result.sent;
        if (result.sent) console.log('✅ Payment link emailed to client');
        else console.error('⚠️ Payment link email not sent:', result.reason);
      } catch (error) {
        console.error('⚠️ Payment link email threw:', error);
      }
    }

    return NextResponse.json(
      {
        message: 'Booking received! Check your WhatsApp for confirmation. Ena Muluken will contact you within 2 hours.',
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
        paymentEmailSent,
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
