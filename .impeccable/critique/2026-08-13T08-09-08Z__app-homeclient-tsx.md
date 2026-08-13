---
target: home page hero / app/HomeClient.tsx
total_score: 21
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
timestamp: 2026-08-13T08-09-08Z
slug: app-homeclient-tsx
---
Method: dual-agent (A: a276bcdc0598e9c59 · B: a41f6b9285f51c156)

Target: `app/HomeClient.tsx` — MuleSoo home page. Mode: **Persuade**.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Hero title + all four stats arrive via client-side fetch with no skeleton; the most important text on the site can repaint after first frame. No active-route state in nav. |
| 2 | Match System / Real World | 3 | Copy is concrete and well-pitched, but "200 AI systems" sits 300px above "50+ Projects Delivered" with no reconciliation. |
| 3 | User Control and Freedom | 3 | The 10-item FAQ renders every answer permanently open — no collapse control. No back-to-top on a ~7,000px page. |
| 4 | Consistency and Standards | 1 | Two FAQ sections with different interaction models and conflicting answers; three arbitrary h2 tiers; emoji inside an all-Lucide system; `btn-secondary` in the hero and `btn-primary` mid-page — the ranking is inverted. |
| 5 | Error Prevention | 2 | Two visible timeline promises disagree (2–4 weeks vs ~3 weeks). All seven "Learn more →" links resolve to the same `/services` index. |
| 6 | Recognition Rather Than Recall | 2 | Price appears once, inside a collapsed `<details>` at ~92% scroll depth. The buyer carries "what does this cost?" through 16 sections. |
| 7 | Flexibility and Efficiency | 1 | A returning visitor who has already decided has no shortcut: 8 nav links, zero nav CTA, and exactly one `/contact` link on the page — the last element. |
| 8 | Aesthetic and Minimalist Design | 1 | 17 bands; three separate social-proof systems naming the same four companies; two stat bands; two FAQs; a global decorative field plus a second hero backdrop. |
| 9 | Error Recovery | 3 | Genuinely good: fallback testimonials and `mergeSettings` mean a failed fetch degrades to real content. |
| 10 | Help and Documentation | 3 | Over-served rather than under: 16 FAQ answers plus a site-wide chatbot — docked for redundancy and self-contradiction. |
| **Total** | | **21/40** | **Acceptable (52%) — significant improvements needed** |

## Design Specificity Verdict

**Category-interchangeable.** An unrelated SaaS or agency could swap the logo and three client names and ship this page unchanged.

**LLM assessment.** The structure is the 2023–2025 template verbatim: dark ground → gradient headline → trust chips → logo strip → stat band → glass service cards → numbered process → testimonials → comparison table → FAQ → gradient CTA. The most atmospheric element on the site — `components/ui/shape-landing-hero.tsx` — is the widely-copied "Elegant Shape" community component, pasted unmodified down to its `[0.23, 0.86, 0.39, 0.96]` easing and a `#030303` background that does not even match `--bg-primary` (`#050810`). It is mounted `fixed` and globally, so its blobs strobe in and out as opaque sections scroll past. One `glass-card` treatment does seven different jobs (services, process, why-us, work, clients, metrics, FAQ); no section owns a form.

The genuinely authored work is in the token layer, not on screen: the two-tone action split (`#1D4ED8` for fills, `#7FB3FF` for anything read, with the contrast maths written down) and the fluid section-rhythm scale. Both are senior-level. Neither is visible as *character*.

**Ethiopian/Pretoria identity does not survive contact with the visual language — it is copy-deep only.** The evidence is entirely strings: client names, "POPIA-compliant", "Pretoria" in the schema. No geometric border, cross motif, textile rhythm, or warm-earth surface. `--color-premium: #D97645`, the one hue that could carry an East African register, is used for 15 star icons, three footer headings, and two table cells. `Cormorant Garamond` is imported and never rendered — a render-blocking font fetch for zero characters, and the loss of the one voice that could have carried warmth.

