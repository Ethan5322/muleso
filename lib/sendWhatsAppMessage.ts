/**
 * Send WhatsApp messages via CallMeBot API
 * API Documentation: https://www.callmebot.com/blog/free-api-whatsapp-messages/
 */

const CALLMEBOT_API_URL = 'https://api.callmebot.com/whatsapp.php';
const CALLMEBOT_API_KEY = '5233738';
const ADMIN_PHONE = '27759440377'; // Owner's WhatsApp number

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
2. Ethan will contact you within 2 hours
3. Download your PDF agreement from your email
4. We will confirm project start date

---NEED HELP?---
Email: hello@mulukenendashaw68@gmail.com
WhatsApp: +27 759 440 377
Website: https://mulesoo.vercel.app

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
 * Send verification confirmation to admin
 */
export async function sendAdminNotification(
  clientName: string,
  service: string,
  verificationCode: string,
  budget: string
): Promise<WhatsAppResult> {
  const message = `New Booking Alert

Client: ${clientName}
Service: ${service}
Budget: ${budget}
Verification Code: ${verificationCode}

Check admin panel for details.`;

  return sendWhatsAppMessage({
    phone: ADMIN_PHONE,
    message,
  });
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
