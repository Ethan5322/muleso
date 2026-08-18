/**
 * Send WhatsApp messages via CallMeBot API
 * API Documentation: https://www.callmebot.com/blog/free-api-whatsapp-messages/
 */

import { HIDE_PASSWORD_FROM_BUYER } from './maskSecret';

const CALLMEBOT_API_URL = 'https://api.callmebot.com/whatsapp.php';
const CALLMEBOT_API_KEY = process.env.CALLMEBOT_API_KEY || '7268108';
const ADMIN_PHONE = process.env.ADMIN_WHATSAPP || '27688529333'; // Owner's WhatsApp number

// Optional Telegram alerts (set both env vars to enable). No-ops if unset.
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

// Where every owner alert's email backup goes — see sendAdminEmailBackup below.
const ADMIN_ALERT_EMAIL = process.env.ADMIN_ALERT_EMAIL || 'hello@mulesoo.com';

/** Send an alert to the owner's Telegram (only if configured). */
export async function sendTelegramMessage(message: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
  } catch (e) {
    console.error('Telegram send failed:', e);
  }
}

/**
 * Back up every owner WhatsApp alert with an email.
 *
 * CallMeBot (the free WhatsApp bridge used below) can return HTTP 200 and a
 * "Message queued" body while never actually delivering — a known limitation
 * of the free tier (silent throttling, a stale registration, etc.) with no
 * machine-readable failure signal to catch. `sendWhatsAppMessage`'s
 * `response.ok` check cannot see that, so a booking alert can silently vanish
 * even though the code path ran correctly end to end. Resend, on this
 * project, has a proven delivery record (see Issues-Found/Resend Domain
 * Verification.md) — so every alert fires here too, always, not just when
 * the WhatsApp send reports failure. Never blocks or fails the caller.
 */
async function sendAdminEmailBackup(subject: string, message: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const escaped = message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const html = `<pre style="font-family:'Segoe UI',Helvetica,Arial,sans-serif;white-space:pre-wrap;font-size:14px;line-height:1.6;color:#0A0F1E;margin:0;">${escaped}</pre>`;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      body: JSON.stringify({ from: 'chatbot@mulesoo.com', to: ADMIN_ALERT_EMAIL, subject, html }),
    });
    if (!res.ok) console.error('Admin email backup rejected:', res.status, (await res.text()).slice(0, 300));
  } catch (e) {
    console.error('Admin email backup failed:', e);
  }
}

interface SendWhatsAppParams {
  phone: string; // Recipient phone number (with country code, no +)
  message: string; // Message to send
}

interface WhatsAppResult {
  success: boolean;
  error?: string;
  timestamp?: string;
}

/**
 * Send WhatsApp message via CallMeBot API with retry logic and fallback
 */
export async function sendWhatsAppMessage({ phone, message }: SendWhatsAppParams): Promise<WhatsAppResult> {
  const timestamp = new Date().toISOString();

  try {
    // Validate phone number
    if (!phone || phone.length < 10) {
      throw new Error('Invalid phone number format');
    }

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Build API URL
    const url = `${CALLMEBOT_API_URL}?phone=${phone}&text=${encodedMessage}&apikey=${CALLMEBOT_API_KEY}`;

    console.log(`[${timestamp}] Sending WhatsApp to ${phone}...`);

    // Try up to 3 times with exponential backoff (CallMeBot can be flaky)
    let lastError: any = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const response = await fetch(url, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'User-Agent': 'MuleSoo/1.0 (+https://mulesoo.com)',
          },
        });

        clearTimeout(timeoutId);

        // 200-299 = success, 429 = rate limited (retry), 5xx = server error (retry)
        if (response.ok) {
          console.log(`[${timestamp}] WhatsApp sent to ${phone} (attempt ${attempt})`);
          return { success: true, timestamp };
        }

        // If it's a rate limit or server error, wait and retry
        if (response.status === 429 || response.status >= 500) {
          lastError = new Error(`API error ${response.status}: ${response.statusText}`);
          if (attempt < 3) {
            const delayMs = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
            console.warn(`[${timestamp}] Retry attempt ${attempt + 1} after ${delayMs}ms...`);
            await new Promise(r => setTimeout(r, delayMs));
            continue;
          }
          throw lastError;
        }

        // Other errors (4xx except 429) = don't retry
        throw new Error(`API error ${response.status}: ${response.statusText}`);
      } catch (attemptError: any) {
        lastError = attemptError;
        if (attempt < 3 && (attemptError.name === 'AbortError' || attemptError.message.includes('429') || attemptError.message.includes('500'))) {
          const delayMs = Math.pow(2, attempt) * 1000;
          console.warn(`[${timestamp}] Attempt ${attempt} failed, retrying in ${delayMs}ms...`);
          await new Promise(r => setTimeout(r, delayMs));
          continue;
        }
        if (attempt === 3) throw lastError;
      }
    }

    throw lastError || new Error('Failed after 3 attempts');
  } catch (error: any) {
    const errorMsg = error?.message || 'Unknown error';
    console.error(`[${timestamp}] WhatsApp failed for ${phone}:`, errorMsg);

    // Log full error for debugging
    console.error('Error details:', {
      phone,
      messageLength: message?.length,
      errorType: error?.name,
      errorMessage: errorMsg,
      timestamp,
    });

    return {
      success: false,
      error: errorMsg,
      timestamp,
    };
  }
}

