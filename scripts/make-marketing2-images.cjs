/* MuleSoo — Marketing 2: 365 daily post images with the founder in frame.
 *
 * One 1080×1080 card per day, built so the post reads as a person speaking
 * rather than a brand announcing. The founder's portrait sits top-left in a
 * small circular frame with an accent ring, name and handle beside it — the
 * layout of a social post, rendered as the image itself. Below it: the project
 * chip in that project's accent, the day's hook in large Sora, and the project
 * name with its live URL along the bottom next to the MuleSoo QR credit stamp.
 *
 * Why the portrait is small: the reader must trust the face and then read the
 * sentence. A large photo makes the card a headshot with text on it; a small
 * circle makes it a post *by* someone, which is what converts.
 *
 * The accent colour comes from the project, not the pillar — so a scroll
 * through the year reads as twelve recognisable products rather than one
 * undifferentiated feed.
 *
 * Run: node scripts/make-marketing2-images.cjs
 * Out: marketing2/Images/YYYY-MM/MuleSoo2-Day-NNN-YYYY-MM-DD.jpg
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const sharp = require('sharp');

const ROOT = process.cwd();
const CSV = path.join(ROOT, 'marketing2', 'MuleSoo-Marketing2-365.csv');
const OUT = path.join(ROOT, 'marketing2', 'Images');
const FONT_DIR = path.join(ROOT, 'assets', 'fonts');
const PORTRAIT_SRC = path.join(ROOT, 'assets', 'founder', 'founder-portrait.jpg');

const SIZE = 1080;
const AVATAR = 168;           // rendered diameter
const AVATAR_SRC_PX = 420;    // pre-scaled source: sharp on 3× so the ring stays crisp

const FOUNDER = 'Ethan';
const HANDLE = 'MuleSoo Digital Services · Pretoria';

// ── CSV (RFC 4180 — post_text and hooks are quoted and multiline) ───────────
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

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Hook type size. The card has one job — be readable in a feed at thumbnail
 * size — so long hooks step down rather than wrap into a paragraph.
 */
function fontSize(len) {
  if (len <= 45) return 74;
  if (len <= 75) return 64;
  if (len <= 105) return 54;
  if (len <= 140) return 46;
  return 40;
}

function cardHtml(day, portrait) {
  const accent = /^#[0-9A-Fa-f]{6}$/.test(day.accent) ? day.accent : '#00C8FF';
  const hook = day.image_hook || '';
  const building = day.project_state === 'building';
  const url = day.project_url.replace(/^https?:\/\//, '');

  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces()}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:${SIZE}px;height:${SIZE}px;overflow:hidden;}
