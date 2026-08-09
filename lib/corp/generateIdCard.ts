'use client';

import jsPDF from 'jspdf';
import { creditImage, CREDIT_COMPACT_ASPECT } from '../brand/agencyCredit';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

/** Render a Code128 barcode (of the verification code) to a white PNG. */
function makeBarcodePng(text: string): string | null {
  try {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, text, {
      format: 'CODE128',
      displayValue: false,
      margin: 0,
      height: 70,
      width: 2,
      background: '#ffffff',
      lineColor: '#0A0F1E',
    });
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}

export interface IdCardData {
  display_name: string;
  staff_number: string;
  department_name?: string | null;
  verification_code: string;
  qr_token: string;
  photo_data_url?: string | null;
  email?: string | null;
}

export type IdCardFormat = 'pdf' | 'png';

type RGB = [number, number, number];
const BLUE: RGB = [0, 200, 255];
const PURPLE: RGB = [123, 47, 255];
const GOLD: RGB = [232, 184, 75];
const INK: RGB = [10, 15, 30];
const CARD: RGB = [13, 21, 40];
const MUTED: RGB = [130, 145, 175];

// Card is standard CR80 (85.6 × 54 mm). We render at a high pixel density so
// both the PNG and the (image-based) PDF are crisp for screen and print.
const W_MM = 85.6;
const H_MM = 54;
const S = 16; // pixels per millimetre  ->  1370 × 864 px

