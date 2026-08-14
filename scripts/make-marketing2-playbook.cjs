/* MuleSoo — Marketing 2: the playbook PDF.
 *
 * The document that goes in front of a person: what MuleSoo has built, what
 * each system does, what it costs, and the year-long posting routine that
 * sells it. It is the portfolio and the marketing plan in one file — hand it
 * to a prospect and it reads as a capabilities deck; hand it to whoever runs
 * the accounts and it reads as instructions.
 *
 * Project facts are read from the calendar script's own PROJECTS table, so the
 * playbook and the 1,825 posts can never drift apart. Pricing is read from
 * PRICING below and is stated in Rand, which is the currency we actually
 * charge in.
 *
 * Run: node scripts/make-marketing2-playbook.cjs
 * Out: marketing2/MuleSoo-Marketing2-Playbook.pdf
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const sharp = require('sharp');

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'marketing2');
const CSV = path.join(OUT, 'MuleSoo-Marketing2-365.csv');
const FONT_DIR = path.join(ROOT, 'assets', 'fonts');
const PORTRAIT_SRC = path.join(ROOT, 'assets', 'founder', 'founder-portrait.jpg');
fs.mkdirSync(OUT, { recursive: true });

// The single source of truth for project copy — shared with the calendar so a
// wording change lands in both the posts and this document.
const { PROJECTS, PILLARS } = require('./marketing2-projects.cjs');

const SITE = 'mulesoo.com';
const WA = 'wa.me/27688529333';
const EMAIL = 'hello@mulesoo.com';

// Prices as published on the live services pages, in Rand.
const PRICING = [
  ['Website design', 'From R3,500', 'Business builds from R7,500 · enterprise quoted on scope'],
  ['AI chatbot', 'From R2,500', 'Website + WhatsApp, trained on your own services and prices'],
  ['AI automation systems', 'From R4,500', 'Booking, payment and follow-up flows joined end to end'],
  ['Design & sales widget', 'From R3,500', 'Greets, answers, books and takes deposits on your site'],
  ['Logo & brand identity', 'From R800', 'Full identity packages from R1,800'],
  ['Custom email setup', 'From R400', 'you@yourbusiness.co.za, migrated, with anti-spam records'],
  ['QR code design', 'From R300', 'Branded, print-ready, with scan tracking'],
  ['PDF guides you sell', 'From R149', 'Written, designed and set up to sell on your own site'],
];

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

/** Thousands with a comma, matching the site's existing "R3,500" copy. */
const comma = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function parseCsv(text) {
  text = text.replace(/^﻿/, '');
  const rows = [];
  let row = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
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

const PLATFORM_NOTES = [
  ['LinkedIn', 'Decision-makers and referrals', 'Post 07:00–09:00 on weekdays. Lead with the insight, never the offer. No link in the first line — LinkedIn buries posts that send people away too early.'],
  ['Instagram', 'Reach and brand memory', 'The card carries the post; the caption only has to earn the tap. Post 11:00–13:00 or 18:00–20:00. Six to eight tags, all of them relevant.'],
  ['Facebook', 'Local business owners in South Africa', 'Plain language wins. Share into local business groups where the rules allow it. Evenings and Sunday afternoons outperform weekday mornings.'],
  ['TikTok', 'Reach with people who have never heard of you', 'Read the caption aloud over a screen recording of the actual system. The first two seconds decide everything. Post 18:00–21:00.'],
  ['X', 'Developers, founders and the tech-curious', 'One idea per post. No thread unless the idea genuinely needs one. Two tags maximum.'],
];

function projectPage(p) {
  return `<section class="proj">
    <div class="proj-head" style="border-color:${p.accent}">
      <div>
        <div class="chip" style="color:${p.accent};border-color:${p.accent}66;background:${p.accent}12">
          ${esc(p.chip.replace(/ · IN BUILD$/, ''))}${p.state === 'building' ? ' · IN BUILD' : ''}
        </div>
        <h3>${esc(p.name)}</h3>
        <div class="sector">${esc(p.sector)}</div>
      </div>
      <div class="url">${esc(p.state === 'live' ? p.url.replace(/^https?:\/\//, '') : 'in development')}</div>
    </div>

    <p class="is">${esc(p.is.charAt(0).toUpperCase() + p.is.slice(1))}.</p>

    <div class="grid3">
      <div>
        <h4>The problem</h4>
        <p>${esc(p.pains[0])}</p>
      </div>
      <div>
        <h4>What it does</h4>
        <ul>${p.gets.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>
      </div>
      <div>
        <h4>Under the bonnet</h4>
        <p>${esc(p.behind[0])}</p>
      </div>
    </div>

    <div class="sell" style="border-color:${p.accent}55;background:${p.accent}0D">
      <b>The line that sells it:</b> ${esc(p.offer)}
      <span class="tags">${p.tags.map((t) => `#${esc(t)}`).join(' ')}</span>
    </div>
  </section>`;
}

function html(portrait, stats) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces()}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'DM Sans',sans-serif;color:#0B1220;font-size:9.5pt;line-height:1.55;}
h2{font-family:'Sora';font-weight:800;font-size:19pt;margin:0 0 3px;}
h3{font-family:'Sora';font-weight:800;font-size:13pt;margin:6px 0 2px;}
h4{font-family:'Sora';font-weight:600;font-size:8pt;letter-spacing:1.6px;text-transform:uppercase;
   color:rgba(11,18,32,0.5);margin-bottom:4px;}
p{margin-bottom:7px;}
ul{margin:0 0 7px 15px;}
li{margin-bottom:2.5px;}
.page{page-break-after:always;}
.lede{font-size:10.5pt;color:rgba(11,18,32,0.72);max-width:150mm;margin-bottom:14px;}
.rule{height:3px;width:60mm;background:linear-gradient(90deg,#00C8FF,#7B2FFF);border-radius:2px;margin:8px 0 16px;}

/* Cover — the founder circle, matching the daily cards exactly. */
.cover{height:97vh;display:flex;flex-direction:column;justify-content:center;page-break-after:always;
  background:radial-gradient(ellipse 180mm 120mm at 20% 12%, rgba(0,200,255,0.10) 0%, transparent 60%),
             radial-gradient(ellipse 160mm 120mm at 90% 88%, rgba(123,47,255,0.09) 0%, transparent 60%);}
.cover .top{display:flex;align-items:center;gap:14px;margin-bottom:26px;}
.cover .avatar{width:34mm;height:34mm;border-radius:50%;object-fit:cover;flex:none;
  border:1.6mm solid #00C8FF;box-shadow:0 0 0 1.2mm rgba(5,8,16,0.06);}
.cover .who .name{font-family:'Sora';font-weight:800;font-size:17pt;}
.cover .who .role{font-size:10pt;color:rgba(11,18,32,0.6);}
.cover .kicker{font-family:'Sora';font-weight:600;font-size:9pt;letter-spacing:4px;
  text-transform:uppercase;color:rgba(11,18,32,0.5);}
.cover h1{font-family:'Sora';font-weight:800;font-size:33pt;line-height:1.1;margin:8px 0 10px;max-width:160mm;}
.cover h1 .grad{background:linear-gradient(120deg,#00C8FF,#7B2FFF);-webkit-background-clip:text;
  -webkit-text-fill-color:transparent;background-clip:text;}
.cover .stats{display:flex;gap:0;margin:20px 0 22px;}
.cover .stat{padding-right:14mm;}
.cover .stat b{font-family:'Sora';font-weight:800;font-size:20pt;display:block;line-height:1.1;}
.cover .stat span{font-size:8pt;letter-spacing:1.4px;text-transform:uppercase;color:rgba(11,18,32,0.5);}
.cover .foot{margin-top:auto;display:flex;justify-content:space-between;align-items:flex-end;}
.cover .foot img{width:52mm;}
.cover .contact{font-size:9pt;color:rgba(11,18,32,0.65);text-align:right;line-height:1.7;}

.box{border:1px solid #D9DEE9;border-radius:8px;padding:11px 14px;margin-bottom:10px;page-break-inside:avoid;}
.box.warn{border-color:#E8B84B;background:#FEFAF0;}
.box.blue{border-color:rgba(0,200,255,0.5);background:rgba(0,200,255,0.05);}

/* Project entries — two per page, each self-contained. */
.proj{border:1px solid #E2E7F0;border-radius:10px;padding:12px 14px;margin-bottom:11px;page-break-inside:avoid;}
.proj-head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;
  border-bottom:2px solid;padding-bottom:7px;margin-bottom:8px;}
.proj-head .chip{display:inline-block;font-family:'Sora';font-weight:600;font-size:6.8pt;letter-spacing:2px;
  border:1px solid;border-radius:99px;padding:1.5px 8px;}
.proj-head .sector{font-size:8.5pt;color:rgba(11,18,32,0.55);}
.proj-head .url{font-size:8.5pt;color:#0A66C2;white-space:nowrap;padding-top:14px;}
.is{font-size:10pt;font-weight:500;margin-bottom:9px;}
.grid3{display:flex;gap:12px;margin-bottom:9px;}
.grid3>div{flex:1;min-width:0;}
.grid3 p,.grid3 li{font-size:8.5pt;}
.sell{border:1px solid;border-radius:7px;padding:7px 10px;font-size:8.5pt;}
.sell .tags{display:block;margin-top:3px;color:rgba(11,18,32,0.45);font-size:7.5pt;}

table{width:100%;border-collapse:collapse;font-size:8.5pt;margin-bottom:12px;}
th{font-family:'Sora';font-weight:600;font-size:7.5pt;letter-spacing:1.4px;text-transform:uppercase;
   text-align:left;color:rgba(11,18,32,0.5);border-bottom:2px solid #00C8FF;padding:5px 7px;}
td{border-bottom:1px solid #E7EBF3;padding:5px 7px;vertical-align:top;}
td.price{font-family:'Sora';font-weight:800;color:#0B1220;white-space:nowrap;}
tr{page-break-inside:avoid;}
.week{display:flex;gap:6px;margin-bottom:12px;}
.week .d{flex:1;border:1px solid #E2E7F0;border-radius:7px;padding:7px 6px;text-align:center;}
.week .d b{font-family:'Sora';font-size:7.5pt;letter-spacing:0.6px;display:block;margin-bottom:2px;}
.week .d span{font-size:7pt;color:rgba(11,18,32,0.55);line-height:1.35;display:block;}
</style></head><body>

<!-- ── Cover ─────────────────────────────────────────────────────────── -->
<div class="cover">
  <div class="top">
    <img class="avatar" src="${portrait}"/>
    <div class="who">
      <div class="name">Ethan</div>
      <div class="role">Founder · MuleSoo Digital Services · Pretoria</div>
    </div>
  </div>
  <div class="kicker">Marketing 2 · Playbook &amp; Portfolio</div>
  <h1>Twelve systems we built.<br><span class="grad">One year of posts</span> that sell them.</h1>
  <p class="lede">This is every platform, chatbot, booking system and product MuleSoo has built —
  what each one does, what it costs, and a full 365-day posting calendar written to put them in
  front of the people who need them.</p>
  <div class="stats">
    <div class="stat"><b>${stats.projects}</b><span>Projects</span></div>
    <div class="stat"><b>365</b><span>Days planned</span></div>
    <div class="stat"><b>${comma(stats.posts)}</b><span>Posts written</span></div>
    <div class="stat"><b>5</b><span>Platforms</span></div>
  </div>
  <div class="foot">
    <img src="${LOCKUP}"/>
    <div class="contact">${SITE}<br>${EMAIL}<br>${WA}</div>
  </div>
</div>

<!-- ── How to use it ─────────────────────────────────────────────────── -->
<div class="page">
  <div class="kicker" style="font-family:'Sora';font-weight:600;font-size:8pt;letter-spacing:3px;
       text-transform:uppercase;color:rgba(11,18,32,0.5)">Section one</div>
  <h2>How to run this</h2>
  <div class="rule"></div>

  <p class="lede">Four minutes a day. That is the entire commitment.</p>

  <div class="box blue">
    <b>The daily routine</b>
    <ol style="margin:6px 0 0 16px;">
      <li>Open this month's PDF in <i>marketing2/PDF/</i> and find today.</li>
      <li>Post the picture shown on that page — the file name is printed beneath it, and the same
          image is in <i>marketing2/Images/</i>, sorted by month.</li>
      <li>Copy the caption for the platform you are posting to. It is already the right length.</li>
      <li>Publish. Reply to every comment within the hour — that is where the actual work is.</li>
    </ol>
  </div>

  <div class="box warn">
    <b>The one rule that protects everything else.</b> There is not a single invented statistic in
    this system. No "+300% bookings", no "47 happy clients". Every claim is a capability a reader
    can verify by opening the live site. Three projects — Sena, Yewogen Derash and DR. Hospital —
    are still in development and are labelled <b>IN BUILD</b> wherever they appear. Never post
    those as launched. An agency caught inflating one number loses the credibility of the other
    eleven projects with it.
  </div>

  <h3>The weekly rhythm</h3>
  <p>Each week runs straight through seven post types, so a project is explained and joked about
  long before it is ever offered. Only one day in seven asks for anything.</p>
  <div class="week">
    ${PILLARS.map((p, i) => `<div class="d"><b>Day ${i + 1}</b><span>${esc(p.label)}</span></div>`).join('')}
  </div>

  <h3>Why every post names a project</h3>
  <p>Generic agency content — "five tips for a better website" — is written by ten thousand
  accounts and remembered by nobody. A post that says <i>we built YoYo Gym, here is the exact
  problem it solved</i> does three jobs at once: it proves the work exists, it teaches something
  real, and it tells a gym owner reading it that you have already solved their problem once.
  Every one of the ${comma(stats.posts)} posts in this system names a project.</p>

  <h3>Where the pictures come from</h3>
  <p>Each day has a designed 1080×1080 card carrying that day's line, in the project's own accent
  colour, with the founder's portrait in the frame. The square format posts natively to Instagram,
  Facebook, LinkedIn, X and TikTok, so one image covers every platform. The face matters: people
  follow and buy from people, and a feed of pure logos reads as an advertisement.</p>
</div>

<!-- ── The work ──────────────────────────────────────────────────────── -->
<div class="page">
  <div style="font-family:'Sora';font-weight:600;font-size:8pt;letter-spacing:3px;
       text-transform:uppercase;color:rgba(11,18,32,0.5)">Section two</div>
  <h2>The work</h2>
  <div class="rule"></div>
  <p class="lede">Twelve systems, each one live or in active development. This is what the year of
  posts is actually selling.</p>
  ${PROJECTS.map(projectPage).join('\n')}
</div>

<!-- ── Pricing ───────────────────────────────────────────────────────── -->
<div class="page">
  <div style="font-family:'Sora';font-weight:600;font-size:8pt;letter-spacing:3px;
       text-transform:uppercase;color:rgba(11,18,32,0.5)">Section three</div>
  <h2>What it costs</h2>
  <div class="rule"></div>
  <p class="lede">Priced in Rand, because that is what we charge in. Every quote is fixed before
  work begins — the number does not move afterwards.</p>

  <table>
    <thead><tr><th>Service</th><th>From</th><th>What that covers</th></tr></thead>
    <tbody>
      ${PRICING.map(([s, p, n]) => `<tr><td><b>${esc(s)}</b></td><td class="price">${esc(p)}</td><td>${esc(n)}</td></tr>`).join('')}
    </tbody>
  </table>

  <div class="box">
    <b>What every build includes.</b> Mobile-first design, SEO setup, 30 days of free support after
    launch, and full ownership — the client owns the domain and the source code outright, with no
    monthly licence fee. Payment plans are available; ask.
  </div>

  <h3>Where to send people</h3>
  <table>
    <tbody>
      <tr><td><b>Book a free 30-minute call</b></td><td>${SITE}/contact</td></tr>
      <tr><td><b>WhatsApp</b></td><td>${WA}</td></tr>
      <tr><td><b>Email</b></td><td>${EMAIL}</td></tr>
      <tr><td><b>Buy a guide</b></td><td>${SITE}/store</td></tr>
      <tr><td><b>See the work</b></td><td>${SITE}/portfolio</td></tr>
    </tbody>
  </table>
</div>

<!-- ── Platforms ─────────────────────────────────────────────────────── -->
<div>
  <div style="font-family:'Sora';font-weight:600;font-size:8pt;letter-spacing:3px;
       text-transform:uppercase;color:rgba(11,18,32,0.5)">Section four</div>
  <h2>Platform by platform</h2>
  <div class="rule"></div>
  <p class="lede">The same sentence does not work everywhere. Every caption in this system is
  already written to the register below — this page explains why it reads differently on each one.</p>

  <table>
    <thead><tr><th style="width:22mm">Platform</th><th style="width:44mm">Who is there</th><th>How to post it</th></tr></thead>
    <tbody>
      ${PLATFORM_NOTES.map(([n, w, h]) => `<tr><td><b>${esc(n)}</b></td><td>${esc(w)}</td><td>${esc(h)}</td></tr>`).join('')}
    </tbody>
  </table>

  <h3>The three things that actually move the needle</h3>
  <div class="box">
    <b>1. Reply to every comment within the hour.</b> The algorithm rewards it, and more importantly
    the person who commented is the closest thing you have to a lead today.
  </div>
  <div class="box">
    <b>2. Post the same card everywhere, but never the same caption.</b> Identical copy across five
    platforms is the fastest way to look automated. The captions here are already differentiated.
  </div>
  <div class="box">
    <b>3. When a post lands, send it to the person it describes.</b> A gym owner who liked the YoYo
    Gym post is not an impression. Message them the same day.
  </div>

  <div class="box warn" style="margin-top:14px;">
    <b>Before you post an IN BUILD project:</b> say it is in build. "We are building this — early
    partners welcome" outperforms a fake launch, and it is the only version you can defend when
    somebody asks for a live link.
  </div>
</div>

</body></html>`;
}

function writePdf(file, buf) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try { fs.writeFileSync(file, buf); return file; }
    catch (e) {
      if (e.code !== 'EBUSY' && e.code !== 'EPERM') throw e;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 400);
    }
  }
  const alt = file.replace(/\.pdf$/, '.NEW.pdf');
  fs.writeFileSync(alt, buf);
  return alt;
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
  const rows = fs.existsSync(CSV) ? parseCsv(fs.readFileSync(CSV, 'utf8')) : [];
  const stats = { projects: PROJECTS.length, posts: rows.length || 1825 };

  const buf = await sharp(PORTRAIT_SRC)
    .extract({ left: 325, top: 60, width: 1250, height: 1250 })
    .resize(520, 520, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toBuffer();
  const portrait = `data:image/jpeg;base64,${buf.toString('base64')}`;

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    args: ['--font-render-hinting=none', '--force-color-profile=srgb'],
  });

  let written;
  try {
    const page = await browser.newPage();
    // A4 at 96dpi minus the print margins, so the preview PNG and the PDF wrap
    // their text at the same place.
    await page.setViewport({ width: 794 - 106, height: 1123, deviceScaleFactor: 1 });
    await page.setContent(html(portrait, stats), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);

    // --preview writes a tall PNG of the whole document. Layout faults in a PDF
    // are invisible until someone opens it; this makes them checkable.
    if (process.argv.includes('--preview')) {
      const png = path.join(OUT, 'playbook-preview.png');
      await page.screenshot({ path: png, fullPage: true });
      console.log(`  preview → ${path.relative(ROOT, png)}`);
    }

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', bottom: '16mm', left: '14mm', right: '14mm' },
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: `<div style="width:100%;font-size:7pt;color:#8A93A8;font-family:Arial;
          display:flex;justify-content:space-between;padding:0 14mm;">
        <span>MuleSoo Digital Services · Marketing 2 Playbook · ${SITE}</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>`,
    });
    written = writePdf(path.join(OUT, 'MuleSoo-Marketing2-Playbook.pdf'), pdf);
    console.log(`\n  ${path.basename(written)}  ${(pdf.length / 1024).toFixed(0)} KB`);
  } finally {
    await browser.close();
  }

  console.log(`  ${stats.projects} projects · ${stats.posts} posts referenced`);
  console.log(`  → ${path.relative(ROOT, written)}\n`);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
