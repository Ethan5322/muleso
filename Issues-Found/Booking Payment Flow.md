---
title: Booking Payment Flow
type: concept
status: active
tags: [concept, booking, architecture]
---

# Booking Payment Flow

How a client's booking actually gets from the chat widget to a paid deposit,
and the chain of fixes it took to make that true end to end.

```
Client fills chat widget (components/ChatbotWidget.tsx)
        │
        ├─→ Back arrow to correct an answer ────────── [[Back Button Did Not Allow Editing]]
        │
        ▼
POST /api/chatbot-booking
        │
        ├─→ Insert into `bookings` table ──────────── [[Bookings Never Saved]]
        │                                              [[Booking Schema Mismatch]]
        │
        ├─→ WhatsApp confirmation to client ────────── (worked all along)
        │        "Download your PDF agreement from
        │         your email" ─────────────────────── [[Promised PDF Agreement Never Sent]]
        │
        ├─→ WhatsApp alert to admin ─────────────────  (worked all along)
        │
        └─→ Email a Paystack payment link ──────────── [[Payment Link Never Sent]]
                 │
                 ▼
        Client opens link → pays on Paystack's
        hosted checkout → redirected to
        /booking/pay?bookingId=&ref=
                 │
                 ▼
        POST /api/paystack/verify
        (same endpoint the in-chat inline
        popup already used)
                 │
                 ▼
        `bookings.payment_status = 'paid'`
```

## Why one fix wasn't enough

Four separate faults sat on this one path, and fixing the first only exposed
the next:

1. [[Back Button Did Not Allow Editing]] — clients couldn't correct a mistake before submitting
2. [[Bookings Never Saved]] — RLS silently rejected every insert
3. [[Booking Schema Mismatch]] — a second, independent insert failure once the first was fixed
4. [[Payment Link Never Sent]] — the email trigger never existed at all
5. [[Two-Stage Booking Payment]] — a real R100 fee, verified server-side, now gates the owner alert, the deposit email and the PDF, none of which fired on anything before this
6. [[Promised PDF Agreement Never Sent]] — still open, a separate broken promise on the same path

The alternate path — the **in-chat inline Paystack popup** — worked the whole
time, because it never touched the booking row or an email. That is precisely
why nobody had noticed: the flow that got tested (stay in the chat, pay
immediately) worked; the flow that got promised (close the chat, pay later
from an email) silently didn't exist.

## Related

- [[Issues MOC]]
- [[Two Halves Disagreeing]]
- [[Verification Method]]

---
Back to [[Issues MOC]]
