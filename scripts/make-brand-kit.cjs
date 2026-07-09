/* MuleSoo brand kit — corporate business card (ATM/CR80 size) + banner.
   Designs are SVG (full vector control), rendered by sharp at print DPI,
   exported as high-quality PNG + PDF.

   Run: node scripts/make-brand-kit.cjs
   Out: marketing/brand-kit/
*/
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { jsPDF } = require('jspdf');

const OUT = path.join(process.cwd(), 'marketing', 'brand-kit');
fs.mkdirSync(OUT, { recursive: true });

// CR80 card @600dpi
const CW = 2022, CH = 1276;
// Banner 3:1
const BW = 2400, BH = 800;

const FONT = `Segoe UI, Arial, Helvetica, sans-serif`;
const INK = '#0A0F1E', CARD = '#0D1528', BLUE = '#00C8FF', PURPLE = '#7B2FFF', GOLD = '#E8B84B';
const TXT = '#F0F2FA', MUT = '#A8B2D0';

const logoB64 = fs.readFileSync('public/mulesoo-logo-transparent.png').toString('base64');
const LOGO = `data:image/png;base64,${logoB64}`;
const logoIconB64 = fs.readFileSync('public/mulesoo-logo-icon.png').toString('base64');
const ICON = `data:image/png;base64,${logoIconB64}`;

const defs = (id) => `
  <defs>
    <linearGradient id="bg${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${INK}"/><stop offset="1" stop-color="#101A33"/>
    </linearGradient>
    <linearGradient id="bar${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${BLUE}"/><stop offset="1" stop-color="${PURPLE}"/>
    </linearGradient>
    <radialGradient id="glowB${id}"><stop offset="0" stop-color="${BLUE}" stop-opacity="0.16"/><stop offset="1" stop-color="${BLUE}" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowP${id}"><stop offset="0" stop-color="${PURPLE}" stop-opacity="0.16"/><stop offset="1" stop-color="${PURPLE}" stop-opacity="0"/></radialGradient>
    <pattern id="grid${id}" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M60 0 L0 0 0 60" fill="none" stroke="#ffffff" stroke-opacity="0.035" stroke-width="1.4"/>
    </pattern>
  </defs>`;

// ── CARD FRONT ─────────────────────────────────────────────────
function cardFront() {
  return `<svg width="${CW}" height="${CH}" viewBox="0 0 ${CW} ${CH}" xmlns="http://www.w3.org/2000/svg">
  ${defs('f')}
  <rect width="${CW}" height="${CH}" fill="url(#bgf)"/>
  <rect width="${CW}" height="${CH}" fill="url(#gridf)"/>
  <circle cx="1780" cy="1080" r="620" fill="url(#glowPf)"/>
  <circle cx="240" cy="140" r="520" fill="url(#glowBf)"/>
  <circle cx="1795" cy="245" r="150" fill="none" stroke="${BLUE}" stroke-opacity="0.35" stroke-width="3"/>
  <circle cx="1795" cy="245" r="205" fill="none" stroke="${GOLD}" stroke-opacity="0.30" stroke-width="3"/>
  <rect width="${CW}" height="22" fill="url(#barf)"/>
  <rect y="22" width="${CW}" height="7" fill="${GOLD}"/>
  <rect y="${CH - 16}" width="${CW}" height="16" fill="url(#barf)"/>

  <image href="${LOGO}" x="${(CW - 1160) / 2}" y="330" width="1160" height="${Math.round(1160 * 216 / 1000)}"/>
  <text x="${CW / 2}" y="712" text-anchor="middle" font-family="${FONT}" font-size="56" font-weight="600" letter-spacing="18" fill="${GOLD}">D I G I T A L&#160;&#160;S E R V I C E S</text>
  <text x="${CW / 2}" y="836" text-anchor="middle" font-family="${FONT}" font-size="54" fill="${MUT}">Websites&#160;&#160;·&#160;&#160;AI Chatbots&#160;&#160;·&#160;&#160;Auto Pilot Systems</text>
  <rect x="${CW / 2 - 260}" y="906" width="520" height="4" fill="${GOLD}" opacity="0.85"/>
  <text x="${CW / 2}" y="1030" text-anchor="middle" font-family="${FONT}" font-size="64" font-weight="700" fill="${BLUE}">www.mulesoo.com</text>
  <text x="${CW / 2}" y="1130" text-anchor="middle" font-family="${FONT}" font-size="44" fill="${MUT}">Pretoria, South Africa</text>
</svg>`;
}

