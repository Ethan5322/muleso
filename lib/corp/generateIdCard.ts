'use client';

import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export interface IdCardData {
  display_name: string;
  staff_number: string;
  department_name?: string | null;
  verification_code: string;
  qr_token: string;
  photo_data_url?: string | null;
  email?: string | null;
}

const BLUE = '#00C8FF';
const PURPLE = '#7B2FFF';

/** Generate & download a corporate staff ID card (portrait, ~54x86mm). */
export async function generateIdCard(data: IdCardData): Promise<void> {
  const W = 54;
  const H = 86;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [W, H] });

  // Background
  doc.setFillColor(10, 15, 30);
  doc.rect(0, 0, W, H, 'F');

  // Header band
  doc.setFillColor(0, 200, 255);
  doc.rect(0, 0, W, 13, 'F');
  doc.setFillColor(123, 47, 255);
  doc.rect(0, 12.4, W, 0.6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('MULESOO', W / 2, 6.2, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5);
  doc.text('DIGITAL SERVICES — STAFF ID', W / 2, 10, { align: 'center' });

  // Photo (3:4) centered
  const pw = 24;
  const ph = 32;
  const px = (W - pw) / 2;
  const py = 17;
  doc.setDrawColor(0, 200, 255);
  doc.setLineWidth(0.5);
  if (data.photo_data_url) {
    try {
      doc.addImage(data.photo_data_url, 'JPEG', px, py, pw, ph);
    } catch {
      doc.setFillColor(20, 28, 46);
      doc.rect(px, py, pw, ph, 'F');
    }
  } else {
    doc.setFillColor(20, 28, 46);
    doc.rect(px, py, pw, ph, 'F');
  }
  doc.rect(px, py, pw, ph, 'S');

  // Name + department
  let y = py + ph + 6;
  doc.setTextColor(240, 242, 250);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(data.display_name, W / 2, y, { align: 'center' });
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(168, 178, 208);
  doc.text(data.department_name || 'MuleSoo', W / 2, y, { align: 'center' });

  // Staff number
  y += 5.5;
  doc.setTextColor(0, 200, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(data.staff_number, W / 2, y, { align: 'center' });

  // Verification code
  y += 5;
  doc.setFontSize(4.6);
  doc.setTextColor(110, 122, 145);
  doc.text('VERIFICATION CODE', W / 2, y, { align: 'center' });
  y += 3;
  doc.setFontSize(6.6);
  doc.setTextColor(232, 184, 75);
  doc.setFont('helvetica', 'bold');
  doc.text(data.verification_code, W / 2, y, { align: 'center' });

  // QR (login)
  const qrUrl = `https://mulesoo.vercel.app/corporate/qr-login?token=${encodeURIComponent(data.qr_token)}`;
  try {
    const qr = await QRCode.toDataURL(qrUrl, { width: 300, margin: 0, color: { dark: '#0A0F1E', light: '#FFFFFF' } });
    const qs = 16;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(W / 2 - qs / 2 - 1, y + 2, qs + 2, qs + 2, 1, 1, 'F');
    doc.addImage(qr, 'PNG', W / 2 - qs / 2, y + 3, qs, qs);
    doc.setFontSize(4.4);
    doc.setTextColor(168, 178, 208);
    doc.setFont('helvetica', 'normal');
    doc.text('SCAN TO LOG IN', W / 2, y + qs + 6, { align: 'center' });
  } catch {
    /* skip QR if generation fails */
  }

  // Footer
  doc.setFontSize(4);
  doc.setTextColor(110, 122, 145);
  doc.text('mulesoo.vercel.app', W / 2, H - 3, { align: 'center' });

  const filename = `MuleSoo_StaffID_${data.staff_number.replace(/[^A-Za-z0-9]/g, '')}.pdf`;
  const blob = doc.output('blob');
  downloadBlob(blob, filename);
}

function downloadBlob(blob: Blob, filename: string) {
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const ua = navigator.userAgent || '';
    const isIOS = /iP(hone|ad|od)/.test(ua);
    if (!('download' in a) || isIOS) {
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 15000);
      return;
    }
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 4000);
  } catch (e) {
    console.error('ID card download failed', e);
  }
}
