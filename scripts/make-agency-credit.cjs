/* MuleSoo — agency credit lockup.
 *
 * "Designed & built by MuleSoo Digital Services" + the transparent logo +
 * mulesoo.com + hello@mulesoo.com, as ONE reusable transparent PNG.
 *
 * WHY A RENDERED LOCKUP RATHER THAN LIVE TEXT:
 *   Every PDF in these projects is drawn with jsPDF, which ships only
 *   helvetica/courier/times — Sora and DM Sans are simply not available to it,
 *   which is exactly why the credit lines have never been in the brand fonts.
 *   Embedding them means shipping a TTF; Google publishes Sora and DM Sans only
 *   as VARIABLE fonts now, and jsPDF would collapse those to a single default
 *   weight, so the wordmark could not be bold.
 *
 *   So the credit block is rendered once in headless Chrome — where the real
 *   fonts and the real logo render correctly — and stamped into every PDF and
 *   every ID card as an image. A credit block is a logo lockup; raster is the
 *   normal, correct treatment for one, and it guarantees byte-identical
 *   branding across MuleSoo, Yoyo GYM, Shime and Tsedi.
 *
 * Two variants, because these land on both dark cards and white PDFs.
 * Both are transparent, so they never punch a box over the artwork beneath.
 *
 * Run: node scripts/make-agency-credit.cjs
 * Out: public/brand/  (+ mirrored into the client projects by the caller)
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const QRCode = require('qrcode');

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public', 'brand');
const FONT_DIR = path.join(ROOT, 'assets', 'fonts');
fs.mkdirSync(OUT, { recursive: true });

const b64 = (p) => fs.readFileSync(p).toString('base64');
const LOGO_ICON = `data:image/png;base64,${b64('public/mulesoo-logo-icon.png')}`;

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

// Rendered at 4x so it stays crisp when a PDF or a 600dpi card scales it down.
const SCALE = 4;
// Kept near 4:1 — a very wide lockup is hard to place in a tight card footer
// without crowding whatever sits beside it.
const W = 408; // design units
const H = 96;

const GOLD = '#E8B84B';

/** `onDark` flips the text ramp; the logo and gold rule stay constant. */
function lockup(onDark) {
  const primary = onDark ? '#FFFFFF' : '#0B1220';
  const muted = onDark ? 'rgba(233,237,245,0.62)' : 'rgba(11,18,32,0.55)';
  const contact = onDark ? 'rgba(233,237,245,0.82)' : 'rgba(11,18,32,0.72)';
  const divider = onDark ? 'rgba(232,184,75,0.42)' : 'rgba(232,184,75,0.62)';

  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces()}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:${W}px;height:${H}px;background:transparent;}
body{
  display:flex;align-items:center;gap:18px;
  font-family:'DM Sans',sans-serif;
  -webkit-font-smoothing:antialiased;
  text-rendering:geometricPrecision;
}
.logo{width:70px;height:70px;flex:none;display:block;}
.bar{width:1.5px;height:62px;background:${divider};flex:none;border-radius:1px;}
.kicker{
  font-family:'DM Sans';font-weight:500;font-size:10px;letter-spacing:2.4px;
  text-transform:uppercase;color:${muted};line-height:1;
}
.wordmark{
  font-family:'Sora';font-weight:800;font-size:25px;letter-spacing:0.6px;
  color:${primary};line-height:1;margin-top:7px;white-space:nowrap;
}
.dot{
  display:inline-block;width:4.5px;height:4.5px;border-radius:50%;
  background:${GOLD};vertical-align:middle;margin:0 3px 4px 3px;
}
.contact{
  font-family:'DM Sans';font-weight:400;font-size:12px;letter-spacing:0.1px;
  color:${contact};line-height:1;margin-top:9px;white-space:nowrap;
}
.sep{color:${divider};padding:0 6px;}
</style></head><body>
  <img class="logo" src="${LOGO_ICON}"/>
  <div class="bar"></div>
  <div>
    <div class="kicker">Designed &amp; Built By</div>
    <div class="wordmark">MULE<span class="dot"></span>SOO<span
      style="font-family:'DM Sans';font-weight:500;font-size:10px;letter-spacing:1.7px;
             color:${muted};margin-left:10px;vertical-align:2px;">DIGITAL SERVICES</span></div>
    <div class="contact">mulesoo.com<span class="sep">|</span>hello@mulesoo.com</div>
  </div>