body{
  background:
    radial-gradient(ellipse 900px 720px at 14% 6%, ${accent}2B 0%, transparent 56%),
    radial-gradient(ellipse 820px 700px at 90% 92%, #7B2FFF1F 0%, transparent 55%),
    #050810;
  font-family:'DM Sans',sans-serif;color:#F0F2FA;
  display:flex;flex-direction:column;padding:64px 72px 52px;position:relative;
  -webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;
}
.grid{position:absolute;inset:0;opacity:0.10;
  background-image:linear-gradient(#1A2640 1px,transparent 1px),linear-gradient(90deg,#1A2640 1px,transparent 1px);
  background-size:72px 72px;
  -webkit-mask-image:radial-gradient(ellipse at 28% 16%, black 24%, transparent 74%);}

/* The author row: portrait, name, handle — a post, not a poster. */
.author{display:flex;align-items:center;gap:24px;position:relative;}
.avatar{width:${AVATAR}px;height:${AVATAR}px;border-radius:50%;flex:none;position:relative;}
.avatar img{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;
  border:4px solid ${accent};
  box-shadow:0 0 0 9px #05081040, 0 0 46px ${accent}59;}
/* Live dot, bottom-right of the circle, the way a presence badge sits. */
.avatar .live{position:absolute;right:6px;bottom:6px;width:26px;height:26px;border-radius:50%;
  background:#00FF88;border:5px solid #050810;box-shadow:0 0 14px #00FF8899;}
.who{display:flex;flex-direction:column;gap:7px;min-width:0;}
.who .name{font-family:'Sora';font-weight:800;font-size:38px;letter-spacing:0.2px;
  display:flex;align-items:center;gap:12px;}
.who .name .mark{font-weight:800;font-size:19px;letter-spacing:2px;color:${accent};
  border:2px solid ${accent}66;background:${accent}14;border-radius:99px;padding:5px 14px;}
.who .handle{font-size:23px;color:#A8B2D0;letter-spacing:0.2px;}
.wordmark{margin-left:auto;font-family:'Sora';font-weight:800;font-size:25px;letter-spacing:2px;
  color:#F0F2FA;align-self:flex-start;padding-top:6px;white-space:nowrap;}
.wordmark .dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#E8B84B;margin:0 4px 3px;}

.chip{margin-top:62px;align-self:flex-start;position:relative;display:flex;align-items:center;gap:12px;
  font-family:'Sora';font-weight:600;font-size:19px;letter-spacing:3.5px;
  color:${accent};border:2px solid ${accent}66;background:${accent}14;
  border-radius:99px;padding:12px 26px;}
.chip .build{font-size:15px;letter-spacing:2px;color:#E8B84B;
  border-left:1px solid ${accent}55;padding-left:12px;}

/* Bottom-anchored: the hook should sit close to the rule that introduces the
   project, not float in the middle with slack on both sides. Short hooks take
   their breathing room from above, where the chip already holds the eye. */
.hook{flex:1;display:flex;align-items:flex-end;padding-bottom:54px;position:relative;}
.hook h1{font-family:'Sora';font-weight:800;font-size:${fontSize(hook.length)}px;line-height:1.24;
  letter-spacing:0.1px;max-width:900px;}

.rule{height:3px;width:180px;border-radius:2px;position:relative;
  background:linear-gradient(90deg,${accent},#7B2FFF);margin-bottom:26px;}
.project{position:relative;display:flex;align-items:baseline;gap:16px;margin-bottom:26px;flex-wrap:wrap;}
.project .pname{font-family:'Sora';font-weight:600;font-size:26px;color:#F0F2FA;}
.project .purl{font-size:21px;color:${accent};letter-spacing:0.3px;}
.stamp{position:relative;display:flex;justify-content:space-between;align-items:flex-end;}
.stamp img{width:560px;display:block;}
.scan{font-weight:500;font-size:17px;letter-spacing:2.5px;color:#A8B2D0;text-transform:uppercase;
  padding-bottom:10px;white-space:nowrap;}
.scan b{color:#E8B84B;}
</style></head><body>
  <div class="grid"></div>

  <div class="author">
    <div class="avatar">
      <img src="${portrait}"/>
      <span class="live"></span>
    </div>
    <div class="who">
      <div class="name">${esc(FOUNDER)} <span class="mark">FOUNDER</span></div>
      <div class="handle">${esc(HANDLE)}</div>
    </div>
    <div class="wordmark">MULE<span class="dot"></span>SOO</div>
  </div>

  <div class="chip">
    ${esc(day.image_kicker.replace(/ · IN BUILD$/, ''))}
    ${building ? '<span class="build">IN BUILD</span>' : ''}
  </div>

  <div class="hook"><h1>${esc(hook)}</h1></div>

  <div class="rule"></div>
  <div class="project">
    <span class="pname">${esc(day.project)}</span>
    <span class="purl">${esc(url)}</span>
  </div>
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
  if (!fs.existsSync(PORTRAIT_SRC)) {
    throw new Error(`Missing founder portrait at assets/founder/founder-portrait.jpg`);
  }
  // Pre-scale once. Inlining the 832 KB original into 365 pages is ~400 MB of
  // base64 pushed through the CDP socket for no visible gain at 168px.
  // A plain cover-crop of a 2048² studio portrait leaves the face small inside
  // a 168px circle, surrounded by suit. Crop to the head-and-collar box first
  // so the face fills the frame the way a profile picture should.
  const FACE_BOX = { left: 325, top: 60, width: 1250, height: 1250 };
  const meta = await sharp(PORTRAIT_SRC).metadata();
  const fits = FACE_BOX.left + FACE_BOX.width <= meta.width
    && FACE_BOX.top + FACE_BOX.height <= meta.height;
  const portraitBuf = await sharp(PORTRAIT_SRC)
    // Fall back to a centre cover-crop if the portrait is ever swapped for a
    // differently sized file — a wrong extract box throws, a fallback does not.
    [fits ? 'extract' : 'resize'](fits ? FACE_BOX : { width: AVATAR_SRC_PX, height: AVATAR_SRC_PX, fit: 'cover' })
    .resize(AVATAR_SRC_PX, AVATAR_SRC_PX, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toBuffer();
  if (!fits) console.log(`  note: portrait is ${meta.width}×${meta.height}, using centre crop`);
  const portrait = `data:image/jpeg;base64,${portraitBuf.toString('base64')}`;
  console.log(`  portrait  ${AVATAR_SRC_PX}px  ${(portraitBuf.length / 1024).toFixed(0)} KB inline`);

  const records = parseCsv(fs.readFileSync(CSV, 'utf8'));
  // One card per day — LinkedIn is simply the row we read the day's metadata
  // from; the hook itself is written for the image, not lifted from a caption.
  const days = records.filter((r) => r.platform === 'LinkedIn')
    .sort((a, b) => a.date.localeCompare(b.date));
  if (days.length !== 365) throw new Error(`expected 365 days, got ${days.length}`);

  const missing = days.filter((d) => !d.image_hook.trim());
  if (missing.length) throw new Error(`${missing.length} days have an empty image_hook`);

  // --limit N renders the first N days only, for proofing the design without
  // waiting out the full year.
  const li = process.argv.indexOf('--limit');
  const limit = li > -1 && process.argv[li + 1] ? Number(process.argv[li + 1]) : days.length;
  const queue = days.slice(0, limit);

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    args: ['--font-render-hinting=none', '--force-color-profile=srgb'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: SIZE, height: SIZE, deviceScaleFactor: 1 });

    let done = 0;
    for (const day of queue) {
      const ym = day.date.slice(0, 7);
      const dir = path.join(OUT, ym);
      fs.mkdirSync(dir, { recursive: true });
      const file = path.join(
        dir,
        `MuleSoo2-Day-${String(day.day_number).padStart(3, '0')}-${day.date}.jpg`
      );

      await page.setContent(cardHtml(day, portrait), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: file, type: 'jpeg', quality: 90 });

      if (++done % 30 === 0) console.log(`  ${done}/${queue.length} …`);
    }
    console.log(`  ${queue.length}/${queue.length} done`);
  } finally {
    await browser.close();
  }

  let total = 0;
  for (const ym of fs.readdirSync(OUT).sort()) {
    const dir = path.join(OUT, ym);
    if (!fs.statSync(dir).isDirectory()) continue;
    const files = fs.readdirSync(dir);
    const bytes = files.reduce((n, f) => n + fs.statSync(path.join(dir, f)).size, 0);
    total += bytes;
    console.log(`  ${ym}  ${String(files.length).padStart(3)} images  ${(bytes / 1048576).toFixed(1)} MB`);
  }
  console.log(`\n  total ${(total / 1048576).toFixed(1)} MB → marketing2/Images/\n`);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
