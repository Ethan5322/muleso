# Regenerating the YouTube channel art

The PNGs one folder up are rendered from HTML by headless Chrome, so a wording or spacing
change is an edit to `build-youtube-assets.mjs` — never a hand-edit of the PNG.

## 1. Rebuild the HTML

```bash
node marketing/YouTube/src/build-youtube-assets.mjs
```

This inlines the brand fonts (`assets/fonts/*.woff2`) and the logo (`public/*.png`) as data
URIs. That is deliberate: with a network fetch or a plain `file://` reference, Chrome renders
before the asset arrives and silently falls back to Segoe UI, and the lockup comes out
off-brand without erroring.

## 2. Render each PNG

Run from `marketing/YouTube/`. The `file:///C:/...` URL must be absolute — Chrome treats a
relative path as a hostname and screenshots a DNS error page instead.

```bash
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
SRC="file:///C:/Users/mule/OneDrive/Desktop/mulesoo/marketing/YouTube/src"
OUT="C:\Users\mule\OneDrive\Desktop\mulesoo\marketing\YouTube"

"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=2560,1440 \
  --screenshot="$OUT\MuleSoo-YouTube-Banner-2560x1440.png" "$SRC/banner-2560x1440.html"

"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=800,800 \
  --screenshot="$OUT\MuleSoo-YouTube-Profile-800x800.png" "$SRC/profile-800x800.html"

# --default-background-color=00000000 is what keeps the watermark's alpha channel.
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --default-background-color=00000000 --window-size=150,150 \
  --screenshot="$OUT\MuleSoo-YouTube-Watermark-150x150.png" "$SRC/watermark-150x150.html"
```

`--force-device-scale-factor=1` matters: without it a HiDPI display makes Chrome render at 2x
and you get a 5120 × 2880 file that YouTube downscales unpredictably.

## 3. Rebuild the setup-sheet PDF

```bash
node marketing/YouTube/src/build-setup-pdf.mjs

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$OUT\MuleSoo-YouTube-Setup-Sheet.pdf" "$SRC/setup-sheet.html"
```

All copy lives in `build-setup-pdf.mjs`, not in the HTML — edit it there. The Amharic blocks
need `noto-ethiopic-400-static.ttf`, which the script inlines; without it Chrome prints tofu
boxes rather than failing, so eyeball page 2 after any font change.

## Layout constraint that governs the banner

One 2560 × 1440 file is cropped three ways by YouTube:

| Surface | Crop |
|---|---|
| TV | 2560 × 1440 (all of it) |
| Desktop | 2560 × 423 — the full-width middle band |
| Mobile | 1546 × 423 — centred |

So all text lives in the centred **1546 × 423** `.safe` box. Anything outside it is atmosphere
that mobile viewers will never see. If you add a line of copy, re-measure: the safe box is
423px tall and the current stack uses ~300px.
