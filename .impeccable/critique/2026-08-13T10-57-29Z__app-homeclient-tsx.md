---
target: home page / app/HomeClient.tsx (post ZAR conversion)
total_score: 18
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 3
timestamp: 2026-08-13T10-57-29Z
slug: app-homeclient-tsx
---
Method: dual-agent (A: a676a9cfa537d4ab3 · B: a5043b95a3666df23)

Target: `app/HomeClient.tsx` — MuleSoo home page (+ `/store` for the currency check). Mode: **Persuade**.
Previous run: 21/40.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | 7 identical "Learn more" links all resolve to `/services`; hero badge is a link with no link affordance; trust-bar names animate on hover with no destination; no active-route state in nav. |
| 2 | Match System / Real World | 2 | H1 is "Digital Excellence" — two words that assert nothing; "24/7 — Automated Response Time" labels availability as a duration; no VAT position on any ZAR figure. |
| 3 | User Control and Freedom | 2 | Ten FAQ answers permanently expanded, no collapse; no `prefers-reduced-motion` anywhere; no back-to-top on a ~12,000px page. |
| 4 | Consistency and Standards | 1 | Two FAQ blocks giving different answers to "How do I get started?"; two client rosters that disagree with each other; emoji metric icons amid Lucide; five h2s tied with the h1 at `md:text-7xl`. |
| 5 | Error Prevention | 2 | `/contact` printed as unlinked prose the reader is expected to type; guarantee h3 says "Your Money Back" while its body says "refund your deposit". |
| 6 | Recognition Rather Than Recall | 2 | Improved — prices are on-page now. But the band's 4 rows don't map to the grid's 7 cards, so the buyer reconciles two taxonomies unaided. |
| 7 | Flexibility and Efficiency | 1 | Navbar is 8 equal-weight links and no CTA; no sticky mobile CTA; no anchor to pricing on a 14-section page. |
| 8 | Aesthetic and Minimalist Design | 2 | Nine consecutive card grids; two trust sections; two FAQ sections; "you own everything" asserted four times. |
| 9 | Error Recovery | 2 | Dead-end hover states, `/contact` as text, and the guarantee ambiguity all unhandled. |
| 10 | Help and Documentation | 2 | 16 FAQ entries is thorough help, split across two blocks that contradict each other. |
| **Total** | | **18/40** | **Poor–Acceptable boundary (45%)** |

**The score went DOWN 3 while three real fixes landed. Both facts are true and the reason matters.**
All three previous fixes were independently verified as genuinely resolved (below) — worth roughly +3 on their own heuristics. The independent pass then found ~6 points of defects the first run missed: two contradictory client rosters, a guarantee that contradicts itself, a navbar with no action, and a type hierarchy that is *inverted* rather than merely collapsed. The denominator of known defects grew faster than the numerator of fixes. This is what an honest second look costs; a critique that inflated the number to show progress would be worthless.

## Verification of the three previous fixes — all confirmed landed

**P0 padding / `@layer base` — RESOLVED.** `globals.css:90–92` now wraps the reset. Confirmed by rendered effect: hero CTAs measure **50px** tall (was 26px), badge 52px. Sub-44px targets fell 38 → 32 on desktop, 32 → 25 on mobile.

**P0 hero CTA dominance — RESOLVED.** Measured at full settle: "Get a Free Quote" is solid `rgb(29,78,216)`, weight 600, with a shadow; "View Our Work" is `rgba(255,255,255,0.02)`, weight 500, no shadow. Unambiguous ranking. `/contact` links went 1 → 3. **Caveat: it did not carry into the Navbar**, which still has no CTA — the hero leads correctly for one viewport, then the persistent chrome offers nothing for 12,000px.

**P1 price surfacing — RESOLVED in placement, NOT in ranking.** Prices are on all 7 cards at ~25% depth in the correct copper token (`rgb(217,118,69)` confirmed) and in the "What it costs" band. The Guarantee does now sit against the ask. But the band uses `section-tight` — the step the CSS explicitly reserves for "stats, trust marks… scanned, not read" — and its h2 is the *smallest* on the page while "Frequently Asked Questions" gets `md:text-7xl`. The page shouts its FAQ heading and murmurs its price.

## Currency conversion — verified in the rendered DOM

**Home page: clean.** Zero dollar prices in rendered text at either viewport. Rand rendering confirmed: `R3,500 R2,500 R800 R149 R300 R400`.

**Store: 38 dollar figures, all intentional.** Every one is the secondary "≈ $X" beside a Rand primary, exactly as specified. Typography confirms the hierarchy held: Rand at **30px / weight 700 / rgb(240,242,250)**, USD at **12px / weight 400 / rgb(168,178,208)**. No dollar figure is masquerading as a primary price.