/** Load the official transparent logo icon as an <img>. */
async function loadLogoImg(): Promise<HTMLImageElement | null> {
  try {
    return await loadImg('/mulesoo-logo-icon.png');
  } catch {
    return null;
  }
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Draw the full staff ID card onto a high-resolution canvas. This is the single
 * source of truth for both the PNG and the PDF export.
 */
async function renderIdCardCanvas(data: IdCardData): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(W_MM * S);
  canvas.height = Math.round(H_MM * S);
  const ctx = canvas.getContext('2d')!;
  ctx.textBaseline = 'alphabetic';

  const mm = (v: number) => v * S;
  const pt = (v: number) => v * 0.3528 * S; // pt -> px
  const rgb = (c: RGB) => `rgb(${c[0]},${c[1]},${c[2]})`;
  const setFont = (weight: 'bold' | 'normal', sizePt: number) => {
    ctx.font = `${weight === 'bold' ? 'bold ' : ''}${pt(sizePt)}px Helvetica, Arial, sans-serif`;
  };
  const roundPath = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };
  const roundFill = (xm: number, ym: number, wm: number, hm: number, rm: number) => {
    roundPath(mm(xm), mm(ym), mm(wm), mm(hm), mm(rm));
    ctx.fill();
  };
  const text = (str: string, xm: number, ym: number, align: CanvasTextAlign = 'left') => {
    ctx.textAlign = align;
    ctx.fillText(str, mm(xm), mm(ym));
  };
  const fit = (s: string, maxMm: number): string => {
    if (ctx.measureText(s).width <= mm(maxMm)) return s;
    let t = s;
    while (t.length > 1 && ctx.measureText(t + '…').width > mm(maxMm)) t = t.slice(0, -1);
    return t + '…';
  };

  const logo = await loadLogoImg();

  // ---- Card background ----
  ctx.fillStyle = rgb(CARD);
  roundFill(0, 0, W_MM, H_MM, 3);

  // ---- Header (blue -> purple gradient) ----
  const headerH = 11;
  const grad = ctx.createLinearGradient(0, 0, mm(W_MM), 0);
  grad.addColorStop(0, rgb(BLUE));
  grad.addColorStop(1, rgb(PURPLE));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, mm(W_MM), mm(headerH));
  ctx.fillStyle = rgb(GOLD);
  ctx.fillRect(0, mm(headerH), mm(W_MM), mm(0.5));

  // Logo icon on the header
  let textX = 4;
  if (logo) {
    try {
      ctx.drawImage(logo, mm(2), mm(0.6), mm(10), mm(10));
      textX = 13;
    } catch {
      /* fall back to wordmark-only */
    }
  }

  ctx.fillStyle = 'rgb(255,255,255)';
  setFont('bold', 9);
  text('MULESOO', textX, 6);
  setFont('normal', 4.2);
  text('D I G I T A L   S E R V I C E S', textX, 9);

  setFont('bold', 6.5);
  ctx.fillStyle = rgb(INK);
  text('STAFF ID', W_MM - 4, 7, 'right');

  // ============ ZONE 1: PHOTO ============
  const px = 5;
  const py = 15;
  const pw = 20;
  const ph = 25.7; // 20 * 45/35 (ID standard)
  ctx.fillStyle = 'rgb(255,255,255)';
  roundFill(px - 0.8, py - 0.8, pw + 1.6, ph + 1.6, 1);
  let photoImg: HTMLImageElement | null = null;
  if (data.photo_data_url) {
    try {
      const src = data.photo_data_url.startsWith('data:')
        ? data.photo_data_url
        : `data:image/jpeg;base64,${data.photo_data_url}`;
      photoImg = await loadImg(src);
    } catch {
      photoImg = null;
    }
  }
  if (photoImg) {
    ctx.drawImage(photoImg, mm(px), mm(py), mm(pw), mm(ph));
  } else {
    ctx.fillStyle = 'rgb(228,233,244)';
    ctx.fillRect(mm(px), mm(py), mm(pw), mm(ph));
  }
  setFont('bold', 6);
  ctx.fillStyle = rgb(BLUE);
  text(data.staff_number, px + pw / 2, py + ph + 4, 'center');

  // ============ ZONE 2: DETAILS ============
  const dx = 29;
  const dMax = 31;
  setFont('bold', 10.5);
  ctx.fillStyle = 'rgb(240,242,250)';
  text(fit(data.display_name, dMax), dx, 18);

  setFont('normal', 6.5);
  ctx.fillStyle = rgb(MUTED);
  text(fit(data.department_name || 'MuleSoo Team', dMax), dx, 22.5);

  ctx.strokeStyle = rgb(GOLD);
  ctx.lineWidth = mm(0.3);
  ctx.beginPath();
  ctx.moveTo(mm(dx), mm(25));
  ctx.lineTo(mm(dx + dMax), mm(25));
  ctx.stroke();

  const smallField = (label: string, value: string, x: number, y: number) => {
    setFont('normal', 4.4);
    ctx.fillStyle = rgb(MUTED);
    text(label.toUpperCase(), x, y);
    setFont('bold', 6.5);
    ctx.fillStyle = 'rgb(235,240,250)';
    text(value, x, y + 3.4);
  };

  const issued = new Date();
  const valid = new Date();
  valid.setFullYear(valid.getFullYear() + 2);
  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')} ${d.toLocaleDateString('en-GB', { month: 'short' })} ${String(d.getFullYear()).slice(2)}`;

  smallField('Issued', fmt(issued), dx, 30);
  smallField('Valid thru', fmt(valid), dx + 16, 30);

  setFont('normal', 4.4);
  ctx.fillStyle = rgb(MUTED);
  text('VERIFICATION CODE', dx, 38);
  setFont('bold', 8);
  ctx.fillStyle = rgb(GOLD);
  text(data.verification_code, dx, 42);

  // ============ ZONE 3: QR ============
  const qrUrl = `https://mulesoo.com/staff-access?token=${encodeURIComponent(data.qr_token)}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(qrUrl, { width: 300, margin: 0, color: { dark: '#0A0F1E', light: '#FFFFFF' } });
    const qrImg = await loadImg(qrDataUrl);
    const qs = 17;
    const qx = W_MM - qs - 5;
    const qy = 14;
    ctx.fillStyle = 'rgb(255,255,255)';
    roundFill(qx - 1, qy - 1, qs + 2, qs + 2, 1);
    ctx.drawImage(qrImg, mm(qx), mm(qy), mm(qs), mm(qs));
    setFont('bold', 4.2);
    ctx.fillStyle = rgb(MUTED);
    text('SCAN TO LOG IN', qx + qs / 2, qy + qs + 3, 'center');
  } catch {
    /* skip QR if it fails */
  }

  // ============ BARCODE ============
  // Encode the verification code (short = reliably scannable by the admin
  // camera and hardware scanners). Scanning it in the admin Scan page resolves
  // it to the holder's full details. A long URL here makes the 1D barcode too
  // dense for a webcam to read.
  const barcode = makeBarcodePng(data.verification_code);
  if (barcode) {
    try {
      const bImg = await loadImg(barcode);
      const bw = W_MM - 16;
      const bx = 8;
      const by = 44.2;
      const bh = 5;
      ctx.fillStyle = 'rgb(255,255,255)';
      roundFill(bx - 1, by - 1, bw + 2, bh + 2, 0.8);
      ctx.drawImage(bImg, mm(bx), mm(by), mm(bw), mm(bh));
    } catch {
      /* skip barcode if it fails */
    }
  }

  // ---- Footer: agency credit lockup ----
  // The card is dark, so the light-ink one-line variant. Width is chosen so the
  // lockup's height fits the strip left BELOW the barcode (which ends at 49.2mm)
  // and above the card edge — it can never ride over the barcode or the photo.
  const BARCODE_BOTTOM_MM = 49.4;
  const availH = H_MM - BARCODE_BOTTOM_MM - 1.2; // leave 1.2mm at the trim edge
  const creditH = Math.min(availH, 3.6);
  const creditW = creditH * CREDIT_COMPACT_ASPECT;
  const creditX = (W_MM - creditW) / 2;
  const creditY = H_MM - 1.2 - creditH;

  try {
    const credit = await loadImg(creditImage(true, true));
    ctx.drawImage(credit, mm(creditX), mm(creditY), mm(creditW), mm(creditH));
  } catch {
    // Never lose the attribution if the image fails — fall back to plain text.
    setFont('normal', 4);
    ctx.fillStyle = rgb(MUTED);
    text('Designed & built by MuleSoo Digital Services · mulesoo.com', W_MM / 2, H_MM - 1.6, 'center');
  }

  return canvas;
}

/** Wrap the rendered card canvas into a single-page, card-sized PDF. */
function downloadCardAsPdf(canvas: HTMLCanvasElement, filename: string) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [W_MM, H_MM] });
  doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, W_MM, H_MM);
  downloadBlob(doc.output('blob'), filename);
}

/** Download the rendered card canvas as a high-resolution PNG image. */
function downloadCardAsPng(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => {
    if (blob) downloadBlob(blob, filename);
  }, 'image/png');
}

/**
 * Generate & download a corporate staff ID card.
 * If `format` is omitted, the user is asked to choose PDF or PNG.
 */
export async function generateIdCard(data: IdCardData, format?: IdCardFormat): Promise<void> {
  const chosen = format ?? (await promptIdFormat());
  if (!chosen) return; // user cancelled

  const canvas = await renderIdCardCanvas(data);
  const base = `MuleSoo_StaffID_${data.staff_number.replace(/[^A-Za-z0-9]/g, '')}`;
  if (chosen === 'png') {
    downloadCardAsPng(canvas, `${base}.png`);
  } else {
    downloadCardAsPdf(canvas, `${base}.pdf`);
  }
}

/** Small on-brand modal asking whether to download the ID as PDF or PNG. */
function promptIdFormat(): Promise<IdCardFormat | null> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') return resolve('pdf');

    const overlay = document.createElement('div');
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;' +
      'background:rgba(3,6,14,0.75);backdrop-filter:blur(4px);padding:20px;';

    const box = document.createElement('div');
    box.style.cssText =
      'width:100%;max-width:340px;background:#0D1528;border:1px solid #1A2640;border-radius:16px;' +
      'padding:22px;font-family:Inter,Segoe UI,Arial,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,0.5);';

    const title = document.createElement('div');
    title.textContent = 'Download Staff ID';
    title.style.cssText = 'color:#F0F2FA;font-size:17px;font-weight:700;margin-bottom:4px;';

    const sub = document.createElement('div');
    sub.textContent = 'Choose a format — both are high quality.';
    sub.style.cssText = 'color:#A8B2D0;font-size:12.5px;margin-bottom:18px;';

    const mkBtn = (label: string, note: string, primary: boolean, val: IdCardFormat) => {
      const b = document.createElement('button');
      b.style.cssText =
        `width:100%;text-align:left;margin-bottom:10px;padding:13px 15px;border-radius:11px;cursor:pointer;` +
        `border:1px solid ${primary ? '#7FB3FF' : '#1A2640'};` +
        `background:${primary ? 'linear-gradient(135deg,rgba(127, 179, 255,0.16),rgba(123,47,255,0.16))' : '#0A0F1E'};` +
        `color:#F0F2FA;font-size:14px;font-weight:600;transition:transform .12s ease;`;
      b.innerHTML = `${label}<div style="font-size:11px;font-weight:400;color:#A8B2D0;margin-top:2px;">${note}</div>`;
      b.onmouseenter = () => (b.style.transform = 'translateY(-1px)');
      b.onmouseleave = () => (b.style.transform = 'none');
      b.onclick = () => {
        cleanup();
        resolve(val);
      };
      return b;
    };

    const cancel = document.createElement('button');
    cancel.textContent = 'Cancel';
    cancel.style.cssText =
      'width:100%;margin-top:4px;padding:9px;border-radius:9px;border:none;background:transparent;' +
      'color:#7C88A6;font-size:12.5px;cursor:pointer;';
    cancel.onclick = () => {
      cleanup();
      resolve(null);
    };

    const cleanup = () => {
      document.removeEventListener('keydown', onKey);
      overlay.remove();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cleanup();
        resolve(null);
      }
    };
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        cleanup();
        resolve(null);
      }
    };
    document.addEventListener('keydown', onKey);

    box.appendChild(title);
    box.appendChild(sub);
    box.appendChild(mkBtn('📄  PDF Document', 'Best for printing & official records', true, 'pdf'));
    box.appendChild(mkBtn('🖼️  PNG Image', 'Best for sharing on WhatsApp / phone', false, 'png'));
    box.appendChild(cancel);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  });
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
