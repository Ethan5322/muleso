/* MuleSoo — የአማርኛ መርሃ ግብር → ወርሃዊ PDF (12 files).
 *
 * The Amharic sibling of make-social-calendar-pdf.cjs: each day lists all five
 * platform posts as SELECTABLE text so a post can be copied straight out of
 * the PDF and published. Ethiopic set in Noto Sans Ethiopic; the English
 * edition and its PDFs are untouched.
 *
 * Run: node scripts/make-social-calendar-amharic-pdf.cjs
 * Out: marketing/Social-Calendar-Amharic/PDF/MuleSoo-Amharic-Posts-….pdf × 12
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const ROOT = process.cwd();
const CSV = path.join(ROOT, 'marketing', 'Social-Calendar-Amharic', 'MuleSoo-Social-Calendar-Amharic-365.csv');
const OUT = path.join(ROOT, 'marketing', 'Social-Calendar-Amharic', 'PDF');
const FONT_DIR = path.join(ROOT, 'assets', 'fonts');
fs.mkdirSync(OUT, { recursive: true });

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
const LOCKUP = `data:image/png;base64,${b64(path.join(ROOT, 'public', 'brand', 'mulesoo-credit-on-light.png'))}`;

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const PLATFORM_ORDER = ['LinkedIn', 'Instagram', 'Facebook', 'TikTok', 'X'];
const PLATFORM_HUE = {
  LinkedIn: '#0A66C2', Instagram: '#C13584', Facebook: '#1877F2', TikTok: '#111111', X: '#111111',
};
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_AM = ['ጃንዋሪ','ፌብሩዋሪ','ማርች','ኤፕሪል','ሜይ','ጁን','ጁላይ','ኦገስት','ሴፕቴምበር','ኦክቶበር','ኖቬምበር','ዲሴምበር'];

function monthHtml(mIdx, year, days) {
  const totalPosts = days.reduce((n, d) => n + d.posts.length, 0);

  const dayBlocks = days.map((d) => {
    const posts = PLATFORM_ORDER
      .map((p) => d.posts.find((x) => x.platform === p))
      .filter(Boolean)
      .map((p) => {
        const proof = p.needs_real_result === 'yes' || p.pillar === 'PROOF';
        return `<div class="post ${proof ? 'proof' : ''}">
          <div class="post-head">
            <span class="platform" style="color:${PLATFORM_HUE[p.platform] || '#111'}">${esc(p.platform)}</span>
            <span class="pillar">${esc(p.pillar)}</span>
            ${proof ? '<span class="warn">አብነት ነው — ከመለጠፉ በፊት እውነተኛ የደንበኛ ውጤት ያስገቡ</span>' : ''}
            <span class="chars">${esc(p.characters)} ፊደላት</span>
          </div>
          <div class="body">${esc(p.post_text)}</div>
        </div>`;
      }).join('\n');

    return `<section class="day">
      <h2><span class="dnum">ቀን ${esc(d.day_number)}</span> ${esc(d.date)} · ${esc(d.day_of_week)}</h2>
      ${posts}
    </section>`;
  }).join('\n');

  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces()}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'DM Sans','Noto Ethiopic',sans-serif;color:#0B1220;font-size:9.5pt;line-height:1.6;}
.cover{height:96vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;page-break-after:always;}
.cover .kicker{font-family:'Noto Ethiopic';font-weight:500;font-size:11pt;color:rgba(11,18,32,0.55);}
.cover h1{font-family:'Sora','Noto Ethiopic';font-weight:800;font-size:30pt;margin:10px 0 4px;}
.cover .sub{font-family:'Noto Ethiopic';font-size:11pt;color:rgba(11,18,32,0.6);margin-bottom:22px;}
.cover .note{max-width:440px;font-family:'Noto Ethiopic';font-size:9pt;color:rgba(11,18,32,0.62);
  border:1px solid rgba(232,184,75,0.6);border-radius:8px;padding:10px 14px;margin-bottom:34px;}
.cover img{width:220px;}
.day{margin-bottom:14px;}
.day h2{font-family:'Sora','Noto Ethiopic';font-weight:800;font-size:12pt;border-bottom:2px solid #E8B84B;
  padding-bottom:3px;margin:14px 0 8px;page-break-after:avoid;}
.day h2 .dnum{color:#7B2FFF;margin-right:8px;}
.post{border:1px solid #D9DEE9;border-radius:8px;padding:8px 10px;margin-bottom:7px;page-break-inside:avoid;}
.post.proof{border-color:#E8B84B;background:#FEFAF0;}
.post-head{display:flex;align-items:baseline;gap:8px;margin-bottom:5px;flex-wrap:wrap;}
.platform{font-family:'Sora';font-weight:800;font-size:9pt;letter-spacing:0.5px;}
.pillar{font-size:7pt;font-weight:500;letter-spacing:1.2px;color:rgba(11,18,32,0.5);border:1px solid #D9DEE9;border-radius:99px;padding:1px 7px;}
.warn{font-family:'Noto Ethiopic';font-size:7pt;font-weight:500;color:#8A6510;background:#F6E3B4;border-radius:99px;padding:1px 7px;}
.chars{font-family:'Noto Ethiopic';font-size:7pt;color:rgba(11,18,32,0.4);margin-left:auto;}
.body{white-space:pre-wrap;font-family:'Noto Ethiopic','DM Sans';font-size:9pt;}
</style></head><body>
  <div class="cover">
    <div class="kicker">የማህበራዊ ሚዲያ የልጥፍ መርሃ ግብር — አማርኛ</div>
    <h1>${esc(MONTHS_AM[mIdx])} ${year}</h1>
    <div class="sub">${days.length} ቀናት · ${totalPosts} ዝግጁ ልጥፎች · LinkedIn፣ Instagram፣ Facebook፣ TikTok፣ X</div>
    <div class="note"><b>ወርቃማ ቀለም ያላቸው ልጥፎች አብነቶች ናቸው።</b> እነሱ የ PROOF ቀናት ናቸው — በቅንፍ ውስጥ ያለውን
    መስመር በእውነተኛ የደንበኛ ውጤት ይተኩ። በጭራሽ አይፍጠሩ። ሌሎቹ ሁሉ እንዳሉ ተገልብጠው ሊለጠፉ ይችላሉ።</div>
    <img src="${LOCKUP}"/>
  </div>
  ${dayBlocks}
</body></html>`;
}

/**
 * Write over a path a viewer or OneDrive may be holding open. Retry, and if the
 * file is genuinely locked, park the new build beside it rather than aborting
 * the whole year's build half-way through.
 */
