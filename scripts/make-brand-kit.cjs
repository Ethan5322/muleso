/* MuleSoo brand kit — corporate business card (ATM/CR80) + banner.
 *
 * Rendered in headless Chrome so the real brand faces (Sora, DM Sans) are used.
 * The old sharp/librsvg pipeline silently fell back to Segoe UI, which is most
 * of why the output looked like a template.
 *
 * Design rules held here:
 *   - Asymmetric, left-anchored composition. No centred stacks.
 *   - One accent (gold). Blue lives in the logo mark, nowhere else.
 *   - No full-bleed gradient bars, no decorative circles, no service lists.
 *   - Depth comes from the background, not from ornament.
 *
 * Print:  3mm bleed + 4mm safe zone. PDFs carry crop marks in a 5mm slug and
 *         use CMYK-reachable inks (the neon #00C8FF is far out of gamut and
 *         would print as a muddy cyan, so type/rules use a deeper blue).
 *
 * Run: node scripts/make-brand-kit.cjs
 * Out: marketing/MuleSoo-Brand-Kit/{Business-Card,Banner}/
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const QRCode = require('qrcode');
const { jsPDF } = require('jspdf');
const puppeteer = require('puppeteer-core');

// ── paths ───────────────────────────────────────────────────────────────────
const ROOT = process.cwd();
const KIT = path.join(ROOT, 'marketing', 'MuleSoo-Brand-Kit');
const CARD_DIR = path.join(KIT, 'Business-Card');
const BAN_DIR = path.join(KIT, 'Banner');
const FONT_DIR = path.join(ROOT, 'assets', 'fonts');
fs.mkdirSync(CARD_DIR, { recursive: true });
fs.mkdirSync(BAN_DIR, { recursive: true });

// ── geometry ────────────────────────────────────────────────────────────────
const CARD_DPI = 600;
const BAN_DPI = 300;
const mmToPx = (mm, dpi) => Math.round((mm * dpi) / 25.4);

const BLEED_MM = 3;
const SAFE_MM = 4; // no text within this of the trim line
const SLUG_MM = 5; // white margin in the PDF that carries the crop marks

const CARD_TRIM = { w: 85.6, h: 54 };
const BAN_TRIM = { w: 300, h: 100 };

// ── ink ─────────────────────────────────────────────────────────────────────
// Screen brand colours, pulled to values that survive a CMYK conversion.
const INK = '#0B1220'; // deep navy field (rich black on press)
const INK_DEEP = '#070C16';
const INK_LIFT = '#0E1830';
const GOLD = '#E8B84B';
const GOLD_DIM = 'rgba(232,184,75,0.42)';
const BLUE_PRINT = '#2AA7DE'; // #00C8FF is out of CMYK gamut; this is not
const TEXT = '#EDEFF5';
const MUTED = '#95A0BC';

// ── assets ──────────────────────────────────────────────────────────────────
const b64 = (p) => fs.readFileSync(p).toString('base64');
const LOGO = `data:image/png;base64,${b64('public/mulesoo-logo-transparent.png')}`; // 1000×216
const ICON = `data:image/png;base64,${b64('public/mulesoo-logo-icon.png')}`; // 400×400
const LOGO_RATIO = 216 / 1000;

const FONTS = [
  ['Sora', 400, 'sora-latin-400-normal.woff2'],
  ['Sora', 600, 'sora-latin-600-normal.woff2'],
  ['Sora', 700, 'sora-latin-700-normal.woff2'],
  ['Sora', 800, 'sora-latin-800-normal.woff2'],
  ['DM Sans', 400, 'dm-sans-latin-400-normal.woff2'],
  ['DM Sans', 500, 'dm-sans-latin-500-normal.woff2'],
  ['DM Sans', 700, 'dm-sans-latin-700-normal.woff2'],
];

function fontFaces() {
  return FONTS.map(([family, weight, file]) => {
    const p = path.join(FONT_DIR, file);
    if (!fs.existsSync(p)) throw new Error(`Missing font ${file}. See assets/fonts/README.md`);
    return `@font-face{font-family:'${family}';font-weight:${weight};font-style:normal;font-display:block;
      src:url(data:font/woff2;base64,${b64(p)}) format('woff2');}`;
  }).join('\n');
}

/** Shared page chrome. `dpi` lets each artboard size itself in millimetres. */
function shell(dpi, wPx, hPx, body, extraCss = '') {
  const u = (mm) => `${mmToPx(mm, dpi)}px`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces()}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:${wPx}px;height:${hPx}px;}
