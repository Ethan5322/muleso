// MuleSoo Growth Playbook — PDF generator (jsPDF, Node).
// One unified walk() drives BOTH the measure pass (to compute the table of
// contents / page numbers) and the draw pass, so numbering always matches.
import { jsPDF } from 'jspdf';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import blocks from './content.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const C = {
  bg: [5, 8, 16], card: [13, 21, 40], blue: [0, 200, 255], purple: [123, 47, 255],
  gold: [232, 184, 75], ink: [26, 33, 50], text: [40, 46, 60], soft: [110, 122, 145],
  line: [214, 220, 234],
};

const PW = 595.28, PH = 841.89;
const ML = 60, MR = 60, MT = 76, MB = 60;
const CW = PW - ML - MR;

const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
const setFill = (c) => doc.setFillColor(c[0], c[1], c[2]);
const setText = (c) => doc.setTextColor(c[0], c[1], c[2]);
const setDraw = (c) => doc.setDrawColor(c[0], c[1], c[2]);
const wrap = (t, w, size, style = 'normal') => { doc.setFont('helvetica', style); doc.setFontSize(size); return doc.splitTextToSize(t, w); };

const S = {
  h2: { size: 14.5, lh: 19, gb: 15, ga: 7, style: 'bold', color: C.blue },
  h3: { size: 11.5, lh: 16, gb: 11, ga: 4, style: 'bold', color: C.ink },
  p:  { size: 10.5, lh: 15.5, gb: 0, ga: 8, style: 'normal', color: C.text },
  li: { size: 10.5, lh: 15, gb: 0, ga: 4.5, style: 'normal', color: C.text },
  quote: { size: 12.5, lh: 18, gb: 10, ga: 12, style: 'italic', color: C.purple },
};

let OFFSET = 0; // printed-number offset (cover + toc pages), set after measuring

function footer(n) {
  setDraw(C.line); doc.setLineWidth(0.5); doc.line(ML, PH - MB + 20, PW - MR, PH - MB + 20);
  setText(C.soft); doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
  doc.text('MULE•SOO  —  The Growth Playbook', ML, PH - MB + 32);
  doc.text(String(n), PW - MR, PH - MB + 32, { align: 'right' });
}

function partDivider(b, num) {
  setFill(C.bg); doc.rect(0, 0, PW, PH, 'F');
  setFill(C.purple); doc.circle(PW - 50, 70, 120, 'F');
  setFill(C.blue); doc.circle(30, PH - 50, 95, 'F');
  setText(C.gold); doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
  doc.text(`PART ${num}`, ML, PH / 2 - 44);
  setText([240, 242, 250]); doc.setFont('helvetica', 'bold'); doc.setFontSize(30);
  doc.text(wrap(b.title, CW, 30, 'bold'), ML, PH / 2);
  if (b.subtitle) { setText([170, 180, 210]); doc.setFont('helvetica', 'normal'); doc.setFontSize(12); doc.text(wrap(b.subtitle, CW, 12), ML, PH / 2 + 36); }
}

// The unified layout walk. draw=false only measures (returns entries + pages).
function walk(draw) {
  let y = MT, page = 1, chap = 0, part = 0;
  const entries = [];
  const brk = () => { if (draw) { footer(page + OFFSET); doc.addPage(); } page++; y = MT; };
  const ensure = (need) => { if (y + need > PH - MB) brk(); };

  for (const b of blocks) {
    if (b.type === 'part') {
      const fresh = page === 1 && y === MT && chap === 0 && part === 0;
      if (!fresh) { brk(); }               // close current page, land on divider page
      part++;
      entries.push({ kind: 'part', num: part, title: b.title, page });
      if (draw) partDivider(b, part);
      // divider owns this page; next chapter starts fresh (no footer on divider)
      if (draw) doc.addPage(); page++; y = MT;
      continue;
    }
    if (b.type === 'chapter') {
      if (y !== MT) brk();
      chap++;
      entries.push({ kind: 'chapter', num: chap, title: b.title, page });
      if (draw) { setText(C.gold); doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text(`CHAPTER ${chap}`, ML, y); }
      y += 16;
      const tl = wrap(b.title, CW, 22, 'bold');
      if (draw) { setText(C.ink); doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.text(tl, ML, y); }
      y += tl.length * 26 + 6;
      if (draw) { setDraw(C.blue); doc.setLineWidth(2); doc.line(ML, y, ML + 46, y); }
      y += 16;
      if (b.intro) {
        const il = wrap(b.intro, CW, 11, 'italic'); ensure(il.length * 16);
        if (draw) { setText(C.soft); doc.setFont('helvetica', 'italic'); doc.setFontSize(11); doc.text(il, ML, y); }
        y += il.length * 16 + 8;
      }
      continue;
    }
    if (b.type === 'callout') {
      const pad = 12, titleH = b.title ? 16 : 0;
      const bl = wrap(b.text, CW - pad * 2, 10);
      const h = pad * 2 + titleH + bl.length * 14.5;
      ensure(h + 10);
      if (draw) {
        setFill(C.card); setDraw(C.blue); doc.setLineWidth(0.8); doc.roundedRect(ML, y, CW, h, 6, 6, 'FD');
        let ty = y + pad + 9;
        if (b.title) { setText(C.gold); doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text(b.title.toUpperCase(), ML + pad, ty); ty += titleH; }
        setText([212, 220, 236]); doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.text(bl, ML + pad, ty);
      }
      y += h + 12; continue;
    }
    if (S[b.type]) {
      const s = S[b.type]; y += s.gb;
      const w = wrap(b.text, CW, s.size, s.style);
      ensure(w.length * s.lh + (b.type[0] === 'h' ? s.lh : 0));
      if (draw) { setText(s.color); doc.setFont('helvetica', s.style); doc.setFontSize(s.size); doc.text(w, ML, y); }
      y += w.length * s.lh + s.ga; continue;
    }
    if (b.type === 'ul' || b.type === 'ol') {
      y += 2;
      b.items.forEach((it, i) => {
        const s = S.li, indent = 18, bullet = b.type === 'ol' ? `${i + 1}.` : '•';
        const w = wrap(it, CW - indent, s.size);
        ensure(w.length * s.lh + s.ga);
        if (draw) {
          setText(b.type === 'ol' ? C.blue : C.purple); doc.setFont('helvetica', 'bold'); doc.setFontSize(s.size); doc.text(bullet, ML, y);
          setText(s.color); doc.setFont('helvetica', 'normal'); doc.text(w, ML + indent, y);
        }
        y += w.length * s.lh + s.ga;
      });
      y += 4; continue;
    }
  }
  if (draw) footer(page + OFFSET);
  return { entries, pages: page };
}

