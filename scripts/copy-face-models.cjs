/**
 * Copies the face-api model weights out of node_modules into public/models so
 * they are served same-origin from the Vercel CDN instead of jsdelivr.
 *
 * public/models is gitignored — this runs on postinstall and prebuild, so the
 * files exist locally and in every deploy without living in the repo.
 *
 * Only the three models the app actually uses are copied (the package ships
 * age/gender/expression/ssd nets we never load).
 */
const fs = require('fs');
const path = require('path');

const MODELS = ['tiny_face_detector_model', 'face_landmark_68_model', 'face_recognition_model'];

const src = path.join(__dirname, '..', 'node_modules', '@vladmandic', 'face-api', 'model');
const dest = path.join(__dirname, '..', 'public', 'models');

if (!fs.existsSync(src)) {
  console.warn('[face-models] @vladmandic/face-api not installed yet — skipping copy.');
  process.exit(0);
}

fs.mkdirSync(dest, { recursive: true });

let copied = 0;
let bytes = 0;
for (const model of MODELS) {
  for (const file of [`${model}-weights_manifest.json`, `${model}.bin`]) {
    const from = path.join(src, file);
    const to = path.join(dest, file);
    if (!fs.existsSync(from)) {
      console.error(`[face-models] missing ${file} in the face-api package.`);
      process.exit(1);
    }
    // Skip identical re-copies so repeated builds stay fast.
    const srcStat = fs.statSync(from);
    if (fs.existsSync(to) && fs.statSync(to).size === srcStat.size) continue;
    fs.copyFileSync(from, to);
    copied++;
    bytes += srcStat.size;
  }
}

console.log(
  copied
    ? `[face-models] copied ${copied} file(s), ${(bytes / 1024 / 1024).toFixed(1)}MB → public/models`
    : '[face-models] public/models already up to date'
);
