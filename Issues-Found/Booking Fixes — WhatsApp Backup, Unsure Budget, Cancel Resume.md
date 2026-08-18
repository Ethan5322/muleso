---
title: Booking Fixes — WhatsApp Backup, Unsure Budget, Cancel Resume
type: change
status: fixed
found: 2026-08-18
updated: 2026-08-18
tags: [change, booking, whatsapp, pdf, email, chatbot-widget]
---

# Booking Fixes — WhatsApp Backup, Unsure Budget, Cancel Resume

Three separate reports from one message, acted on together: the owner still
isn't getting WhatsApp booking alerts, the deposit email/PDF assume a firm
50% for clients who said they don't know their budget, and the widget traps
a client in an unfinished form with no way out.

## 1. WhatsApp alert still not arriving — root cause and the fix that's actually possible

Real diagnosis, not a guess: a live booking's DB update genuinely succeeded
(`payment_status: booking_fee_paid`) and the deposit email genuinely
delivered (Resend logged it), proving `paystack/verify/route.ts`'s code path
runs correctly end to end. Direct CallMeBot tests with the exact production
fallback credentials succeeded twice ("Message queued"), including two real
diagnostic messages sent straight to the owner's WhatsApp — neither arrived,
confirmed directly by the owner.

That is the actual finding: **CallMeBot (the free WhatsApp bridge in
`lib/sendWhatsAppMessage.ts`) can return HTTP 200 and "Message queued" while
never delivering**, with no machine-readable signal to catch — a known
limitation of its free tier (silent throttling, a stale/expired
registration). `sendWhatsAppMessage`'s `response.ok` check cannot see this;
there is nothing left to fix in that function that would make CallMeBot
itself trustworthy.

**What was actually shippable without new credentials:** every owner alert
(`sendAdminNotification`, `sendDepositPaidNotification`, `sendLeadNotification`,
`sendPurchaseNotification`) now also fires a plain-text email to
`hello@mulesoo.com` via Resend — proven reliable on this project (see
[[Resend Domain Verification]]) — alongside the existing WhatsApp attempt and
optional Telegram fallback. `sendAdminEmailBackup()` in
`lib/sendWhatsAppMessage.ts`. This doesn't fix CallMeBot's reliability; it
means a silent CallMeBot failure no longer means a silent alert failure —
the owner now has a channel that has never failed on this project.

**Not fixed, flagged for a real decision:** replacing CallMeBot with a paid,
accountable channel (Twilio WhatsApp Business API, Meta's own WhatsApp Cloud
API) is the only way to get real delivery guarantees. Out of scope here —
needs new credentials and a cost decision, not a code fix.

### The actual smoking gun, found on a second pass

The user reported the WhatsApp alert *still* wasn't arriving after the email
backup shipped. Rather than repeat the same "maybe it's silently failing"
guess, called CallMeBot's live API directly with the exact production
fallback credentials and read the **response body**, not just the status
code:

```
$ curl "https://api.callmebot.com/whatsapp.php?phone=27688529333&text=...&apikey=7268108"
<b>Service is down (410)</b>: Sorry for the inconvenience. There is a
technical problem and I am working on it. The service will be back in
24-48hs (on August 18th or sooner)
HTTP_STATUS: 207
```

**That is the real, confirmed root cause**, reproduced three times: CallMeBot
is in a declared outage, and returns **HTTP 207** — inside the 200-299 range
`response.ok` treats as success — for its own outage notice. Every WhatsApp
send during this window was silently "succeeding" by our own check while
literally nothing was sent. Not vague flakiness; a specific, provable false
positive.

**Fixed properly this time:** `sendWhatsAppMessage()` in
`lib/sendWhatsAppMessage.ts` no longer trusts `response.ok`. It reads the
response body and requires CallMeBot's own documented success phrase
("Message queued") before calling it delivered — anything else (this outage
notice, a future rate-limit or registration error CallMeBot reports the same
way) is now correctly treated as a failure, retried, and if still failing,
returned as an honest `success: false` with the real reason text instead of
a false positive.

