---
title: Bookings Never Saved
type: issue
status: fixed
severity: critical
found: 2026-08-17
fixed_in: f05a1fc
tags: [issue, fixed, booking, database, rls]
---

# Bookings Never Saved

## Symptom

Discovered while testing [[Payment Link Never Sent]] — a real production
booking returned `bookingId: null`. Checked directly with the service-role
key: **no row existed at all.**

## Root cause

`app/api/chatbot-booking/route.ts` inserted through the public **anon key**.
`bookings` has row-level security enabled with no policy permitting the anon
role to write. Reproduced the exact failure:

```
code: 42501
message: "new row violates row-level security policy for table \"bookings\""
```

The route only logged that error and continued — correct behaviour, a DB
hiccup should never block a client's booking — but it meant **every booking
anyone ever made through the chatbot was silently rejected by Postgres.**
Clients still got their WhatsApp confirmation and a success message, so nobody
noticed. The admin bookings dashboard has likely been empty this whole time,
with WhatsApp as the only surviving record any booking ever happened.

## Fix

Switched to `supabaseAdmin` — the service-role client already used for exactly
this reason in `app/api/contact/route.ts` and `app/api/paystack/verify/route.ts`.
Confirmed the service-role key inserts past RLS cleanly before making the
change, confirmed the anon-key failure independently, then verified the fix
against a real production booking.

## Why this mattered for the actual task

Directly load-bearing for [[Payment Link Never Sent]]: without a real row,
`/api/paystack/verify` would have had nothing to mark paid once a client
actually used the emailed link. The payment-link email fix could not be
verified as a complete flow until this was found and fixed too.

## Related

- [[Booking Schema Mismatch]] — the second, independent insert failure
- [[Payment Link Never Sent]]
- [[Booking Payment Flow]]

---
Back to [[Issues MOC]]