/**
 * Send booking confirmation to customer with FULL booking details
 */
export async function sendBookingConfirmation(
  phoneNumber: string,
  clientName: string,
  service: string,
  verificationCode: string,
  bookingDetails?: {
    email?: string;
    company?: string;
    country?: string;
    budget?: string;
    timeline?: string;
    projectDescription?: string;
    bookingReference?: string;
    contactMethod?: string;
  }
): Promise<WhatsAppResult> {
  const message = `*BOOKING CONFIRMATION*

Hi ${clientName}!

Your booking has been CONFIRMED!

---CLIENT INFORMATION---
Name: ${clientName}
Email: ${bookingDetails?.email || 'N/A'}
Phone: ${phoneNumber}
Company: ${bookingDetails?.company || 'N/A'}
Country: ${bookingDetails?.country || 'N/A'}

---PROJECT DETAILS---
Service: ${service}
Budget: ${bookingDetails?.budget || 'N/A'}
Timeline: ${bookingDetails?.timeline || 'N/A'}
Contact Method: ${bookingDetails?.contactMethod || 'N/A'}

---PROJECT DESCRIPTION---
${bookingDetails?.projectDescription || 'No description provided'}

---VERIFICATION CODE---
Code: ${verificationCode}

Keep this code safe - required for project verification!

---BOOKING REFERENCE---
Reference: ${bookingDetails?.bookingReference || 'N/A'}

---NEXT STEPS---
1. Review your booking details above
2. Our team will contact you within 2 hours
3. Download your PDF agreement from your email
4. We will confirm project start date

---NEED HELP?---
Email: hello@mulesoo.com
WhatsApp: +27 68 852 9333
Website: https://mulesoo.com

Thank you for choosing MULESOO! We're excited to build something amazing with you!`;

  const result = await sendWhatsAppMessage({
    phone: phoneNumber.replace(/\D/g, ''),
    message,
  });

  if (!result.success) {
    console.warn(`Booking confirmation WhatsApp failed, but booking was still saved. Customer: ${clientName}`);
  }

  return result;
}

/**
 * Alert the owner (WhatsApp + Telegram) about a new booking — with the FULL
 * client + project record, professionally formatted.
 */
