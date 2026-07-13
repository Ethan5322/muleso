/* MuleSoo — daily social post images.
 *
 * One designed 1080×1080 card per calendar day (365 total), generated from the
 * master CSV: the day's LinkedIn hook line set large in the brand look — deep
 * #050810, radial glows, grid whisper, pillar chip — with the MuleSoo QR credit
 * stamp (scan → mulesoo.com) along the bottom. Square posts everywhere:
 * Instagram, Facebook, LinkedIn, X and TikTok all accept 1:1.
 *
 * PROOF-template days never show bracketed placeholder text: if the hook
 * carries a [bracket] it falls back to a neutral pillar line. JPEG q90 keeps
 * the whole year around ~50MB so it can live in the repo like the PDFs do.
 *
 * Run: node scripts/make-social-images.cjs
 * Out: marketing/Social-Calendar/Images/YYYY-MM/MuleSoo-Day-NNN-YYYY-MM-DD.jpg
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const ROOT = process.cwd();
const CSV = path.join(ROOT, 'marketing', 'Social-Calendar', 'MuleSoo-Social-Calendar-365.csv');
const OUT = path.join(ROOT, 'marketing', 'Social-Calendar', 'Images');
const FONT_DIR = path.join(ROOT, 'assets', 'fonts');

const SIZE = 1080;

// ── CSV (RFC 4180, multiline quoted post_text) ──────────────────────────────
function parseCsv(text) {
  text = text.replace(/^﻿/, '');
  const rows = [];
  let row = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQ = false;
      } else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  const header = rows.shift();
  return rows.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

const b64 = (p) => fs.readFileSync(p).toString('base64');
const FONTS = [
  ['Sora', 600, 'sora-latin-600-normal.woff2'],
  ['Sora', 800, 'sora-latin-800-normal.woff2'],
  ['DM Sans', 400, 'dm-sans-latin-400-normal.woff2'],
  ['DM Sans', 500, 'dm-sans-latin-500-normal.woff2'],
];
const fontFaces = () =>
  FONTS.map(([family, weight, file]) => {
    const p = path.join(FONT_DIR, file);
    if (!fs.existsSync(p)) throw new Error(`Missing ${file} — see assets/fonts/README.md`);
    return `@font-face{font-family:'${family}';font-weight:${weight};font-style:normal;font-display:block;
      src:url(data:font/woff2;base64,${b64(p)}) format('woff2');}`;
  }).join('\n');
const STAMP = `data:image/png;base64,${b64(path.join(ROOT, 'public', 'brand', 'mulesoo-credit-stamp-on-dark.png'))}`;

// Brand accents only — one per pillar so the feed rotates without leaving the palette.
const PILLAR = {
  PROBLEM: { color: '#00C8FF', label: 'THE PROBLEM' },
  EDUCATE: { color: '#7B2FFF', label: 'KNOW-HOW' },
  PROOF:   { color: '#E8B84B', label: 'PROOF' },
  MYTH:    { color: '#00FF88', label: 'MYTH VS FACT' },
  BEHIND:  { color: '#00C8FF', label: 'BEHIND THE BUILD' },
  PROMO:   { color: '#E8B84B', label: 'WORK WITH US' },
  HUMAN:   { color: '#7B2FFF', label: 'AGENCY LIFE' },
};
const FALLBACK_HOOK = {
  PROOF: 'Real work. Real businesses. Real results.',
};

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * First strong line of the post, split into an optional attribution label and
 * the headline itself.
 *
 * A quotation set alone in 72px type is read as the poster's own opinion — so
 * "We are too small for automation" would look like MuleSoo's view rather than
 * the myth the post exists to demolish. Any quoted line therefore carries a
 * visible label above it saying whose words these are, and the "Myth:" style
 * lead-in is lifted out of the headline so the quote itself stays the visual.
 */
