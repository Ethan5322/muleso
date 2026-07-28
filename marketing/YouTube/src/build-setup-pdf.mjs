/**
 * Builds the print-ready HTML for MuleSoo-YouTube-Setup-Sheet.pdf — the sheet you
 * keep open while filling in a brand-new YouTube channel.
 *
 * Fonts and the logo are inlined so the PDF is self-contained and renders with
 * the real brand typefaces (including Ethiopic for the Amharic fields).
 *
 * Usage: node marketing/YouTube/src/build-setup-pdf.mjs
 * Then:  chrome --headless --print-to-pdf=... setup-sheet.html
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../../..');
const uri = (p, mime) => `data:${mime};base64,${readFileSync(join(ROOT, p)).toString('base64')}`;
const font = (f) => uri(`assets/fonts/${f}`, f.endsWith('woff2') ? 'font/woff2' : 'font/ttf');

const LOGO = uri('public/mulesoo-logo-transparent.png', 'image/png');

const C = {
  ink: '#050810', card: '#0A0F1E', blue: '#00C8FF', purple: '#7B2FFF',
  gold: '#E8B84B', border: '#D8DEEA', body: '#2A3550', dim: '#5A6685',
};

/** A field the user copies into a YouTube form. */
const field = (label, where, value, note = '') => `
<div class="field">
  <div class="flabel">${label}</div>
  <div class="fwhere">${where}</div>
  <pre class="copy">${value.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>
  ${note ? `<div class="fnote">${note}</div>` : ''}
</div>`;

const DESCRIPTION = `MuleSoo Digital Services builds world-class websites, AI chatbots and automation systems for businesses across South Africa and Africa.

This channel shows the work. How a business goes from "we need a website" to a live, fast site that actually converts. How an AI assistant answers customers and books jobs at 2am. How the admin you do by hand becomes a system that runs itself.

What you'll find here:

- Website builds, start to finish
- AI chatbots and WhatsApp assistants
- Booking, payment and automation systems
- Digital ID cards and QR verification
- Straight-talking advice for business owners going digital

Founded by Ena Muluken. Based in Pretoria, South Africa - building for clients across the continent.

Most projects launch within 3 weeks.

Work with us: https://mulesoo.com
Email: hello@mulesoo.com
WhatsApp: +27 68 852 9333

See what we've built: https://mulesoo.com/portfolio`;

const DESCRIPTION_AM = `ሙሌሱ ዲጂታል ሰርቪስስ በደቡብ አፍሪካና በአፍሪካ ላሉ ንግዶች የዓለም አቀፍ ደረጃ ያላቸው ድረ-ገጾች፣ የ AI ቻትቦቶችና አውቶሜሽን ሲስተሞች ይሠራል።

በዚህ ቻናል ላይ ሥራውን በተግባር እናሳያለን። አንድ ንግድ "ድረ-ገጽ እንፈልጋለን" ከሚለው ተነስቶ ፈጣንና ደንበኛ ወደሚያመጣ ድረ-ገጽ እንዴት እንደሚደርስ። የ AI ረዳት ሌሊት ሁለት ሰዓት ላይ ደንበኞችን መልስ ሰጥቶ ቀጠሮ እንዴት እንደሚይዝ። በእጅ የምትሠራው አስተዳደራዊ ሥራ ራሱን ወደሚያሄድ ሲስተም እንዴት እንደሚቀየር።

እዚህ የምታገኛቸው:

- ድረ-ገጽ ከመጀመሪያው እስከ መጨረሻው
- የ AI ቻትቦቶችና የ WhatsApp ረዳቶች
- የቀጠሮ፣ የክፍያና የአውቶሜሽን ሲስተሞች
- ዲጂታል መታወቂያና የ QR ማረጋገጫ
- ወደ ዲጂታል ለሚሸጋገሩ ነጋዴዎች ግልጽ ምክር

መሥራች: እና ሙሉቀን። መቀመጫችን ፕሪቶሪያ፣ ደቡብ አፍሪካ ነው።

አብዛኞቹ ፕሮጀክቶች በ3 ሳምንት ውስጥ ይጠናቀቃሉ።

ድረ-ገጽ: https://mulesoo.com
ኢሜይል: hello@mulesoo.com
ዋትስአፕ: +27 68 852 9333`;

const KEYWORDS = `"MuleSoo", "web design Pretoria", "website design South Africa", "AI chatbot South Africa", "digital agency Pretoria", "web developer South Africa", "AI automation South Africa", "chatbot development", "logo design South Africa", "QR code design", "small business website", "Next.js developer", "booking system South Africa", "digital ID card", "WhatsApp business automation", "website design for small business"`;