function writePdf(file, buf, locked) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      fs.writeFileSync(file, buf);
      return true;
    } catch (e) {
      if (e.code !== 'EBUSY' && e.code !== 'EPERM') throw e;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 400);
    }
  }
  fs.writeFileSync(file.replace(/\.pdf$/, '.NEW.pdf'), buf);
  locked.push(path.basename(file));
  return false;
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
  const byDay = new Map();
  for (const r of records) {
    if (!byDay.has(r.date)) {
      byDay.set(r.date, { date: r.date, day_of_week: r.day_of_week, day_number: r.day_number, posts: [] });
    }
    byDay.get(r.date).posts.push(r);
  }
  const byMonth = new Map();
  for (const day of byDay.values()) {
    const m = day.date.slice(0, 7);
    if (!byMonth.has(m)) byMonth.set(m, []);
    byMonth.get(m).push(day);
  }

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    args: ['--font-render-hinting=none', '--force-color-profile=srgb'],
  });

  const locked = [];
  try {
    for (const [ym, days] of [...byMonth.entries()].sort()) {
      days.sort((a, b) => a.date.localeCompare(b.date));
      const [year, mm] = ym.split('-');
      const mIdx = Number(mm) - 1;

      const page = await browser.newPage();
      await page.setContent(monthHtml(mIdx, year, days), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);

      const file = path.join(OUT, `MuleSoo-Amharic-Posts-${ym}-${MONTHS_EN[mIdx]}.pdf`);
      const buf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '14mm', bottom: '16mm', left: '13mm', right: '13mm' },
        displayHeaderFooter: true,
        headerTemplate: '<span></span>',
        footerTemplate: `<div style="width:100%;font-size:7pt;color:#8A93A8;
            font-family:Arial;display:flex;justify-content:space-between;padding:0 13mm;">
          <span>MuleSoo — ${MONTHS_EN[mIdx]} ${year} Amharic posting calendar · mulesoo.com</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>`,
      });
      await page.close();

      const ok = writePdf(file, buf, locked);
      const kb = (buf.length / 1024).toFixed(0);
      console.log(`  ${path.basename(file).padEnd(44)} ${String(days.length).padStart(2)} days  ${kb.padStart(5)} KB${ok ? '' : '   LOCKED → wrote .NEW.pdf'}`);
    }
  } finally {
    await browser.close();
  }

  console.log(`\n  written to marketing/Social-Calendar-Amharic/PDF/`);
  if (locked.length) {
    console.log(`\n  ${locked.length} file(s) were open and could not be replaced:`);
    for (const f of locked) console.log(`    ${f}`);
    console.log(`  Close them and re-run; the fresh build is beside each as *.NEW.pdf.`);
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