body{
  font-family:'DM Sans',sans-serif;
  -webkit-font-smoothing:antialiased;
  text-rendering:geometricPrecision;
  color:${TEXT};
  position:relative;
  overflow:hidden;
  /* Depth without ornament: a soft directional field, one cool lift, one warm
     lift, a fine engraved texture, and a vignette to seat the edges. */
  background:
    radial-gradient(120% 90% at 8% 4%, rgba(42,167,222,0.13), transparent 58%),
    radial-gradient(90% 80% at 96% 98%, rgba(232,184,75,0.07), transparent 62%),
    linear-gradient(158deg, ${INK_LIFT} 0%, ${INK} 48%, ${INK_DEEP} 100%);
}
/* engraved silk: hairlines at a print-visible pitch, almost subliminal */
body::before{
  content:'';position:absolute;inset:0;pointer-events:none;
  background:repeating-linear-gradient(-38deg,
    rgba(255,255,255,0.020) 0 1px, transparent 1px ${u(0.62)});
}
/* vignette seats the artwork so the dark field doesn't read as flat black */
body::after{
  content:'';position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse 78% 74% at 50% 46%, transparent 52%, rgba(0,0,0,0.34) 100%);
}
.safe{position:absolute;inset:${u(BLEED_MM + SAFE_MM)};z-index:2;display:flex;}
.rule{background:${GOLD};border-radius:${u(0.2)};}
/* Sora's latin subset carries no U+2022, so the wordmark dot is drawn, not set. */
.dot{display:inline-block;border-radius:50%;background:${GOLD};vertical-align:middle;}
${extraCss}
</style></head><body>${body}</body></html>`;
}

// ── card front: the mark, air, one hairline ─────────────────────────────────
function cardFront(dpi) {
  const w = mmToPx(CARD_TRIM.w + BLEED_MM * 2, dpi);
  const h = mmToPx(CARD_TRIM.h + BLEED_MM * 2, dpi);
  const u = (mm) => `${mmToPx(mm, dpi)}px`;
  const logoW = 44;

  const body = `
  <div class="safe" style="flex-direction:column;justify-content:center;align-items:flex-start;">
    <img src="${LOGO}" style="width:${u(logoW)};height:${u(logoW * LOGO_RATIO)};display:block;"/>
    <div class="rule" style="width:${u(11)};height:${u(0.4)};margin:${u(5.6)} 0 ${u(3.4)} ${u(0.8)};"></div>
    <div style="font-family:'DM Sans';font-weight:500;font-size:${u(2.5)};
                letter-spacing:${u(0.38)};text-transform:uppercase;color:${MUTED};
                padding-left:${u(0.8)};">Digital&nbsp;Services</div>
  </div>`;
  return { html: shell(dpi, w, h, body), w, h };
}

// ── card back: name, contact, QR ────────────────────────────────────────────
function cardBack(dpi, qr) {
  const w = mmToPx(CARD_TRIM.w + BLEED_MM * 2, dpi);
  const h = mmToPx(CARD_TRIM.h + BLEED_MM * 2, dpi);
  const u = (mm) => `${mmToPx(mm, dpi)}px`;

  // One uniform gold tick per line — not four different colours.
  const line = (t, strong = false) => `
    <div style="display:flex;align-items:center;gap:${u(2.2)};">
      <span style="width:${u(1.5)};height:${u(0.3)};background:${GOLD_DIM};flex:none;"></span>
      <span style="font-family:'DM Sans';font-weight:${strong ? 500 : 400};
                   font-size:${u(2.5)};color:${strong ? TEXT : MUTED};
                   white-space:nowrap;">${t}</span>
    </div>`;

  const body = `
  <div class="safe" style="align-items:stretch;justify-content:space-between;">
    <div style="display:flex;flex-direction:column;">
      <div style="display:flex;align-items:center;gap:${u(2.2)};">
        <img src="${ICON}" style="width:${u(6.8)};height:${u(6.8)};display:block;"/>
        <div>
          <div style="font-family:'Sora';font-weight:800;font-size:${u(3.8)};
                      letter-spacing:${u(0.06)};line-height:1;color:${TEXT};">MULE<span
                      class="dot" style="width:${u(0.72)};height:${u(0.72)};
                      margin:0 ${u(0.85)} ${u(0.5)} ${u(0.85)};"></span>SOO</div>
          <div style="font-family:'DM Sans';font-weight:500;font-size:${u(1.5)};
                      letter-spacing:${u(0.34)};text-transform:uppercase;
                      color:${BLUE_PRINT};margin-top:${u(1.0)};">Digital&nbsp;Services</div>
        </div>
      </div>

      <div style="margin-top:${u(5.6)};">
        <div style="font-family:'Sora';font-weight:700;font-size:${u(4.6)};
                    letter-spacing:${u(-0.05)};line-height:1.05;color:${TEXT};">Ena Muluken</div>
        <div style="font-family:'DM Sans';font-weight:500;font-size:${u(2.15)};
                    letter-spacing:${u(0.38)};text-transform:uppercase;color:${GOLD};
                    margin-top:${u(1.7)};">Founder &amp; CEO</div>
      </div>

      <div style="display:flex;flex-direction:column;gap:${u(1.9)};margin-top:${u(4.6)};">
        ${line('+27 68 852 9333', true)}
        ${line('hello@mulesoo.com', true)}
        ${line('www.mulesoo.com')}
        ${line('Pretoria, South Africa')}
      </div>
    </div>

    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
      <div style="background:#ffffff;padding:${u(2.0)};border-radius:${u(1.3)};">
        <img src="${qr}" style="width:${u(17.5)};height:${u(17.5)};display:block;"/>
      </div>
      <div style="font-family:'DM Sans';font-weight:500;font-size:${u(1.5)};
                  letter-spacing:${u(0.34)};text-transform:uppercase;color:${MUTED};
                  margin-top:${u(2.2)};">Scan to visit</div>
    </div>
  </div>`;
  return { html: shell(dpi, w, h, body), w, h };
}

// ── banner ──────────────────────────────────────────────────────────────────
function banner(dpi, qr) {
  const w = mmToPx(BAN_TRIM.w + BLEED_MM * 2, dpi);
  const h = mmToPx(BAN_TRIM.h + BLEED_MM * 2, dpi);
  const u = (mm) => `${mmToPx(mm, dpi)}px`;

  const dot = `<span class="dot" style="width:${u(0.7)};height:${u(0.7)};
    opacity:0.5;margin:0 ${u(3.4)};"></span>`;

  const body = `
  <div class="safe" style="align-items:center;justify-content:flex-start;">
    <div style="display:flex;flex-direction:column;justify-content:center;flex:none;">
      <img src="${LOGO}" style="width:${u(76)};height:${u(76 * LOGO_RATIO)};display:block;
                                margin-bottom:${u(7.6)};"/>
      <div style="font-family:'Sora';font-weight:700;font-size:${u(8.4)};line-height:1.2;
                  letter-spacing:${u(-0.09)};color:${TEXT};">
        World-Class Websites, AI Chatbots<br/>&amp; Auto Pilot Systems
      </div>
      <div class="rule" style="width:${u(20)};height:${u(0.6)};margin:${u(5.8)} 0 ${u(5.0)} 0;"></div>
      <div style="font-family:'DM Sans';font-weight:400;font-size:${u(4.3)};color:${MUTED};
                  margin-bottom:${u(4.2)};">Built in Pretoria — serving businesses across Africa</div>
      <div style="font-family:'DM Sans';font-weight:500;font-size:${u(4.1)};color:${TEXT};
                  display:flex;align-items:center;">
        www.mulesoo.com${dot}hello@mulesoo.com${dot}+27 68 852 9333
      </div>
    </div>

    <!-- The 3:1 ratio leaves a void between the columns; a hairline gives the
         eye a reason for it instead of letting it read as unfinished. -->
    <div style="flex:1;display:flex;justify-content:center;align-self:stretch;align-items:center;">
      <div style="width:${u(0.3)};height:66%;background:linear-gradient(180deg,
        transparent, rgba(232,184,75,0.30) 22%, rgba(232,184,75,0.30) 78%, transparent);"></div>
    </div>

    <div style="display:flex;flex-direction:column;align-items:center;flex:none;">
      <div style="background:#ffffff;padding:${u(3.0)};border-radius:${u(2.0)};">
        <img src="${qr}" style="width:${u(34)};height:${u(34)};display:block;"/>
      </div>
      <div style="font-family:'DM Sans';font-weight:500;font-size:${u(2.9)};
                  letter-spacing:${u(0.62)};text-transform:uppercase;color:${MUTED};
                  margin-top:${u(3.4)};">Scan to start</div>
    </div>
  </div>`;
  return { html: shell(dpi, w, h, body), w, h };
}

