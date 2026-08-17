---
title: Generic Steps Shown For Every Project
type: change
status: fixed
found: 2026-08-17
updated: 2026-08-17
tags: [change, portfolio, copy]
---

# Generic Steps Shown For Every Project

Called out directly: "How your customers book — end to end... that is not
working on all project why you keep writing in all portfolio on the some
way, understand each project purpose and how it works and write differently."

## The problem

`app/portfolio/page.tsx`'s project detail modal rendered a single hardcoded
`BOOKING_STEPS` array — "Get your QR code → chat → deposit → confirmation" —
under a fixed heading, **unconditionally, for every project in the
portfolio**. That flow is genuinely how the QR-chatbot projects work (MuleSoo
itself, YoYo Gym, X-Boss, Shime, Tsedi, TSI). It is not how a church content
site, a card-payment vending device, a fundraising platform, or a clinic
queue system work — none of those involve a QR-triggered chat booking at
all, yet the modal claimed they did.

## The fix

Added two optional fields to the `Project` interface: `howItWorks` (a step
list in the project's own words) and `howItWorksTitle` (a heading that fits
what the steps actually describe). The render block now reads:

```tsx
{(selected.howItWorks && selected.howItWorks.length > 0 ? selected.howItWorks : BOOKING_STEPS).map(...)}
```

with the heading falling back the same way. Projects that don't define
`howItWorks` keep showing the generic flow — correctly, since it's actually
true for them. Four projects got their own real steps written from their
actual mechanism, not the template:

| Project | New heading | Real mechanism it describes |
|---|---|---|
| Hamere Noh Kidane Mihret Church | "How the church keeps it current" | Bilingual content, edited live from an admin panel — no developer, no rebuild |
| Yewogen Derash | "How giving works" | A cause goes live, verified, and anyone gives — no account, no QR, no chat |
| Telga | "How a vendor earns from it" | Tap/swipe a card on a POS device, instant payment, commission logged |
| DR. Hospital | "A patient's journey through the clinic" | QR → booking fee → AI symptom intake → queue → clinician review → discharge |

The DR. Hospital steps were written directly from its own already-accurate
`capabilities` array in the same file, not invented — same source-checking
standard as [[Added Three Portfolio Projects]].

## Related

- [[Portfolio Copy And Cover Corrections]]
- [[Added Three Portfolio Projects]]
- [[Telga Portfolio Concept]]
- [[Verification Method]]

---
Back to [[Issues MOC]]
