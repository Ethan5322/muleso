/**
 * Generates the MuleSoo YouTube channel art as exact-pixel PNGs.
 *
 * Everything is inlined (brand fonts as woff2 data URIs, the logo as a PNG data
 * URI) so the HTML renders identically with no network and no font fallback —
 * headless Chrome would otherwise silently substitute Segoe UI for Sora and the
 * lockup would come out off-brand.
 *
 * Usage:  node marketing/YouTube/src/build-youtube-assets.mjs
 * Then:   render each .html with Chrome --headless --screenshot at its own size.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../../..');

const dataUri = (relPath, mime) =>
  `data:${mime};base64,${readFileSync(join(ROOT, relPath)).toString('base64')}`;

const font = (file) => dataUri(`assets/fonts/${file}`, 'font/woff2');

const LOGO_FULL = dataUri('public/mulesoo-logo-transparent.png', 'image/png');
const LOGO_MARK = dataUri('public/mulesoo-logo-icon-trim.png', 'image/png');

// Brand tokens — copied verbatim from CLAUDE.md. Do not drift.
const C = {
  bgPrimary: '#050810',
  bgSecondary: '#0A0F1E',
  blue: '#00C8FF',
  purple: '#7B2FFF',
  gold: '#E8B84B',
  green: '#00FF88',
  text: '#F0F2FA',
  textDim: '#A8B2D0',
  border: '#1A2640',
};

const FACES = `
@font-face { font-family: 'Sora'; src: url('${font('sora-latin-600-normal.woff2')}') format('woff2'); font-weight: 600; }
@font-face { font-family: 'Sora'; src: url('${font('sora-latin-700-normal.woff2')}') format('woff2'); font-weight: 700; }
@font-face { font-family: 'Sora'; src: url('${font('sora-latin-800-normal.woff2')}') format('woff2'); font-weight: 800; }
@font-face { font-family: 'DM Sans'; src: url('${font('dm-sans-latin-400-normal.woff2')}') format('woff2'); font-weight: 400; }
@font-face { font-family: 'DM Sans'; src: url('${font('dm-sans-latin-500-normal.woff2')}') format('woff2'); font-weight: 500; }
`;

const page = (w, h, css, body, transparent = false) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
${FACES}
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: ${w}px; height: ${h}px; overflow: hidden; ${transparent ? '' : `background: ${C.bgPrimary};`} }
body { -webkit-font-smoothing: antialiased; }
${css}
</style></head><body>${body}</body></html>`;

/* ────────────────────────────────────────────────────────────────────────────
   1. CHANNEL BANNER — 2560 x 1440
   YouTube crops this three ways from the SAME file:
     TV       2560 x 1440  (everything)
     Desktop  2560 x  423  (full-width middle band)
     Mobile   1546 x  423  (centred — the "safe area")
   So every word lives inside the centred 1546x423 box; the rest of the canvas
   is atmosphere only.
──────────────────────────────────────────────────────────────────────────── */
const bannerCss = `
.canvas { position: relative; width: 2560px; height: 1440px; overflow: hidden;
  background:
    radial-gradient(1100px 620px at 20% 50%, rgba(123,47,255,0.20), transparent 70%),
    radial-gradient(1200px 660px at 80% 50%, rgba(0,200,255,0.18), transparent 70%),
    radial-gradient(900px 900px at 50% 50%, rgba(10,15,30,0.85), transparent 75%),
    linear-gradient(160deg, #050810 0%, #0A0F1E 45%, #050810 100%); }

/* Faint engineering grid — reads as "built", not decorative noise. */
.grid { position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(26,38,64,0.55) 1px, transparent 1px),
    linear-gradient(90deg, rgba(26,38,64,0.55) 1px, transparent 1px);
  background-size: 80px 80px;
  mask-image: radial-gradient(1500px 700px at 50% 50%, #000 20%, transparent 78%);
  -webkit-mask-image: radial-gradient(1500px 700px at 50% 50%, #000 20%, transparent 78%); }

/* Circuit accents sit in the desktop band but outside the mobile safe area. */
.circuit { position: absolute; top: 50%; width: 430px; height: 300px;
  transform: translateY(-50%); opacity: 0.5; }
.circuit.l { left: 90px; }
.circuit.r { right: 90px; }

.hline { position: absolute; left: 0; right: 0; top: 50%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,200,255,0.28) 25%, rgba(232,184,75,0.35) 50%, rgba(123,47,255,0.28) 75%, transparent);
  transform: translateY(-211.5px); }
.hline.b { transform: translateY(211.5px); }

.safe { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: 1546px; height: 423px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center; }

.lockup { height: 116px; width: auto; filter: drop-shadow(0 10px 34px rgba(0,200,255,0.30)); }

.headline { font-family: 'Sora'; font-weight: 700; font-size: 44px; line-height: 1.18;
  color: ${C.text}; letter-spacing: -0.5px; margin-top: 26px; }
.headline .hl { background: linear-gradient(100deg, ${C.blue}, ${C.purple});
  -webkit-background-clip: text; background-clip: text; color: transparent; }

.services { font-family: 'Sora'; font-weight: 600; font-size: 16px; letter-spacing: 4.2px;
  color: ${C.textDim}; margin-top: 20px; text-transform: uppercase; }
.services i { color: ${C.gold}; font-style: normal; padding: 0 12px; }

.rule { width: 760px; height: 1px; margin-top: 26px;
  background: linear-gradient(90deg, transparent, ${C.border} 20%, rgba(232,184,75,0.55) 50%, ${C.border} 80%, transparent); }

.meta { display: flex; align-items: center; gap: 22px; margin-top: 22px;
  font-family: 'DM Sans'; font-weight: 500; font-size: 21px; color: ${C.textDim}; }
.meta .site { color: ${C.blue}; font-weight: 500; }
.meta .dot { width: 5px; height: 5px; border-radius: 50%; background: ${C.gold}; }
`;

