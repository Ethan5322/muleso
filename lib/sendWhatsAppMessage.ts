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

/**
 * Send WhatsApp message via CallMeBot API
 */
export async function sendWhatsAppMessage({ phone, message }: SendWhatsAppParams): Promise<{ success: boolean; error?: string }> {
  try {
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Build API URL
    const url = `${CALLMEBOT_API_URL}?phone=${phone}&text=${encodedMessage}&apikey=${CALLMEBOT_API_KEY}`;

    // Send request
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    console.log(`âœ… WhatsApp message sent to ${phone}`);
    return { success: true };
  } catch (error: any) {
    console.error('âŒ Failed to send WhatsApp message:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send booking confirmation to customer
 */
export async function sendBookingConfirmation(
  phoneNumber: string,
  clientName: string,
  service: string,
  verificationCode: string
): Promise<{ success: boolean; error?: string }> {
  const message = `ðŸŽ‰ *Booking Confirmation* ðŸŽ‰

Hi ${clientName}! ðŸ‘‹

Your booking has been confirmed! âœ…

ðŸ“¦ *Service:* ${service}
ðŸ” *Verification Code:* ${verificationCode}

Keep this code safe. You'll need it to verify your booking once the project is completed.

ðŸ“ž *Need Help?*
Contact us: +27 759 440 377
WhatsApp: https://wa.me/27759440377

Thank you for choosing MuleSoo! ðŸš€`;

  return sendWhatsAppMessage({
    phone: phoneNumber.replace(/\D/g, ''), // Remove all non-digits
    message,
  });
}

/**
 * Send verification confirmation to admin
 */
export async function sendAdminNotification(
  clientName: string,
  service: string,
  verificationCode: string,
  budget: string
): Promise<{ success: boolean; error?: string }> {
  const message = `ðŸ”” *New Booking Alert* ðŸ””

Client: ${clientName}
Service: ${service}
Budget: ${budget}
Verification Code: ${verificationCode}

Check admin panel for full details.`;

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
): Promise<{ success: boolean; error?: string }> {
  const message = `ðŸ“‹ *Project Completion Verification* ðŸ“‹

Hi ${clientName}! ðŸ‘‹

Your project is complete! Please verify using your code:

ðŸ” *Code:* ${verificationCode}

Visit: https://mulesoo.com/verify

Enter your code to confirm completion.`;

  return sendWhatsAppMessage({
    phone: phoneNumber.replace(/\D/g, ''),
    message,
  });
}

