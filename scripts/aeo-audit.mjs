/**
 * End-to-end AEO / SEO audit — fetches real pages from a running server and
 * asserts what a crawler would actually receive.
 *
 * The point is to test the HTML as served, not the source. Every bug this suite
 * was written for was invisible in the source and obvious in the response:
 *   - FAQ answers behind `{isOpen && ...}` shipped questions and no answers
 *   - the root layout's BreadcrumbList claimed the same trail on every route
 *   - a canonical inherited from the layout made 220 URLs claim to be the
 *     homepage
 * All three typecheck, build and look fine in a browser.
 *
 * Usage:
 *   node node_modules/next/dist/bin/next build
 *   node node_modules/next/dist/bin/next start -p 3111
 *   node scripts/aeo-audit.mjs [baseUrl]
 *
 * Exits non-zero if any check fails, so it can gate a deploy.
 */

const BASE = process.argv[2] || 'http://localhost:3111';

const SERVICE_SLUGS = [
  'website-design', 'chatbot', 'design-widget', 'logo-design', 'pdf-guides',
  'qr-codes', 'email-setup', 'custom-apps', 'digital-id', 'autopilot',
];

/** Pages that must be indexable and fully marked up. */
const CORE = [
  '/', '/services', '/ai-automation', '/portfolio', '/about', '/contact',
  '/store', '/terms', '/privacy',
  ...SERVICE_SLUGS.map((s) => `/services/${s}`),
  // One of the 200 long-tail pages is appended at runtime — see sampleAutomation().
];

/**
 * Take a real automation slug from the sitemap rather than hardcoding one.
 * A hardcoded slug that no longer exists returns a correct 404 that reads in
 * the report as a site failure — the audit would be crying wolf about a route
 * behaving exactly as designed.
 */
async function sampleAutomation() {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const match = [...xml.matchAll(/<loc>[^<]*\/ai-automation\/([^<]+)<\/loc>/g)][0];
  return match ? `/ai-automation/${match[1]}` : null;
}

let failures = 0;
let warnings = 0;
let checks = 0;

const ok = (cond, page, msg) => {
  checks++;
  if (!cond) {
    failures++;
    console.log(`  FAIL  ${page}  ${msg}`);
  }
  return cond;
};

/**
 * Reported but not failed.
 *
 * Title length is the case this exists for. Google truncates the tail with an
 * ellipsis but still ranks on every word in the title, so an over-length title
 * is a cosmetic cost, not a defect — and the fix (cutting the brand name or a
 * local keyword out of the suffix) is a brand decision, not an engineering one.
 * Failing the build over it would let a judgement call block a deploy.
 */
const warn = (cond, page, msg) => {
  checks++;
  if (!cond) {
    warnings++;
    console.log(`  warn  ${page}  ${msg}`);
  }
  return cond;
};

/** Strip script tags before asserting visible copy.
 *  Next serialises component props into the RSC payload inside <script>, so a
 *  naive substring match on the raw HTML reports text as "present" that no
 *  reader or crawler ever sees rendered. */
const domText = (html) => html.replace(/<script[\s\S]*?<\/script>/g, '');

const decodeEntities = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));

const jsonLdBlocks = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => {
      try {
        return JSON.parse(m[1]);
      } catch {
        return { '@type': 'UNPARSEABLE', _raw: m[1].slice(0, 80) };
      }
    });

