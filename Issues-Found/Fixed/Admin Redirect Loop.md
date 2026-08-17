---
title: Admin Redirect Loop
type: issue
status: fixed
severity: critical
found: 2026-08-14
fixed_in: 2c9c185
regression_from: 4aff8c4
tags: [issue, fixed, auth, middleware, security]
---

# Admin Redirect Loop

## Symptom

Login succeeded, then the screen sat on **"Welcome Back! Admin panel is
loading…"** indefinitely. Reported as 10–15 minutes of waiting. It would never
have finished.

## Root cause

`middleware.ts` required a field the login route never issues:

```ts
typeof sessionData.passwordHash !== 'string'   // → always true → redirect
```

`/api/admin/login` signs `{ authenticated, timestamp, _sig }`. No
`passwordHash`. So **every** request to `/admin` was bounced back to
`/admin/login` — where the browser already was, so the page never unmounted and
its success panel stayed on screen forever.

## The regression

Traced with `git log -S`. It was **one commit, 4 August**: `4aff8c4`
*"CRITICAL SECURITY FIXES: Forged sessions, 2FA bypass, XSS, info leak"*.

Before it, the cookie carried:

```ts
passwordHash: Math.random().toString(36).substring(2, 15)   // random junk
```

— never a hash of anything. The middleware only checked `typeof === 'string'`,
which any garbage satisfies. It proved nothing, but it *passed*, so login had
worked since June.

That commit correctly replaced the unsigned cookie with an HMAC-signed one and
dropped the meaningless field — **but never updated the middleware**.

## The security half

The middleware only `JSON.parse`d the cookie and **never verified the
signature**. Confirmed: a hand-written cookie
`{"authenticated":true,"timestamp":<now>,"passwordHash":"x"}` sailed straight
through.

So that security commit achieved the exact opposite of its goal — it locked out
the real admin while still accepting forgeries.

## Fix

Middleware now checks the shape the login route actually signs **and** verifies
the HMAC with Web Crypto (Edge runtime has no `node:crypto`). Verified: accepts
the genuine session, rejects the forgery.

A textbook [[Two Halves Disagreeing]].

## Related

- [[2FA Codes Rejected As Invalid]]
- [[Login Dropped Connection]]

---
Back to [[Issues MOC]]