**Deterministic scan.** `detect.mjs` returned **0 findings** across `HomeClient.tsx` (976 lines), `Navbar.tsx`, and `Footer.tsx` — exit 0, clean under both default config and `--no-config`. The scanner is not a no-op: a synthetic file with a bounce easing curve correctly tripped `[bounce-easing]` and exit 2. **Every defect in this report was invisible to the regex scan.** The clean result is the least informative signal here, not a pass.

**Visual overlays.** No user-visible overlay exists. Script injection was not attempted — the machine wedged twice during Assessment B (a bare `echo` failed to complete in 240s; `taskkill` itself timed out), so the remaining budget went to guaranteeing capture and server cleanup. Fallback signal: direct CDP measurement of computed styles at 1440×900 and 390×844. All servers confirmed stopped.

## Overall Impression

The design system underneath this page is better than the page. Someone did real engineering on colour roles and section rhythm and wrote down the reasoning; then seventeen sections accreted on top of it without anything being deleted, and the token work stopped being visible.

But the single biggest finding is mechanical, not aesthetic, and it was verified in the compiled CSS: **`app/globals.css:85` ships `* { margin: 0; padding: 0; box-sizing: border-box; }` unlayered, while Tailwind v4 emits all utilities inside `@layer utilities`.** Unlayered CSS wins over layered CSS regardless of specificity. Every `px-*`, `py-*`, `p-*`, `m-*`, `mt-*`, `mb-*`, and `space-y-*` utility on this site is being overridden by that one line. This is why the hero buttons measure 26px tall under `py-3`, why the badge text touches its own border under `px-6 py-3`, and why the mobile subheadline runs flush to the viewport edge. The page has been shipping without its component padding, and because `gap-*` and the custom `section-*` classes survive, it looked plausible enough that nobody caught it.

## What's Working

1. **The colour-role system (`globals.css:17–83`) is senior-level.** Splitting the action colour into `--color-action-primary: #1D4ED8` (fills, 7.2:1 under white) and `--color-action-on-dark: #7FB3FF` (text/links/icons, 9.3:1) solves a failure most systems never notice until an audit — a blue that passes as a filled control and fails as text. The hover-brightens-not-darkens rule shows someone reasoned about dark-ground perception instead of copying a light-mode ramp, and the compatibility aliases resolve legacy names to *roles*, which is why no surface has drifted back to cyan.

2. **The section-rhythm scale (`globals.css:266–297`) is the only reason the page has pacing.** Four fluid `clamp()` steps at a stated ratio, plus the discipline of exactly one `section-climax` per page. The final CTA reads as a conclusion purely because it holds the largest interval on the page.

3. **Featured Work is correctly built persuasion.** Real imagery, category badges as orienting devices, and captions written as *outcomes* rather than deliverables — "Bilingual AI bookings with online deposits and PDF contracts" tells a buyer what they get to stop doing. It is the only band that shows rather than claims, and it is what the rest of the page should be copying.

## Priority Issues

### [P0] The universal reset silently disables every Tailwind spacing utility site-wide
**Why it matters.** Verified in the compiled bundle: `@layer utilities` spans chars 10276–118903, and the bare `*{box-sizing:border-box;margin:0;padding:0}` sits at 119826 — outside it. Unlayered beats layered, so `.py-3{padding-block:...}` never applies. Measured consequences at both breakpoints: hero CTAs render **26px tall**, the hamburger is **28×28**, nav links 20px, footer links 18px — **38 interactive elements under 44px at desktop, 32 at mobile**. The hero buttons visually collide with the trust-chip row beneath them; at 390px "View Our Work" sits directly on it. This fails WCAG target size, wrecks the thumb-zone on mobile, and it is not a design decision anyone made — it is one line of inherited boilerplate silently winning the cascade.
**Fix.** Wrap the reset in `@layer base { }` in `app/globals.css:85` so utilities outrank it. Rebuild and re-measure the same elements; expect ~48px buttons and the collisions to resolve on their own. Note this reset came verbatim from `CLAUDE.md`'s prescribed `globals.css`, so fix it there too or it returns on the next scaffold.
**Suggested command:** `/impeccable audit`

