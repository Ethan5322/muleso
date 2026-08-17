---
title: Promised PDF Agreement Never Sent
type: issue
status: open
severity: medium
found: 2026-08-17
tags: [issue, booking, email, open]
---

# Promised PDF Agreement Never Sent

## The promise

Every client who books through the chatbot receives a WhatsApp confirmation
containing this line, from `lib/sendWhatsAppMessage.ts`:

```
---NEXT STEPS---
1. Review your booking details above
2. Our team will contact you within 2 hours
3. Download your PDF agreement from your email
4. We will confirm project start date
```

## Correction — the original claim here was wrong

This note originally said both PDF generators were dead code, based on
`grep -rln "generate...PDF" app/` — zero matches. That search was too
narrowly scoped. `lib/generateCleanBookingPDF.ts` **is** imported and called,
just from `components/ChatbotWidget.tsx`, which sits outside `app/`. Found
and corrected while building [[Two-Stage Booking Payment]], with a proper
repo-wide, glob-based search this time — not repeating the same scoping
mistake twice.

`lib/generateBookingPDF.ts` (the other, older file — no "Clean") genuinely
**is** dead: zero references anywhere in the repo, confirmed.

## The reality, corrected

The PDF is real, generated client-side by `generateCleanBookingPDF`, and
downloadable — but only ever as a **local download the client triggers by
clicking a button in the widget**. It is never emailed anywhere, by any
code path, to anyone. So step 3 of the WhatsApp promise —
*"Download your PDF agreement from your email"* — has still never been true,
just for a different reason than first thought: not because the PDF doesn't
exist, but because it only ever reaches the client through a browser
download, never their inbox.

[[Two-Stage Booking Payment]] gated the download button behind the R100
booking fee, which incidentally also means: before that fee is paid, the
WhatsApp message's step 3 was doubly false — no PDF existed for the booking
at all, downloadable or otherwise.

## Options

1. **Wire it up** — actually attach the PDF to an email once generated
   (client-side `generateCleanBookingPDF` would need a server-side twin, or
   the client would need to upload the generated file for the server to
   attach and send).
2. **Remove the promise** — change step 3 of the WhatsApp template to
   describe what's actually true: download it in the chat, not from email.

Option 2 is the one-line fix; option 1 is real additional work.

## Not fixed because

Still out of scope for what was asked in either the payment-link work or the
two-stage payment restructure. Flagged, not silently changed — the WhatsApp
copy is client-facing and the choice is yours.

## Related

- [[Payment Link Never Sent]] — the email that *does* now go out
- [[Booking Payment Flow]]

---
Back to [[Issues MOC]]
