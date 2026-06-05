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
 * Send booking confirmation to customer with fallback logging
 */
export async function sendBookingConfirmation(
  phoneNumber: string,
  clientName: string,
  service: string,
  verificationCode: string
): Promise<WhatsAppResult> {
  const message = `Booking Confirmation

Hi ${clientName}!

Your booking has been confirmed!

Service: ${service}
Verification Code: ${verificationCode}

Keep this code safe for project verification.

Visit: https://mulesoo.vercel.app | Contact: +27 759 440 377

Thank you for choosing MuleSoo!`;

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
