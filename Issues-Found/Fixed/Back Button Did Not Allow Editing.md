---
title: Back Button Did Not Allow Editing
type: issue
status: fixed
severity: medium
found: 2026-08-17
tags: [issue, fixed, chatbot-widget, ux]
---

# Back Button Did Not Allow Editing

## Symptom

Client clicks the back arrow in the chat widget to correct an earlier answer.
Nothing usable happens — the field looks the same as before, no way to edit.

## Root cause — two compounding causes in `components/ChatbotWidget.tsx`

1. **`goBack()` cleared the input to `''` instead of restoring the previous
   answer.** `bookingData` already held the correct value (e.g.
   `bookingData.fullName`), but nothing populated `inputValue` from it, so the
   client landed on a blank box with no visible answer to edit.

2. **Old chat bubbles were never removed.** Every submission calls
   `addMessage()` and appends a new bubble; nothing ever slices the transcript
   back. So even after typing a corrected answer, the *original* answer's
   bubble stayed on screen, unreplaced — updating `bookingData` correctly
   under the hood did nothing to make the edit *look* like it took.

Neither half alone fully explains "does not allow to edit" — the input being
blank reads as "there's nothing to edit here"; the stale bubble on top of it
reads as "my edit didn't save." Together, they made the feature feel entirely
broken even though `setBookingData()` was updating correctly the whole time.

## Fix

- `stageEntryMsgCount` (ref, keyed by stage) snapshots how many chat bubbles
  existed the moment each stage was first entered — right after its bot
  question, before the client answered
- `goBack()` now slices `messages` back to that snapshot, so the transcript
  visibly rewinds to the question being re-answered
- `goBack()`/`goForward()` now call `valueForStage()` to pre-fill `inputValue`
  from the matching `bookingData` field, so the client sees and can edit what
  they actually typed

A subtlety caught before shipping: the natural instinct was to snapshot the
message count via a `useEffect` dependent on `[stage, messages]`. That's
wrong — stages like `'details'` fire multiple `addMessage` calls (the answer,
then an async "Processing…" step) *before* transitioning, so a `messages`-
dependent effect would keep inflating the snapshot mid-stage and undercut how
far `goBack()` could actually rewind. Fixed with a separate
`messagesCountRef` kept in sync by its own `[messages]`-only effect, read (not
depended on) by the `[stage]`-only tracking effect — declared in that order so
React's same-commit effect ordering guarantees the ref is current by the time
it's read.

## Verified

TypeScript-checked via a full production build (compile → typecheck → 284
static pages) before pushing — traced the effect ordering and snapshot timing
by hand against the exact sequence a real edit produces, the same rigor as
every other fix in this vault.

## Related

- [[Booking Payment Flow]] — this sits earlier on the same client journey
- [[Verification Method]]

---
Back to [[Issues MOC]]
