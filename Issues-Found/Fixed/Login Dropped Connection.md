---
title: Login Dropped Connection
type: issue
status: fixed
severity: high
found: 2026-08-14
fixed_in: 1071085
tags: [issue, fixed, auth, network]
---

# Login Dropped Connection

## Symptom

Correct 2FA code, sometimes accepted, sometimes **"Invalid code"** again —
after [[2FA Codes Rejected As Invalid]] and [[Admin Redirect Loop]] were
already fixed. Console showed:

```
net::ERR_NETWORK_CHANGED
Error verifying 2FA code: TypeError: Failed to fetch
```

## Root cause

The connection dropped **mid-request** — after the server had already verified
the code and marked it `used: true`, but before the response reached the
browser. Retyping the same digits then hit an already-consumed code and came
back "Invalid code", so a network fault presented as a wrong code.

Confirmed directly against the database: six codes were marked `used = true`
from logins the browser never actually completed.

A second, compounding fault: `router.push('/admin')` after a successful login
fetches an RSC payload with no timeout. On the same unstable connection, that
fetch could stall forever — this is most of what [[Admin Redirect Loop]] was
mistaken for before the real redirect-loop cause was found.

## Fix

- Navigation after login is now a full page load (`window.location.href`),
  which gets the browser's own timeout and error handling instead of an
  indefinite spinner
- The login request itself carries a 20s `AbortController` deadline
- A failed request reports the real problem — "connection dropped, this code
  may already be used" — and returns to the start for a fresh code, instead of
  silently burning attempts

## Related

- [[2FA Codes Rejected As Invalid]]
- [[Admin Redirect Loop]]
- [[Two Halves Disagreeing]]

---
Back to [[Issues MOC]]