// ── CARD BACK ──────────────────────────────────────────────────
function cardBack(qr) {
  const row = (y, color, label) => `
    <circle cx="158" cy="${y - 16}" r="11" fill="${color}"/>
    <text x="205" y="${y}" font-family="${FONT}" font-size="56" fill="${TXT}">${label}</text>`;
  return `<svg width="${CW}" height="${CH}" viewBox="0 0 ${CW} ${CH}" xmlns="http://www.w3.org/2000/svg">
  ${defs('b')}
  <rect width="${CW}" height="${CH}" fill="url(#bgb)"/>
  <rect width="${CW}" height="${CH}" fill="url(#gridb)"/>
  <circle cx="300" cy="1120" r="560" fill="url(#glowBb)"/>
  <rect width="${CW}" height="22" fill="url(#barb)"/>
  <rect y="22" width="${CW}" height="7" fill="${GOLD}"/>
  <rect y="${CH - 16}" width="${CW}" height="16" fill="url(#barb)"/>

  <image href="${ICON}" x="132" y="118" width="150" height="150"/>
  <text x="316" y="196" font-family="${FONT}" font-size="76" font-weight="800" fill="${TXT}">MULE<tspan fill="${GOLD}">●</tspan>SOO</text>
  <text x="318" y="252" font-family="${FONT}" font-size="38" letter-spacing="14" fill="${BLUE}">DIGITAL SERVICES</text>

  <text x="140" y="470" font-family="${FONT}" font-size="92" font-weight="800" fill="${TXT}">Ena Muluken</text>
  <text x="140" y="556" font-family="${FONT}" font-size="54" font-weight="600" fill="${BLUE}">Founder &amp; CEO</text>
  <rect x="140" y="606" width="470" height="4" fill="${GOLD}" opacity="0.9"/>

  ${row(740, BLUE, '+27 68 852 9333')}
  ${row(852, PURPLE, 'hello@mulesoo.com')}
  ${row(964, GOLD, 'www.mulesoo.com')}
  ${row(1076, '#00FF88', 'Pretoria, South Africa')}

  <rect x="1352" y="332" width="540" height="540" rx="34" fill="#ffffff"/>
  <image href="${qr}" x="1388" y="368" width="468" height="468"/>
  <text x="1622" y="948" text-anchor="middle" font-family="${FONT}" font-size="44" font-weight="700" letter-spacing="8" fill="${GOLD}">SCAN TO VISIT</text>
  <text x="1622" y="1010" text-anchor="middle" font-family="${FONT}" font-size="38" fill="${MUT}">mulesoo.com</text>
</svg>`;
}

// ── BANNER ─────────────────────────────────────────────────────
function banner(qr) {
  return `<svg width="${BW}" height="${BH}" viewBox="0 0 ${BW} ${BH}" xmlns="http://www.w3.org/2000/svg">
  ${defs('n')}
  <rect width="${BW}" height="${BH}" fill="url(#bgn)"/>
  <rect width="${BW}" height="${BH}" fill="url(#gridn)"/>
  <circle cx="2200" cy="120" r="560" fill="url(#glowPn)"/>
  <circle cx="180" cy="700" r="520" fill="url(#glowBn)"/>
  <circle cx="1620" cy="400" r="330" fill="none" stroke="${BLUE}" stroke-opacity="0.12" stroke-width="2.5"/>
  <circle cx="1620" cy="400" r="390" fill="none" stroke="${GOLD}" stroke-opacity="0.10" stroke-width="2.5"/>
  <rect width="${BW}" height="14" fill="url(#barn)"/>
  <rect y="14" width="${BW}" height="5" fill="${GOLD}"/>
  <rect y="${BH - 12}" width="${BW}" height="12" fill="url(#barn)"/>

  <image href="${LOGO}" x="120" y="120" width="820" height="${Math.round(820 * 216 / 1000)}"/>
  <text x="128" y="404" font-family="${FONT}" font-size="66" font-weight="800" fill="${TXT}">World-Class Websites, AI Chatbots</text>
  <text x="128" y="490" font-family="${FONT}" font-size="66" font-weight="800" fill="${TXT}">&amp; Auto Pilot Systems</text>
  <rect x="128" y="530" width="430" height="5" fill="${GOLD}" opacity="0.9"/>
  <text x="128" y="614" font-family="${FONT}" font-size="44" fill="${MUT}">Built in Pretoria — serving businesses across Africa</text>
  <text x="128" y="706" font-family="${FONT}" font-size="47" font-weight="700" fill="${BLUE}">www.mulesoo.com&#160;&#160;&#160;·&#160;&#160;&#160;hello@mulesoo.com&#160;&#160;&#160;·&#160;&#160;&#160;+27 68 852 9333</text>

  <rect x="1908" y="182" width="436" height="436" rx="30" fill="#ffffff"/>
  <image href="${qr}" x="1938" y="212" width="376" height="376"/>
  <text x="2126" y="682" text-anchor="middle" font-family="${FONT}" font-size="40" font-weight="700" letter-spacing="7" fill="${GOLD}">SCAN TO START</text>
</svg>`;
}

// ── render helpers ─────────────────────────────────────────────
async function png(svg, file) {
  const buf = await sharp(Buffer.from(svg), { density: 96 }).png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(OUT, file), buf);
  console.log(file.padEnd(28), (buf.length / 1024).toFixed(0) + ' KB');
  return buf;
}

(async () => {
  const qr = await QRCode.toDataURL('https://mulesoo.com', { width: 900, margin: 0, color: { dark: INK, light: '#FFFFFF' } });

  const front = await png(cardFront(), 'business-card-front.png');
  const back = await png(cardBack(qr), 'business-card-back.png');
  const ban = await png(banner(qr), 'banner.png');

  // PDF — business card at exact ATM/CR80 size (85.6 × 54 mm), front + back
  const card = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 54] });
  card.addImage('data:image/png;base64,' + front.toString('base64'), 'PNG', 0, 0, 85.6, 54);
  card.addPage([85.6, 54], 'landscape');
  card.addImage('data:image/png;base64,' + back.toString('base64'), 'PNG', 0, 0, 85.6, 54);
  fs.writeFileSync(path.join(OUT, 'MuleSoo-Business-Card.pdf'), Buffer.from(card.output('arraybuffer')));
  console.log('MuleSoo-Business-Card.pdf'.padEnd(28), 'front+back @ 85.6x54mm');

  // PDF — banner (300 × 100 mm print page)
  const bp = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [300, 100] });
  bp.addImage('data:image/png;base64,' + ban.toString('base64'), 'PNG', 0, 0, 300, 100);
  fs.writeFileSync(path.join(OUT, 'MuleSoo-Banner.pdf'), Buffer.from(bp.output('arraybuffer')));
  console.log('MuleSoo-Banner.pdf'.padEnd(28), '300x100mm');
  console.log('\nAll files in marketing/brand-kit/');
})().catch((e) => { console.error(e); process.exit(1); });