Two dollar hits in the raw home HTML (`"$10"`) are Next.js RSC flight-payload element references, not prices — **false positive**.

**Deterministic scan: 0 findings** across all five files, and clean under `--no-config`. Assessment B established this is weak evidence rather than a pass: a probe file written with low-contrast colors, an 11px font, a 20px button and a click-handler `<div>` also returned `[]`. On `.tsx` the detector is a regex matcher, not a rendering analysis. Every defect in this report was invisible to it.

**Visual overlays: none.** Injection was skipped by instruction after a previous run wedged the machine. No overlay ran; fallback signal was direct CDP measurement at 1440×900 and 390×844 on `/` and `/store`.

## Overall Impression

The engineering rigour in `globals.css` — contrast ratios computed in comments, a four-step fluid rhythm scale, a safety net that catches gradient CTAs measuring 1.84:1 — is above what most agencies ship. The copy in `siteSettings.ts` is below what a template ships. Same repo, same week. The single biggest opportunity is not a new section; it is that the page's differentiators (POPIA, you-own-the-code, a booking flow that ends in a paid verified booking) are all present and all buried, while the H1 spends the most valuable 200 pixels on the site saying "Digital Excellence."

## What's Working

1. **The colour-role system, and the page obeys it where it counts.** Prices use `--color-premium` copper on both the card and the band — verified `rgb(217,118,69)` in the browser. Value never masquerades as interaction.
2. **The rhythm scale is spent, not just defined.** `section-tight` on trust marks, `section-loose` on services, `section-climax` exactly once on the final ask. The close *feels* like a close because it holds 112–192px of air nothing else gets.
3. **The price band's composition.** Everything else is a card grid; this is a `<dl>` with an asymmetric `lg:grid-cols-[0.85fr_1fr]`, `items-baseline` row alignment, and "from" set smaller and tucked inside the `<dd>`. It is the one block that would survive a portfolio review on its own.

## Priority Issues

### [P0] Two client rosters on one page that contradict each other
The trust bar lists *Habesha Celebration Events, Shime Events, **YoYo** Gym, Tsedi Catering, DR. Hospital*. "Trusted By Industry Leaders" ~300 lines later lists *X-Boss Photography, **Yoyo** Gym, Shime Events, Tsedi Catering, Habesha Events*. Two clients under two spellings; two clients in only one list. Both render as `charAt(0)` letter tiles — no logo asset exists for any of them.
**Why it matters:** this is the credibility spine of a persuade surface. A buyer about to spend R7,500 checks the client list — that is what it is for. A list that cannot agree with itself on a client's spelling, twice, in one scroll, is the strongest available signal that the names are decoration.
**Fix:** delete the second section entirely, keep one roster with one canonical spelling. Replace letter tiles with real marks, or set the names as a consistent wordmark list and call it a client list rather than a logo wall. Four verifiable clients beat five where one is a letter in a box.
**Suggested command:** `/impeccable distill`

### [P0] The guarantee over-promises against its own body, directly above the ask
The h3 says "100% Satisfaction or **Your Money Back**." The body says "we'll refund **your deposit** in full." Different promises. "Deposit" is never defined or quantified anywhere on the page.
**Why it matters:** it sits immediately above the final CTA *because I moved it there* last round. That placement is correct, and it is exactly why this is P0 — reassurance against the ask gets maximum weight, and the maximum-weight content is currently a promise that shrinks by ~80% between its heading and its second sentence.
**Fix:** make the two lines say the same thing, then state the deposit in the price band as a fifth row ("Deposit to start — 50%"). A guarantee that references a number only reassures once the reader knows the number.
**Suggested command:** `/impeccable clarify`

### [P1] Type hierarchy is inverted on every phone
The h1 is `text-4xl sm:text-5xl md:text-7xl lg:text-8xl`. Five h2s are `md:text-7xl` with **no base-size prefix**, so `text-6xl` applies below `md`. At 375px the H1 renders at **36px** while "Our Services", "How We Work", "What Clients Say" and "Frequently Asked Questions" each render at **60px**.
**Why it matters:** mobile is the majority path for a Pretoria SMB audience arriving via WhatsApp links. On that path the hero does not read as the hero, and the least important heading on the page is 24px larger than the most important one.
**Fix:** h1 → `text-5xl sm:text-6xl md:text-7xl lg:text-8xl`; section h2s → `text-3xl sm:text-4xl md:text-5xl`. Let the rhythm scale rank sections, which is what it was built for.
**Suggested command:** `/impeccable typeset`

