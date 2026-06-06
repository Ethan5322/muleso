import { supabase } from './supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = 'mulukenendashaw68@gmail.com'; // Change to your admin email

interface SecurityAlert {
  alert_type: 'SUSPICIOUS_LOGIN' | 'FAILED_2FA' | 'ACCOUNT_LOCKED' | 'PASSWORD_CHANGED' | 'NEW_DEVICE';
  admin_email: string;
  ip_address?: string;
  user_agent?: string;
  device_info?: string;
  location?: string;
  details?: object;
}

/**
 * Send email alert for suspicious activity
 */
export async function sendSecurityAlert(
  alert: SecurityAlert
): Promise<{ success: boolean; error?: string }> {
  try {
    // Log to database
    await logSecurityAlert(alert);

    // Send email notification
    const subject = getAlertSubject(alert.alert_type);
    const message = getAlertMessage(alert);

    const { error } = await resend.emails.send({
      from: 'security@mulesoo.com',
      to: ADMIN_EMAIL,
      subject,
      html: message,
    });

    if (error) {
      console.error('Failed to send security alert:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Security alert sent for: ${alert.alert_type}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending security alert:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get alert subject based on type
 */
function getAlertSubject(alertType: string): string {
  const subjects: Record<string, string> = {
    SUSPICIOUS_LOGIN: '🚨 Suspicious Login Attempt - MuleSoo Admin',
    FAILED_2FA: '⚠️ Failed 2FA Attempts - MuleSoo Admin',
    ACCOUNT_LOCKED: '🔒 Account Locked - MuleSoo Admin',
    PASSWORD_CHANGED: '🔑 Password Changed - MuleSoo Admin',
    NEW_DEVICE: '📱 New Device Login - MuleSoo Admin',
  };

  return subjects[alertType] || 'Security Alert - MuleSoo Admin';
}

/**
 * Get alert message HTML based on type
 */
function getAlertMessage(alert: SecurityAlert): string {
  const baseHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #050810; color: #F0F2FA; }
          .container { max-width: 600px; margin: 0 auto; background: #0A0F1E; border: 1px solid #00C8FF; border-radius: 12px; padding: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .alert-badge { display: inline-block; background: #FF6B6B; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold; margin-bottom: 20px; }
          .details-box { background: #1A2640; border: 1px solid #00C8FF; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #0D1528; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { color: #A8B2D0; font-weight: bold; }
          .detail-value { color: #F0F2FA; }
          .warning-box { background: #7B2FFF; background-color: rgba(123, 47, 255, 0.2); border-left: 4px solid #7B2FFF; padding: 15px; margin: 20px 0; }
          .action-button { display: inline-block; background: #00C8FF; color: #050810; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; font-size: 11px; color: #A8B2D0; margin-top: 30px; padding-top: 20px; border-top: 1px solid #1A2640; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="alert-badge">SECURITY ALERT</div>
            <h2 style="color: #F0F2FA; margin: 10px 0;">Unusual Activity Detected</h2>
          </div>
  `;

  const detailsHTML = getAlertDetails(alert);

  const footerHTML = `
          <div class="warning-box">
            <strong>🔒 What to do:</strong><br>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Review the activity details below</li>
              <li>If this wasn't you, <strong>change your password immediately</strong></li>
              <li>Enable/review 2FA on your account</li>
              <li>Contact support if you need assistance</li>
            </ul>
          </div>

          <a href="https://mulesoo.vercel.app/admin/login" class="action-button">Go to Admin Panel</a>

          <div class="footer">
            <p>© 2025 MuleSoo Digital Services. All rights reserved.</p>
            <p>This is an automated security email. Do not reply directly.</p>
            <p>If you did not request this email or think this is an error, please contact support immediately.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return baseHTML + detailsHTML + footerHTML;
}

/**
 * Get detailed alert information
 */
function getAlertDetails(alert: SecurityAlert): string {
  const timestamp = new Date().toLocaleString();

  let detailsHTML = `
    <div class="details-box">
      <div class="detail-row">
        <span class="detail-label">📅 Time:</span>
        <span class="detail-value">${timestamp}</span>
      </div>
  `;

  if (alert.ip_address) {
    detailsHTML += `
      <div class="detail-row">
        <span class="detail-label">🌐 IP Address:</span>
        <span class="detail-value">${alert.ip_address}</span>
      </div>
    `;
  }

  if (alert.location) {
    detailsHTML += `
      <div class="detail-row">
        <span class="detail-label">📍 Location:</span>
        <span class="detail-value">${alert.location}</span>
      </div>
    `;
  }

  if (alert.device_info) {
    detailsHTML += `
      <div class="detail-row">
        <span class="detail-label">📱 Device:</span>
        <span class="detail-value">${alert.device_info}</span>
      </div>
    `;
  }

  const alertMessages: Record<string, string> = {
    SUSPICIOUS_LOGIN: 'An attempt to log in from an unrecognized location or device was detected.',
    FAILED_2FA: 'Multiple failed 2FA verification attempts were made on your account.',
    ACCOUNT_LOCKED: 'Your admin account has been temporarily locked due to multiple failed login attempts.',
    PASSWORD_CHANGED: 'Your admin password was successfully changed.',
    NEW_DEVICE: 'A successful login from a new device or location was recorded.',
  };

  detailsHTML += `
    <div class="detail-row" style="margin-top: 10px; padding-top: 10px;">
      <span class="detail-label">Alert Type:</span>
      <span class="detail-value">${alertMessages[alert.alert_type] || 'Security Alert'}</span>
    </div>
  `;

  detailsHTML += '</div>';

  return detailsHTML;
}

/**
 * Log security alert to database
 */
async function logSecurityAlert(alert: SecurityAlert): Promise<void> {
  try {
    await supabase.from('security_alerts').insert({
      alert_type: alert.alert_type,
      admin_email: alert.admin_email,
      ip_address: alert.ip_address || 'unknown',
      user_agent: alert.user_agent || '',
      device_info: alert.device_info || '',
      location: alert.location || '',
      details: alert.details || {},
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error logging security alert:', error);
  }
}

/**
 * Get security alert history
 */
export async function getSecurityAlerts(
  adminEmail: string,
  limit: number = 50
): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('security_alerts')
      .select('*')
      .eq('admin_email', adminEmail)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching security alerts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching security alerts:', error);
    return [];
  }
}

/**
 * Detect suspicious login based on device fingerprint
 */
export function detectSuspiciousLogin(
  storedDeviceInfo: string | null,
  currentDeviceInfo: string
): boolean {
  // If no previous device info, it's new
  if (!storedDeviceInfo) {
    return true;
  }

  // If device info matches, not suspicious
  if (storedDeviceInfo === currentDeviceInfo) {
    return false;
  }

  // Device changed = suspicious
  return true;
}

/**
 * Get device fingerprint
 */
export function getDeviceFingerprint(): string {
  if (typeof window === 'undefined') {
    return 'unknown';
  }

  const nav = navigator;
  const fingerprint = [
    nav.userAgent,
    nav.language,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
  ].join('|');

  return btoa(fingerprint);
}
