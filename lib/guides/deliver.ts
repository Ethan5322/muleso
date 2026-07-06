import { Resend } from 'resend';
import { buildGuide } from './buildGuide';
import { getGuide } from './registry';
import { findProductBySlug } from '../storeProducts';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mulukenendashaw68@gmail.com';

/** A short, deterministic open-password derived from the payment reference. */
export function derivePassword(reference: string): string {
  const clean = reference.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  return `MS-${clean.slice(-6) || 'GUIDE0'}`;
}

export interface BuyerGuide {
  pdf: Uint8Array;
  password: string;
  filename: string;
  productName: string;
}

/**
 * Generate the buyer's personalised copy: their name/email + order stamped on
 * every page, and opened with a per-buyer password. Returns null if the book
 * content isn't available yet.
 */
export function generateBuyerGuide(slug: string, reference: string, buyerEmail: string): BuyerGuide | null {
  const guide = getGuide(slug);
  const product = findProductBySlug(slug);
  if (!guide || !product) return null;
  const password = derivePassword(reference);
  const watermark = `${buyerEmail} • ${reference}`;
  const pdf = buildGuide(guide, { watermark, password });
  return { pdf, password, filename: `${slug}.pdf`, productName: product.name };
}

/** Email the buyer their guide as an attachment (best-effort). */
export async function emailGuideToBuyer(buyerEmail: string, item: BuyerGuide): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn('emailGuideToBuyer: RESEND_API_KEY not set — skipping email');
    return;
  }
  const resend = new Resend(key);
  const base64 = Buffer.from(item.pdf).toString('base64');

  const html = `
    <div style="font-family:Arial,sans-serif;color:#0A0F1E">
      <h2 style="color:#00C8FF">Thank you for your purchase 🎉</h2>
      <p>Your guide <strong>${item.productName}</strong> is attached to this email.</p>
      <p style="background:#FFFBF0;border:1px solid #E8B84B;border-radius:8px;padding:12px">
        This copy is licensed to <strong>${buyerEmail}</strong>. To open it, use this password:<br/>
        <span style="font-size:20px;font-weight:bold;letter-spacing:2px;color:#7B2FFF">${item.password}</span>
      </p>
      <p style="color:#555;font-size:13px">Please don't share this file — every page is watermarked to your account.</p>
      <p style="color:#555;font-size:13px">Questions? Just reply to this email or WhatsApp +27 68 852 9333.</p>
      <p style="color:#888;font-size:12px">MuleSoo Digital Services · Pretoria, South Africa</p>
    </div>`;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: buyerEmail,
    bcc: ADMIN_EMAIL,
    subject: `Your guide: ${item.productName} (password inside)`,
    html,
    attachments: [{ filename: item.filename, content: base64 }],
  });
}