### [P1] The price band is correctly placed, correctly built, and ranked as a footnote
Three ranking failures: it uses `section-tight` (reserved for things "scanned, not read"); its h2 is the smallest section heading on the page; and its 4 rows don't map to the grid's 7 cards — "AI automation system" has no card at all, and "Website Design" silently splits into Starter/Business. **No figure anywhere states a VAT position** — a 15% swing on every number, and the first question a South African finance person asks.
**Fix:** promote to `section-loose` and `text-5xl md:text-6xl`; reconcile the taxonomy to one product line; add "All prices exclude VAT" (or incl.) under the intro; move the band to sit immediately after the services grid, where the price question actually forms.
**Suggested command:** `/impeccable layout`

### [P1] Two FAQ sections, and a 28px mobile nav control
The always-open FAQ renders 10 questions with every answer expanded (~2,400px of unskippable mobile scroll) directly before the price band, while `FaqSection` twenty lines later does it correctly with `<details>`. They conflict on the first action ("book a consultation" vs "WhatsApp") and on ownership conditions. One answer prints `/contact` as unlinked prose at the highest-intent sentence on the page. Separately, the hamburger measures **28×28** — confirmed in the browser, `padding: 0px` — and it is the only nav control on mobile.
**Fix:** delete the always-open FAQ, merge its unique questions into `HOME_FAQS`, resolve the timeline to one number, make `/contact` a real `<Link>`. Add `p-3 -mr-3` to the hamburger for a 52px target. That single edit removes ~100 lines, ~2,400px of scroll, one contradiction and one interaction inconsistency.
**Suggested command:** `/impeccable distill`

## Persona Red Flags

**Jordan (first-timer):** "Digital Excellence" answers nothing; the subtitle is a six-item bullet list including undefined jargon ("Auto Pilot Systems"). Clicks "AI Chatbots → Learn more", lands on a services index — first click, first broken expectation. The hero badge navigates to a 200-item library and looks like chrome. And the highest-intent sentence on the page hands them a raw URL path to type.

**Riley (stress tester):** finds five contradictions without leaving the page — "200 AI systems" vs "50+ Projects Delivered"; two client rosters with mismatched spelling; "+300% Average Booking Growth" where the only 300% on the site is one client's testimonial (average over n=1); the guarantee headline vs its body; and the timeline stated three ways (2–4 weeks / about three weeks / delivered in 10 days).

**Casey (one-handed mobile):** the 28px hamburger is the only nav control and sits in the hardest thumb reach. Nothing is sticky, so intent formed after the first screen has nowhere to go without scrolling ~11,000px. The comparison table is `min-w-[560px]` in an `overflow-x-auto` with no scroll cue — the "Big Agency" column, the entire point of the comparison, is invisible. Six "Learn more" links measure 24px. ~50 scroll animations plus five `repeat: Infinity` loops pinned to the viewport, with no `prefers-reduced-motion` guard on any route.

## Minor Observations

- `main` has `pt-20` (80px) under a 96px navbar — 16px of every page sits under the fixed bar.
- `StatCounter` still does not count; it renders a static string with a fade.
- Eight decorative layers stack behind a two-word headline: `ShapeLandingHero`'s five fixed floating pills plus the hero's own two orbs and masked grid.
- `ShapeLandingHero` hardcodes `bg-[#030303]`, a second near-black in a system whose premise is one source of truth.
- Invalid `<dl>` markup in the price band: the wrapper `<div>` contains a `<dt>` and a `<p>`; div-in-dl permits only `dt`/`dd` children.
- The booking-steps grid is `md:grid-cols-3 lg:grid-cols-5` — at tablet the numbered sequence splits 1-2-3 / 4-5, breaking the read order the numbers exist to establish.
- `FaqSection` sets its own `my-24` inside a `section-tight` wrapper, the one place the spacing system is bypassed. It also emits a second "Frequently Asked Questions" h2 into the document outline.
- No `aria-current` on the active nav link.
- `--accent-gold` now holds `#d97645`, which is copper. The token name and its value have diverged.
- Console: recurring 401 from `supabase/rest/v1/visitors`, matching the server-side `[supabaseAdmin] MISCONFIGURED` warning. Local-env only.

## Questions to Consider

1. If you deleted every section between the hero and the price band, would you lose a single sale? Your argument is complete by the four trust chips in the first viewport; everything after is the same argument at lower density, with "you own everything" asserted four separate times.
2. Your navbar is on screen for 100% of the visit and contains zero actions. Meanwhile the page spends five `btn-primary` instances trying to re-establish, section by section, the one path that chrome could hold permanently for free. What is it for?
3. You wrote a colour system with contrast ratios in the comments and a rhythm scale with its reasoning committed — and the H1 says "Digital Excellence." What happens if the first thing a Pretoria business owner reads is "Your customers book, pay and confirm themselves — while you're asleep"? You already built the proof for that sentence; it is sitting five thousand pixels below where anyone will read it.