// ── chrome ──────────────────────────────────────────────────────────────────
function findChrome() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean);
  const hit = candidates.find((p) => fs.existsSync(p));
  if (!hit) throw new Error('No Chrome found. Set CHROME_PATH to a Chrome/Edge executable.');
  return hit;
}

/**
 * Anything that pokes outside `.safe` risks being sheared off by the guillotine,
 * which cuts to a tolerance of about a millimetre. Catch it here rather than on
 * a thousand printed cards.
 */
async function assertInsideSafeZone(page, label) {
  const escapees = await page.evaluate(() => {
    const safe = document.querySelector('.safe');
    if (!safe) return [];
    const box = safe.getBoundingClientRect();
    const out = [];
    for (const el of safe.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const dx = Math.max(box.left - r.left, r.right - box.right);
      const dy = Math.max(box.top - r.top, r.bottom - box.bottom);
      if (dx > 1 || dy > 1) {
        out.push({ tag: el.tagName.toLowerCase(), text: (el.textContent || '').trim().slice(0, 28), dx: Math.round(dx), dy: Math.round(dy) });
      }
    }
    return out;
  });
  if (escapees.length) {
    for (const e of escapees) console.error(`  ✗ ${label}: <${e.tag}> "${e.text}" overflows safe zone by ${Math.max(e.dx, 0)}×${Math.max(e.dy, 0)}px`);
    throw new Error(`${label}: content escapes the safe zone`);
  }
}

