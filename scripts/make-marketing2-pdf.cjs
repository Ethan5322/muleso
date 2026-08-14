/* MuleSoo — Marketing 2: monthly posting PDFs, picture beside the post.
 *
 * Twelve PDFs, one per month, each laid out for a single job: open today's
 * page, look at the picture you are about to post, copy the caption for the
 * platform you are on, publish, move on.
 *
 * The difference from the first calendar's PDFs is the image. Every day here
 * shows its rendered 1080×1080 card next to the five captions, so nobody has
 * to cross-reference a filename in a folder against a line in a document at
 * 7am. The card is downscaled hard before embedding — a full-resolution JPEG
 * per day would produce a 60 MB PDF that nobody opens on a phone.
 *
 * Requires: node scripts/make-marketing2-calendar.cjs
 *           node scripts/make-marketing2-images.cjs
 *
 * Run: node scripts/make-marketing2-pdf.cjs
 * Out: marketing2/PDF/MuleSoo2-Posts-YYYY-MM-Month.pdf × 12
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const sharp = require('sharp');

const ROOT = process.cwd();
const CSV = path.join(ROOT, 'marketing2', 'MuleSoo-Marketing2-365.csv');
const IMG = path.join(ROOT, 'marketing2', 'Images');
const OUT = path.join(ROOT, 'marketing2', 'PDF');
const FONT_DIR = path.join(ROOT, 'assets', 'fonts');
fs.mkdirSync(OUT, { recursive: true });

const THUMB_PX = 560; // embedded card width — prints crisply at ~55mm

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
const LOCKUP = `data:image/png;base64,${b64(path.join(ROOT, 'public', 'brand', 'mulesoo-credit-on-light.png'))}`;

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const PLATFORM_ORDER = ['LinkedIn', 'Instagram', 'Facebook', 'TikTok', 'X'];
const PLATFORM_HUE = {
  LinkedIn: '#0A66C2', Instagram: '#C13584', Facebook: '#1877F2', TikTok: '#111111', X: '#111111',
};
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function dayHtml(d, thumb) {
  const posts = PLATFORM_ORDER
    .map((p) => d.posts.find((x) => x.platform === p))
    .filter(Boolean)
    .map((p) => `<div class="post">
        <div class="post-head">
          <span class="platform" style="color:${PLATFORM_HUE[p.platform] || '#111'}">${esc(p.platform)}</span>
          <span class="chars">${esc(p.characters)} chars</span>
        </div>
        <div class="body">${esc(p.post_text)}</div>
      </div>`).join('\n');

  const building = d.project_state === 'building';

  return `<section class="day">
    <h2>
      <span class="dnum">Day ${esc(d.day_number)}</span>
      ${esc(d.date)} · ${esc(d.day_of_week)}
      <span class="pillar">${esc(d.pillar)}</span>
      <span class="proj">${esc(d.project)}</span>
      ${building ? '<span class="warn">IN BUILD — do not post as launched</span>' : ''}
    </h2>
    <div class="cols">
      <div class="art">
        ${thumb ? `<img src="${thumb}"/>` : '<div class="missing">card not rendered yet<br>run make-marketing2-images.cjs</div>'}
        <div class="file">${esc(d.image_file)}</div>
      </div>
      <div class="copy">${posts}</div>
    </div>
  </section>`;
}

function monthHtml(monthName, year, days, thumbs) {
  const totalPosts = days.reduce((n, d) => n + d.posts.length, 0);
  const projects = [...new Set(days.map((d) => d.project))];

  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces()}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'DM Sans',sans-serif;color:#0B1220;font-size:9pt;line-height:1.5;}
.cover{height:96vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;page-break-after:always;}
.cover .kicker{font-weight:500;font-size:10pt;letter-spacing:4px;color:rgba(11,18,32,0.55);text-transform:uppercase;}
.cover h1{font-family:'Sora';font-weight:800;font-size:34pt;margin:10px 0 4px;}
.cover .sub{font-size:11pt;color:rgba(11,18,32,0.6);margin-bottom:20px;}
.cover .note{max-width:440px;font-size:8.5pt;color:rgba(11,18,32,0.66);border:1px solid rgba(0,200,255,0.5);border-radius:8px;padding:11px 15px;margin-bottom:14px;text-align:left;}
.cover .note b{color:#0B1220;}
.cover .projects{max-width:460px;font-size:8pt;color:rgba(11,18,32,0.55);margin-bottom:28px;}
.cover img{width:210px;}

.day{margin-bottom:12px;page-break-inside:avoid;}
.day h2{font-family:'Sora';font-weight:800;font-size:11pt;border-bottom:2px solid #00C8FF;
  padding-bottom:3px;margin:12px 0 8px;page-break-after:avoid;display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;}
.day h2 .dnum{color:#7B2FFF;}
.day h2 .pillar{font-family:'DM Sans';font-size:6.5pt;font-weight:500;letter-spacing:1.2px;
  color:rgba(11,18,32,0.5);border:1px solid #D9DEE9;border-radius:99px;padding:1px 7px;}
.day h2 .proj{font-family:'DM Sans';font-size:8pt;font-weight:500;color:#0A66C2;margin-left:auto;}
.day h2 .warn{font-family:'DM Sans';font-size:6.5pt;font-weight:500;color:#8A6510;background:#F6E3B4;border-radius:99px;padding:1px 7px;}

.cols{display:flex;gap:11px;align-items:flex-start;}
.art{flex:0 0 55mm;}
.art img{width:55mm;height:55mm;border-radius:6px;display:block;border:1px solid #D9DEE9;}
.art .file{font-size:6pt;color:rgba(11,18,32,0.45);margin-top:3px;word-break:break-all;line-height:1.3;}
.art .missing{width:55mm;height:55mm;border:1px dashed #C3CBDA;border-radius:6px;display:flex;
  align-items:center;justify-content:center;text-align:center;font-size:7pt;color:rgba(11,18,32,0.4);padding:8px;}
.copy{flex:1;min-width:0;}
.post{border:1px solid #D9DEE9;border-radius:7px;padding:6px 9px;margin-bottom:5px;page-break-inside:avoid;}
.post-head{display:flex;align-items:baseline;gap:8px;margin-bottom:3px;}
.platform{font-family:'Sora';font-weight:800;font-size:8pt;letter-spacing:0.4px;}
.chars{font-size:6.5pt;color:rgba(11,18,32,0.4);margin-left:auto;}
.body{white-space:pre-wrap;font-size:8pt;}
</style></head><body>
  <div class="cover">
    <div class="kicker">Marketing 2 · Project-Led Posting Calendar</div>
    <h1>${esc(monthName)} ${year}</h1>
    <div class="sub">${days.length} days · ${totalPosts} ready-to-copy posts · picture included</div>
    <div class="note">
      <b>How to use this.</b> Find today. Post the picture on the left — the file name is printed
      under it, and the same image lives in <i>marketing2/Images/</i>. Then copy the caption for the
      platform you are posting to. That is the whole routine.<br><br>
      <b>Every post names real work.</b> There are no invented statistics in this document. Where a
      project is still in development it is flagged <i>IN BUILD</i> — never post those as launched.
    </div>
    <div class="projects"><b>Projects this month:</b> ${esc(projects.join(' · '))}</div>
    <img src="${LOCKUP}"/>
  </div>
  ${days.map((d) => dayHtml(d, thumbs.get(d.date))).join('\n')}
</body></html>`;
}

/** OneDrive or an open viewer can hold the target; park the build beside it rather than dying. */
function writePdf(file, buf, locked) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try { fs.writeFileSync(file, buf); return true; }
    catch (e) {
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
  if (!records.length) throw new Error('CSV parsed to zero rows');

  const byDay = new Map();
  for (const r of records) {
    if (!byDay.has(r.date)) {
      byDay.set(r.date, {
        date: r.date, day_of_week: r.day_of_week, day_number: r.day_number,
        pillar: r.pillar, project: r.project, project_state: r.project_state,
        image_file: `MuleSoo2-Day-${String(r.day_number).padStart(3, '0')}-${r.date}.jpg`,
        posts: [],
      });
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
  let missingArt = 0;
  try {
    for (const [ym, days] of [...byMonth.entries()].sort()) {
      days.sort((a, b) => a.date.localeCompare(b.date));
      const [year, mm] = ym.split('-');
      const monthName = MONTHS[Number(mm) - 1];

      // Downscale each card once per month, in parallel — full-size cards would
      // make a PDF too heavy to open on the phone it is meant to be used from.
      const thumbs = new Map();
      await Promise.all(days.map(async (d) => {
        const src = path.join(IMG, ym, d.image_file);
        if (!fs.existsSync(src)) { missingArt++; return; }
        const buf = await sharp(src).resize(THUMB_PX, THUMB_PX, { fit: 'inside' })
          .jpeg({ quality: 78 }).toBuffer();
        thumbs.set(d.date, `data:image/jpeg;base64,${buf.toString('base64')}`);
      }));

      const page = await browser.newPage();
      // A4 at 96dpi minus print margins, so a --preview PNG wraps exactly where
      // the PDF does.
      await page.setViewport({ width: 794 - 91, height: 1123, deviceScaleFactor: 1 });
      await page.setContent(monthHtml(monthName, year, days, thumbs), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);

      // --preview writes a tall PNG of the first month only. Layout faults in a
      // PDF are invisible until someone opens it; this makes them checkable.
      if (process.argv.includes('--preview') && !fs.existsSync(path.join(OUT, 'preview.png'))) {
        await page.screenshot({ path: path.join(OUT, 'preview.png'), fullPage: true });
        console.log(`  preview → ${path.relative(ROOT, path.join(OUT, 'preview.png'))}`);
      }

      const file = path.join(OUT, `MuleSoo2-Posts-${ym}-${monthName}.pdf`);
      const buf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '13mm', bottom: '15mm', left: '12mm', right: '12mm' },
        displayHeaderFooter: true,
        headerTemplate: '<span></span>',
        footerTemplate: `<div style="width:100%;font-size:7pt;color:#8A93A8;
            font-family:Arial;display:flex;justify-content:space-between;padding:0 12mm;">
          <span>MuleSoo Marketing 2 — ${monthName} ${year} · mulesoo.com</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>`,
      });
      await page.close();

      const ok = writePdf(file, buf, locked);
      console.log(`  ${path.basename(file).padEnd(40)} ${String(days.length).padStart(2)} days  ${String((buf.length / 1048576).toFixed(1)).padStart(5)} MB${ok ? '' : '   LOCKED → wrote .NEW.pdf'}`);
    }
  } finally {
    await browser.close();
  }

  console.log(`\n  written to marketing2/PDF/`);
  if (missingArt) {
    console.log(`  ${missingArt} day(s) had no rendered card — run scripts/make-marketing2-images.cjs`);
  }
  if (locked.length) {
    console.log(`\n  ${locked.length} file(s) were open and could not be replaced:`);
    for (const f of locked) console.log(`    ${f}`);
    console.log(`  Close them and re-run; the fresh build is beside each as *.NEW.pdf.`);
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
