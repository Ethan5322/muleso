---
title: Verification Method
type: concept
status: active
tags: [concept, methodology]
---

# Verification Method

None of the fixes in this vault were declared done from reading code alone.
Each was checked against the running system before being called fixed — this
note is what "checked" meant in each case, so the standard is visible rather
than implied.

| Fix | How it was actually verified |
|---|---|
| [[2FA Codes Rejected As Invalid]] | Reproduced the exact bug against a real database row's `expires_at` value, then proved the fix flips the same calculation |
| [[Admin Redirect Loop]] | Signed a real session cookie the way the login route does, ran it through both the old and new middleware logic, and separately confirmed a forged cookie is now rejected |
| [[Login Dropped Connection]] | Found via the user's actual browser console output — `net::ERR_NETWORK_CHANGED` — not inferred from code |
| [[Bookings Never Saved]] | Reproduced the exact Postgres error (`42501`) using the same anon key the route used in production, then confirmed the service-role key inserts cleanly |
| [[Booking Schema Mismatch]] | Reproduced the exact PostgREST error (`PGRST204`) with a live insert, then read the actual column list back from the table |
| [[Payment Link Never Sent]] | End-to-end against production: real booking → real database row → real Paystack transaction (verified via Paystack's own API) → real email (confirmed `delivered` in Resend's log) → the real link read out of the actual inbox |
| [[Resend Domain Verification]] | Checked Resend's `/domains` endpoint directly, and sent a real email through the app's own existing route rather than a new script |
| [[Live API Keys Committed]] | The exposed value was diffed byte-for-byte against the real `.env.local`, not assumed from the filename |

## The rule this follows

A green build or a `{success:true}` response proves the code ran without
throwing — it does not prove the thing it claims to have done actually
happened. Every fix above was checked against the actual downstream system
(the database, Paystack's API, Resend's delivery log, or the real inbox) after
deploying, not just after building.

## Related

- [[Two Halves Disagreeing]]
- [[Booking Payment Flow]]

---
Back to [[Issues MOC]]