export async function sendAdminNotification(
  clientName: string,
  service: string,
  verificationCode: string,
  budget: string,
  details?: {
    email?: string;
    phone?: string;
    company?: string;
    country?: string;
    usageType?: string;
    timeline?: string;
    contactMethod?: string;
    projectDescription?: string;
    bookingReference?: string;
    clientID?: string;
    clientIDType?: string;
    deposit?: number;
    paymentStatus?: 'paid' | 'pending' | string;
  }
): Promise<WhatsAppResult> {
  const dash = '—';
  const timestamp = new Date().toISOString();
  const receivedAt = new Date().toLocaleString('en-ZA', {
    timeZone: 'Africa/Johannesburg',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const idLine =
    details?.clientID
      ? `\n${details.clientIDType === 'passport' ? 'Passport' : 'National ID'}: ${details.clientID}`
      : '';

  const paid = details?.paymentStatus === 'paid';
  const depositLine = details?.deposit
    ? `R ${Number(details.deposit).toLocaleString('en-ZA')}`
    : 'To be confirmed';

  const message = `🔔 *NEW BOOKING RECEIVED — MuleSoo*

A new client has just booked through the website. Full details below.

👤 *CLIENT*
Name: ${clientName || dash}
Company: ${details?.company || dash}
Email: ${details?.email || dash}
Phone: ${details?.phone || dash}
Country: ${details?.country || dash}
Client Type: ${details?.usageType || dash}${idLine}

🧩 *PROJECT*
Service: ${service || dash}
Budget: ${budget || dash}
Timeline: ${details?.timeline || dash}
Preferred Contact: ${details?.contactMethod || dash}

📝 *PROJECT BRIEF*
${details?.projectDescription || 'No description provided'}

💳 *PAYMENT*
Deposit (50%): ${depositLine}
Status: ${paid ? 'PAID ✅' : 'PENDING ⏳'}

🔖 *REFERENCE*
Booking Ref: ${details?.bookingReference || dash}
Verification Code: ${verificationCode}

📅 Received: ${receivedAt} (SAST)

➡️ *ACTION:* Reply to the client within 2 hours. Full record in Admin → Bookings.`;

  console.log(`[${timestamp}] 🔔 Sending admin notification for booking: ${clientName} (${service})`);
  const result = await sendWhatsAppMessage({ phone: ADMIN_PHONE, message });

  if (result.success) {
    console.log(`[${timestamp}] ✅ Admin WhatsApp notification delivered`);
  } else {
    console.warn(`[${timestamp}] ⚠️ Admin WhatsApp notification failed:`, result.error);
  }

  await sendTelegramMessage(message);
  await sendAdminEmailBackup(`🔔 New Booking — ${clientName} (${service})`, message);
  return result;
}

/**
 * Alert the owner (WhatsApp + Telegram) the moment a client's deposit is paid.
 */
export async function sendDepositPaidNotification(details: {
  clientName?: string;
  service?: string;
  amount?: number;
  bookingReference?: string;
  verificationCode?: string;
  phone?: string;
  email?: string;
}): Promise<void> {
  const timestamp = new Date().toISOString();
  const dash = '—';
  const paidAt = new Date().toLocaleString('en-ZA', {
    timeZone: 'Africa/Johannesburg',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const message = `💰 *DEPOSIT PAID — MuleSoo*

A client's deposit has just been received via Paystack.

👤 Client: ${details.clientName || dash}
🧩 Service: ${details.service || dash}
💳 Amount: ${details.amount ? `R ${Number(details.amount).toLocaleString('en-ZA')}` : dash}
📞 Phone: ${details.phone || dash}
✉️ Email: ${details.email || dash}
🔖 Booking Ref: ${details.bookingReference || dash}
🔑 Verification Code: ${details.verificationCode || dash}
📅 Paid: ${paidAt} (SAST)

The booking is now secured. View it in Admin → Bookings.`;

  console.log(`[${timestamp}] 💰 Sending deposit paid notification for: ${details.clientName} - R${details.amount}`);
  const result = await sendWhatsAppMessage({ phone: ADMIN_PHONE, message });
  if (result.success) {
    console.log(`[${timestamp}] ✅ Deposit paid WhatsApp notification delivered`);
  } else {
    console.warn(`[${timestamp}] ⚠️ Deposit paid WhatsApp notification failed:`, result.error);
  }

  await sendTelegramMessage(message);
  await sendAdminEmailBackup(`💰 Deposit Paid — ${details.clientName || 'Client'}`, message);
}

/**
 * Alert the owner (WhatsApp + Telegram) about a new lead / contact enquiry —
 * with the full enquiry details, professionally formatted (like a booking).
 */
export async function sendLeadNotification(
  name: string,
  service: string,
  email: string,
  details?: {
    company?: string;
    budget?: string;
    projectDetails?: string;
    source?: string;
  }
): Promise<void> {
  const timestamp = new Date().toISOString();
  const dash = '—';
  const receivedAt = new Date().toLocaleString('en-ZA', {
    timeZone: 'Africa/Johannesburg',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const message = `🔔 *NEW ENQUIRY — MuleSoo*

A new enquiry just came in through the website contact form.

👤 *CONTACT*
Name: ${name || dash}
Email: ${email || dash}
Company: ${details?.company || dash}

🧩 *ENQUIRY*
Service: ${service || dash}
Budget: ${details?.budget || dash}
Heard about us: ${details?.source || dash}

📝 *MESSAGE*
${details?.projectDetails || 'No message provided'}

📅 Received: ${receivedAt} (SAST)

➡️ *ACTION:* Reply within 2 hours. Full record in Admin → Leads.`;

  console.log(`[${timestamp}] 🔔 Sending lead notification for: ${name} (${service})`);
  const result = await sendWhatsAppMessage({ phone: ADMIN_PHONE, message });
  if (result.success) {
    console.log(`[${timestamp}] ✅ Lead WhatsApp notification delivered`);
  } else {
    console.warn(`[${timestamp}] ⚠️ Lead WhatsApp notification failed:`, result.error);
  }

  await sendTelegramMessage(message);
  await sendAdminEmailBackup(`🔔 New Enquiry — ${name}`, message);
}

/**
 * Alert the owner (WhatsApp + Telegram) when a store product is purchased.
 */
export async function sendPurchaseNotification(details: {
  productName?: string;
  amount?: number;
  buyerEmail?: string;
  reference?: string;
  /**
   * The buyer's FULL guide password. This alert is the only place it appears
   * in full while HIDE_PASSWORD_FROM_BUYER is on — the buyer's own page and
   * email both show it starred — so the owner can hand it over personally.
   * Safe here: this message goes to the owner's own WhatsApp and Telegram.
   */
  password?: string;
}): Promise<void> {
  const timestamp = new Date().toISOString();
  const dash = '—';
  const paidAt = new Date().toLocaleString('en-ZA', {
    timeZone: 'Africa/Johannesburg',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // While the buyer only sees a starred password, this alert is how the owner
  // gets the full one to hand over. Once HIDE_PASSWORD_FROM_BUYER is switched
  // off the buyer gets it themselves, but it stays here for support.
  const passwordSection = details.password
    ? `
🔑 *FULL PASSWORD:* ${details.password}
${
  HIDE_PASSWORD_FROM_BUYER
    ? 'The buyer only sees it starred. Send them this when you are happy to.'
    : 'The buyer already has this on their page and in their email.'
}`
    : `
The buyer can download it now; a copy is on the confirmation page.`;

  const message = `🛒 *NEW STORE PURCHASE — MuleSoo*

A guide has just been bought and paid via Paystack.

📘 Product: ${details.productName || dash}
💳 Amount: ${details.amount ? `R ${Number(details.amount).toLocaleString('en-ZA')}` : dash}
✉️ Buyer: ${details.buyerEmail || dash}
🔖 Reference: ${details.reference || dash}
📅 Paid: ${paidAt} (SAST)
${passwordSection}`;

  console.log(`[${timestamp}] 🛒 Sending purchase notification for: ${details.productName} - R${details.amount}`);
  const result = await sendWhatsAppMessage({ phone: ADMIN_PHONE, message });
  if (result.success) {
    console.log(`[${timestamp}] ✅ Purchase WhatsApp notification delivered`);
  } else {
    console.warn(`[${timestamp}] ⚠️ Purchase WhatsApp notification failed:`, result.error);
  }

  await sendTelegramMessage(message);
  await sendAdminEmailBackup(`🛒 New Store Purchase — ${details.productName || 'Guide'}`, message);
}

/**
 * Send project completion verification request
 */
export async function sendVerificationRequest(
  phoneNumber: string,
  clientName: string,
  verificationCode: string
): Promise<WhatsAppResult> {
  const message = `Project Completion Verification

Hi ${clientName}!

Your project is complete! Please verify using your code:

Code: ${verificationCode}

Visit: https://mulesoo.com/verify

Enter your code to confirm completion.`;

  return sendWhatsAppMessage({
    phone: phoneNumber.replace(/\D/g, ''),
    message,
  });
}
