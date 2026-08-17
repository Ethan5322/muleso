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

## The reality

There is no PDF agreement, and no email carrying one.

Two generators exist and are fully written:

- `lib/generateBookingPDF.ts`
- `lib/generateCleanBookingPDF.ts`

Neither is imported or called from anywhere in `app/`. Confirmed by searching
the whole app directory — zero references. They are dead code.

So step 3 of the instructions has never been true for any client.

## Options

1. **Wire it up** — generate the PDF in `app/api/chatbot-booking/route.ts` and
   attach it to the payment email built in [[Payment Link Never Sent]]. The
   booking already produces everything the document needs.
2. **Remove the promise** — delete step 3 from the WhatsApp template.

Option 1 is the better product; option 2 takes one minute and stops the site
telling clients something untrue in the meantime.

## Not fixed because

Out of scope for the payment-link work that was requested. Flagged rather than
silently changed — the WhatsApp copy is client-facing and the choice is yours.

## Related

- [[Payment Link Never Sent]] — the email that *does* now go out
- [[Booking Payment Flow]]

---
Back to [[Issues MOC]]
