import 'server-only';
import { randomBytes } from 'crypto';

/** Human-friendly verification code printed on the ID card, e.g. 7K4M-9QX2-P3RT. */
export function makeVerificationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
    if ((i + 1) % 4 === 0 && i !== 11) code += '-';
  }
  return code;
}

/** Opaque QR login token. */
export function makeQrToken(): string {
  return randomBytes(24).toString('hex');
}
