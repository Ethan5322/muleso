#!/usr/bin/env node
/**
 * Sitemap validator — fails the build/CI if any URL listed in sitemap.xml
 * does not return a clean 200. Catches the two failure modes Google reported:
 *   • "Page with redirect"  → a sitemap URL that 301/302s (must list the final
 *                              canonical URL, never one that redirects).
 *   • "Not found (404)"     → a sitemap URL that is dead.
 *
 * Usage:
 *   node scripts/validate-sitemap.mjs [baseUrl]
 *   SITE_URL=https://mulesoo.com node scripts/validate-sitemap.mjs
 *   node scripts/validate-sitemap.mjs http://localhost:3000   (CI, post-build)
 *
 * Exit code 1 on any problem so it can gate a deploy.
 */

const BASE = (
  process.argv[2] ||
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_URL ||
  'https://mulesoo.com'
).replace(/\/$/, '');

const CONCURRENCY = 12;
const TIMEOUT_MS = 20000;
const UA = 'MuleSoo-SitemapValidator/1.0 (+https://mulesoo.com)';

async function fetchText(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA },
      redirect: 'follow',
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`sitemap fetch ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

/** Check one URL WITHOUT following redirects — a redirect is itself a failure. */
async function checkUrl(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA },
      redirect: 'manual',
      signal: ctrl.signal,
    });
    const status = res.status;
    if (status >= 300 && status < 400) {
      const loc = res.headers.get('location') || '(unknown)';
      return { url, ok: false, status, reason: `redirects → ${loc}` };
    }
    if (status !== 200) {
      return { url, ok: false, status, reason: `status ${status}` };
    }
    return { url, ok: true, status };
  } catch (err) {
    return { url, ok: false, status: 'ERR', reason: err.message };
  } finally {
    clearTimeout(t);
  }
}

async function pool(items, worker, size) {
  const results = [];
  let i = 0;
  const runners = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx]);
    }
  });
  await Promise.all(runners);
  return results;
}

async function main() {
  const sitemapUrl = `${BASE}/sitemap.xml`;
  console.log(`\n🔎 Validating sitemap: ${sitemapUrl}\n`);

  let xml;
  try {
    xml = await fetchText(sitemapUrl);
  } catch (err) {
    console.error(`❌ Could not load sitemap.xml — ${err.message}`);
    process.exit(1);
  }

  const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) {
    console.error('❌ sitemap.xml contained no <loc> URLs.');
    process.exit(1);
  }
  console.log(`   Found ${urls.length} URLs. Checking (no redirects allowed)…\n`);

  const results = await pool(urls, checkUrl, CONCURRENCY);
  const bad = results.filter((r) => !r.ok);

  for (const r of bad) {
    console.error(`   ✗ [${r.status}] ${r.url}  — ${r.reason}`);
  }

  console.log(
    `\n${bad.length === 0 ? '✅' : '❌'} ${urls.length - bad.length}/${urls.length} URLs OK` +
      (bad.length ? `, ${bad.length} problem(s).` : '.') +
      '\n'
  );

  if (bad.length > 0) {
    console.error(
      'Fix: point sitemap/internal links straight at the final 200 URL, ' +
        'restore or 301 any dead pages, and remove dead URLs from the sitemap.\n'
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Validator crashed:', err);
  process.exit(1);
});
