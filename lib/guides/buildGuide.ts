import { jsPDF } from 'jspdf';
import { stampAgencyCredit } from '../brand/agencyCredit';

// ── Book content model ───────────────────────────────────────────
export interface GuideSection {
  heading?: string;
  body?: string[]; // paragraphs
  bullets?: string[]; // ✓ bullet list
  steps?: string[]; // numbered steps
  callout?: string; // highlighted tip box
}
export interface GuideChapter {
  title: string;
  intro?: string;
  sections: GuideSection[];
}
export interface Guide {
  title: string;
  subtitle: string;
  tagline?: string;
  accent?: [number, number, number];
  chapters: GuideChapter[];
}

export interface BuildOptions {
  /** Buyer identity stamped on every page (e.g. "name • email • ref"). */
  watermark?: string;
  /** Open password for this buyer's copy. */
  password?: string;
}

const BLUE: [number, number, number] = [0, 200, 255];
const PURPLE: [number, number, number] = [123, 47, 255];
const GOLD: [number, number, number] = [232, 184, 75];
const INK: [number, number, number] = [24, 30, 46];
const BODY: [number, number, number] = [55, 62, 80];
const MUTED: [number, number, number] = [120, 132, 155];

/**
 * jsPDF's built-in fonts are WinAnsi (CP1252). A character outside that set
 * does not error — it silently prints as a WRONG glyph in the sold PDF ('✓'
 * came out as an apostrophe, '→' as garbage). Map the usual suspects to safe
 * equivalents and drop anything else, so a future content edit can never ship
 * mojibake to a paying customer.
 */
const CP1252_EXTRA = new Set('€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ'.split(''));
const WINANSI_MAP: Record<string, string> = {
  '→': '»',
  '⇒': '»',
  '←': '«',
  '✓': '-',
  '✔': '-',
  '✗': 'x',
  '✘': 'x',
  '★': '*',
  '☆': '*',
  '−': '-', // minus sign U+2212
  '≈': '~',
};
export function winAnsiSafe(s: string): string {
  let out = '';
  for (const c of s) {
    if (c.codePointAt(0)! <= 0xff || CP1252_EXTRA.has(c)) out += c;
    else out += WINANSI_MAP[c] ?? '';
  }
  return out;
}

/** Sanitize every string the guide will draw, in one place. */
function safeGuide(g: Guide): Guide {
  return {
    ...g,
    title: winAnsiSafe(g.title),
    subtitle: winAnsiSafe(g.subtitle),
    tagline: g.tagline ? winAnsiSafe(g.tagline) : g.tagline,
    chapters: g.chapters.map((ch) => ({
      title: winAnsiSafe(ch.title),
      intro: ch.intro ? winAnsiSafe(ch.intro) : ch.intro,
      sections: ch.sections.map((s) => ({
        heading: s.heading ? winAnsiSafe(s.heading) : s.heading,
        body: s.body?.map(winAnsiSafe),
        bullets: s.bullets?.map(winAnsiSafe),
        steps: s.steps?.map(winAnsiSafe),
        callout: s.callout ? winAnsiSafe(s.callout) : s.callout,
      })),
    })),
  };
}

/**
 * Render a professional, book-style guide PDF. Optionally password-protect it
 * and stamp a per-buyer watermark on every page (for sale protection).
 * Returns the PDF as a Uint8Array (works server-side).
 */
