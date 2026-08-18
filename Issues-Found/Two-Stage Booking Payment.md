---
title: Two-Stage Booking Payment
type: change
status: in-progress
found: 2026-08-17
tags: [change, booking, payment, whatsapp, pdf, terms]
---

# Two-Stage Booking Payment

A restructure of when a chatbot booking becomes "real," not a bug fix.

## Before

`handleTermsAccept()` in the widget fired `submitBooking()` the instant the
client clicked "I Agree" — before any money changed hands. That single call
to `/api/chatbot-booking` immediately: saved the booking, alerted the owner
by WhatsApp (`sendAdminNotification`), and (per [[Payment Link Never Sent]])
emailed a Paystack link for the 50% deposit. A client who never paid anything
looked identical, from the owner's side, to one who fully intended to pay.
The PDF download button had no gate at all — `generatePDF()` was reachable
regardless of `paymentStatus`.

## After

- **A new, flat, non-refundable R100 booking fee**, paid through the widget's
  own in-chat Paystack popup (`handlePayBookingFee`, renamed from
  `handlePayDeposit`) — separate from and paid before the existing 50%
  project deposit.
- **Nothing fires until Paystack confirms it.** `chatbot-booking/route.ts` now
  only saves the row and sends the client's own WhatsApp acknowledgement.
  `paystack/verify/route.ts` is the single gate: only once it has
  independently verified a `payment_type: 'booking_fee'` transaction does it
  send the owner's WhatsApp alert and trigger the deposit email.
- **The PDF download button is disabled** (`disabled={paymentStatus !== 'paid'}`)
  until the fee clears, with a lock icon and explanatory label in place of the
  download button.
- **T&Cs rewritten** in both the widget's terms screen and
  `lib/generateCleanBookingPDF.ts` (§2 payment terms, §10 cancellation) to
  state the booking fee as its own non-refundable clause, ahead of the
  existing deposit clauses, which were renumbered rather than awkwardly
  inserted around.

## `payment_type` — the actual gate, and why it's trustworthy

`paystack/verify/route.ts` distinguishes the fee from the deposit by reading
`payment_type` back from **Paystack's own verified transaction metadata**
(`pj.data.metadata.payment_type`), never from anything the client's request
body claims. A client cannot mislabel one payment as the other — the value
only exists because the server itself set it at `transaction/initialize`
time, on both the widget's popup and [[Payment Link Never Sent]]'s emailed
link.

## Two things checked before shipping, not assumed

1. **Whether `bookings.payment_status` accepts a new string value at all.**
   Tested directly with a throwaway insert (`payment_status: 'booking_fee_paid'`)
   against the live table before writing a line of the real logic — no CHECK
   constraint, accepted cleanly.
2. **Whether the admin dashboard could render the new state at all.**
   `app/admin/bookings/page.tsx` only recognises four `status` values —
   Pending, Confirmed, Completed, Cancelled — for its stat counts and filter
   tabs. A first draft used `status: 'Booking Fee Paid'`, which would have
   silently fallen outside every one of those buckets: visible in "All", but
   absent from every count and every filter. Changed to `status: 'Confirmed'`
   — an existing, dashboard-recognised value that is also the semantically
   correct one, since a fee-paid booking genuinely has moved from a raw
   submission to a confirmed booking.

## A correction to an earlier note

[[Promised PDF Agreement Never Sent]] claimed the PDF generator was dead
code, based on a `grep` scoped only to `app/`. It is not: `generateCleanBookingPDF`
is imported and called directly from `components/ChatbotWidget.tsx`, which
sits outside that search. That earlier note has been corrected — the PDF was
always reachable, just entirely ungated until this change.

## Also found, not yet fixed

`app/api/paystack/verify/route.ts`'s **deposit** path (unchanged by this
work) still writes `status: 'Paid'` — a value the admin dashboard has never
recognised either, predating everything touched here. Not fixed now: it's a
pre-existing gap outside what was asked, flagged for a future pass rather
than folded silently into this one.

## Related

- [[Payment Link Never Sent]]
- [[Promised PDF Agreement Never Sent]]
- [[Booking Payment Flow]]
- [[Booking Fixes — WhatsApp Backup, Unsure Budget, Cancel Resume]]
- [[Verification Method]]

---
Back to [[Issues MOC]]
