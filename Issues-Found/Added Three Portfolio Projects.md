---
title: Added Three Portfolio Projects
type: change
status: in-progress
found: 2026-08-17
tags: [change, portfolio, covers]
---

# Added Three Portfolio Projects

Not a bug — a feature addition, logged here because it followed the same
verify-before-shipping standard as every fix in this vault, and because one
real mistake was caught mid-work that's worth keeping a record of.

## What was added

Three cards in `app/portfolio/page.tsx`'s `fallbackProjects` array, each with
a purpose-built cover image (not the generic `PortfolioCover` monogram
fallback), rendered the same way every other branded artefact in this
codebase is — headless Chrome, real brand fonts, `scripts/make-portfolio-covers.cjs`:

| Project | Status | Cover |
|---|---|---|
| Hamere Noh Kidane Mihret Church | Live | real Orthodox cross + bilingual EN/AM headline |
| Yewogen Derash (ወገን ደራሽ) | `upcoming: true` | campaign card mockup with verified badge + progress bar |
| Sena — AI Voice Receptionist | `upcoming: true` | the project's own real rendered guest-ID-card asset, tilted |

## The mistake caught before shipping

The church cover's first draft carried an **invented** Amharic subtitle —
guessed, not sourced. Checked against the actual project
(`config/site.ts`, `database/schema-oc.sql`) before shipping and found the
real name is **"Hamere Noh Kidane Mihret" / ሐመረ ኖኅ ኪዳነ ምሕረት** — not what
was on the first draft. Regenerated with the verified text. A fabricated
name or phrase on a real religious institution's public portfolio card would
have been a serious, avoidable error; this is exactly the kind of claim that
gets checked against source, not assumed, per [[Verification Method]].

A second, smaller slip: the Amharic in Yewogen Derash's card `name` field in
`page.tsx` itself was mistyped (ዳራሽ instead of the correct ደራሽ) despite the
cover image itself having the correct text from the start. Caught by
re-grepping the source README, fixed before commit.

## Still open

**The church site's live URL.** Confirmed via `AskUserQuestion` that a public
URL exists; the user is providing it. Until then the card has no `site` link
(same pattern the existing Habesha Celebration Events card already uses —
real project, live site, just not yet wired with a clickable badge). Small,
contained follow-up once the URL arrives — not a rebuild.

## Related

- [[Verification Method]]
- [[Issues MOC]]

---
Back to [[Issues MOC]]
