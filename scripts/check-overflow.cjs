/* Measures horizontal overflow at a mobile viewport and lists offending elements.
   Usage: node scripts/check-overflow.cjs [url] [width] */
const puppeteer = require('puppeteer-core');
(async () => {
  const url = process.argv[2] || 'https://mulesoo.com';
  const width = parseInt(process.argv[3] || '375', 10);
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2500));
  const report = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const out = [];
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > vw + 1 || r.right > vw + 8) {
        const cls = (el.className && typeof el.className === 'string') ? el.className.slice(0, 90) : '';
        out.push({ tag: el.tagName, w: Math.round(r.width), right: Math.round(r.right), cls, text: (el.textContent || '').trim().slice(0, 40) });
      }
    });
    // keep only the outermost offenders (first 12)
    return {
      viewport: vw,
      scrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      offenders: out.slice(0, 12),
    };
  });
  console.log(JSON.stringify(report, null, 1));
  await page.screenshot({ path: `C:/Users/mule/AppData/Local/Temp/claude/c--Users-mule-OneDrive-Desktop-mulesoo/0c0afb50-83ad-432c-8b79-a3f2b8655795/scratchpad/emulated-${width}.png` });
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
