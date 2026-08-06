# Email Sequences Setup Guide

This guide walks you through setting up automated email sequences for MuleSoo using Zapier or Make.com.

## Overview

We have 4 email sequences ready to deploy:

1. **Contact Form Sequence** (5 emails over 7 days)
   - Sent when someone fills the contact form
   - Builds trust, answers common objections, books a call

2. **Chatbot Inquiry Sequence** (3 emails over 5 days)
   - Sent when someone books via chatbot
   - Confirms receipt, sends quote, follows up

3. **Store Purchase Sequence** (4 emails over 14 days)
   - Sent after digital guide purchase
   - Helps customer succeed, upsells to done-for-you service

4. **Case Study Inquiry Sequence** (2 emails over 3 days)
   - Sent when someone engages with case studies
   - Explains your methodology, books strategy call

---

## Setup: Using Zapier (Recommended for beginners)

### Step 1: Connect Your Email Service (Resend)

1. Go to [Zapier.com](https://zapier.com)
2. Click **+ Create** → Start with trigger
3. Search for **Webhooks by Zapier** → Select **Catch Raw Webhook**
4. Copy the webhook URL (you'll need this)
5. Click **Continue to Action**
6. Search for **Resend** → Select **Send Email**
7. Authenticate with your Resend API key (Settings > API Keys)

### Step 2: Set Up Contact Form Trigger

1. In your MuleSoo admin, add this webhook to your contact form:
   ```
   POST https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/
   
   Body (JSON):
   {
     "email": "{{email}}",
     "name": "{{name}}",
     "service": "{{service}}",
     "trigger": "contact_form"
   }
   ```

2. Test by submitting a form entry in admin

3. In Zapier, create the first automation:
   - **Trigger**: Webhook receives "trigger: contact_form"
   - **Action**: Send Email (immediate)
   - Use template from `lib/emailSequences.ts` under `contact-form` → email 1
   - Replace `{{name}}`, `{{service}}`, `{{email}}` with field mappings

### Step 3: Set Up Delays (Schedule Follow-up Emails)

For emails 2-5 in the contact sequence:

1. After "Send Email #1" action, add **Delay by Zapier** → Set to "1 day"
2. Then add another "Send Email" action for email #2
3. Add another Delay → "2 more days" (total 3 days)
4. Add "Send Email #3"
5. Repeat for emails 4-5 with proper delays

### Step 4: Repeat for Other Sequences

- **Chatbot Sequence**: Trigger when chatbot booking is saved
- **Store Sequence**: Trigger when Stripe payment succeeds
- **Case Study Sequence**: Trigger when person views case study page 3x+ (if you have analytics)

---

## Setup: Using Make.com (More powerful)

Make.com is better if you have complex logic or want to:
- Track which emails were opened
- Segment sequences based on user behavior
- Sync data to CRM

### Basic Setup

1. Go to [Make.com](https://make.com)
2. Create new scenario
3. Add **Webhooks → Custom Webhook** as trigger
4. Copy webhook URL and add to your form submission
5. Add **Modules**:
   - Webhooks (trigger)
   - Gmail/Resend (send email)
   - Delay (wait before next email)
   - Repeat for each email in sequence
6. Map data: `{{name}}` → incoming webhook field `name`

**Example scenario structure**:
```
Webhook (receives form data)
  ↓
Send Email #1 (immediate)
  ↓
Delay 1 day
  ↓
Send Email #2
  ↓
Delay 2 days
  ↓
Send Email #3
... etc
```

---

## Testing Your Sequences

### Test Email #1
1. Submit a test form with your own email
2. You should receive email #1 within 5 minutes
3. Check spam folder
4. Click links to verify they work

### Test Delays
1. Modify Zapier/Make temporarily to use shorter delays (5 mins instead of 1 day)
2. Submit another test form
3. Verify all 5 emails arrive in correct order
4. Change delays back to production values

### Track Opens & Clicks (Optional)
- In Resend dashboard, emails show open rates
- Use UTM parameters in links to track which email drove signups
  - Example: `https://mulesoo.com/contact?utm_source=email&utm_medium=contact_form_day3`

---

## Customization Checklist

Before going live, personalize each sequence:

- [ ] Update sender name: "Ethan & MuleSoo" → your name
- [ ] Update links: Make sure all URLs work (Calendly, WhatsApp, case studies)
- [ ] Update company info: "+27 XXX XXX XXXX" → your actual number
- [ ] Update service names: "{{service}}" should match your service names
- [ ] Add CTA buttons: Replace plain links with styled button HTML if possible
- [ ] Brand signature: Add your logo/brand colors if Resend supports it
- [ ] Test tone: Make sure it matches your voice

---

## Monitoring & Optimization

Once live, track these metrics:

### Key Metrics to Watch
- **Email delivery rate**: Should be 95%+
- **Open rate**: Average 25-40% for B2B services
- **Click rate**: Average 5-10%
- **Conversions**: Calls booked / quote acceptances from email sequences

### If Open Rate is Low (<20%)
- Subject lines aren't compelling enough
- Too many emails in sequence (people tune out)
- Wrong time of day sending

### If Click Rate is Low (<3%)
- CTAs aren't clear
- Links are hard to find
- Offers aren't compelling

### If Conversions are Low
- Email copy isn't matching their pain point
- CTA is too soft (add urgency?)
- Timing is off (delay some emails)

---

## API Webhook Format

If you want to trigger sequences programmatically (not just via Zapier UI):

```bash
curl -X POST https://hooks.zapier.com/hooks/catch/YOUR_ID/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "name": "John Smith",
    "service": "Website Design",
    "company": "Acme Corp",
    "trigger": "contact_form"
  }'
```

---

## Troubleshooting

**"Emails not sending"**
- Check Resend API key is correct in Zapier/Make
- Check webhook URL is added to form
- Check spam folder
- Test with your own email first

**"Delays aren't working"**
- Make sure Delay module is between emails, not after
- Check timezone settings in Zapier/Make
- Give it time (delays are approximate, +/- 15 mins)

**"Personalization not working ({{name}} appearing in emails)"**
- In Zapier, make sure `name` field is mapped from webhook
- Check field names match exactly: `{{name}}` must match webhook field `name`
- Test with a simple email first

**"Too many/too few emails sending"**
- Count the number of emails in your Zapier scenario
- Make sure each delay is unique (don't set all to "1 day")
- Check filter conditions (if any) aren't blocking emails

---

## Next Steps

1. ✅ Copy email templates from `lib/emailSequences.ts`
2. ✅ Set up one webhook URL in Zapier/Make
3. ✅ Create the Contact Form sequence first (simplest)
4. ✅ Test with your own email
5. ✅ Deploy and monitor for 1 week
6. ✅ Add other sequences (Chatbot, Store, Case Study)
7. ✅ Optimize based on open/click rates

---

## Questions?

These sequences are battle-tested templates. They work. The key is:
1. **Personalizing them** to your voice and offers
2. **Testing thoroughly** before going live
3. **Monitoring metrics** and adjusting based on performance
4. **Consistency** - send them every time, don't skip

Good luck! 🚀
