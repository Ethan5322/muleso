/* Generates the full favicon set from the MuleSoo logo icon.
   Run: node scripts/make-favicons.cjs
   Outputs:
     app/favicon.ico       — multi-size ICO (16/32/48, PNG-compressed entries)
     app/icon.png          — 512×512 transparent (Next auto <link rel="icon">)
     app/apple-icon.png    — 180×180 on brand-dark bg (apple-touch-icon)
     public/icon-192.png   — PWA manifest icon (dark bg, padded)
     public/icon-512.png   — PWA manifest icon (dark bg, padded)
*/
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = path.join(process.cwd(), 'public', 'mulesoo-logo-icon.png');
const DARK = { r: 10, g: 15, b: 30, alpha: 1 }; // #0A0F1E brand card

async function pngSquare(size, { bg = null, pad = 0 } = {}) {
  const inner = size - pad * 2;
  const logo = await sharp(SRC)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg || { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: logo, left: pad, top: pad }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** Build a .ico container from PNG buffers (PNG-in-ICO, supported everywhere modern). */
function buildIco(entries /* [{size, buf}] */) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);

  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + dir.length;
  entries.forEach((e, i) => {
    const o = i * 16;
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, o); // width
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, o + 1); // height
    dir.writeUInt8(0, o + 2); // palette
    dir.writeUInt8(0, o + 3); // reserved
    dir.writeUInt16LE(1, o + 4); // planes
    dir.writeUInt16LE(32, o + 6); // bpp
    dir.writeUInt32LE(e.buf.length, o + 8); // bytes
    dir.writeUInt32LE(offset, o + 12); // offset
    offset += e.buf.length;
  });
  return Buffer.concat([header, dir, ...entries.map((e) => e.buf)]);
}

(async () => {
  // Browser tab icons — transparent background
  const png16 = await pngSquare(16);
  const png32 = await pngSquare(32);
  const png48 = await pngSquare(48);
  fs.writeFileSync('app/favicon.ico', buildIco([
    { size: 16, buf: png16 },
    { size: 32, buf: png32 },
    { size: 48, buf: png48 },
  ]));
  console.log('app/favicon.ico          ', fs.statSync('app/favicon.ico').size, 'bytes (16+32+48)');

  fs.writeFileSync('app/icon.png', await pngSquare(512));
  console.log('app/icon.png             ', fs.statSync('app/icon.png').size, 'bytes (512, transparent)');

  // Apple touch icon — solid brand background (iOS dislikes transparency)
  fs.writeFileSync('app/apple-icon.png', await pngSquare(180, { bg: DARK, pad: 18 }));
  console.log('app/apple-icon.png       ', fs.statSync('app/apple-icon.png').size, 'bytes (180, dark bg)');

  // PWA manifest icons — dark bg + safe padding for maskable
  fs.writeFileSync('public/icon-192.png', await pngSquare(192, { bg: DARK, pad: 24 }));
  fs.writeFileSync('public/icon-512.png', await pngSquare(512, { bg: DARK, pad: 64 }));
  console.log('public/icon-192.png      ', fs.statSync('public/icon-192.png').size, 'bytes');
  console.log('public/icon-512.png      ', fs.statSync('public/icon-512.png').size, 'bytes');
  console.log('done');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
