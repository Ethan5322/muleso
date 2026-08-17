/**
 * Shared pricing and payment-link logic for the two-stage booking payment:
 *
 *   1. Booking fee — a flat, non-refundable R100, paid through the widget's
 *      own Paystack popup while the client is still in the chat. Nothing
 *      about the booking is treated as real until this clears: no owner
 *      alert, no deposit email, no PDF download.
 *   2. Project deposit — 50% of the chosen service's price, paid afterward
 *      via the emailed Paystack link (app/booking/pay), so the client can
 *      complete it even after closing the chat.
 *
 * Called from two places that must agree on every figure: the booking route
 * (which only stores the booking and takes the client's first payment) and
 * the verify route (which fires the owner alert and sends this email, but
 * only once Paystack has actually confirmed the fee). Centralising it here
 * is what keeps those two in lockstep — before this, the pricing table and
 * the email itself were duplicated in app/api/chatbot-booking/route.ts and
 * a change to one could silently drift from the other.
 */

/** Flat, non-refundable fee to hold a slot, charged in the widget itself. */
export const BOOKING_FEE_ZAR = 100;

/**
 * Deposit pricing, kept deliberately in sync with the `SERVICES` table and
 * `getServiceDeposit()` in components/ChatbotWidget.tsx (50% of the ZAR
 * starting price; a flat fee for Custom/Other). Duplicated there rather than
 * imported because that file is a client component — importing it here would
 * pull the entire chat widget into this server-side bundle. If a price
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
export const rand = (n: number) => 'R' + n.toLocaleString('en-ZA').replace(/ |\s/g, ',');

export function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * The full quote for a booking, so the email can show the client the same
 * numbers they agreed to in the chat rather than a bare deposit figure.
 *
 * A quoted service bills 50% up front and 50% on delivery. Custom/Other work
 * has no fixed price yet, so it takes a flat R1,500 deposit and the total
 * stays open until the job is scoped — the email must not imply a total that
 * was never quoted.
 */
export function quoteForService(serviceName: string): {
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
 * Starts a Paystack transaction for a booking's project deposit and emails
 * the client a direct link to Paystack's hosted checkout — pre-filled with
 * their email and the exact deposit amount, so paying is one click with no
 * extra steps. Mirrors the pattern already proven in
 * app/api/store/checkout/route.ts.
 *
 * Only ever called after the booking fee has cleared (from
 * app/api/paystack/verify/route.ts) — never from the booking route itself.
 * Best-effort: a failure here must never fail the fee payment that triggered
 * it, since the fee is already real money in the account by the time this runs.
 */
export async function sendDepositPaymentEmail(opts: {
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
        payment_type: 'deposit',
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
      subject: `Booking fee received — next step: your ${opts.service} deposit (ref ${opts.verificationCode})`,
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
                  Thanks — your R${BOOKING_FEE_ZAR} booking fee is confirmed and your slot is held under the
                  reference below. The next step is your project deposit, which begins the work itself.
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
                      ${isCustom ? 'Deposit due now' : 'Deposit due now (50%)'}
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
                  Once the deposit clears we begin immediately and confirm your start date.
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
