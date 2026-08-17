---
title: 2FA Codes Rejected As Invalid
type: issue
status: fixed
severity: critical
found: 2026-08-14
fixed_in: 5d10ea7
tags: [issue, fixed, auth, 2fa, timezone]
---

# 2FA Codes Rejected As Invalid

## Symptom

Correct 2FA code entered → **"Invalid code"**. Every time. Admin panel
unreachable.

## Root cause

`two_factor_codes.expires_at` is `timestamp WITHOUT time zone`, so PostgREST
returns it bare:

```
2026-08-14T05:48:15.383     ← no Z, no offset
```

JavaScript parses a bare date-time as **local time**. The browser is UTC+2, so
the expiry was read as two hours *earlier* than it really was — the code was
already expired the instant it was issued.

Proven against the real value:

```
OLD  new Date(raw)  -> 2026-08-14T03:48:15Z   already expired? true
NEW  parseUtc(raw)  -> 2026-08-14T05:48:15Z   already expired? false
```

## Why it said "invalid" and not "expired"

A second defect. `app/admin/login/page.tsx` discarded the real error and
hardcoded the string `Invalid code`, sending everyone hunting for a typo that
was never there.

## Fix

- `parseUtc()` in `lib/twoFactorUtils.ts` labels bare timestamps as UTC
- The server's real error message now reaches the user
- Code lifetime raised 10 → 20 min via `TWO_FACTOR_TTL_MINUTES` (env-tunable,
  so the window can change without a rebuild)

An instance of [[Two Halves Disagreeing]] — the database and the parser
disagreed about what a timestamp meant.

## Related

- [[Admin Redirect Loop]] — the next fault, revealed once this one cleared
- [[Login Dropped Connection]]

---
Back to [[Issues MOC]]
