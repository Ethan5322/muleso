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

/** Rand with a thousands separator — "R3,500", matching the site's own copy. */
const rand = (n: number) => 'R' + n.toLocaleString('en-ZA').replace(/ |\s/g, ',');

/**
 * The full quote for a booking, so the email can show the client the same
 * numbers they agreed to in the chat rather than a bare deposit figure.
 *
 * A quoted service bills 50% up front and 50% on delivery. Custom/Other work
 * has no fixed price yet, so it takes a flat R1,500 booking fee and the total
 * stays open until the job is scoped — the email must not imply a total that
 * was never quoted.
 */
function quoteForService(serviceName: string): {
  total: number | null;
  deposit: number;
  balance: number | null;
  isCustom: boolean;
} {
  const total = SERVICE_ZAR_PRICE[serviceName] ?? null;
  if (total === null) {
    return { total: null, deposit: CUSTOM_DEPOSIT_ZAR, balance: null, isCustom: true };
  }
  const deposit = Math.round(total * DEPOSIT_PERCENT);
  return { total, deposit, balance: total - deposit, isCustom: false };
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

  const { total, deposit, balance, isCustom } = quoteForService(opts.service);
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
      subject: `Your ${opts.service} quote — ${rand(deposit)} to confirm (ref ${opts.verificationCode})`,
      // Table-based layout with inline styles: Gmail and Outlook strip <style>
      // blocks and ignore flexbox, so anything structural has to be a table.
      // The quote is spelled out in full — the client sees the price they chose,
      // what is due now and what is left — because a bare "pay R1,750" invites
      // a reply asking what the other half is.
      html: `
        <div style="background:#F4F6FB;padding:32px 12px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:14px;overflow:hidden;border:1px solid #E4E9F2;">
            <tr>
              <td style="background:#050810;padding:26px 32px;">
                <div style="font-size:19px;font-weight:700;letter-spacing:2px;color:#FFFFFF;">
                  MULE<span style="color:#E8B84B;">&bull;</span>SOO
                </div>
                <div style="font-size:12px;color:#A8B2D0;margin-top:5px;letter-spacing:0.4px;">
                  Digital Services &middot; Pretoria, South Africa
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:32px 32px 8px;">
                <p style="margin:0 0 14px;font-size:17px;color:#0A0F1E;">Hi ${escapeHtml(opts.fullName)},</p>
                <p style="margin:0 0 22px;font-size:15px;line-height:1.65;color:#3C4557;">
                  Thank you for choosing MuleSoo. Your booking is confirmed and held under the
                  reference below. To secure your place in the schedule, the deposit is payable now.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:0 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #E4E9F2;border-radius:10px;">
                  <tr>
                    <td style="padding:14px 18px;font-size:13px;color:#6B7488;border-bottom:1px solid #EEF1F7;">Service</td>
                    <td style="padding:14px 18px;font-size:14px;color:#0A0F1E;font-weight:600;text-align:right;border-bottom:1px solid #EEF1F7;">${escapeHtml(opts.service)}</td>
                  </tr>
                  <tr>
                    <td style="padding:14px 18px;font-size:13px;color:#6B7488;border-bottom:1px solid #EEF1F7;">Reference</td>
                    <td style="padding:14px 18px;font-size:14px;color:#0A0F1E;font-weight:600;text-align:right;border-bottom:1px solid #EEF1F7;letter-spacing:0.5px;">${escapeHtml(opts.verificationCode)}</td>
                  </tr>
                  ${
                    isCustom
                      ? `<tr>
                          <td style="padding:14px 18px;font-size:13px;color:#6B7488;border-bottom:1px solid #EEF1F7;">Project total</td>
                          <td style="padding:14px 18px;font-size:14px;color:#0A0F1E;text-align:right;border-bottom:1px solid #EEF1F7;">Quoted after scoping</td>
                        </tr>`
                      : `<tr>
                          <td style="padding:14px 18px;font-size:13px;color:#6B7488;border-bottom:1px solid #EEF1F7;">Project total</td>
                          <td style="padding:14px 18px;font-size:14px;color:#0A0F1E;font-weight:600;text-align:right;border-bottom:1px solid #EEF1F7;">${rand(total as number)}</td>
                        </tr>`
                  }
                  <tr>
                    <td style="padding:14px 18px;font-size:13px;color:#6B7488;border-bottom:1px solid #EEF1F7;">
                      ${isCustom ? 'Booking fee due now' : 'Deposit due now (50%)'}
                    </td>
                    <td style="padding:14px 18px;font-size:19px;color:#0A0F1E;font-weight:700;text-align:right;border-bottom:1px solid #EEF1F7;">${rand(deposit)}</td>
                  </tr>
                  <tr>
                    <td style="padding:14px 18px;font-size:13px;color:#6B7488;">Balance on delivery</td>
                    <td style="padding:14px 18px;font-size:14px;color:#0A0F1E;text-align:right;">
                      ${isCustom ? 'Confirmed with your quote' : rand(balance as number)}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:28px 32px 8px;">
                <a href="${payUrl}" style="background:#0A66C2;color:#FFFFFF;padding:15px 42px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;display:inline-block;">
                  Pay ${rand(deposit)} securely
                </a>
                <p style="margin:14px 0 0;font-size:12px;color:#8A93A8;">
                  Secured by Paystack &middot; card &amp; instant EFT accepted
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:22px 32px 0;">
                <p style="margin:0 0 6px;font-size:12px;color:#8A93A8;line-height:1.6;">
                  If the button does not open, copy this link into your browser:
                </p>
                <p style="margin:0;font-size:12px;color:#0A66C2;word-break:break-all;">${payUrl}</p>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px 32px;">
                <p style="margin:0;font-size:13px;line-height:1.7;color:#3C4557;">
                  This link is unique to your booking, so there is nothing further to fill in.
                  Once payment clears we begin immediately and confirm your start date.
                </p>
                <p style="margin:18px 0 0;font-size:13px;color:#3C4557;">
                  Any questions, simply reply to this email.<br/>
                  <span style="color:#6B7488;">&mdash; The MuleSoo team</span>
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#F8FAFD;padding:16px 32px;border-top:1px solid #E4E9F2;">
                <p style="margin:0;font-size:11px;color:#98A0B3;line-height:1.6;">
                  MuleSoo Digital Services &middot; Pretoria, South Africa &middot;
                  <a href="https://mulesoo.com" style="color:#0A66C2;text-decoration:none;">mulesoo.com</a><br/>
                  You are receiving this because a booking was made with this email address.
                </p>
              </td>
            </tr>
          </table>
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
          verification_code: verificationCode,
          status: 'Pending',
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