</body></html>`;
}

// ── Compact one-line variant ────────────────────────────────────────────────
// An 85.6×54mm ID card leaves roughly 5mm of footer. The stacked lockup shrunk
// into that strip would render the email at about 1pt — unreadable in print. A
// single wide line stays legible at the same height.
const CW = 620;
const CH = 52;

function compact(onDark) {
  const primary = onDark ? '#FFFFFF' : '#0B1220';
  const muted = onDark ? 'rgba(233,237,245,0.66)' : 'rgba(11,18,32,0.58)';
  const divider = onDark ? 'rgba(232,184,75,0.45)' : 'rgba(232,184,75,0.6)';

  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces()}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:${CW}px;height:${CH}px;background:transparent;}
body{display:flex;align-items:center;gap:12px;font-family:'DM Sans',sans-serif;
  -webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;white-space:nowrap;}
.logo{width:${CH - 8}px;height:${CH - 8}px;flex:none;display:block;}
.k{font-weight:500;font-size:12px;letter-spacing:1.6px;text-transform:uppercase;color:${muted};}
.wm{font-family:'Sora';font-weight:800;font-size:19px;letter-spacing:0.4px;color:${primary};}
.dot{display:inline-block;width:3.6px;height:3.6px;border-radius:50%;background:${GOLD};
  vertical-align:middle;margin:0 2.5px 3px 2.5px;}
.c{font-weight:400;font-size:12.5px;color:${muted};}
.s{color:${divider};padding:0 7px;}
</style></head><body>
  <img class="logo" src="${LOGO_ICON}"/>
  <span class="k">Designed &amp; Built By</span>
  <span class="wm">MULE<span class="dot"></span>SOO</span>
  <span class="s">|</span>
  <span class="c">mulesoo.com</span><span class="s">|</span><span class="c">hello@mulesoo.com</span>
</body></html>`;
}

// ── QR stamp variant ────────────────────────────────────────────────────────
// The stacked lockup plus a scannable QR to mulesoo.com — the "MuleSoo credit
// stamp". The QR lives in a white rounded tile so it scans on dark and light
// pages alike. Print at ≥60mm wide so the QR lands at ≥10mm; the compact
// one-liner is too short to ever host a scannable code, hence this layout.
const SW = 536;
const SH = 96;

function stamp(onDark, qrDataUrl) {
  const primary = onDark ? '#FFFFFF' : '#0B1220';
  const muted = onDark ? 'rgba(233,237,245,0.62)' : 'rgba(11,18,32,0.55)';
  const contact = onDark ? 'rgba(233,237,245,0.82)' : 'rgba(11,18,32,0.72)';
  const divider = onDark ? 'rgba(232,184,75,0.42)' : 'rgba(232,184,75,0.62)';

  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces()}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:${SW}px;height:${SH}px;background:transparent;}
