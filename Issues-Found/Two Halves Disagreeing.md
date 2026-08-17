---
title: Two Halves Disagreeing
type: concept
status: active
tags: [concept, pattern]
---

# Two Halves Disagreeing

The pattern behind three of the [[Issues MOC|fixed issues]]: not a single
broken function, but two pieces of the system that each work correctly in
isolation while silently assuming something the other side no longer provides.

| Issue | The two halves | What they disagreed about |
|---|---|---|
| [[2FA Codes Rejected As Invalid]] | Postgres column type · JavaScript `Date` parser | Whether a bare timestamp string means UTC or local time |
| [[Admin Redirect Loop]] | `/api/admin/login` (signs the cookie) · `middleware.ts` (reads the cookie) | What fields a valid session actually contains |
| [[Booking Schema Mismatch]] | The chat widget's form fields · the `bookings` table columns | Whether `client_id` was ever a real column |

In every case, `git log -S` or a direct field-by-field comparison found the
exact commit or exact mismatch — none of these needed guessing. The general
lesson: when a symptom looks like "sometimes it works, sometimes it doesn't"
with no obvious pattern, check whether two sides of a boundary (client/server,
code/database, old code/new code) still agree on the shape of what crosses it.

## Related

- [[Verification Method]] — how each of these was actually confirmed, not assumed

---
Back to [[Issues MOC]]
