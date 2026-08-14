#!/usr/bin/env node
/**
 * Metadata guard — runs at build time (no network). Fails the build if any
 * PUBLIC, indexable page route renders without its own <title>/<meta
 * description>/canonical, which is what pushes pages into Google's
 * "Crawled – currently not indexed" (thin/duplicate) bucket.
 *
 * A page satisfies the guard when EITHER its own page.tsx OR a sibling
 * layout.tsx in the same route folder provides metadata — via `export const
 * metadata`, `generateMetadata`, or our `pageMetadata()` helper (which always
 * sets a self-referencing canonical).
 *
 * Non-public surfaces (admin, corporate, api, route groups) are skipped: they
 * are already blocked in robots.ts / middleware and must not be indexed.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP_DIR = join(ROOT, 'app');

// Route segments that are never indexed → exempt from the metadata requirement.
const SKIP_SEGMENTS = ['admin', 'corporate', 'api'];
// Individual public routes that are intentionally noindex utility pages.
const SKIP_ROUTES = new Set([
  '/store/success',
  '/booking-confirmation',
  '/booking/pay',
  '/verify',
  '/staff-access',
]);

const META_TOKENS = [/export\s+const\s+metadata/, /generateMetadata/, /pageMetadata\s*\(/];
const hasMeta = (file) => {
  if (!existsSync(file)) return false;
  const src = readFileSync(file, 'utf8');
  return META_TOKENS.some((re) => re.test(src));
};

/** Turn an app-relative folder into a route path, ignoring (route groups). */
function toRoute(relDir) {
  const parts = relDir
    .split(/[\\/]/)
    .filter((p) => p && !(p.startsWith('(') && p.endsWith(')')));
  return '/' + parts.join('/');
}

const pages = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
    } else if (entry === 'page.tsx' || entry === 'page.ts') {
      pages.push(full);
    }
  }
})(APP_DIR);

const failures = [];
for (const pageFile of pages) {
  const relDir = dirname(pageFile).slice(APP_DIR.length + 1);
  const segments = relDir.split(/[\\/]/).filter(Boolean);

  if (segments.some((s) => SKIP_SEGMENTS.includes(s))) continue;

  const route = toRoute(relDir);
  if (SKIP_ROUTES.has(route)) continue;

  const layoutFile = join(dirname(pageFile), 'layout.tsx');
  if (hasMeta(pageFile) || hasMeta(layoutFile)) continue;

  failures.push(route === '' ? '/' : route);
}

if (failures.length > 0) {
  console.error('\n❌ SEO metadata guard failed. These public pages have no');
  console.error('   title/description/canonical (add `export const metadata =');
  console.error('   pageMetadata({...})` to the page or a sibling layout.tsx):\n');
  for (const r of failures) console.error(`   • ${r}`);
  console.error(
    `\n   ${failures.length} page(s) missing metadata. See lib/seo.ts for the helper.\n`
  );
  process.exit(1);
}

console.log(`✅ SEO metadata guard: all ${pages.length} public pages have metadata.`);
