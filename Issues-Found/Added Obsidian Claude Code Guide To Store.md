---
title: Added Obsidian Claude Code Guide To Store
type: change
status: in-progress
found: 2026-08-18
tags: [change, store, guides]
---

# Added Obsidian Claude Code Guide To Store

Not a bug — a new digital product added to the existing guide store, from a
real 8-page PDF the user supplied ("Obsidian + Claude Code — The Beginner's
Master Guide"), not invented content.

## Where the store's product data actually lives

Checked before writing anything, since three different files could plausibly
have looked like "the store":

- `app/services/pdf-guides/page.tsx` — a marketing page with its own inline
  array of guide blurbs. **Not** the real catalog — no price, no purchase
  button, nothing wired to checkout.
- `app/store/store-client.tsx` — the real storefront. Renders three separate
  sections (digital guides, Auto Pilot systems, automations) but the guide
  section is a plain `.map()` over `STORE_PRODUCTS` — no per-product code to
  touch.
- `lib/storeProducts.ts` — the actual single source of truth: name, slug,
  price (ZAR authoritative, USD a courtesy line), pages, features,
  description, accent. `app/api/store/checkout`, `/download` and `/verify`
  all resolve products generically by slug via `findProductBySlug()` —
  confirmed by reading all three routes before assuming a new product
  wouldn't need route changes.
- `lib/guides/registry.ts` + `lib/guides/content/*.ts` — the actual chapter
  content each purchased PDF is generated from, per buyer, with a watermark
  and password (`lib/guides/buildGuide.ts`). A slug only becomes purchasable
  once it exists in `STORE_PRODUCTS` *and* has real chapter content
  registered here — both were needed.

## The cover needed no new asset

Every guide's storefront cover is not a static image — `components/EmojiCover.tsx`
renders one live from `emoji` + `title` + `category` + `accent`, the same
component every other guide card uses. Confirmed by reading it before
assuming a Puppeteer-style generated PNG (like the portfolio covers) would
be needed here — it would not have been; this store's "cover" is a different
mechanism entirely from `scripts/make-portfolio-covers.cjs`.

## What was added

- `lib/guides/content/obsidianClaudeCode.ts` — full chapter content
  transcribed from the actual PDF text supplied (Before You Start; Install;
  Vaults; Connect to an existing project, both options; Obsidian basics;
  the real Obsidian ↔ Claude Code workflow loop; optional plugins; the
  quick-reference checklist) — not summarised or guessed, the real section
  headings and steps.
- Registered in `lib/guides/registry.ts` under `obsidian-claude-code-guide`.
- Added to `STORE_PRODUCTS` in `lib/storeProducts.ts`: **R300** (≈ $18,
  same ~R16.60 conversion ratio every other product uses), 8 pages,
  Beginner-Friendly, `🧠` emoji, `purple` accent (Obsidian's own brand
  colour, and the least-used accent among the six existing products at the
  time — kept the storefront's colour spread even rather than defaulting to
  blue or gold again).

## Related

- [[Verification Method]]

---
Back to [[Issues MOC]]