export function buildGuide(rawGuide: Guide, opts: BuildOptions = {}): Uint8Array {
  const guide = safeGuide(rawGuide);
  const accent = guide.accent || BLUE;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    ...(opts.password
      ? { encryption: { userPassword: opts.password, ownerPassword: `${opts.password}-owner`, userPermissions: ['print'] } }
      : {}),
  });

  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 20;
  const CW = W - 2 * M;
  let y = M;

  const setText = (c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);
  const setFill = (c: [number, number, number]) => doc.setFillColor(c[0], c[1], c[2]);

  // ── COVER ──────────────────────────────────────────────────────
  setFill(INK);
  doc.rect(0, 0, W, H, 'F');
  // gradient accent bands
  const slices = 40;
  for (let i = 0; i < slices; i++) {
    const t = i / (slices - 1);
    doc.setFillColor(
      Math.round(accent[0] + (PURPLE[0] - accent[0]) * t),
      Math.round(accent[1] + (PURPLE[1] - accent[1]) * t),
      Math.round(accent[2] + (PURPLE[2] - accent[2]) * t)
    );
    doc.rect((W / slices) * i, 0, W / slices + 0.5, 6, 'F');
    doc.rect((W / slices) * i, H - 6, W / slices + 0.5, 6, 'F');
  }
  // decorative rings
  doc.setDrawColor(accent[0], accent[1], accent[2]);
  doc.setLineWidth(0.4);
  doc.circle(W - 26, 52, 16);
  doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.circle(W - 26, 52, 22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  setText(GOLD);
  doc.text('MULESOO DIGITAL SERVICES', M, 40);
  doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.setLineWidth(0.6);
  doc.line(M, 44, M + 40, 44);

  // Title (wrapped, large)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(40);
  setText([240, 243, 250]);
  const titleLines = doc.splitTextToSize(guide.title, CW);
  let ty = 96;
  titleLines.forEach((ln: string) => {
    doc.text(ln, M, ty);
    ty += 16;
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(15);
  setText(BLUE);
  const subLines = doc.splitTextToSize(guide.subtitle, CW);
  ty += 4;
  subLines.forEach((ln: string) => {
    doc.text(ln, M, ty);
    ty += 8;
  });

  if (guide.tagline) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    setText(MUTED);
    ty += 6;
    doc.splitTextToSize(guide.tagline, CW).forEach((ln: string) => {
      doc.text(ln, M, ty);
      ty += 6.5;
    });
  }

  // bottom author block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  setText([240, 243, 250]);
  doc.text('A MuleSoo Premium Guide', M, H - 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  setText(MUTED);
  doc.text('Pretoria, South Africa  ·  www.mulesoo.com', M, H - 18);

  // ── CONTENT PAGES ──────────────────────────────────────────────
  const ensure = (need: number) => {
    if (y + need > H - 22) {
      doc.addPage();
      y = M;
    }
  };
  const para = (text: string, size = 10.5, color = BODY, gap = 4.6) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    setText(color);
    const lines = doc.splitTextToSize(text, CW);
    lines.forEach((ln: string) => {
      ensure(gap);
      doc.text(ln, M, y);
      y += gap;
    });
  };

  // Table of contents
  doc.addPage();
  y = M + 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  setText(INK);
  doc.text('Contents', M, y);
  y += 12;
  guide.chapters.forEach((ch, i) => {
    ensure(8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    setText(accent);
    doc.text(`${i + 1}.`, M, y);
    doc.setFont('helvetica', 'normal');
    setText(INK);
    doc.text(ch.title, M + 8, y);
    y += 7.5;
  });

  // Chapters
  guide.chapters.forEach((ch, i) => {
    doc.addPage();
    y = M;
    // chapter header band
    setFill(accent);
    doc.rect(0, 0, W, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    setText(accent);
    doc.text(`CHAPTER ${i + 1}`, M, y + 4);
    y += 12;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    setText(INK);
    doc.splitTextToSize(ch.title, CW).forEach((ln: string) => {
      doc.text(ln, M, y);
      y += 9;
    });
    y += 2;
    if (ch.intro) {
      para(ch.intro, 11, MUTED, 5);
      y += 3;
    }

    ch.sections.forEach((sec) => {
      if (sec.heading) {
        ensure(12);
        y += 3;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        setText(accent);
        doc.splitTextToSize(sec.heading, CW).forEach((ln: string) => {
          ensure(6.5);
          doc.text(ln, M, y);
          y += 6.5;
        });
        y += 1;
      }
      (sec.body || []).forEach((p) => {
        para(p);
        y += 2.5;
      });
      (sec.bullets || []).forEach((b) => {
        ensure(5.4);
        // The check is DRAWN, not typeset: '✓' (U+2713) is outside WinAnsi and
        // jsPDF printed it as an apostrophe in every sold guide. Vector strokes
        // keep the green checkmark exactly as designed on any viewer.
        doc.setDrawColor(0, 160, 90);
        doc.setLineWidth(0.5);
        doc.setLineCap('round');
        doc.line(M + 0.1, y - 1.3, M + 1.0, y - 0.4);
        doc.line(M + 1.0, y - 0.4, M + 2.7, y - 2.9);
        doc.setLineCap('butt');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        setText(BODY);
        doc.splitTextToSize(b, CW - 7).forEach((ln: string, idx: number) => {
          if (idx > 0) ensure(4.6);
          doc.text(ln, M + 7, y);
          y += 4.6;
        });
        y += 1.4;
      });
      (sec.steps || []).forEach((s, si) => {
        ensure(5.4);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        setText(accent);
        doc.text(`${si + 1}.`, M, y);
        doc.setFont('helvetica', 'normal');
        setText(BODY);
        doc.splitTextToSize(s, CW - 8).forEach((ln: string, idx: number) => {
          if (idx > 0) ensure(4.6);
          doc.text(ln, M + 8, y);
          y += 4.6;
        });
        y += 1.4;
      });
      if (sec.callout) {
        const lines = doc.splitTextToSize(sec.callout, CW - 12);
        const boxH = lines.length * 4.8 + 10;
        ensure(boxH + 3);
        setFill([255, 251, 240]);
        doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.setLineWidth(0.4);
        doc.roundedRect(M, y - 1, CW, boxH, 2, 2, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        setText(GOLD);
        doc.text('TIP', M + 5, y + 5);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        setText([90, 80, 40]);
        let cy = y + 5;
        lines.forEach((ln: string) => {
          doc.text(ln, M + 16, cy);
          cy += 4.8;
        });
        y += boxH + 4;
      }
    });
  });

  // ── FOOTERS + PER-BUYER WATERMARK on every content page ─────────
  const pages = doc.getNumberOfPages();
  for (let p = 2; p <= pages; p++) {
    doc.setPage(p);
    doc.setDrawColor(228, 233, 244);
    doc.setLineWidth(0.3);
    doc.line(M, H - 15, W - M, H - 15);

    // The one-line lockup, centred — the exact arrangement on the corporate ID
    // card, the house style on every client PDF. Sized to sit inside the strip
    // between the divider (H-15) and the 10mm bottom margin, so the licence
    // line can live at the left edge without ever reaching it.
    const GUIDE_CREDIT_W = 46; // h ≈ 3.9mm → top at H-13.9, clear of the divider
    stampAgencyCredit(doc, {
      onDark: false,
      align: 'center',
      compact: true,
      widthMm: GUIDE_CREDIT_W,
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    setText(MUTED);
    doc.text(`${p - 1}`, W - M, H - 9.5, { align: 'right' });
    if (opts.watermark) {
      // Centred BELOW the lockup (the same stack the Terms footer uses) so a
      // long buyer name can never run into the centred credit.
      doc.setFontSize(7);
      setText([170, 180, 198]);
      doc.text(`Licensed to ${opts.watermark} — not for redistribution`, W / 2, H - 6, { align: 'center' });
      // faint diagonal ownership stamp
      doc.setTextColor(232, 236, 244);
      doc.setFontSize(30);
      doc.text(opts.watermark, W / 2, H / 2, { align: 'center', angle: 30 });
    }
  }

  return new Uint8Array(doc.output('arraybuffer') as ArrayBuffer);
}