### [P0] The hero has no dominant action, and the page's only ask is at 96% scroll depth
**Why it matters.** Both assessments landed on this independently. Assessment B measured the two hero CTAs as byte-identical at full settle — same `rgba(255,255,255,0.02)` fill, same `rgba(168,178,208,0.22)` border, same colour, no gradient, no weight difference. The nav carries 8 links and **no CTA at all**. There is exactly **one** `/contact` link in the entire 976-line file: the last interactive element. This one is on me — I made both buttons `btn-secondary` earlier in this session at your request, and I flagged the missing hierarchy at the time but should have proposed the real fix instead of a symmetrical downgrade. The original diagnosis in `globals.css:145–149` was right ("every control shouted equally, so none of them led"); the remedy removed the gradient *and* the rank. Two equal quiet buttons is the same failure state as two equal loud ones. Worse, both hero destinations are already in the nav — the hero's only actions duplicate navigation.
**Fix.** Hero: `.btn-primary` "Get a Free Quote" → `/contact`; keep `.btn-secondary` "View Our Work" → `/portfolio`; delete "Explore Services" (Services is in the nav and seven service cards sit 800px below). Add a `.btn-primary` "Get a Quote" to the navbar right edge and into the mobile drawer, which currently ends with 8 plain links and nothing to do. Add a sticky bottom CTA on `<md`, since the thumb zone currently holds only the chatbot launcher.
**Suggested command:** `/impeccable layout`

### [P1] Price is invisible, so the decision the page exists to trigger never happens
**Why it matters.** No price appears in any visible element. The figures — R3,500 / R7,500 / R2,500 / R4,500 — live in `HOME_FAQS[1]`, inside a `<details>` that ships closed, in the *second* of two FAQ sections, at ~92% scroll depth. A buyer can read this entire homepage and never encounter a number. Meanwhile the page says "you own everything" four separate times: it answers an anxiety nobody has while refusing the only one everybody has. The Guarantee section is a money-back promise attached to an unstated amount, which makes it un-evaluable.
**Fix.** Put `from R3,500` on each service card in `--color-premium` — literally the role that token was defined for ("prices, badge text") and currently near-unused. Insert a compact three-tier pricing band immediately *before* the Guarantee, and move the Guarantee adjacent to the final CTA. Sequence: price → guarantee → ask.
**Suggested command:** `/impeccable clarify`

### [P1] Duplicated and self-contradicting content across three redundant systems
**Why it matters.** Two FAQ sections with different interaction models and overlapping questions, which disagree in public: "Websites: 2-4 weeks" vs "about three weeks"; "unlimited revisions, you only pay when 100% satisfied" vs "we'll refund your deposit in full". Two client-proof bands name the same companies. Two numeric-stat bands. "200 AI systems" against "50+ Projects Delivered". A corporate buyer evaluating R7,500+ reads inconsistency as a proxy for operational sloppiness — exactly the sloppiness they fear in delivery. Two answers to one question is worse than either answer alone.
**Fix.** Delete the 10-card always-open FAQ; keep `FaqSection` (collapsible, native `<details>`, no-JS, emits FAQPage schema — strictly better). Reconcile the timeline to one number. Merge the trust bar into Trusted By. Delete either "Proven Results" or the stats bar, not both. Reconcile 200 vs 50+ into one claim with one meaning.
**Suggested command:** `/impeccable distill`

### [P2] Typographic hierarchy collapses at the `md` breakpoint
**Why it matters.** The h1 is `md:text-7xl`; four h2s are also `md:text-7xl`. At `md` they are identical — 72px. "Frequently Asked Questions" renders at the same size as the brand promise. Three arbitrary h2 tiers exist with no governing rule, which directly undoes the work the section-rhythm scale is doing.
**Fix.** One h2 scale — `text-4xl md:text-5xl` — for every section heading. Reserve `md:text-7xl`/`lg:text-8xl` for exactly two elements: the h1 and the climax CTA. Let rhythm, not type size, mark section importance; that is what it was built for.
**Suggested command:** `/impeccable typeset`

## Persona Red Flags