const UPLOAD_DESC = `MuleSoo Digital Services - websites, AI chatbots and automation for businesses in South Africa and across the continent.

Start your project: https://mulesoo.com/contact
See our work: https://mulesoo.com/portfolio
WhatsApp: https://wa.me/27688529333
Email: hello@mulesoo.com

What we build:
Websites - from R3,500
AI Chatbots - from R2,500
Support & Sales Widget - from R3,500
Logo Design - from R800
QR Code Design - from R300
Custom Email Setup - from R400
PDF Guides - from R99
AI Automation - from R5,000
Custom Apps, Digital ID & Auto Pilot systems - quoted per project

Most projects launch within 3 weeks.
Pretoria, South Africa.

Subscribe: https://www.youtube.com/@mulesoo?sub_confirmation=1`;

const TAGS = `mulesoo, web design south africa, website design pretoria, ai chatbot, ai automation, small business website, chatbot development, digital agency south africa, qr code design, logo design, booking system, whatsapp automation, nextjs website, digital id card, business automation`;

const LINKS = [
  ['Our Website', 'https://mulesoo.com'],
  ['Get a Free Quote', 'https://mulesoo.com/contact'],
  ['WhatsApp Us', 'https://wa.me/27688529333'],
  ['Services &amp; Pricing', 'https://mulesoo.com/services'],
  ['Portfolio', 'https://mulesoo.com/portfolio'],
  ['AI Automation', 'https://mulesoo.com/ai-automation'],
  ['Digital Store', 'https://mulesoo.com/store'],
];

const SETTINGS = [
  ['Country of residence', 'Settings &rarr; Channel &rarr; Basic info', 'South Africa'],
  ['Made for kids', 'Settings &rarr; Channel &rarr; Advanced', 'No, not made for kids'],
  ['Default upload visibility', 'Settings &rarr; Upload defaults &rarr; Advanced', 'Private'],
  ['Default video language', 'Settings &rarr; Upload defaults &rarr; Advanced', 'English (South Africa)'],
  ['Default category', 'Settings &rarr; Upload defaults &rarr; Advanced', 'Science &amp; Technology'],
  ['Comments', 'Settings &rarr; Upload defaults &rarr; Advanced', 'Hold potentially inappropriate comments for review'],
  ['Phone verification', 'Settings &rarr; Channel &rarr; Feature eligibility', 'Verify - it unlocks custom thumbnails'],
];

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>MuleSoo - YouTube Channel Setup Sheet</title>
<style>
@font-face { font-family:'Sora'; src:url('${font('sora-latin-600-normal.woff2')}') format('woff2'); font-weight:600 }
@font-face { font-family:'Sora'; src:url('${font('sora-latin-700-normal.woff2')}') format('woff2'); font-weight:700 }
@font-face { font-family:'Sora'; src:url('${font('sora-latin-800-normal.woff2')}') format('woff2'); font-weight:800 }
@font-face { font-family:'DM Sans'; src:url('${font('dm-sans-latin-400-normal.woff2')}') format('woff2'); font-weight:400 }
@font-face { font-family:'DM Sans'; src:url('${font('dm-sans-latin-500-normal.woff2')}') format('woff2'); font-weight:500 }
@font-face { font-family:'Noto Ethiopic'; src:url('${font('noto-ethiopic-400-static.ttf')}') format('truetype'); font-weight:400 }

@page { size: A4; margin: 14mm 13mm 16mm; }
* { margin:0; padding:0; box-sizing:border-box }
body { font-family:'DM Sans', sans-serif; font-size:9.6pt; line-height:1.55; color:${C.body};
  -webkit-print-color-adjust:exact; print-color-adjust:exact }

/* ── Cover band ─────────────────────────────────────────────── */
.cover { background:linear-gradient(135deg, ${C.ink} 0%, ${C.card} 55%, ${C.ink} 100%);
  color:#F0F2FA; padding:26px 30px 24px; border-radius:10px; margin-bottom:20px; position:relative;
  overflow:hidden }
.cover::after { content:''; position:absolute; right:-70px; top:-70px; width:260px; height:260px;
  border-radius:50%; background:radial-gradient(circle, rgba(0,200,255,0.22), transparent 65%) }
.cover img { height:46px; margin-bottom:16px; position:relative }
.cover h1 { font-family:'Sora'; font-weight:800; font-size:22pt; letter-spacing:-0.4px;
  line-height:1.15; position:relative }
