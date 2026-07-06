import type { Guide } from '../buildGuide';

export const buildProWebsiteClaudeCode: Guide = {
  title: 'Build a Pro Website With Claude Code',
  subtitle: 'Use AI to build stunning, professional websites in days, not weeks — step by step.',
  tagline: 'The exact AI workflow behind sites that look like a studio built them.',
  accent: [232, 184, 75],
  chapters: [
    {
      title: 'Meet Your AI Co-Builder',
      intro: 'Claude Code is like having a senior developer who never tires, works at your pace, and explains everything. This guide shows you how to direct it to build real, professional websites.',
      sections: [
        {
          heading: 'What changes when you build with AI',
          body: [
            'The old way: learn to code for months, then build slowly. The new way: describe what you want clearly, review what the AI builds, and refine. You become the director, not the labourer.',
            'You still need taste and judgement — knowing what “good” looks like. This guide sharpens both while the AI handles the typing.',
          ],
        },
        {
          heading: 'What you can build',
          bullets: [
            'Business and portfolio websites',
            'Landing pages that convert',
            'Booking and contact systems',
            'Online stores and simple web apps',
            'Animated, modern, mobile-first designs',
          ],
        },
      ],
    },
    {
      title: 'Set Up Your Project',
      sections: [
        {
          heading: 'Your starting point',
          steps: [
            'Install the essentials: Node.js and a code editor (VS Code)',
            'Start a modern project (Next.js + Tailwind CSS)',
            'Open Claude Code in your project folder',
            'Tell it your brand: colours, fonts, and the site’s goal',
            'Commit early to Git so every step is saved',
          ],
        },
        {
          heading: 'Give the AI a brief',
          body: [
            'Before building, write a short brief: who the site is for, the one action you want visitors to take, the pages you need, and the look and feel. Paste this to Claude Code so every prompt has context.',
          ],
          callout: 'A good brief is worth ten prompts. The clearer you are about the outcome, the closer the first build lands to what you imagined.',
        },
      ],
    },
    {
      title: 'The Master Prompt Method',
      intro: 'Great results come from great prompts. Use this repeatable structure and the AI will build exactly what you picture.',
      sections: [
        {
          heading: 'The prompt formula',
          steps: [
            'Context: what the site is and who it’s for',
            'Task: the specific section or page to build',
            'Details: layout, colours, content, and behaviour',
            'Constraints: mobile-first, fast, accessible',
            'Example or reference: “like this, but for a bakery”',
          ],
        },
        {
          heading: 'Prompt like a director',
          bullets: [
            'Ask for one section at a time, not the whole site at once',
            'Review, then request specific changes (“make the hero taller”)',
            'Keep a consistent design system across prompts',
            'Ask it to explain choices so you learn as you go',
          ],
        },
      ],
    },
    {
      title: 'Build Page by Page',
      sections: [
        {
          heading: 'The order that works',
          steps: [
            'Base layout: navigation bar and footer first',
            'Hero section: headline, subheadline, primary button',
            'Proof and offer sections from your brief',
            'Supporting pages: about, services, contact',
            'Review the whole flow on desktop and mobile',
          ],
        },
        {
          heading: 'Keep it consistent',
          body: [
            'Ask the AI to reuse the same spacing, colours and button styles across every section. Consistency is what makes a site feel professionally designed rather than assembled.',
          ],
        },
      ],
    },
    {
      title: 'Animations & Polish',
      sections: [
        {
          heading: 'The details that impress',
          bullets: [
            'Subtle fade-and-rise animations as sections scroll into view',
            'Smooth hover effects on buttons and cards',
            'A tasteful gradient or glow for a premium feel',
            'Consistent rounded corners and soft shadows',
          ],
          callout: 'Animation should guide attention, not shout. One elegant motion per section beats a page that moves everywhere at once.',
        },
      ],
    },
    {
      title: 'Forms, Data & Payments',
      sections: [
        {
          heading: 'Make it actually work',
          steps: [
            'Add a contact form that emails the owner on submit',
            'Store enquiries in a database (e.g. Supabase) if needed',
            'Add online payments (Paystack / Stripe) for stores',
            'Send confirmations by email or WhatsApp',
            'Test every flow end to end before launch',
          ],
        },
      ],
    },
    {
      title: 'Deploy in Minutes',
      sections: [
        {
          heading: 'From your screen to the world',
          steps: [
            'Push your project to GitHub',
            'Connect it to Vercel or Netlify (free)',
            'It builds and goes live automatically on every push',
            'Add your custom domain and enable HTTPS',
            'Run a final speed and mobile check',
          ],
        },
      ],
    },
    {
      title: 'Ship Faster, Charge More',
      intro: 'Building faster with AI does not mean charging less. It means delivering better work, sooner — which is worth more, not less.',
      sections: [
        {
          heading: 'Turn speed into income',
          bullets: [
            'Deliver in days and clients gladly pay a premium',
            'Offer clear fixed-price packages, not hourly rates',
            'Add a monthly care plan for recurring income',
            'Show your best builds as a portfolio to win the next job',
          ],
          callout: 'Clients buy the result and the speed. AI lets you deliver both — position yourself as the builder who ships professional sites in a week.',
        },
      ],
    },
  ],
};
