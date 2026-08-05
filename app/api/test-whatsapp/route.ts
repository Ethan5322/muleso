import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage, sendTelegramMessage } from '@/lib/sendWhatsAppMessage';

/**
 * Test endpoint to verify WhatsApp alert delivery
 * GET /api/test-whatsapp - sends a test message to the admin phone number
 *
 * Usage:
 *   curl https://mulesoo.com/api/test-whatsapp?token=TEST_SECRET
 *
 * Set TEST_WHATSAPP_TOKEN in .env.local for security
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const testToken = process.env.TEST_WHATSAPP_TOKEN || 'test123';

  // Security: verify token
  if (token !== testToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const timestamp = new Date().toLocaleString('en-ZA', {
    timeZone: 'Africa/Johannesburg',
  });

  const testMessage = `🧪 *WHATSAPP ALERT TEST*

This is a test message from MuleSoo admin diagnostics.

Sent: ${timestamp} (SAST)
Endpoint: /api/test-whatsapp
Status: Testing

If you see this, WhatsApp alerts are working correctly! ✅`;

  try {
    console.log('Testing WhatsApp alert system...');

    // Test WhatsApp
    const whatsappResult = await sendWhatsAppMessage({
      phone: process.env.ADMIN_WHATSAPP || '27688529333',
      message: testMessage,
    });

    // Also test Telegram if configured
    let telegramStatus = 'not configured';
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      try {
        await sendTelegramMessage(testMessage);
        telegramStatus = 'sent';
      } catch (e) {
        telegramStatus = 'failed';
      }
    }

    console.log('Test results:', { whatsappResult, telegramStatus });

    return NextResponse.json({
      message: 'Test message sent',
      timestamp,
      results: {
        whatsapp: whatsappResult,
        telegram: telegramStatus,
      },
      config: {
        adminPhone: (process.env.ADMIN_WHATSAPP || '').replace(/\d(?=\d{2})/g, '*'),
        apiKeySet: !!process.env.CALLMEBOT_API_KEY,
      },
    });
  } catch (error: any) {
    console.error('Test failed:', error);
    return NextResponse.json(
      {
        error: 'Test failed',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
