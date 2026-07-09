/**
 * Send WhatsApp messages via CallMeBot API
 * API Documentation: https://www.callmebot.com/blog/free-api-whatsapp-messages/
 */

const CALLMEBOT_API_URL = 'https://api.callmebot.com/whatsapp.php';
const CALLMEBOT_API_KEY = process.env.CALLMEBOT_API_KEY || '7268108';
const ADMIN_PHONE = process.env.ADMIN_WHATSAPP || '27688529333'; // Owner's WhatsApp number

// Optional Telegram alerts (set both env vars to enable). No-ops if unset.
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

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
 * Send WhatsApp message via CallMeBot API with error handling
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

    // Send request with timeout (10 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${response.statusText}`);
    }

    console.log(`[${timestamp}] WhatsApp sent to ${phone}`);
    return { success: true, timestamp };
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
2. Ena Muluken will contact you within 2 hours
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

  const result = await sendWhatsAppMessage({ phone: ADMIN_PHONE, message });
  await sendTelegramMessage(message);
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

  await sendWhatsAppMessage({ phone: ADMIN_PHONE, message });
  await sendTelegramMessage(message);
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

  await sendWhatsAppMessage({ phone: ADMIN_PHONE, message });
  await sendTelegramMessage(message);
}

/**
 * Alert the owner (WhatsApp + Telegram) when a store product is purchased.
 */
export async function sendPurchaseNotification(details: {
  productName?: string;
  amount?: number;
  buyerEmail?: string;
  reference?: string;
}): Promise<void> {
  const dash = '—';
  const paidAt = new Date().toLocaleString('en-ZA', {
    timeZone: 'Africa/Johannesburg',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const message = `🛒 *NEW STORE PURCHASE — MuleSoo*

A guide has just been bought and paid via Paystack.

📘 Product: ${details.productName || dash}
💳 Amount: ${details.amount ? `R ${Number(details.amount).toLocaleString('en-ZA')}` : dash}
✉️ Buyer: ${details.buyerEmail || dash}
🔖 Reference: ${details.reference || dash}
📅 Paid: ${paidAt} (SAST)

The buyer can download it now; a copy has been made available on the confirmation page.`;

  await sendWhatsAppMessage({ phone: ADMIN_PHONE, message });
  await sendTelegramMessage(message);
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