**Jordan (confused first-timer).** The hero says "Digital Excellence" — two abstract nouns, no verb, no object — over a badge reading "Intelligent Digital Solution", three more abstract nouns. First 3 seconds produce no answer to "what is this?" Then two identical grey buttons, neither marked for someone who doesn't yet know what they want. The badge is a `<Link href="/ai-automation">` that looks purely decorative — one click drops Jordan into a 200-item library before they've learned what MuleSoo does. Seven "Learn more →" links all hardcode `/services`, so clicking "AI Chatbots" lands on an index where they must find it again. No price to self-qualify against. No active nav state, so Home looks like the other seven links.

**Riley (stress tester).** Five brand names in the trust bar carry `whileHover={{ scale: 1.05 }}` and a colour change but `cursor-default` and no href — hover feedback, click does nothing, five times. Three 5-star testimonials with no photos, no logos, no links, sitting next to a client wall made of **single-letter placeholder squares**; Riley's instinct is to verify "Kgosi Moeng, Owner, Yoyo Gym" and the page offers nothing to check. The comparison table is the only horizontally-scrolling element and gives no scroll cue at 375px — it reads as clipped, not scrollable. No `prefers-reduced-motion` guard anywhere despite 60+ entrance animations and a 12s infinite blob loop. With JS off or slow hydration, nearly everything below the hero is `opacity: 0`.

**Casey (distracted, one-handed, mobile).** The only conversion link is at the absolute bottom, past ~7,000px including 10 forced-open FAQ cards — 20+ thumb swipes to do the one thing they came for. The thumb zone holds only the chatbot launcher, which opens a 650–750px full-screen takeover: the most likely accidental tap is the most disruptive action on the page. The mobile drawer ends with 8 plain links and no ask — "Contact" is the eighth item in an undifferentiated list. Seven identical service cards consume roughly seven mobile viewports and all link to the same URL. Confirmed by measurement: no horizontal overflow at 390px (scrollW = clientW = 390), but the subheadline runs flush to the right edge with no gutter, and hero tap targets are 26px.

## Minor Observations

- `StatCounter` doesn't count — it renders a static string with a fade; the name is a fossil of a removed count-up.
- Three components hand-roll `useRef` + `useInView` + `useAnimation` + `useEffect` (~30 lines) where every other section uses `whileInView` directly.
- `hover:gap-2` on "Learn more →" has no base `gap` and no second flex child — the micro-interaction does nothing.
- Straight quotes render as `"` glyphs in testimonials; use proper curly quotes.
- `.gold-text` is defined and unused on this page — the price treatment exists, but there are no prices.
- Featured Work images are over-darkened: a full-height `from-[var(--bg-primary)]` scrim covers a 192px crop, half-erasing the only real evidence on the page.
- `globals.css:213–252` contains the same three-paragraph comment block twice, describing a gold-controls decision that no longer exists.
- Section comments run 1, 1.5, 2, 3, 3.5, 4, 4.5, 4.7, 4.8, 5, 5.5, 6, 6.3, 6.5, 6.7, 7 — sixteen insertions, zero deletions. The numbering is the finding.
- Console: repeating 401 from `supabase.co/rest/v1/visitors`, matching the server-side `[supabaseAdmin] MISCONFIGURED` warning. Local-env only, but it means visitor tracking is silently dead wherever that key is unset.
- Assessment B observed the headline gradient rendering **orange→purple**, which sits oddly against the recent "azure replaces gold" commit — worth an eyeball before the next release.

## Questions to Consider

1. If you deleted every section between the hero and Featured Work — trust bar, stats, seven service cards, booking steps, process row, why-us grid — would a corporate buyer be less convinced, or would they finally reach your actual evidence while they still had patience?
2. The page says "you own everything" four times and says what anything costs zero times. Which of those is the buyer lying awake about?
3. `globals.css:5–15` opens with a thesis — "GOLD acts. COPPER marks." Sixty lines later, line 74 redefines gold *as* copper and line 38 makes azure the action colour. The file's own rationale now describes a palette that does not exist. What else on this page is a leftover from a decision that was re-made without being re-read?
