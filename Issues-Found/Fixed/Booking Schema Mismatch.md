---
title: Booking Schema Mismatch
type: issue
status: fixed
severity: high
found: 2026-08-17
fixed_in: 58b792f
tags: [issue, fixed, booking, database, schema]
---

# Booking Schema Mismatch

## Symptom

[[Bookings Never Saved]] was fixed — RLS switched to the service-role
client — but a fresh test booking **still** came back with `bookingId: null`.

## Root cause

A second, independent insert failure. `bookings` has no `client_id`,
`client_id_type` or `usage_type` column. The chat widget collects all three
and the route was sending them anyway, so PostgREST rejected the whole row:

```
PGRST204  Could not find the 'client_id' column of 'bookings' in the schema cache
```

Verified directly: an insert carrying `client_id` fails with `PGRST204` even
under the service-role key (RLS was never the issue here), while the identical
row without it succeeds.

The real columns, confirmed live:

```
id, created_at, name, email, phone, country, company, client_type, service,
budget, timeline, contact_method, project_description, verification_code,
status, notes, payment_status, deposit_amount, payment_reference,
amount_paid, paid_at
```

Note `client_type`, not `client_id_type` — and no `usage_type` at all.

## Fix

`client_id`, `client_id_type` and `usage_type` are folded into
`project_description` rather than dropped, so whoever works the booking still
sees the ID and usage type the client typed. Real columns can be added later
if this ever needs to be queried on directly.

## Why two bugs, not one

[[Bookings Never Saved]] fixed RLS but the insert still failed for an
unrelated reason — two independent faults had to clear before a single
booking could reach the database. Neither symptom (`bookingId: null`) told
you which one you were looking at; only checking the actual Postgres error
code did.

## Related

- [[Bookings Never Saved]]
- [[Payment Link Never Sent]]
- [[Verification Method]]

---
Back to [[Issues MOC]]