async function shoot(browser, { html, w, h }, label) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready); // never screenshot mid-swap
  await assertInsideSafeZone(page, label);
  const buf = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: w, height: h } });
  await page.close();
  return buf;
}

// ── output ──────────────────────────────────────────────────────────────────
/** Strip the bleed so the PNG is exactly the finished, trimmed artwork. */
async function trimmed(buf, dpi, trim) {
  const b = mmToPx(BLEED_MM, dpi);
  return sharp(buf)
    .extract({ left: b, top: b, width: mmToPx(trim.w, dpi), height: mmToPx(trim.h, dpi) })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

const jpeg = async (buf) =>
  'data:image/jpeg;base64,' + (await sharp(buf).jpeg({ quality: 94, chromaSubsampling: '4:4:4' }).toBuffer()).toString('base64');

/** Crop marks sit in the slug, offset by the bleed so they never touch artwork. */
function cropMarks(pdf, trim) {
  const L = 4; // mark length (mm)
  const x1 = SLUG_MM + BLEED_MM;
  const y1 = SLUG_MM + BLEED_MM;
  const x2 = x1 + trim.w;
  const y2 = y1 + trim.h;
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.12);
  for (const [x, sx] of [[x1, -1], [x2, 1]]) {
    for (const [y, sy] of [[y1, -1], [y2, 1]]) {
      pdf.line(x + sx * BLEED_MM, y, x + sx * (BLEED_MM + L), y); // horizontal
      pdf.line(x, y + sy * BLEED_MM, x, y + sy * (BLEED_MM + L)); // vertical
    }
  }
}