// ---- pass 1: measure -------------------------------------------------------
const measured = walk(false);
const rows = 32;
const tocPages = Math.max(1, Math.ceil(measured.entries.length / rows));
OFFSET = 1 + tocPages;

// ---- cover -----------------------------------------------------------------
setFill(C.bg); doc.rect(0, 0, PW, PH, 'F');
setFill(C.blue); doc.circle(PW - 30, 80, 130, 'F');
setFill(C.purple); doc.circle(20, PH - 110, 150, 'F');
setText(C.blue); doc.setFont('helvetica', 'bold'); doc.setFontSize(15);
doc.text('MULE', ML, 150); const mw = doc.getTextWidth('MULE');
setText(C.gold); doc.text('•', ML + mw + 4, 150);
setText([240, 242, 250]); doc.text('SOO', ML + mw + 15, 150);
setText(C.gold); doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.text('THE GROWTH PLAYBOOK', ML, 300);
setText([240, 242, 250]); doc.setFont('helvetica', 'bold'); doc.setFontSize(38);
doc.text(wrap('Win Clients. Beat the Competition. Build a Powerful Agency.', CW, 38, 'bold'), ML, 348);
setText([170, 180, 210]); doc.setFont('helvetica', 'normal'); doc.setFontSize(13);
doc.text(wrap('A deep, practical marketing & sales system for a premium tech agency in South Africa — going from zero clients to a booked-out business.', CW, 13), ML, 500);
setDraw(C.blue); doc.setLineWidth(2); doc.line(ML, 560, ML + 60, 560);
setText([120, 132, 158]); doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
doc.text('MuleSoo Digital Services  ·  Pretoria, South Africa', ML, 590);
doc.text('Founder Edition', ML, 608);

// ---- toc -------------------------------------------------------------------
for (let tp = 0; tp < tocPages; tp++) {
  doc.addPage();
  let y = MT;
  if (tp === 0) { setText(C.ink); doc.setFont('helvetica', 'bold'); doc.setFontSize(24); doc.text('Contents', ML, y); y += 30; setDraw(C.blue); doc.setLineWidth(2); doc.line(ML, y, ML + 46, y); y += 24; }
  for (const e of measured.entries.slice(tp * rows, (tp + 1) * rows)) {
    const printed = e.page + OFFSET;
    if (e.kind === 'part') {
      y += 6; setText(C.purple); doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
      doc.text(`PART ${e.num}  ·  ${e.title}`, ML, y);
      setText(C.soft); doc.setFontSize(9); doc.text(String(printed), PW - MR, y, { align: 'right' }); y += 17;
    } else {
      setText(C.text); doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
      doc.text(doc.splitTextToSize(`${e.num}.  ${e.title}`, CW - 40)[0], ML + 10, y);
      setText(C.soft); doc.text(String(printed), PW - MR, y, { align: 'right' }); y += 15.5;
    }
  }
  footer(tp + 2);
}

// ---- pass 2: draw content --------------------------------------------------
doc.addPage(); // first content page (walk starts drawing here as its page 1)
walk(true);

mkdirSync(join(__dirname, '..', '..', 'marketing'), { recursive: true });
const out = join(__dirname, '..', '..', 'marketing', 'MuleSoo-Growth-Playbook.pdf');
writeFileSync(out, Buffer.from(doc.output('arraybuffer')));
console.log('WROTE', out, '— total pages:', doc.getNumberOfPages(), '| chapters:', measured.entries.filter(e => e.kind === 'chapter').length);
