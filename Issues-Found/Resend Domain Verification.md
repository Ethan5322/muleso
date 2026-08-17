---
title: Resend Domain Verification
type: reference
status: verified
found: 2026-08-14
tags: [reference, email, resend, dns]
---

# Resend Domain Verification

Reference note — confirms the email infrastructure that [[Payment Link Never Sent]] and the 2FA email in [[2FA Codes Rejected As Invalid]] both depend on.

## Verified directly against Resend's API, not assumed

```
GET /domains -> mulesoo.com : "status": "verified"

DNS records, individually:
  [verified]  TXT   resend._domainkey   (DKIM)
  [verified]  MX    send                (feedback-smtp.eu-west-1.amazonses.com)
  [verified]  TXT   send                (SPF: v=spf1 include:amazonses.com ~all)
```

`RESEND_API_KEY` confirmed present in Vercel, both Preview and Production.

## Sender addresses in use across the app

| Sender | Used by | Status |
|---|---|---|
| `chatbot@mulesoo.com` | booking payment link, chatbot lead alerts | verified, delivers |
| `security@mulesoo.com` | 2FA codes, security alerts | verified, delivers |
| `onboarding@resend.dev` | admin login 2FA (sandbox), contact form | works regardless (Resend's own domain) |

Real test sent through the app's own `contact-chat` route (not a new script)
→ confirmed `delivered` in Resend's own event log, not just the app's
optimistic `{success:true}` response.

## Related

- [[Payment Link Never Sent]]
- [[Live API Keys Committed]] — the `RESEND_API_KEY` that authorizes all of this

---
Back to [[Issues MOC]]
