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

type RGB = [number, number, number];
const BLUE: RGB = [0, 200, 255];
const PURPLE: RGB = [123, 47, 255];
const GOLD: RGB = [232, 184, 75];
const INK: RGB = [10, 15, 30];
const CARD: RGB = [13, 21, 40];
const MUTED: RGB = [130, 145, 175];
const WHITE: RGB = [255, 255, 255];

/** Generate & download a corporate staff ID card — standard CR80 (85.6×54mm). */
export async function generateIdCard(data: IdCardData): Promise<void> {
  const W = 85.6;
  const H = 54;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [W, H] });

  // Card background
  doc.setFillColor(...CARD);
  doc.roundedRect(0, 0, W, H, 3, 3, 'F');

  // ---- Header gradient bar ----
  const headerH = 11;
  const slices = 60;
  for (let i = 0; i < slices; i++) {
    const t = i / (slices - 1);
    doc.setFillColor(
      Math.round(BLUE[0] + (PURPLE[0] - BLUE[0]) * t),
      Math.round(BLUE[1] + (PURPLE[1] - BLUE[1]) * t),
      Math.round(BLUE[2] + (PURPLE[2] - BLUE[2]) * t)
    );
    doc.rect((W / slices) * i, 0, W / slices + 0.5, headerH, 'F');
  }
  // gold underline
  doc.setFillColor(...GOLD);
  doc.rect(0, headerH, W, 0.5, 'F');

  // Logo mark
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(4, 2.6, 6, 6, 1, 1, 'F');
  doc.setTextColor(...PURPLE);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('M', 7, 7, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('MULESOO', 12, 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(4.2);
  doc.text('D I G I T A L   S E R V I C E S', 12, 9);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...INK);
  doc.text('STAFF ID', W - 4, 7, { align: 'right' });

  // ---- Photo (ID standard 35:45) ----
  const px = 5;
  const py = 15;
  const pw = 22;
  const ph = 28.3; // 22 * 45/35
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(px - 0.8, py - 0.8, pw + 1.6, ph + 1.6, 1, 1, 'F');
  if (data.photo_data_url) {
    try {
      doc.addImage(data.photo_data_url, 'JPEG', px, py, pw, ph);
    } catch {
      doc.setFillColor(230, 235, 245);
      doc.rect(px, py, pw, ph, 'F');
    }
  } else {
    doc.setFillColor(230, 235, 245);
    doc.rect(px, py, pw, ph, 'F');
  }

  // ID line under photo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(...BLUE);
  doc.text(data.staff_number, px + pw / 2, py + ph + 4, { align: 'center' });

  // ---- Details (right of photo) ----
  const dx = 31;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(240, 242, 250);
  doc.text(truncate(data.display_name, 22), dx, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text(truncate(data.department_name || 'MuleSoo Team', 28), dx, 22.5);

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.3);
  doc.line(dx, 25, dx + 30, 25);

  const field = (label: string, value: string, x: number, y: number) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.6);
    doc.setTextColor(...MUTED);
    doc.text(label.toUpperCase(), x, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(235, 240, 250);
    doc.text(value, x, y + 3.6);
  };

  const issued = new Date();
  const valid = new Date();
  valid.setFullYear(valid.getFullYear() + 2);
  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  field('Issued', fmt(issued), dx, 30);
  field('Valid thru', fmt(valid), dx + 20, 30);

  // Verification code (gold, prominent)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(4.6);
  doc.setTextColor(...MUTED);
  doc.text('VERIFICATION CODE', dx, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...GOLD);
  doc.text(data.verification_code, dx, 43);

  // ---- QR (bottom-right) ----
  const qrUrl = `https://mulesoo.vercel.app/corporate/qr-login?token=${encodeURIComponent(data.qr_token)}`;
  try {
    const qr = await QRCode.toDataURL(qrUrl, { width: 300, margin: 0, color: { dark: '#0A0F1E', light: '#FFFFFF' } });
    const qs = 18;
    const qx = W - qs - 5;
    const qy = 15;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(qx - 1, qy - 1, qs + 2, qs + 2, 1, 1, 'F');
    doc.addImage(qr, 'PNG', qx, qy, qs, qs);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.4);
    doc.setTextColor(...MUTED);
    doc.text('SCAN TO LOG IN', qx + qs / 2, qy + qs + 3, { align: 'center' });
  } catch {
    /* skip QR if it fails */
  }

  // ---- Footer ----
  doc.setDrawColor(30, 40, 66);
  doc.setLineWidth(0.3);
  doc.line(5, H - 5, W - 5, H - 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(4);
  doc.setTextColor(...MUTED);
  doc.text('Property of MuleSoo Digital Services · mulesoo.vercel.app', 5, H - 2.5);

  const filename = `MuleSoo_StaffID_${data.staff_number.replace(/[^A-Za-z0-9]/g, '')}.pdf`;
  downloadBlob(doc.output('blob'), filename);
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
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