async function auditPage(path) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, { redirect: 'manual' });
  const html = await res.text();
  const dom = domText(html);
  const blocks = jsonLdBlocks(html);
  const types = blocks.map((b) => b['@type']);

  ok(res.status === 200, path, `expected 200, got ${res.status}`);

  // ── Metadata ──────────────────────────────────────────────────────────────
  // Decode entities before measuring: "&amp;" is five characters in the source
  // and one on the results page, so counting raw HTML reports a title as four
  // over the limit per ampersand when it is not.
  const title = decodeEntities((html.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1] || '');
  ok(title.length > 0, path, 'no <title>');
  warn(title.length <= 60, path, `title ${title.length} chars — Google shows about 60`);

  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  ok(desc.length > 0, path, 'no meta description');
  warn(desc.length <= 160, path, `description ${desc.length} chars — Google shows about 160`);

  // ── Canonical: exactly one, self-referencing ──────────────────────────────
  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map((m) => m[1]);
  ok(canonicals.length === 1, path, `${canonicals.length} canonical tags, expected 1`);
  if (canonicals.length === 1) {
    const got = new URL(canonicals[0]).pathname.replace(/\/$/, '') || '/';
    ok(got === path, path, `canonical points at ${got}, not itself`);
  }

  // ── Headings ──────────────────────────────────────────────────────────────
  const h1s = [...dom.matchAll(/<h1[^>]*>/g)].length;
  ok(h1s === 1, path, `${h1s} <h1> elements, expected exactly 1`);

  // ── Structured data ───────────────────────────────────────────────────────
  ok(!types.includes('UNPARSEABLE'), path, 'a JSON-LD block does not parse');

  const crumbs = blocks.filter((b) => b['@type'] === 'BreadcrumbList');
  ok(crumbs.length <= 1, path, `${crumbs.length} BreadcrumbList blocks — a page has one position`);
  if (path !== '/') {
    ok(crumbs.length === 1, path, 'no BreadcrumbList — search results show the raw URL');
  }
  for (const c of crumbs) {
    const last = c.itemListElement?.[c.itemListElement.length - 1];
    const lastPath = last?.item ? new URL(last.item).pathname.replace(/\/$/, '') || '/' : '';
    ok(lastPath === path, path, `breadcrumb ends at ${lastPath}, not this page`);
  }

  // ── Service pages: the AEO payload ────────────────────────────────────────
  const slug = path.startsWith('/services/') ? path.split('/')[2] : null;
  if (slug && SERVICE_SLUGS.includes(slug)) {
    const svc = blocks.find((b) => b['@type'] === 'Service');
    ok(!!svc, path, 'no Service schema');
    if (svc?.offers) {
      ok(typeof svc.offers.price === 'number' && svc.offers.price > 0, path,
        `Offer price is ${svc.offers.price}, expected a positive number`);
      ok(svc.offers.priceCurrency === 'ZAR', path, `currency ${svc.offers.priceCurrency}, expected ZAR`);
    }

    const faq = blocks.find((b) => b['@type'] === 'FAQPage');
    ok(!!faq, path, 'no FAQPage schema');
    if (faq) {
      ok(faq.mainEntity.length >= 4, path, `only ${faq.mainEntity.length} FAQs, want 4+`);
      // The whole point: every answer promised in schema is in the served DOM.
      for (const q of faq.mainEntity) {
        const answer = q.acceptedAnswer.text;
        const probe = answer.slice(0, 45);
        ok(dom.includes(probe), path, `FAQ answer missing from DOM: "${q.name.slice(0, 50)}"`);
      }
    }

    ok(dom.includes('Quick answer'), path, 'no AnswerBlock in DOM');
  }

  return { path, status: res.status, types, bytes: html.length };
}

async function auditInfrastructure() {
  const robots = await (await fetch(`${BASE}/robots.txt`)).text();
  ok(/GPTBot/i.test(robots), '/robots.txt', 'GPTBot not addressed — AI crawlers left to guess');
  ok(/PerplexityBot/i.test(robots), '/robots.txt', 'PerplexityBot not addressed');
  ok(/Sitemap:/i.test(robots), '/robots.txt', 'no Sitemap line');

  const llms = await (await fetch(`${BASE}/llms.txt`)).text();
  ok(llms.length > 500, '/llms.txt', 'llms.txt is suspiciously short');
  for (const s of SERVICE_SLUGS) {
    ok(llms.includes(`/services/${s}`), '/llms.txt', `does not list /services/${s}`);
  }

  const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  ok(urls.length > 200, '/sitemap.xml', `only ${urls.length} URLs`);
  for (const s of SERVICE_SLUGS) {
    ok(urls.some((u) => u.endsWith(`/services/${s}`)), '/sitemap.xml', `missing /services/${s}`);
  }
  return urls.length;
}

console.log(`AEO audit against ${BASE}\n`);

const sample = await sampleAutomation();
if (sample) CORE.push(sample);
else console.log('  WARN  sitemap lists no /ai-automation/* page to sample');

const rows = [];
for (const path of CORE) {
  const before = failures;
  const r = await auditPage(path);
  rows.push({ ...r, passed: failures === before });
}

console.log('\nInfrastructure');
const sitemapCount = await auditInfrastructure();

console.log('\n─────────────────────────────────────────────────────────────');
for (const r of rows) {
  console.log(
    `${r.passed ? 'pass' : 'FAIL'}  ${r.path.padEnd(30)} ${String(r.status).padEnd(4)} ${r.types.join(', ')}`
  );
}
console.log('─────────────────────────────────────────────────────────────');
console.log(`${sitemapCount} URLs in sitemap`);
console.log(`${checks} checks, ${failures} failed, ${warnings} warnings`);

// exitCode rather than exit(): process.exit() tears the loop down mid-flight
// and libuv asserts on Windows after the report has already printed.
process.exitCode = failures ? 1 : 0;
