/* MuleSoo — three new portfolio covers: Yewogen Derash, Kidane Mihret Church,
 * Sena.
 *
 * These three don't have a polished existing screenshot the way YoYo Gym or
 * X-Boss do, so — same as every other branded artefact in this codebase —
 * the cover is composed once in headless Chrome with the real brand fonts,
 * not left to the generic runtime PortfolioCover monogram fallback. Each
 * design pulls from what that project actually is, not a generic template:
 *
 *   Yewogen Derash — identity-verified crowdfunding for Ethiopia. A verified
 *     campaign card with a progress bar and a per-campaign QR, bilingual
 *     wordmark (ወገን ደራሽ). Still in build — no live link, "Coming Soon".
 *
 *   Kidane Mihret — the bilingual Orthodox church site. A simple, respectful
 *     Orthodox cross motif, EN/AM headline, warm gold-on-navy. Deployed —
 *     the site's own colours (Orthodox-inspired, per its DESIGN.md), not
 *     MuleSoo's usual electric blue.
 *
 *   Sena — the AI hotel voice receptionist. Built around the project's own
 *     real rendered guest-ID-card asset (sena/guest-id-card.png), tilted on
 *     a dark purple ground with a waveform motif for "voice". In build, not
 *     yet deployed — "Coming Soon".
 *
 *   Telga — a new venture-stage concept, not yet built. An airtime and bill-
 *     payment vending network for Ethiopia, in the mould of the proven
 *     networked-reseller model South African platforms like Kazang and Flash
 *     run — small POS terminals and an Android app carried by corner-shop
 *     vendors. The cover shows the one moment that model runs on: the
 *     terminal screen mid-swipe, selling airtime.
 *
 * Run: node scripts/make-portfolio-covers.cjs
 * Out: public/yewogen-derash-portfolio.jpg
 *      public/kidane-mihret-portfolio.jpg
 *      public/sena-portfolio.jpg
 *      public/telga-portfolio.jpg
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public');
const FONT_DIR = path.join(ROOT, 'assets', 'fonts');
const SENA_CARD = 'C:/Users/mule/OneDrive/Desktop/sena/guest-id-card.png';

const W = 1600, H = 900; // 16:9, matches the highest-res existing covers

const b64 = (p) => fs.readFileSync(p).toString('base64');
const FONTS = [
  ['Sora', 600, 'sora-latin-600-normal.woff2', 'woff2'],
  ['Sora', 700, 'sora-latin-700-normal.woff2', 'woff2'],
  ['Sora', 800, 'sora-latin-800-normal.woff2', 'woff2'],
  ['DM Sans', 400, 'dm-sans-latin-400-normal.woff2', 'woff2'],
  ['DM Sans', 500, 'dm-sans-latin-500-normal.woff2', 'woff2'],
  ['Noto Ethiopic', 400, 'noto-ethiopic-400-static.ttf', 'truetype'],
  ['Noto Ethiopic', 700, 'noto-ethiopic-600-static.ttf', 'truetype'],
  ['Noto Ethiopic', 800, 'noto-ethiopic-800-static.ttf', 'truetype'],
];
const fontFaces = () =>
  FONTS.map(([family, weight, file, fmt]) => {
    const p = path.join(FONT_DIR, file);
    if (!fs.existsSync(p)) throw new Error(`Missing ${file}`);
    const mime = fmt === 'woff2' ? 'font/woff2' : 'font/ttf';
    return `@font-face{font-family:'${family}';font-weight:${weight};font-style:normal;font-display:block;
      src:url(data:${mime};base64,${b64(p)}) format('${fmt}');}`;
  }).join('\n');

const LOCKUP = `data:image/png;base64,${b64(path.join(ROOT, 'public', 'brand', 'mulesoo-credit-stamp-on-dark.png'))}`;
const SENA_CARD_URI = `data:image/png;base64,${b64(SENA_CARD)}`;

const BASE_CSS = `
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:${W}px;height:${H}px;overflow:hidden;}
body{font-family:'DM Sans',sans-serif;color:#F0F2FA;position:relative;-webkit-font-smoothing:antialiased;}
.grid{position:absolute;inset:0;opacity:0.08;
  background-image:linear-gradient(#1A2640 1px,transparent 1px),linear-gradient(90deg,#1A2640 1px,transparent 1px);
  background-size:64px 64px;}
.wordmark{font-family:'Sora';font-weight:800;letter-spacing:2px;}
.wordmark .dot{color:#E8B84B;}
.stamp{position:absolute;left:64px;bottom:48px;width:420px;opacity:0.92;}
`;

// ── 1. Yewogen Derash ────────────────────────────────────────────────────────
function yewogenHtml() {
  const accent = '#00C8FF';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces()}
${BASE_CSS}
body{background:
  radial-gradient(ellipse 1000px 800px at 15% 10%, ${accent}2E 0%, transparent 55%),
  radial-gradient(ellipse 900px 800px at 90% 90%, #E8B84B22 0%, transparent 55%),
  #050810;
  padding:72px 80px;display:flex;flex-direction:column;}
.top{display:flex;justify-content:space-between;align-items:flex-start;position:relative;z-index:2;}
.badge{display:inline-flex;align-items:center;gap:10px;font-family:'Sora';font-weight:700;font-size:18px;
  letter-spacing:3px;color:${accent};border:2px solid ${accent}66;background:${accent}14;
  border-radius:99px;padding:10px 22px;}
.amharic{font-family:'Noto Ethiopic';font-weight:800;font-size:30px;color:#A8B2D0;margin-top:26px;}
h1{font-family:'Sora';font-weight:800;font-size:78px;color:#fff;margin-top:14px;line-height:1.05;}
.sub{font-size:24px;color:#A8B2D0;max-width:620px;margin-top:22px;line-height:1.55;}

/* A campaign card mockup — the actual product, not a decoration */
.card{position:absolute;right:64px;top:170px;width:520px;background:#0D1528;border:1px solid #1A2640;
  border-radius:20px;padding:32px;box-shadow:0 40px 100px rgba(0,0,0,0.55);z-index:3;}
