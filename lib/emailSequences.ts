/**
 * Email Sequence Templates for MuleSoo
 * Auto-sent via Zapier/Make based on triggers
 * Customize sender name, domain, and links before deploying
 */

export type SequenceType = 'contact-form' | 'chatbot' | 'store-purchase' | 'case-study';

export interface EmailSequence {
  name: string;
  description: string;
  emails: Array<{
    delay: string; // e.g., "immediate", "1 day", "3 days"
    subject: string;
    preview: string;
    body: string;
  }>;
}

export const emailSequences: Record<SequenceType, EmailSequence> = {
  'contact-form': {
    name: 'Contact Form Sequence',
    description: 'Sent when someone fills the contact form',
    emails: [
      {
        delay: 'immediate',
        subject: "Got your message — here's what's next 🚀",
        preview: 'We received your enquiry and will reply within 2 hours',
        body: `Hi {{name}},

Thanks for reaching out to MuleSoo! We received your enquiry about {{service}} and will get back to you within 2 hours (usually faster).

While you wait, here's what to expect:
✓ We'll review your project details
✓ We'll ask any clarifying questions via email or WhatsApp
✓ We'll send you a custom quote and timeline
✓ You can ask questions before committing

In the meantime, explore our work:
→ View our case studies: https://mulesoo.com/case-studies
→ See live projects: https://mulesoo.com/portfolio
→ Learn about {{service}}: https://mulesoo.com/services

Questions? Hit us up:
📧 hello@mulesoo.com
💬 WhatsApp: https://wa.me/27688529333

Talk soon!
Ethan & the MuleSoo team`,
      },
      {
        delay: '1 day',
        subject: "Didn't hear back yet? Here's why it matters 💡",
        preview: 'Why quick delivery is just the start of what makes MuleSoo different',
        body: `Hi {{name}},

If you haven't heard from us yet, we're finalizing your custom quote. We'll send it today or tomorrow.

But I wanted to share something while you're thinking about {{service}}:

Most agencies give you a "ballpark estimate" and charge extra later. We don't do that.

Our process:
1️⃣  We understand YOUR business (not generic)
2️⃣  We build exactly what you need (scope is clear before we start)
3️⃣  We own the quality (unlimited revisions until you're 100% satisfied)
4️⃣  You own the output (source code, data, everything is yours)

That's why clients like Yoyo Gym, Shime Events, and Tsedi Catering keep coming back.

Your quote is coming soon — it's real, no surprises.

→ Want to see it sooner? Reply to this email or WhatsApp: https://wa.me/27688529333

Ethan
Founder, MuleSoo`,
      },
      {
        delay: '3 days',
        subject: 'Quick question: What matters most for {{service}}? ⏰',
        preview: 'We want to make sure your quote addresses what really matters',
        body: `Hi {{name}},

Quick question before we finalize your {{service}} quote:

Of these, what matters MOST to you?

A) Speed — Get it launched ASAP
B) Quality — No corners cut, premium design
C) Cost — Work within a tight budget
D) Functionality — Specific features are critical
E) All of the above

Just reply with A-E, or tell us what else is on your mind.

We'll make sure your quote reflects your actual priorities.

Looking forward to building this together.

Ethan
MuleSoo`,
      },
      {
        delay: '5 days',
        subject: "Let's talk {{service}} — Free 15-min call? ☎️",
        preview: 'Book a quick call to answer questions and finalize your project',
        body: `Hi {{name}},

If we haven't connected yet, I wanted to reach out personally.

Sometimes email misses the nuance of what you actually need.

Would you be open to a quick 15-minute call?

We can:
✓ Answer any questions about {{service}}
✓ Clear up unclear parts of the quote
✓ Discuss timeline and payment
✓ Get you started this week if you're ready

→ Book a time: https://calendly.com/mulesoo (if configured)
→ Or just reply with your availability

No pressure — we're here when you're ready.

Ethan
MuleSoo`,
      },
      {
        delay: '7 days',
        subject: 'One more thing before we move on... 👋',
        preview: 'Last chance to grab the option to build {{service}} with us',
        body: `Hi {{name}},

I'm archiving your enquiry today, but I wanted to reach out one last time.

If {{service}} is still on your radar, we're still here and ready to build.

Reasons clients choose us:
✅ Real results (Yoyo Gym +300% bookings, Shime Events 100% lead capture)
✅ 100% Satisfaction Guarantee — or we refund
✅ Unlimited revisions until you love it
✅ 30-day free support post-launch

When you're ready, just hit reply or book a call: https://calendly.com/mulesoo

In the meantime, feel free to browse our case studies: https://mulesoo.com/case-studies

We're here whenever you are.

Ethan
MuleSoo

P.S. — If something's holding you back (budget, timeline, concerns), just tell us. We've likely solved it before.`,
      },
    ],
  },

  'chatbot': {
    name: 'Chatbot Inquiry Sequence',
    description: 'Sent when someone books via chatbot',
    emails: [
      {
        delay: 'immediate',
        subject: '✅ We got your booking request — next steps inside',
        preview: 'Your meeting is on our radar and a custom quote is coming',
        body: `Hi {{name}},

You messaged us on the chatbot about {{service}} and we're pumped. 🚀

Here's what happens next:

1️⃣  We're prepping a custom quote (usually done in 24 hours)
2️⃣  We'll send it via email with timeline and pricing
3️⃣  You ask questions, we clarify
4️⃣  Once you approve, we get started

If you want to chat faster, hit us on WhatsApp:
💬 https://wa.me/27688529333

You can also check out what we've built before:
→ Case studies: https://mulesoo.com/case-studies
→ Portfolio: https://mulesoo.com/portfolio

Talk soon!
Ethan & team`,
      },
      {
        delay: '2 days',
        subject: 'Your {{service}} quote is ready 📊',
        preview: 'Check your quote details below and let us know when you want to start',
        body: `Hi {{name}},

Your custom quote for {{service}} is ready.

[Quote summary would go here — pulled from your CRM]

Next steps:
1. Review the quote and timeline
2. Ask any questions (reply to this email)
3. Let us know when you want to start
4. We'll send you a simple agreement + payment details

Have questions? WhatsApp is fastest:
💬 https://wa.me/27688529333

Looking forward to building this!

Ethan`,
      },
      {
        delay: '5 days',
        subject: 'Following up: Ready to move forward with {{service}}?',
        preview: 'Quick check-in on your project — any blockers we can help with?',
        body: `Hi {{name}},

Just checking in on your {{service}} quote. Do you have any questions or concerns?

Sometimes the quote raises new questions — totally normal. Common ones:

❓ "Can you adjust the scope to fit my budget?"
→ Yes. We scope based on priorities, not a fixed list.

❓ "How do payments work?"
→ 50% upfront to start, 50% on delivery. Payment plans available.

❓ "What if I'm not happy?"
→ 100% satisfaction guarantee. Unlimited revisions.

❓ "Can I have the source code?"
→ 100%. You own everything after delivery.

Reply with your question, or just let us know if you're ready to go.

Ethan
MuleSoo`,
      },
    ],
  },

  'store-purchase': {
    name: 'Store Purchase Follow-up',
    description: 'Sent after someone buys a digital guide/product',
    emails: [
      {
        delay: 'immediate',
        subject: '🎉 Download your {{product}} (+ bonus inside)',
        preview: 'Your guide is ready + you got a free bonus resource',
        body: `Hi {{name}},

Thanks for buying {{product}}! 🙌

→ Download here: [download link]

BONUS: We included a free resource inside (you'll see it when you download):
✓ Checklist for {{product}}-related task
✓ 3 templates you can use immediately
✓ Links to tools mentioned in the guide

Questions? Reply to this email — we read every one.

Next step? If you implement the guide and get results, we'd love to hear about it. Feel free to reach out if you need help turning this into a full {{product}}.

Cheers!
Ethan & team`,
      },
      {
        delay: '2 days',
        subject: "Started reading {{product}}? Here is the #1 mistake to avoid",
        preview: "Most people miss this - don't be one of them",
        body: `Hi {{name}},

Started reading {{product}}?

Most people who buy guides like this skip ahead to implementation, which is good — action matters.

But the #1 mistake? Not doing the "Discovery" section first.

Why? Because [specific reason related to product].

Take 10 minutes to do that section. Seriously. It'll save you hours later.

Need help? We do paid consulting on {{product}} implementations. Reply if you're interested.

Ethan`,
      },
      {
        delay: '7 days',
        subject: "How's the guide going? Results yet? 📈",
        preview: 'We want to know if {{product}} is delivering value for you',
        body: `Hi {{name}},

A week has passed since you grabbed {{product}}.

Have you started implementing it? Getting results?

We'd genuinely love to know:
✓ What's working?
✓ What was confusing?
✓ Did you get ROI yet?

Reply with your thoughts. Honest feedback helps us make the guide better for the next person.

Also: If you implemented this and it worked, but you need help scaling it, we do that too. Just reply.

Ethan
MuleSoo`,
      },
      {
        delay: '14 days',
        subject: 'Ready to go from {{product}} to {{service}}? 🚀',
        preview: 'We can build the full system for you (done-for-you option)',
        body: `Hi {{name}},

You've had {{product}} for 2 weeks now.

If you've read it and thought "I'd rather someone else build this..." — that's exactly why we exist.

We can:
✓ Take your {{product}} learnings
✓ Build the full {{service}} system for you
✓ Have it live in 2-4 weeks
✓ Hand it over completely

→ Check out what we built for others: https://mulesoo.com/case-studies
→ See our {{service}} services: https://mulesoo.com/services

Interested? Just reply or book a call: https://calendly.com/mulesoo

Ethan`,
      },
    ],
  },

  'case-study': {
    name: 'Case Study Inquiry Follow-up',
    description: 'Sent when someone views case studies page multiple times',
    emails: [
      {
        delay: 'immediate',
        subject: '👀 Noticed you looking at our case studies',
        preview: 'Curious about building something similar for your business?',
        body: `Hi {{name}},

We noticed you've been checking out our case studies (specifically: {{case_study}}).

Makes sense — seeing real results from real businesses is way more convincing than generic promises.

Quick question: Are you thinking about doing something similar for {{company}}?

If so, we should talk. What worked for Yoyo Gym, Shime Events, or Tsedi Catering might work for you too — with tweaks for your specific situation.

→ Book a free 30-min strategy call: https://calendly.com/mulesoo

No pitch, just a real conversation about what's possible.

Ethan
MuleSoo`,
      },
      {
        delay: '3 days',
        subject: 'The secret behind those case study results 🔑',
        preview: 'Why Yoyo Gym, Shime Events, and Tsedi got such big wins',
        body: `Hi {{name}},

You probably noticed the results in our case studies are pretty impressive.

+300% bookings for Yoyo Gym. 100% lead capture for Shime Events. +200% online orders for Tsedi.

What's the secret?

It's not luck. It's a combination of:

1️⃣  Understanding their EXACT workflow (not generic)
2️⃣  Building AI automation into the process (not just a pretty website)
3️⃣  Measuring results obsessively (not hoping for the best)
4️⃣  Iterating based on real data (not guessing)

Most agencies do #1 and maybe #4. We do all four.

That's why results stick around.

→ If you want to apply this to your business, let's talk: https://calendly.com/mulesoo

Ethan`,
      },
    ],
  },
};

/**
 * Helper function to personalize email content
 * Replace {{name}}, {{service}}, {{product}}, etc. with actual values
 */
export const personalizeEmail = (
  template: string,
  data: Record<string, string>
): string => {
  let result = template;
  Object.entries(data).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return result;
};
