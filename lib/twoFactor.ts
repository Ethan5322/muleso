import { supabase } from './supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Generate a random 6-digit 2FA code
 */
export function generateTwoFactorCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send 2FA code via email
 */
export async function sendTwoFactorEmail(
  adminEmail: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: 'security@mulesoo.com',
      to: adminEmail,
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
              .warning { background: #7B2FFF; background-opacity: 0.2; border-left: 4px solid #7B2FFF; padding: 15px; margin: 20px 0; font-size: 13px; }
              .footer { text-align: center; font-size: 11px; color: #A8B2D0; margin-top: 30px; padding-top: 20px; border-top: 1px solid #1A2640; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">
                  <span>MULE</span>SOO
                </div>
                <p style="color: #00C8FF; margin: 10px 0; font-size: 12px;">Admin Panel Security</p>
              </div>

              <h2 style="text-align: center; margin: 20px 0;">Two-Factor Authentication Code</h2>

              <p>Hello,</p>
              <p>You're attempting to log in to your MuleSoo admin panel. Your verification code is:</p>

              <div class="code">
                <div class="code-text">${code}</div>
              </div>

              <div class="note">
                ⏰ This code expires in <strong>10 minutes</strong>
              </div>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you didn't request this code, please secure your account immediately by changing your password.
              </div>

              <div style="background: #0D1528; border-radius: 8px; padding: 20px; margin: 20px 0; font-size: 13px;">
                <h4 style="margin-top: 0; color: #00C8FF;">Next Steps:</h4>
                <ol style="margin: 10px 0; padding-left: 20px;">
                  <li>Return to your login page</li>
                  <li>Enter your password</li>
                  <li>Enter this 6-digit code</li>
                  <li>Click "Login"</li>
                </ol>
              </div>

              <p style="font-size: 12px; color: #A8B2D0;">
                <strong>Need help?</strong> Contact us at support@mulesoo.com
              </p>

              <div class="footer">
                <p>© 2025 MuleSoo Digital Services. All rights reserved.</p>
                <p>This is an automated security email. Do not reply directly.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send 2FA email:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ 2FA code sent to:', adminEmail);
    return { success: true };
  } catch (error: any) {
    console.error('2FA email error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Store 2FA code in database for verification
 */
export async function storeTwoFactorCode(
  adminEmail: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('two_factor_codes').insert({
      admin_email: adminEmail,
      code,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      verified: false,
      created_at: new Date().toISOString(),
    });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error storing 2FA code:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verify 2FA code from user
 */
export async function verifyTwoFactorCode(
  adminEmail: string,
  userCode: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get the most recent code
    const { data, error: fetchError } = await supabase
      .from('two_factor_codes')
      .select('*')
      .eq('admin_email', adminEmail)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !data) {
      return { success: false, error: 'No valid 2FA code found' };
    }

    // Check if code is expired
    if (new Date() > new Date(data.expires_at)) {
      return { success: false, error: '2FA code expired. Request a new one.' };
    }

    // Check if code matches
    if (data.code !== userCode) {
      return { success: false, error: 'Invalid 2FA code' };
    }

    // Mark code as verified
    const { error: updateError } = await supabase
      .from('two_factor_codes')
      .update({ verified: true })
      .eq('id', data.id);

    if (updateError) throw updateError;

    console.log('✅ 2FA code verified for:', adminEmail);
    return { success: true };
  } catch (error: any) {
    console.error('Error verifying 2FA code:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Clean up expired 2FA codes
 */
export async function cleanupExpiredCodes(): Promise<void> {
  try {
    await supabase
      .from('two_factor_codes')
      .delete()
      .lt('expires_at', new Date().toISOString());

    console.log('✅ Cleaned up expired 2FA codes');
  } catch (error) {
    console.error('Error cleaning up 2FA codes:', error);
  }
}