.card .verified{display:inline-flex;align-items:center;gap:8px;font-family:'Sora';font-weight:700;font-size:13px;
  letter-spacing:1.5px;color:#00FF88;background:#00FF8814;border:1px solid #00FF8855;border-radius:99px;padding:6px 14px;}
.card h2{font-family:'Sora';font-weight:700;font-size:26px;color:#fff;margin-top:20px;}
.card .goal{font-size:14px;color:#8A93A8;margin-top:4px;}
.card .bar-track{height:10px;background:#1A2640;border-radius:99px;margin-top:18px;overflow:hidden;}
.card .bar-fill{height:100%;width:68%;border-radius:99px;background:linear-gradient(90deg,${accent},#7B2FFF);}
.card .stats{display:flex;justify-content:space-between;margin-top:14px;font-size:14px;color:#A8B2D0;}
.card .stats b{color:#fff;font-family:'Sora';}
.card .qr-row{display:flex;align-items:center;gap:14px;margin-top:26px;padding-top:22px;border-top:1px solid #1A2640;}
.card .qr{width:56px;height:56px;border-radius:8px;background:
  repeating-conic-gradient(#fff 0deg 90deg, #0D1528 90deg 180deg) ;
  background-size: 10px 10px; border:3px solid #fff;}
.card .qr-text{font-size:12px;color:#8A93A8;line-height:1.5;}
.card .qr-text b{color:${accent};font-family:'Sora';}
</style></head><body>
  <div class="grid"></div>
  <div class="top">
    <div>
      <div class="badge">🇪🇹 CROWDFUNDING</div>
      <div class="amharic">ወገን ደራሽ</div>
      <h1>Yewogen Derash</h1>
      <p class="sub">Identity-verified crowdfunding for Ethiopia — every campaign owner
      KYC-checked, every campaign its own QR and ledger, no payment confirmed without
      a verified gateway webhook.</p>
    </div>
  </div>
  <div class="card">
    <span class="verified">✓ IDENTITY VERIFIED</span>
    <h2>Rebuild After the Flood</h2>
    <p class="goal">Addis Ababa · Emergency Relief</p>
    <div class="bar-track"><div class="bar-fill"></div></div>
    <div class="stats"><span><b>ETB 340,000</b> raised</span><span>of <b>ETB 500,000</b></span></div>
    <div class="qr-row">
      <div class="qr"></div>
      <div class="qr-text">Scan opens <b>this campaign only</b><br/>— never a generic homepage</div>
    </div>
  </div>
  <img class="stamp" src="${LOCKUP}"/>
  <div class="wordmark" style="position:absolute;right:64px;bottom:48px;font-size:24px;color:#fff;z-index:2;">
    MULE<span class="dot">●</span>SOO
  </div>
</body></html>`;
}

// ── 2. Kidane Mihret Church ──────────────────────────────────────────────────
function kidaneMihretHtml() {
  // Orthodox-inspired palette per the project's own DESIGN.md — deep navy and
  // warm gold, not MuleSoo's usual electric blue.
  const gold = '#C9A227';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces()}
${BASE_CSS}
body{background:
  radial-gradient(ellipse 1100px 900px at 20% 15%, ${gold}22 0%, transparent 55%),
  radial-gradient(ellipse 900px 800px at 85% 85%, ${gold}18 0%, transparent 55%),
  #0A0D14;
  padding:72px 80px;display:flex;flex-direction:column;align-items:center;text-align:center;
  justify-content:center;}
.cross{width:64px;height:64px;margin-bottom:28px;opacity:0.95;}
.badge{display:inline-flex;align-items:center;gap:10px;font-family:'Sora';font-weight:700;font-size:17px;
  letter-spacing:3px;color:${gold};border:2px solid ${gold}77;background:${gold}14;
  border-radius:99px;padding:10px 24px;}
h1{font-family:'Sora';font-weight:800;font-size:56px;color:#fff;margin-top:26px;line-height:1.15;}
.amharic{font-family:'Noto Ethiopic';font-weight:700;font-size:32px;color:${gold};margin-top:16px;}
.sub{font-size:22px;color:#A8B2D0;max-width:680px;margin-top:24px;line-height:1.6;}
.rule{width:120px;height:3px;background:linear-gradient(90deg,transparent,${gold},transparent);margin-top:32px;}
.langs{display:flex;gap:16px;margin-top:30px;}
.langs span{font-family:'Sora';font-weight:700;font-size:14px;letter-spacing:2px;color:#0A0D14;
  background:${gold};border-radius:99px;padding:8px 20px;}
</style></head><body>
  <div class="grid"></div>
  <svg class="cross" viewBox="0 0 64 64" fill="none">
    <path d="M28 4h8v14h14v8H36v34h-8V26H14v-8h14V4z" fill="${gold}"/>
  </svg>
  <div class="badge">⛪ CHURCH WEBSITE</div>
  <!-- Real name and Amharic text, verbatim from config/site.ts and
       database/schema-oc.sql (church.shortName) — never invented. -->
  <h1>Hamere Noh Kidane Mihret</h1>
  <div class="amharic">ሐመረ ኖኅ ኪዳነ ምሕረት</div>
  <p class="sub">A dignified, fully bilingual home for the Ethiopian Orthodox Tewahedo
  parish in Pretoria — service times, sermons, saints and the calendar, editable by
  the church itself, in English and Amharic side by side.</p>
  <div class="rule"></div>
  <div class="langs"><span>ENGLISH</span><span>አማርኛ</span></div>
  <img class="stamp" src="${LOCKUP}"/>
  <div class="wordmark" style="position:absolute;right:64px;bottom:48px;font-size:24px;color:#fff;">
    MULE<span class="dot">●</span>SOO
  </div>
</body></html>`;
}

// ── 3. Sena ───────────────────────────────────────────────────────────────────
function senaHtml() {
  const accent = '#7B2FFF';
  const gold = '#E8B84B';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces()}
${BASE_CSS}
body{background:
  radial-gradient(ellipse 1100px 900px at 12% 15%, ${accent}30 0%, transparent 55%),
  radial-gradient(ellipse 900px 800px at 92% 85%, ${gold}1E 0%, transparent 55%),
  #050810;
  padding:72px 80px;display:flex;align-items:center;}
.left{position:relative;z-index:2;max-width:560px;}
.badge{display:inline-flex;align-items:center;gap:10px;font-family:'Sora';font-weight:700;font-size:18px;
  letter-spacing:3px;color:${accent};border:2px solid ${accent}77;background:${accent}18;
  border-radius:99px;padding:10px 22px;}
h1{font-family:'Sora';font-weight:800;font-size:76px;color:#fff;margin-top:22px;line-height:1.03;}
.sub{font-size:23px;color:#A8B2D0;margin-top:22px;line-height:1.6;}
.wave{display:flex;align-items:flex-end;gap:5px;margin-top:34px;height:38px;}
.wave span{width:5px;border-radius:3px;background:linear-gradient(180deg,${accent},${gold});}
.card-wrap{position:absolute;right:36px;top:50%;transform:translateY(-50%) rotate(4deg);
  width:640px;box-shadow:0 50px 120px rgba(0,0,0,0.6);border-radius:20px;z-index:3;}
.card-wrap img{width:100%;display:block;border-radius:20px;}
</style></head><body>
  <div class="grid"></div>
  <div class="left">
    <div class="badge">🏨 AI VOICE RECEPTIONIST</div>
    <h1>Sena</h1>
    <p class="sub">The guest clicks Call Reception — Sena answers, says plainly she is
    an AI, checks live availability, quotes real rates, takes payment, and issues a
    single-use QR guest ID. Self-hosted voice, no per-minute vendor.</p>
    <div class="wave">
      <span style="height:14px"></span><span style="height:26px"></span><span style="height:38px"></span>
      <span style="height:20px"></span><span style="height:32px"></span><span style="height:16px"></span>
      <span style="height:28px"></span><span style="height:12px"></span>
    </div>
  </div>
  <div class="card-wrap"><img src="${SENA_CARD_URI}"/></div>
  <img class="stamp" src="${LOCKUP}"/>
  <div class="wordmark" style="position:absolute;right:64px;bottom:48px;font-size:24px;color:#fff;z-index:2;">
    MULE<span class="dot">●</span>SOO
  </div>
</body></html>`;
}

// ── 4. Telga ──────────────────────────────────────────────────────────────────
// A physical card-swipe terminal, not a phone screen — bright yellow casing
// (the user's explicit direction: "like a new Flash swiping machine, but
// yellow"), a real swipe slot with a card mid-drag through it, and a molded
// keypad, since that silhouette is what actually reads as "vending machine"
// rather than "app on a phone."
function telgaHtml() {
  const yellow = '#FFC72C';
  const yellowDeep = '#D9A400';
  const ink = '#0A0D14';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces()}
${BASE_CSS}
body{background:
  radial-gradient(ellipse 1100px 900px at 85% 15%, ${yellow}22 0%, transparent 55%),
  radial-gradient(ellipse 900px 800px at 10% 90%, ${yellow}14 0%, transparent 55%),
  #050810;
  padding:72px 80px;display:flex;align-items:center;}
.left{position:relative;z-index:2;max-width:560px;}
.badge{display:inline-flex;align-items:center;gap:10px;font-family:'Sora';font-weight:700;font-size:18px;
  letter-spacing:3px;color:${yellow};border:2px solid ${yellow}88;background:${yellow}1C;
  border-radius:99px;padding:10px 22px;}
h1{font-family:'Sora';font-weight:800;font-size:88px;color:#fff;margin-top:22px;line-height:1;}
.sub{font-size:23px;color:#A8B2D0;margin-top:22px;line-height:1.6;}
.formfactor{display:flex;gap:12px;margin-top:30px;}
.formfactor span{font-family:'Sora';font-weight:700;font-size:13px;letter-spacing:1.5px;color:${ink};
  background:${yellow};border-radius:99px;padding:8px 18px;}

/* The terminal — molded yellow plastic body, swipe slot, keypad. This is the
   silhouette of a real handheld card machine, not a phone with a yellow tint. */
.terminal{position:absolute;right:150px;top:50%;transform:translateY(-50%) rotate(-4deg);
  width:340px;background:linear-gradient(160deg,${yellow},${yellowDeep});
  border-radius:26px;padding:16px 16px 22px;box-shadow:0 50px 120px rgba(0,0,0,0.65), inset 0 2px 0 rgba(255,255,255,0.4);
  z-index:3;}
.terminal .brandrow{display:flex;justify-content:space-between;align-items:center;padding:2px 6px 12px;}
.terminal .brandrow .name{font-family:'Sora';font-weight:800;font-size:16px;letter-spacing:1px;color:${ink};}
.terminal .brandrow .signal{font-size:10px;color:${ink};opacity:0.65;letter-spacing:1px;}

/* Swipe slot: a dark recessed groove with a card caught mid-drag through it */
.slot{position:relative;height:34px;background:${ink};border-radius:8px;
  box-shadow:inset 0 3px 6px rgba(0,0,0,0.6);margin-bottom:14px;overflow:visible;}
.slot .card{position:absolute;left:58%;top:-14px;width:150px;height:60px;border-radius:7px;
  background:linear-gradient(135deg,#2A3350,#161B2E);border:1px solid #3A4560;
  box-shadow:0 10px 26px rgba(0,0,0,0.5);transform:rotate(-4deg);}
.slot .card .chip{position:absolute;left:14px;top:14px;width:22px;height:16px;border-radius:3px;
  background:linear-gradient(135deg,#E8B84B,#C9962E);}
.slot .card .stripe{position:absolute;left:0;top:6px;width:100%;height:9px;background:#0A0D14;opacity:0.7;}

.screen{background:${ink};border-radius:14px;padding:20px 18px;}
.screen .op{font-size:12px;color:#8A93A8;letter-spacing:0.5px;}
.screen .amount{font-family:'Sora';font-weight:800;font-size:44px;color:#fff;margin-top:4px;}
.screen .amount span{font-size:20px;color:${yellow};}
.screen .prompt{margin-top:16px;background:${yellow}1A;border:1.5px dashed ${yellow}AA;border-radius:12px;
  padding:12px;text-align:center;}
.screen .prompt .txt{font-family:'Sora';font-weight:700;font-size:13px;letter-spacing:1.8px;color:${yellow};}
.screen .foot{display:flex;justify-content:space-between;margin-top:14px;font-size:10px;color:#5A6480;}

/* Molded keypad below the screen — the detail that reads as "real device" */
.keypad{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:14px;padding:0 4px;}
.keypad span{background:${yellowDeep};border-radius:7px;height:26px;box-shadow:inset 0 -2px 0 rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.25);}
</style></head><body>
  <div class="grid"></div>
  <div class="left">
    <div class="badge">📶 AIRTIME &amp; BILL PAYMENTS</div>
    <h1>Telga</h1>
    <p class="sub">A vending network for Ethiopia's corner shops — airtime and bill
    payments sold on the same proven networked-reseller model that made platforms
    like Flash and Kazang ubiquitous across South Africa's informal retail.</p>
    <div class="formfactor"><span>POS TERMINAL</span><span>ANDROID APP</span></div>
  </div>
  <div class="terminal">
    <div class="brandrow"><span class="name">TELGA</span><span class="signal">●●●● 4G</span></div>
    <div class="slot">
      <div class="card"><div class="chip"></div><div class="stripe"></div></div>
    </div>
    <div class="screen">
      <div class="op">Ethio Telecom Airtime</div>
      <div class="amount">50<span>ETB</span></div>
      <div class="prompt"><div class="txt">SWIPE TO PAY</div></div>
      <div class="foot"><span>VENDOR #0412</span><span>REF TG-88213</span></div>
    </div>
    <div class="keypad">
      <span></span><span></span><span></span>
      <span></span><span></span><span></span>
      <span></span><span></span><span></span>
    </div>
  </div>
  <img class="stamp" src="${LOCKUP}"/>
  <div class="wordmark" style="position:absolute;right:64px;bottom:48px;font-size:24px;color:#fff;z-index:2;">
    MULE<span class="dot">●</span>SOO
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
  if (!fs.existsSync(SENA_CARD)) throw new Error(`Missing ${SENA_CARD}`);

  const targets = [
    ['yewogen-derash-portfolio.jpg', yewogenHtml()],
    ['kidane-mihret-portfolio.jpg', kidaneMihretHtml()],
    ['sena-portfolio.jpg', senaHtml()],
    ['telga-portfolio.jpg', telgaHtml()],
  ];

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    args: ['--font-render-hinting=none', '--force-color-profile=srgb'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
    for (const [file, html] of targets) {
      await page.setContent(html, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const out = path.join(OUT, file);
      await page.screenshot({ path: out, type: 'jpeg', quality: 92 });
      console.log(`  ${file}  ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
    }
  } finally {
    await browser.close();
  }
  console.log('\n  → public/*.jpg');
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
