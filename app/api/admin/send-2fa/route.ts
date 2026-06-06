import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Missing email or code' },
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: '🔐 MuleSoo Admin - Two-Factor Code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background: #050810; color: #F0F2FA; }
              .container { max-width: 500px; margin: 0 auto; background: #0A0F1E; border: 1px solid #00C8FF; border-radius: 12px; padding: 40px; }
              .header { text-align: center; margin-bottom: 30px; }
              .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
              .logo span { color: #00C8FF; }
              .code { background: #1A2640; border: 2px solid #00C8FF; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
              .code-text { font-size: 48px; font-weight: bold; color: #00C8FF; letter-spacing: 8px; font-family: 'Courier New', monospace; }
              .note { font-size: 12px; color: #A8B2D0; text-align: center; margin: 20px 0; }
              .footer { text-align: center; font-size: 11px; color: #A8B2D0; margin-top: 30px; padding-top: 20px; border-top: 1px solid #1A2640; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo"><span>MULE</span>SOO</div>
                <p style="color: #A8B2D0; margin-top: 10px;">Admin Security Code</p>
              </div>
              <p style="color: #A8B2D0;">Your 2FA code is:</p>
              <div class="code">
                <div class="code-text">${code}</div>
              </div>
              <p class="note">Code expires in 10 minutes</p>
              <div class="footer">
                <p>If you didn't request this code, please contact support immediately.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send 2FA error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
