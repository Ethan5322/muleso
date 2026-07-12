/* MuleSoo — የአማርኛ ዕለታዊ የልጥፍ ምስሎች (365 × 1080×1080).
 *
 * The Amharic sibling of make-social-images.cjs: one designed card per day
 * from the Amharic master CSV, same brand look, with the QR credit stamp
 * (scan → mulesoo.com) along the bottom. Headlines set in Noto Sans Ethiopic
 * (variable weight, downloaded to assets/fonts) — Sora and DM Sans carry the
 * Latin; Ethiopic glyphs fall through to Noto. Ethiopic dislikes wide letter
 * tracking, so headings run at natural spacing.
 *
 * Run: node scripts/make-social-images-amharic.cjs
 * Out: marketing/Social-Calendar-Amharic/Images/YYYY-MM/MuleSoo-AM-Day-….jpg
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const ROOT = process.cwd();
const CSV = path.join(ROOT, 'marketing', 'Social-Calendar-Amharic', 'MuleSoo-Social-Calendar-Amharic-365.csv');
const OUT = path.join(ROOT, 'marketing', 'Social-Calendar-Amharic', 'Images');
const FONT_DIR = path.join(ROOT, 'assets', 'fonts');

const SIZE = 1080;

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
// STATIC faces only: Chromium's PDF exporter silently swaps variable fonts for
// Times New Roman, so the Ethiopic faces are static TTFs, one per weight.
const FONTS = [
  ['Sora', '600', 'sora-latin-600-normal.woff2'],
  ['Sora', '800', 'sora-latin-800-normal.woff2'],
  ['DM Sans', '400', 'dm-sans-latin-400-normal.woff2'],
  ['DM Sans', '500', 'dm-sans-latin-500-normal.woff2'],
  ['Noto Ethiopic', '400', 'noto-ethiopic-400-static.ttf'],
  ['Noto Ethiopic', '600', 'noto-ethiopic-600-static.ttf'],
  ['Noto Ethiopic', '800', 'noto-ethiopic-800-static.ttf'],
];
const fontFaces = () =>
  FONTS.map(([family, weight, file]) => {
    const p = path.join(FONT_DIR, file);
    if (!fs.existsSync(p)) throw new Error(`Missing ${file}`);
    const ttf = file.endsWith('.ttf');
    return `@font-face{font-family:'${family}';font-weight:${weight};font-style:normal;font-display:block;
      src:url(data:font/${ttf ? 'ttf' : 'woff2'};base64,${b64(p)}) format('${ttf ? 'truetype' : 'woff2'}');}`;
  }).join('\n');
const STAMP = `data:image/png;base64,${b64(path.join(ROOT, 'public', 'brand', 'mulesoo-credit-stamp-on-dark.png'))}`;

// Amharic pillar chips, brand accents only.
const PILLAR = {
  PROBLEM: { color: '#00C8FF', label: 'ችግሩ' },
  EDUCATE: { color: '#7B2FFF', label: 'እውቀት' },
  PROOF:   { color: '#E8B84B', label: 'ማስረጃ' },
  MYTH:    { color: '#00FF88', label: 'እውነቱ ይነገር' },
  BEHIND:  { color: '#00C8FF', label: 'ከስራችን ጀርባ' },
  PROMO:   { color: '#E8B84B', label: 'ከእኛ ጋር ይስሩ' },
  HUMAN:   { color: '#7B2FFF', label: 'የቢሮ ህይወት' },
};
const PROOF_IMAGE_HOOK = 'እውነተኛ ስራ። እውነተኛ ውጤት።';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function hookOf(rec) {
  let line = (rec.post_text || '').split(/\n/).map((l) => l.trim()).find((l) => l.length > 0) || '';
  if (line.includes('[') || !line) line = PROOF_IMAGE_HOOK;
  line = line.replace(/#\S+/g, '').replace(/https?:\/\/\S+/g, '').trim();
  if (line.length > 120) {
    const cut = line.slice(0, 120);
    line = cut.slice(0, Math.max(cut.lastIndexOf('። '), cut.lastIndexOf(' '))) + '…';
  }
  return line;
}

// Ethiopic glyphs run wider and taller than Latin — sizes step down earlier.
function fontSize(len) {
  if (len <= 30) return 72;
  if (len <= 55) return 60;
  if (len <= 90) return 50;
  return 42;
}

const MONTHS_AM = ['ጃንዋሪ','ፌብሩዋሪ','ማርች','ኤፕሪል','ሜይ','ጁን','ጁላይ','ኦገስት','ሴፕቴምበር','ኦክቶበር','ኖቬምበር','ዲሴምበር'];

function cardHtml(day) {
  const p = PILLAR[day.pillar] || PILLAR.EDUCATE;
  const hook = hookOf(day);
  const [y, m, d] = day.date.split('-');
  const dateLabel = `${MONTHS_AM[Number(m) - 1]} ${Number(d)}፣ ${y}`;

  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces()}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:${SIZE}px;height:${SIZE}px;overflow:hidden;}
body{
  background:
    radial-gradient(ellipse 900px 700px at 12% 8%, ${p.color}26 0%, transparent 55%),
    radial-gradient(ellipse 800px 700px at 92% 88%, #7B2FFF21 0%, transparent 55%),
    #050810;
  font-family:'DM Sans','Noto Ethiopic',sans-serif;color:#F0F2FA;
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
.date{font-family:'Noto Ethiopic','DM Sans';font-weight:500;font-size:20px;color:#A8B2D0;}
.chip{margin-top:84px;align-self:flex-start;position:relative;
  font-family:'Noto Ethiopic','Sora';font-weight:600;font-size:21px;
  color:${p.color};border:2px solid ${p.color}66;background:${p.color}14;
  border-radius:99px;padding:12px 30px;}
.hook{flex:1;display:flex;align-items:center;position:relative;}
.hook h1{font-family:'Sora','Noto Ethiopic';font-weight:800;font-size:${fontSize(hook.length)}px;line-height:1.38;
  max-width:900px;}
.rule{height:3px;width:170px;border-radius:2px;position:relative;
  background:linear-gradient(90deg,${p.color},#7B2FFF);margin-bottom:36px;}
.stamp{position:relative;display:flex;justify-content:space-between;align-items:flex-end;}
.stamp img{width:600px;display:block;}
.scan{font-family:'Noto Ethiopic','DM Sans';font-weight:500;font-size:18px;color:#A8B2D0;padding-bottom:10px;}
.scan b{color:#E8B84B;}
</style></head><body>
  <div class="grid"></div>
  <div class="top">
    <div class="wordmark">MULE<span class="dot"></span>SOO</div>
    <div class="date">ቀን ${esc(day.day_number)} · ${esc(dateLabel)}</div>
  </div>
  <div class="chip">${esc(p.label)}</div>
  <div class="hook"><h1>${esc(hook)}</h1></div>
  <div class="rule"></div>
  <div class="stamp">
    <img src="${STAMP}"/>
    <div class="scan"><b>ይቃኙ</b> · mulesoo.com</div>
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
  const days = records.filter((r) => r.platform === 'LinkedIn')
    .sort((a, b) => a.date.localeCompare(b.date));
  if (days.length !== 365) throw new Error(`expected 365 days, got ${days.length}`);

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
        `MuleSoo-AM-Day-${String(day.day_number).padStart(3, '0')}-${day.date}.jpg`
      );

      await page.setContent(cardHtml(day), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: file, type: 'jpeg', quality: 90 });

      if (++done % 60 === 0) console.log(`  ${done}/365 …`);
    }
    console.log('  365/365 done');
  } finally {
    await browser.close();
  }

  let total = 0, count = 0;
  for (const ym of fs.readdirSync(OUT).sort()) {
    const dir = path.join(OUT, ym);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) { total += fs.statSync(path.join(dir, f)).size; count++; }
  }
  console.log(`\n  ${count} images, ${(total / 1048576).toFixed(1)} MB → marketing/Social-Calendar-Amharic/Images/`);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