function hookOf(rec) {
  let line = (rec.post_text || '').split(/\n/).map((l) => l.trim()).find((l) => l.length > 0) || '';
  if (line.includes('[') || !line) line = FALLBACK_HOOK[rec.pillar] || 'World-class digital, built in Pretoria.';
  line = line.replace(/#\S+/g, '').replace(/https?:\/\/\S+/g, '').trim();

  let attrib = null;
  // Lift a lead-in ("A myth we hear constantly:", "Myth:") off the front of a quote.
  const lead = line.match(/^(.*?:)\s*(["“«].*)$/);
  if (rec.pillar === 'MYTH') {
    attrib = 'WHAT PEOPLE SAY';
    if (lead) line = lead[2];
  } else if (/^["“«]/.test(line)) {
    attrib = 'OVERHEARD';
  }

  if (line.length > 150) {
    const cut = line.slice(0, 150);
    line = cut.slice(0, Math.max(cut.lastIndexOf('. '), cut.lastIndexOf(' '))) + '…';
  }
  return { line, attrib };
}

function fontSize(len) {
  if (len <= 42) return 76;
  if (len <= 80) return 62;
  if (len <= 115) return 52;
  return 44;
}

// No date is printed on the card: the post must be usable on any day. The
// calendar lives in the folder and file names, not in the artwork.

function cardHtml(day) {
  const p = PILLAR[day.pillar] || PILLAR.EDUCATE;
  const { line: hook, attrib } = hookOf(day);

  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces()}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:${SIZE}px;height:${SIZE}px;overflow:hidden;}
body{
  background:
    radial-gradient(ellipse 900px 700px at 12% 8%, ${p.color}26 0%, transparent 55%),
    radial-gradient(ellipse 800px 700px at 92% 88%, #7B2FFF21 0%, transparent 55%),
    #050810;
  font-family:'DM Sans',sans-serif;color:#F0F2FA;
  display:flex;flex-direction:column;padding:72px 78px 56px;
  position:relative;
  -webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;
}
.grid{position:absolute;inset:0;opacity:0.10;
  background-image:linear-gradient(#1A2640 1px,transparent 1px),linear-gradient(90deg,#1A2640 1px,transparent 1px);
  background-size:72px 72px;
  -webkit-mask-image:radial-gradient(ellipse at 30% 20%, black 25%, transparent 75%);}
.top{display:flex;justify-content:space-between;align-items:center;position:relative;}
.wordmark{font-family:'Sora';font-weight:800;font-size:26px;letter-spacing:2px;}
.wordmark .dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#E8B84B;margin:0 4px 3px;}
.chip{margin-top:84px;align-self:flex-start;position:relative;
  font-family:'Sora';font-weight:600;font-size:19px;letter-spacing:4px;
  color:${p.color};border:2px solid ${p.color}66;background:${p.color}14;
  border-radius:99px;padding:12px 28px;}
.hook{flex:1;display:flex;flex-direction:column;justify-content:center;position:relative;}
.attrib{font-family:'Sora';font-weight:600;font-size:20px;letter-spacing:4px;
  color:#A8B2D0;text-transform:uppercase;margin-bottom:20px;
  display:flex;align-items:center;gap:14px;}
.attrib::after{content:'';height:1px;width:70px;background:#A8B2D0;opacity:0.45;}
.hook h1{font-family:'Sora';font-weight:800;font-size:${fontSize(hook.length)}px;line-height:1.22;
  letter-spacing:0.2px;max-width:880px;}
.rule{height:3px;width:170px;border-radius:2px;position:relative;
  background:linear-gradient(90deg,${p.color},#7B2FFF);margin-bottom:36px;}
.stamp{position:relative;display:flex;justify-content:space-between;align-items:flex-end;}
.stamp img{width:600px;display:block;}
.scan{font-weight:500;font-size:17px;letter-spacing:2.5px;color:#A8B2D0;text-transform:uppercase;
  padding-bottom:10px;}
.scan b{color:#E8B84B;}
</style></head><body>
  <div class="grid"></div>
  <div class="top">
    <div class="wordmark">MULE<span class="dot"></span>SOO</div>
  </div>
  <div class="chip">${esc(p.label)}</div>
  <div class="hook">
    ${attrib ? `<div class="attrib">${esc(attrib)}</div>` : ''}
    <h1>${esc(hook)}</h1>
  </div>
  <div class="rule"></div>
  <div class="stamp">
    <img src="${STAMP}"/>
    <div class="scan"><b>Scan</b> · mulesoo.com</div>
  </div>
</body></html>`;
}

function findChrome() {
  const c = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean);
  const hit = c.find((p) => fs.existsSync(p));
  if (!hit) throw new Error('No Chrome found. Set CHROME_PATH.');
  return hit;
}

(async () => {
  const records = parseCsv(fs.readFileSync(CSV, 'utf8'));
  // LinkedIn carries the cleanest, insight-first copy — it is the hook source.
  const days = records.filter((r) => r.platform === 'LinkedIn')
    .sort((a, b) => a.date.localeCompare(b.date));
  if (days.length !== 365) throw new Error(`expected 365 LinkedIn days, got ${days.length}`);

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    args: ['--font-render-hinting=none', '--force-color-profile=srgb'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: SIZE, height: SIZE, deviceScaleFactor: 1 });

    let done = 0;
    for (const day of days) {
      const ym = day.date.slice(0, 7);
      const dir = path.join(OUT, ym);
      fs.mkdirSync(dir, { recursive: true });
      const file = path.join(
        dir,
        `MuleSoo-Day-${String(day.day_number).padStart(3, '0')}-${day.date}.jpg`
      );

      await page.setContent(cardHtml(day), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: file, type: 'jpeg', quality: 90 });

      if (++done % 30 === 0) console.log(`  ${done}/365 …`);
    }
    console.log(`  365/365 done`);
  } finally {
    await browser.close();
  }

  // Size report per month
  let total = 0;
  for (const ym of fs.readdirSync(OUT).sort()) {
    const dir = path.join(OUT, ym);
    if (!fs.statSync(dir).isDirectory()) continue;
    const files = fs.readdirSync(dir);
    const bytes = files.reduce((n, f) => n + fs.statSync(path.join(dir, f)).size, 0);
    total += bytes;
    console.log(`  ${ym}  ${String(files.length).padStart(3)} images  ${(bytes / 1048576).toFixed(1)} MB`);
  }
  console.log(`\n  total ${(total / 1048576).toFixed(1)} MB → marketing/Social-Calendar/Images/`);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
