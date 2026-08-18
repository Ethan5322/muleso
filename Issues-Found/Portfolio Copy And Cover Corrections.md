---
title: Portfolio Copy And Cover Corrections
type: change
status: in-progress
found: 2026-08-17
tags: [change, portfolio, covers, copy]
---

# Portfolio Copy And Cover Corrections

Feedback on [[Added Three Portfolio Projects]] and [[Telga Portfolio Concept]],
acted on directly — three separate corrections in one pass.

## 1. The QR "Scan" credit stamp did not belong on these covers

Every cover built in the earlier pass used `mulesoo-credit-stamp-on-dark.png`
— MuleSoo's own branded stamp, which bundles a QR code reading "Scan ·
mulesoo.com". That's the right asset for a marketing piece meant to be
scanned. On a **portfolio project cover**, it reads as if the project itself
has a scan feature — confusing on Hamere Noh Kidane Mihret Church (no scan
feature exists) and on Telga (a card-payment device, not a QR device).

Fixed by swapping to `mulesoo-credit-compact-on-dark.png` — the plain text
wordmark lockup, no QR — across **all four** new covers, not just the two
flagged, since the same mistake was present on all of them (Yewogen Derash
and Sena's QR mentions happened to be factually accurate to those specific
products, which is why they read less wrong, but the underlying asset choice
was still the marketing stamp in the wrong context).

## 2. Telga's cover looked like a toy, and the design reference was wrong

Called out directly: "no button seen no screen seen swiping place its looks
toy." Traced this to a real modelling error, not just a polish problem — the
first design copied an old-style countertop card machine (small screen above
a physical numeric keypad). Researched what the actual reference device class
looks like before redrawing anything (`WebSearch`, Flash TouchGo2 / Kazang
terminal class): these are modern **Android touchscreen handheld units** —
the screen fills nearly the whole front face, there is no physical keypad,
a magstripe swipe slot sits along the top edge, a chip-insert slot along the
bottom.

Redrawn around that real silhouette: tall handheld yellow-cased body, the
screen dominant rather than a small panel, a visible swipe slot with a card
mid-drag at the top, an insert slot at the bottom. This is also why Telga's
own `tech` array already said `Android` — the redraw now actually matches
that.

## 3. Telga's positioning was wrong, not just its copy

Original copy framed Telga as South-Africa-inspired and scoped to "corner
shops" — both explicitly rejected: "this project supposed to be entrepreneur
job... do not mention any small shop... telga uses anywhere any shops and
marketing place." Rewritten throughout (`page.tsx` and the cover's own
text) to drop the Flash/Kazang South Africa comparison from anything
client-facing and reframe as an entrepreneur-run card-payment business usable
anywhere — any shop, any market stall, any location — not scoped by
geography or shop size.

## 4. Yewogen Derash was pitched like a spec sheet, not a cause

"Just like gofundme... do not write un neccessary advertisment scan what
what... write clear description mention as we built for society do not write
steps how to use it." The existing copy led with KYC checks, webhooks, and a
literal "Scan opens this campaign only" line baked into the cover's own
mocked-up card — accurate, but reads as a payments spec, not a fundraising
platform. Rewritten simply: a trusted way for Ethiopians at home and abroad
to help each other, free to use, built for the community — no technical
steps, no scan language, and (per instruction) no comparison to any named
platform.

## Related

- [[Added Three Portfolio Projects]]
- [[Telga Portfolio Concept]]
- [[Generic Steps Shown For Every Project]]
- [[Covers Cropped On Narrow Screens]]
- [[Verification Method]]

---
Back to [[Issues MOC]]