function slugLabel(pdf, pageW, pageH, text) {
  pdf.setFontSize(4.4);
  pdf.setTextColor(120);
  pdf.text(text, pageW / 2, pageH - 1.7, { align: 'center' });
}

async function printPdf(pages, trim, outFile, label) {
  const pageW = trim.w + (BLEED_MM + SLUG_MM) * 2;
  const pageH = trim.h + (BLEED_MM + SLUG_MM) * 2;
  const artW = trim.w + BLEED_MM * 2;
  const artH = trim.h + BLEED_MM * 2;

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [pageW, pageH] });
  for (let i = 0; i < pages.length; i++) {
    if (i > 0) pdf.addPage([pageW, pageH], 'landscape');
    pdf.addImage(await jpeg(pages[i]), 'JPEG', SLUG_MM, SLUG_MM, artW, artH);
    cropMarks(pdf, trim);
    slugLabel(pdf, pageW, pageH, label);
  }
  fs.writeFileSync(outFile, Buffer.from(pdf.output('arraybuffer')));
  const kb = (fs.statSync(outFile).size / 1024).toFixed(0);
  console.log(`${path.basename(outFile).padEnd(30)} ${kb} KB   ${pages.length}pp @ ${pageW}×${pageH}mm`);
}

async function writePng(buf, dir, file) {
  fs.writeFileSync(path.join(dir, file), buf);
  const m = await sharp(buf).metadata();
  console.log(`${file.padEnd(30)} ${(buf.length / 1024).toFixed(0)} KB   ${m.width}×${m.height}`);
}

// ── go ──────────────────────────────────────────────────────────────────────
(async () => {
  // margin:2 keeps a quiet zone even before the white panel padding.
  const qr = await QRCode.toDataURL('https://mulesoo.com', {
    width: 1200,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: INK, light: '#FFFFFF' },
  });

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    args: ['--font-render-hinting=none', '--disable-lcd-text', '--force-color-profile=srgb'],
  });

  try {
    const frontArt = await shoot(browser, cardFront(CARD_DPI), 'card front');
    const backArt = await shoot(browser, cardBack(CARD_DPI, qr), 'card back');
    const banArt = await shoot(browser, banner(BAN_DPI, qr), 'banner');

    await writePng(await trimmed(frontArt, CARD_DPI, CARD_TRIM), CARD_DIR, 'MuleSoo-Business-Card-Front.png');
    await writePng(await trimmed(backArt, CARD_DPI, CARD_TRIM), CARD_DIR, 'MuleSoo-Business-Card-Back.png');
    await writePng(await trimmed(banArt, BAN_DPI, BAN_TRIM), BAN_DIR, 'MuleSoo-Banner.png');

    await printPdf([frontArt, backArt], CARD_TRIM, path.join(CARD_DIR, 'MuleSoo-Business-Card.pdf'),
      'MuleSoo Business Card — 85.6×54mm trim · 3mm bleed · crop marks');
    await printPdf([banArt], BAN_TRIM, path.join(BAN_DIR, 'MuleSoo-Banner.pdf'),
      'MuleSoo Banner — 300×100mm trim · 3mm bleed · crop marks');
  } finally {
    await browser.close();
  }

  console.log('\nAll files in marketing/MuleSoo-Brand-Kit/');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
