---
title: Live API Keys Committed
type: issue
status: open
severity: critical
found: 2026-08-17
tags: [issue, security, open, credentials]
---

# Live API Keys Committed

> [!danger] Your live production keys are in the public git history.
> Deleting the file does **not** fix this. The values stay in every past commit.
> **Rotate first, scrub second.**

## What is exposed

`2FA_INTEGRATION_SUMMARY.md` — a tracked, committed file in
`github.com/Ethan5322/muleso` — contains the exact live values of:

| Key | Consequence if used |
|---|---|
| `RESEND_API_KEY` | Anyone can send email **as `mulesoo.com`** — invoices, password resets, anything |
| `RECAPTCHA_SECRET_KEY` | Bot protection on the contact form can be bypassed |

`GET_ENV_VARIABLES.md` was also flagged but contains only placeholders
(`re_xxxx`, `6Le7xxx`) — that file is fine.

## How this was confirmed

Not guessed. The values in the committed doc were compared byte-for-byte against
the live `.env.local`:

```
RESEND_API_KEY:        *** LIVE VALUE IS IN THE COMMITTED DOC ***
RECAPTCHA_SECRET_KEY:  *** LIVE VALUE IS IN THE COMMITTED DOC ***
NEXT_PUBLIC_SUPABASE_ANON_KEY: not present in doc
SUPABASE_SERVICE_ROLE_KEY:     not present in doc
```

Supabase keys are **not** exposed. Only those two.

## Fix — in this order

1. **Rotate Resend** — dashboard → API Keys → revoke the old key, create a new one
2. **Rotate reCAPTCHA** — Google reCAPTCHA admin → regenerate the secret
3. Update both in **Vercel** (Production + Preview) and in local `.env.local`
4. Only then scrub the values from `2FA_INTEGRATION_SUMMARY.md`

Step 4 last, deliberately: until the keys are rotated the old ones work no
matter what the file says.

## Why it matters here

The same document set claims "API keys go ONLY in .env.local — never in
component files". That rule was correct; the documentation itself broke it.
Related: [[Documentation Contradictions]].

---
Back to [[Issues MOC]]