**Verified the email backup is genuinely carrying the load in the
meantime** — checked Resend's own delivery log directly (not the app's
optimistic response), found two real post-deploy bookings ("Uomato",
"Tiop sigat") both landed `delivered` "🔔 New Booking" emails at
`hello@mulesoo.com` within the same second their deposit emails went out.
The owner has not actually missed a booking since the backup shipped, even
though WhatsApp itself has been down the whole time.

CallMeBot's own message estimates a return "on August 18th or sooner" —
today's date — so this may already have resolved by the time this is read.
Nothing on our side can hurry that along; the code fix above just stops it
from lying about it next time.

## 2. "Not sure yet" budget clients were handed a firm 50% figure and a live pay button

The deposit email and PDF compute the deposit from the *service's* fixed
list price (`quoteForService()` in `lib/bookingPayment.ts`) — never from the
client's own *budget* answer. A client who explicitly picked "Not sure yet"
for budget still got the exact same confident "Pay R1,750 securely" email
and PDF line as someone who'd committed to a price band. The number itself
was real (the site's own published price), but presenting it as settled,
with an immediate payment button, skips the conversation an unsure client
was signalling they needed.

Fixed by branching on `budget === 'Not sure yet'` in three places that must
agree, same pattern as [[Two-Stage Booking Payment]]:

- `lib/bookingPayment.ts` — `sendDepositPaymentEmail()` now checks the
  client's budget (passed through from `paystack/verify/route.ts`'s
  `updatedRow.budget`) and routes to a new `sendUnsureBudgetEmail()` instead:
  no Paystack transaction is initialized, no amount is charged or implied —
  it tells the client the team will reach out to agree a deposit together,
  then send a real link once that's settled.
- `lib/generateCleanBookingPDF.ts` — the PAYMENT & DEPOSIT box shows
  "Deposit: To be agreed with MuleSoo team" instead of a computed rand
  figure, with matching copy in the balance line and footnote.
- `components/ChatbotWidget.tsx` — the in-chat terms screen and the
  pre-payment "Pay Your Booking Fee" note both show the same budget-aware
  copy, so the client never sees a firm 50% mentioned anywhere in the
  flow if they said they weren't sure.

Clients who did pick a real budget band or a specific service price are
unaffected — that number was never the complaint.

## 3. The widget trapped a client in an unfinished form

`ChatbotWidget` lives in `layout.tsx` and never unmounts while closed —
`isOpen` only toggles which JSX renders, so `stage`/`bookingData`/`messages`
survive a close exactly as they were. Reopening mid-form silently dropped
the client back into the same half-finished step with no way out short of
finishing it — not a bug in the strict sense (nothing was lost), but a real
dead end the client had no way to escape.

Two additions:

- **A Cancel button**, visible throughout the data-collection stages
  (same condition as the existing back/forward arrows), opens a confirm
  screen; confirming marks any already-recorded booking row `Cancelled`
  (best-effort, via a new `POST /api/chatbot-booking/cancel`) and resets the
  widget to the service picker, in the same open panel.
- **A resume-or-restart prompt** on reopening mid-flow (any stage except
  `greeting` and `summary`, detected via a `wasOpenRef` close→reopen check):
  "Continue Booking" leaves everything untouched; "Start Over" cancels any
  recorded row and resets the same way the Cancel button does.

`submitBooking()` only inserts a `bookings` row after `terms` is accepted —
so cancelling earlier in the form has nothing to cancel yet, and
`cancelBookingRow()` (client) / the new route (server) both treat a missing
`bookingId` as a no-op, not an error. `status: 'Cancelled'` was already one
of the four values `app/admin/bookings/page.tsx` recognises (see
[[Two-Stage Booking Payment]]), so cancelled bookings show up correctly in
the dashboard's own filters rather than a value it silently drops.

## Related

- [[Two-Stage Booking Payment]]
- [[Booking Payment Flow]]
- [[Resend Domain Verification]]
- [[Verification Method]]

---
Back to [[Issues MOC]]