.cover h1 span { background:linear-gradient(100deg, ${C.blue}, ${C.purple});
  -webkit-background-clip:text; background-clip:text; color:transparent }
.cover p { color:#A8B2D0; font-size:9.5pt; margin-top:9px; max-width:150mm; position:relative }
.cover .rule { width:70px; height:3px; margin-top:14px; border-radius:2px;
  background:linear-gradient(90deg, ${C.gold}, rgba(232,184,75,0)); position:relative }

/* ── Sections ───────────────────────────────────────────────── */
h2 { font-family:'Sora'; font-weight:700; font-size:12.5pt; color:${C.ink};
  margin:22px 0 3px; padding-bottom:6px; border-bottom:1.5px solid ${C.border} }
h2 .n { color:${C.gold}; margin-right:8px }
.lede { color:${C.dim}; font-size:8.8pt; margin-bottom:12px }

.field { margin-bottom:13px; break-inside:avoid }
.flabel { font-family:'Sora'; font-weight:600; font-size:9.6pt; color:${C.ink} }
.fwhere { font-size:8pt; color:${C.dim}; margin-bottom:5px }
.copy { font-family:Consolas,'Courier New',monospace; font-size:8.2pt; line-height:1.5;
  background:#F4F6FB; border:1px solid ${C.border}; border-left:3px solid ${C.blue};
  border-radius:5px; padding:9px 11px; white-space:pre-wrap; word-break:break-word; color:#16203A }
.copy.am { font-family:'Noto Ethiopic','DM Sans',sans-serif; font-size:9pt; line-height:1.75;
  border-left-color:${C.purple} }
.fnote { font-size:8pt; color:${C.dim}; margin-top:4px }

table { width:100%; border-collapse:collapse; margin-bottom:12px; break-inside:avoid }
th { font-family:'Sora'; font-weight:600; font-size:8.2pt; text-transform:uppercase;
  letter-spacing:0.6px; color:${C.dim}; text-align:left; padding:6px 8px;
  border-bottom:1.5px solid ${C.border} }
td { padding:6px 8px; border-bottom:1px solid #EDF0F6; font-size:8.8pt; vertical-align:top }
td.mono { font-family:Consolas,'Courier New',monospace; font-size:8.2pt; color:#16203A }
tr:last-child td { border-bottom:none }

ol.steps { margin:2px 0 0 16px }
ol.steps li { margin-bottom:5px; padding-left:3px }

.callout { background:#FBF6E8; border:1px solid #E9DCB4; border-left:3px solid ${C.gold};
  border-radius:5px; padding:9px 11px; font-size:8.6pt; margin-bottom:12px; break-inside:avoid }
.callout b { font-family:'Sora'; font-weight:600; color:${C.ink} }

footer { margin-top:22px; padding-top:10px; border-top:1px solid ${C.border};
  font-size:7.8pt; color:${C.dim}; display:flex; justify-content:space-between }
.pagebreak { break-before:page }
</style></head>
<body>

<div class="cover">
  <img src="${LOGO}" alt="MuleSoo">
  <h1>YouTube Channel<br><span>Setup Sheet</span></h1>
  <p>Every field you need when creating the MuleSoo channel, ready to copy. Colours, logo,
     address, services and prices are taken from the live mulesoo.com project.</p>
  <div class="rule"></div>
</div>

<h2><span class="n">01</span>Images to upload</h2>
<div class="lede">Studio &rarr; Customisation &rarr; Branding. All three files sit in the same folder as this PDF.</div>
<table>
  <tr><th style="width:42%">File</th><th style="width:22%">Size</th><th>Field</th></tr>
  <tr><td class="mono">MuleSoo-YouTube-Profile-800x800.png</td><td>800 &times; 800</td><td>Picture</td></tr>
  <tr><td class="mono">MuleSoo-YouTube-Banner-2560x1440.png</td><td>2560 &times; 1440</td><td>Banner image</td></tr>
  <tr><td class="mono">MuleSoo-YouTube-Watermark-150x150.png</td><td>150 &times; 150</td><td>Video watermark</td></tr>
</table>
<div class="callout"><b>These are YouTube's own recommended sizes.</b> The banner is one file that
YouTube crops three ways &mdash; 1546 &times; 423 on phones, 2560 &times; 423 on desktop, the full frame on TV.
All the text sits inside the phone-sized safe area, so nothing gets cut off. Check it on your
phone after uploading: that is the tightest crop.</div>

<h2><span class="n">02</span>Name and handle</h2>
<div class="lede">Studio &rarr; Customisation &rarr; Basic info</div>
${field('Channel name', 'Basic info &rarr; Name', 'MuleSoo Digital Services')}
${field('Handle', 'Basic info &rarr; Handle', '@mulesoo',
  'Claim this first &mdash; it is the one thing you cannot change later without breaking every link. youtube.com/@mulesoo returned 404 on 28 Jul 2026, so it looked free. If it has been taken, the agreed fallback is <b>@mulesoodigital</b>, and it must then be changed everywhere else too.')}

<h2><span class="n">03</span>Channel description</h2>
<div class="lede">Studio &rarr; Customisation &rarr; Basic info &rarr; Description &middot; limit 1,000 characters &middot; this uses 897</div>
${field('Description (English)', 'Paste exactly as shown', DESCRIPTION)}

<div class="pagebreak"></div>
<h2><span class="n">04</span>Amharic translation <span style="font-family:'DM Sans';font-weight:400;font-size:8.5pt;color:${C.dim}">(optional)</span></h2>
<div class="lede">Studio &rarr; Customisation &rarr; Basic info &rarr; &ldquo;+ ADD LANGUAGE&rdquo; &rarr; Amharic</div>
${field('Translated channel name', 'Amharic', 'ሙሌሱ ዲጂታል ሰርቪስስ').replace('class="copy"', 'class="copy am"')}
${field('Translated description', 'Amharic', DESCRIPTION_AM).replace('class="copy"', 'class="copy am"')}

<h2><span class="n">05</span>Links and contact</h2>
<div class="lede">Studio &rarr; Customisation &rarr; Basic info &rarr; Links. Add in this order &mdash; the first one is what YouTube shows on your banner.</div>
<table>
  <tr><th style="width:8%">#</th><th style="width:34%">Link title</th><th>URL</th></tr>
  ${LINKS.map(([t, u], i) => `<tr><td>${i + 1}</td><td class="mono">${t}</td><td class="mono">${u}</td></tr>`).join('')}
</table>
${field('Email for business enquiries', 'Basic info &rarr; Contact info', 'hello@mulesoo.com')}

<h2><span class="n">06</span>Channel keywords</h2>
<div class="lede">Studio &rarr; Settings &rarr; Channel &rarr; Basic info &rarr; Keywords &middot; limit 500 characters &middot; this uses 412</div>
${field('Keywords', 'Paste as one line &mdash; the quotes keep multi-word phrases together', KEYWORDS)}

<div class="pagebreak"></div>
<h2><span class="n">07</span>Settings to change from the default</h2>
<table>
  <tr><th style="width:26%">Setting</th><th style="width:38%">Where</th><th>Set to</th></tr>
  ${SETTINGS.map(([s, w, v]) => `<tr><td>${s}</td><td style="color:${C.dim}">${w}</td><td class="mono">${v}</td></tr>`).join('')}
</table>

<h2><span class="n">08</span>Upload defaults</h2>
<div class="lede">Studio &rarr; Settings &rarr; Upload defaults. Set once and every future video carries it automatically.</div>
${field('Default description', 'Upload defaults &rarr; Basic info &rarr; Description', UPLOAD_DESC,
  'Prices are the live ones from the services page. If you change pricing on the site, change it here too &mdash; a stale price under a video is a promise you have to honour.')}
${field('Default tags', 'Upload defaults &rarr; Basic info &rarr; Tags', TAGS)}

<h2><span class="n">09</span>Order to do it in</h2>
<ol class="steps">
  <li>Create the account and claim <b>@mulesoo</b>.</li>
  <li>Verify by phone (Settings &rarr; Channel &rarr; Feature eligibility) &mdash; unlocks custom thumbnails.</li>
  <li>Upload the three images (Branding tab).</li>
  <li>Paste name, description, links and contact email (Basic info tab).</li>
  <li>Paste keywords and set country (Settings &rarr; Channel).</li>
  <li>Set the upload defaults from sections 07 and 08.</li>
  <li>Add the Amharic translation.</li>
  <li>In the codebase, flip <span class="mono">youtube</span> to <span class="mono">live: true</span>
      in <span class="mono">lib/socials.ts</span> &mdash; until then the footer icon and the
      <span class="mono">sameAs</span> schema deliberately hide the channel.</li>
</ol>

<footer>
  <span>MuleSoo Digital Services &middot; Pretoria, South Africa &middot; hello@mulesoo.com</span>
  <span>mulesoo.com</span>
</footer>

</body></html>`;

writeFileSync(join(HERE, 'setup-sheet.html'), html);
console.log('wrote setup-sheet.html', (html.length / 1024).toFixed(0) + 'kb');