body{
  display:flex;align-items:center;gap:18px;
  font-family:'DM Sans',sans-serif;
  -webkit-font-smoothing:antialiased;
  text-rendering:geometricPrecision;
}
.logo{width:70px;height:70px;flex:none;display:block;}
.bar{width:1.5px;height:62px;background:${divider};flex:none;border-radius:1px;}
.kicker{
  font-family:'DM Sans';font-weight:500;font-size:10px;letter-spacing:2.4px;
  text-transform:uppercase;color:${muted};line-height:1;
}
.wordmark{
  font-family:'Sora';font-weight:800;font-size:25px;letter-spacing:0.6px;
  color:${primary};line-height:1;margin-top:7px;white-space:nowrap;
}
.dot{
  display:inline-block;width:4.5px;height:4.5px;border-radius:50%;
  background:${GOLD};vertical-align:middle;margin:0 3px 4px 3px;
}
.contact{
  font-family:'DM Sans';font-weight:400;font-size:12px;letter-spacing:0.1px;
  color:${contact};line-height:1;margin-top:9px;white-space:nowrap;
}
.sep{color:${divider};padding:0 6px;}
.qrtile{
  flex:none;width:88px;height:88px;background:#FFFFFF;border-radius:8px;
  border:1.5px solid ${divider};
  display:flex;align-items:center;justify-content:center;
}
.qrtile img{width:76px;height:76px;display:block;}
</style></head><body>
  <img class="logo" src="${LOGO_ICON}"/>
  <div class="bar"></div>
  <div style="flex:1;">
    <div class="kicker">Designed &amp; Built By</div>
    <div class="wordmark">MULE<span class="dot"></span>SOO<span
      style="font-family:'DM Sans';font-weight:500;font-size:10px;letter-spacing:1.7px;
             color:${muted};margin-left:10px;vertical-align:2px;">DIGITAL SERVICES</span></div>
    <div class="contact">mulesoo.com<span class="sep">|</span>hello@mulesoo.com</div>
  </div>
  <div class="qrtile"><img src="${qrDataUrl}"/></div>
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

/**
 * Nothing may sit outside the artboard, or the caller's placement maths (which
 * assumes a known aspect ratio) would silently clip the logo or the email.
 */
async function assertNoOverflow(page, label, w, h) {
  const bad = await page.evaluate(
    (ww, hh) => {
      const out = [];
      for (const el of document.body.querySelectorAll('*')) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (r.left < -0.5 || r.top < -0.5 || r.right > ww + 0.5 || r.bottom > hh + 0.5) {
          out.push(`<${el.tagName.toLowerCase()}> "${(el.textContent || '').trim().slice(0, 24)}"`);
        }
      }
      return out;
    },
    w,
    h
  );
  if (bad.length) throw new Error(`${label}: content overflows the lockup → ${bad.join(', ')}`);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    args: ['--font-render-hinting=none', '--force-color-profile=srgb'],
  });

  try {
    // High-res QR (crisp at SCALE 4), quiet zone provided by the white tile.
    const qrDataUrl = await QRCode.toDataURL('https://mulesoo.com', {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 76 * SCALE,
      color: { dark: '#0B1220', light: '#FFFFFF' },
    });

    const jobs = [
      ['mulesoo-credit-on-dark', lockup(true), W, H],
      ['mulesoo-credit-on-light', lockup(false), W, H],
      ['mulesoo-credit-compact-on-dark', compact(true), CW, CH],
      ['mulesoo-credit-compact-on-light', compact(false), CW, CH],
      ['mulesoo-credit-stamp-on-dark', stamp(true, qrDataUrl), SW, SH],
      ['mulesoo-credit-stamp-on-light', stamp(false, qrDataUrl), SW, SH],
    ];

    for (const [name, html, w, h] of jobs) {
      const page = await browser.newPage();
      await page.setViewport({ width: w, height: h, deviceScaleFactor: SCALE });
      await page.setContent(html, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await assertNoOverflow(page, name, w, h);
      const buf = await page.screenshot({ type: 'png', omitBackground: true });
      fs.writeFileSync(path.join(OUT, `${name}.png`), buf);
      console.log(
        `  ${name.padEnd(32)} ${(buf.length / 1024).toFixed(0).padStart(4)} KB   ${w * SCALE}×${h * SCALE}  aspect ${(w / h).toFixed(3)}`
      );
      await page.close();
    }
  } finally {
    await browser.close();
  }

  // Aspect ratios are the contract every caller places against.
  fs.writeFileSync(
    path.join(OUT, 'credit-lockup.json'),
    JSON.stringify(
      {
        stacked: { width: W, height: H, aspect: +(W / H).toFixed(4) },
        compact: { width: CW, height: CH, aspect: +(CW / CH).toFixed(4) },
        stamp: { width: SW, height: SH, aspect: +(SW / SH).toFixed(4) },
        scale: SCALE,
      },
      null,
      2
    )
  );
  console.log(`\n  stacked aspect ${(W / H).toFixed(3)} · compact aspect ${(CW / CH).toFixed(3)}`);
  console.log(`  written to public/brand/`);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
