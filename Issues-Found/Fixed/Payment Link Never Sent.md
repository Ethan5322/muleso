---
title: Payment Link Never Sent
type: issue
status: fixed
severity: critical
found: 2026-08-17
fixed_in: b639549
tags: [issue, fixed, booking, payment, email, resend, paystack]
---

# Payment Link Never Sent

## Symptom

A client books through the chatbot and provides an email address. No email
ever arrives with a way to pay.

## Root cause

The trigger never existed. `app/api/chatbot-booking/route.ts` called only
`sendBookingConfirmation` and `sendAdminNotification` — both WhatsApp-only, no
Resend import anywhere in the file. The only payment path in the whole app was
the **inline Paystack popup inside the chat widget itself**, which only works
if the client stays in that exact browser tab. Close the chat, and there was
never anything to come back to.

## Fix

`sendPaymentLinkEmail()` in `chatbot-booking/route.ts`:

1. Computes the deposit server-side from a price table kept in lock-step with
   `SERVICES`/`getServiceDeposit()` in `components/ChatbotWidget.tsx` — every
   service price and both constants (`DEPOSIT_PERCENT`, `CUSTOM_DEPOSIT_ZAR`)
   diffed line by line against the widget before shipping
2. Initializes a real Paystack transaction, same pattern already proven in
   `app/api/store/checkout/route.ts`
3. Emails the resulting hosted checkout link — pre-filled with the client's
   email and the exact deposit — via `chatbot@mulesoo.com`, which
   [[Resend Domain Verification]] confirmed is a fully verified sender

`app/booking/pay/page.tsx` is where Paystack sends the browser back after
payment. It does not reimplement verification — it calls the existing
`/api/paystack/verify`, the same endpoint the in-chat inline flow already used,
so a deposit paid by email and one paid inline are checked and recorded
identically.

## Second pass — the email itself

The first version sent a bare "pay your deposit" line. Rewritten to a full
HTML template that shows the client the exact quote they chose in the chat:
service, reference, project total, deposit due now, balance on delivery — not
just a number with no context. Table-based layout with inline styles
throughout, since Gmail and Outlook strip `<style>` blocks and ignore
flexbox.

## Verified against production, not just built

- `POST /api/chatbot-booking` on the live site → `paymentEmailSent: true`
- Database row confirmed to exist with the right `service` and
  `payment_status: unpaid`
- Paystack transaction confirmed via its own API: `R1,750` on a `Build AI
  Chatbot` booking — exactly 50% of `R3,500`
- Resend confirms `delivered`
- The actual email was read from the connected inbox and the real link
  extracted: `https://checkout.paystack.com/...`
- That link returns a live Cloudflare-protected Paystack page (403 to a
  scripted fetch is the bot check, not a dead link — the transaction's
  validity was already confirmed via Paystack's own verify API)

## Depended on

- [[Bookings Never Saved]] — without a real row there was nothing for
  `/api/paystack/verify` to mark paid
- [[Booking Schema Mismatch]] — the second insert failure found in the same pass
- [[Resend Domain Verification]] — confirms `chatbot@mulesoo.com` actually delivers

## Still open

- [[Promised PDF Agreement Never Sent]] — a separate, still-unfixed promise in
  the WhatsApp confirmation text

## Related

- [[Booking Payment Flow]]

---
Back to [[Issues MOC]]
