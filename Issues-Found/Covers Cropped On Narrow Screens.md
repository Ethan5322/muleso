---
title: Covers Cropped On Narrow Screens
type: change
status: fixed
found: 2026-08-18
tags: [change, portfolio, store, responsive, covers]
---

# Covers Cropped On Narrow Screens

Reported directly: portfolio and store covers looked "zoomed" — part of the
artwork cut off, not visible edge to edge on some phones.

## Root cause

Every cover container used a **fixed height** (`h-60`, `h-56`, `h-40 sm:h-52`,
`h-36 sm:h-40`) with `object-cover` (portfolio's real photo covers) or an SVG
`preserveAspectRatio="slice"` (`EmojiCover`, `PortfolioCover`) inside it.
Both of those crop whatever doesn't fit — by design, that's what "cover" and
"slice" mean. The crop only looks *correct* when the container's aspect
ratio happens to match the artwork's own aspect ratio. It didn't: a fixed
height paired with a `w-full` container means the ratio changes with every
screen width, while the artwork itself (1200×675 for portfolio covers,
1200×480 for every `EmojiCover`) never changes. Narrower than the artwork's
own ratio → the sides get sliced off — exactly what was reported, and worse
on a phone (one grid column, narrowest container) than on desktop.

Confirmed by reading the actual numbers before touching anything: portfolio
`<Image>` calls are always `width={1200} height={675}` (16:9 exactly), and
`EmojiCover`'s own `viewBox="0 0 1200 480"` (5:2 exactly) — both fixed,
neither matching a fixed-pixel container at every width.

## Fix

Replaced every fixed height with a CSS `aspect-*` utility matching the
artwork's real ratio, so the container's shape always equals the artwork's
shape — nothing left to crop, at any screen width:

| File | Was | Now |
|---|---|---|
| `app/portfolio/page.tsx` — grid card | `h-60` | `aspect-[16/9]` |
| `app/portfolio/page.tsx` — detail modal | `h-56` | `aspect-[16/9]` |
| `app/store/store-client.tsx` — digital guides | `h-40 sm:h-52` | `aspect-[1200/480]` |
| `app/store/store-client.tsx` — Auto Pilot systems | `h-40 sm:h-52` | `aspect-[1200/480]` |
| `app/store/store-client.tsx` — automations | `h-36 sm:h-40` | `aspect-[1200/480]` |

All five containers hold either the same `Image` size or the same
`EmojiCover` component, so one ratio value per artwork size covers every
instance — checked with a repo-wide search for `EmojiCover` and the new
portfolio image filenames before assuming these were the only spots.

Cards in the same grid row still line up: CSS grid gives every card in a row
the same column width, and `aspect-ratio` derives height from width, so
same width → same height, same as the fixed-height version did — just now
correctly sized instead of arbitrarily fixed.

## Related

- [[Portfolio Copy And Cover Corrections]]
- [[Added Obsidian Claude Code Guide To Store]]
- [[Verification Method]]

---
Back to [[Issues MOC]]