const circuitSvg = (flip) => `
<svg class="circuit ${flip ? 'r' : 'l'}" viewBox="0 0 430 300" fill="none">
  <g stroke="${C.blue}" stroke-width="1.6" opacity="0.55">
    <path d="M${flip ? '430 60 H300 L250 110 H120' : '0 60 H130 L180 110 H310'}"/>
    <path d="M${flip ? '430 150 H210' : '0 150 H220'}"/>
    <path d="M${flip ? '430 240 H300 L250 190 H150' : '0 240 H130 L180 190 H280'}"/>
  </g>
  <g fill="${C.blue}">
    <circle cx="${flip ? 120 : 310}" cy="110" r="5"/>
    <circle cx="${flip ? 210 : 220}" cy="150" r="5"/>
  </g>
  <g fill="${C.purple}"><circle cx="${flip ? 250 : 180}" cy="190" r="5"/></g>
  <g fill="${C.green}"><circle cx="${flip ? 300 : 130}" cy="60" r="4"/></g>
</svg>`;

const banner = page(2560, 1440, bannerCss, `
<div class="canvas">
  <div class="grid"></div>
  ${circuitSvg(false)}
  ${circuitSvg(true)}
  <div class="hline"></div>
  <div class="hline b"></div>
  <div class="safe">
    <img class="lockup" src="${LOGO_FULL}" alt="MuleSoo">
    <div class="headline">World-Class Websites, <span class="hl">AI Chatbots</span> &amp; Automation</div>
    <div class="services">Websites<i>&bull;</i>AI Chatbots<i>&bull;</i>Automation<i>&bull;</i>Digital ID<i>&bull;</i>QR Systems</div>
    <div class="rule"></div>
    <div class="meta">
      <span class="site">mulesoo.com</span>
      <span class="dot"></span>
      <span>Pretoria, South Africa</span>
      <span class="dot"></span>
      <span>hello@mulesoo.com</span>
    </div>
  </div>
</div>`);

/* ────────────────────────────────────────────────────────────────────────────
   2. PROFILE PICTURE — 800 x 800, always rendered as a circle.
   Mark only: the wordmark is unreadable at the 48px size YouTube uses in
   comments and search results, and a cropped word looks like a mistake.
──────────────────────────────────────────────────────────────────────────── */
const avatarCss = `
.canvas { position: relative; width: 800px; height: 800px;
  background:
    radial-gradient(420px 420px at 32% 28%, rgba(123,47,255,0.42), transparent 68%),
    radial-gradient(460px 460px at 70% 74%, rgba(0,200,255,0.34), transparent 68%),
    linear-gradient(150deg, #0A0F1E 0%, #050810 60%, #0A0F1E 100%);
  display: flex; align-items: center; justify-content: center; }

/* Two rings, both inside the circular crop: gold hairline + faint inner keyline. */
.ring { position: absolute; border-radius: 50%; }
.ring.gold { inset: 34px; border: 3px solid rgba(232,184,75,0.55);
  box-shadow: 0 0 40px rgba(232,184,75,0.18) inset; }
.ring.inner { inset: 52px; border: 1px solid rgba(0,200,255,0.28); }

/* Sized to nearly fill the circle: YouTube renders this at 48px in comments
   and search, so every pixel of empty margin is legibility thrown away. */
.mark { width: 520px; height: auto; position: relative;
  filter: drop-shadow(0 14px 40px rgba(0,200,255,0.42)); }
`;

const avatar = page(800, 800, avatarCss, `
<div class="canvas">
  <div class="ring gold"></div>
  <div class="ring inner"></div>
  <img class="mark" src="${LOGO_MARK}" alt="MuleSoo">
</div>`);

/* ────────────────────────────────────────────────────────────────────────────
   3. VIDEO WATERMARK — 150 x 150, transparent, sits over playing video.
   Rendered on a transparent canvas; Chrome needs
   --default-background-color=00000000 for the alpha to survive.
──────────────────────────────────────────────────────────────────────────── */
const watermarkCss = `
.canvas { width: 150px; height: 150px; display: flex; align-items: center;
  justify-content: center; background: transparent; }
.mark { width: 138px; height: auto;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.85)) drop-shadow(0 0 12px rgba(0,0,0,0.6)); }
`;

const watermark = page(150, 150, watermarkCss,
  `<div class="canvas"><img class="mark" src="${LOGO_MARK}" alt="MuleSoo"></div>`, true);

const out = [
  ['banner-2560x1440.html', banner],
  ['profile-800x800.html', avatar],
  ['watermark-150x150.html', watermark],
];

for (const [name, html] of out) {
  writeFileSync(join(HERE, name), html);
  console.log('wrote', name, (html.length / 1024).toFixed(0) + 'kb');
}
