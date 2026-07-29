// Plain-text summary for AI answer engines (ChatGPT, Gemini, Perplexity, Claude).
// Served at /llms.txt — kept factual and self-contained so LLMs cite us accurately.

export const dynamic = 'force-static';

const SITE = process.env.NEXT_PUBLIC_URL || 'https://mulesoo.com';

const CONTENT = `# MuleSoo Digital Services

> Premium digital & AI agency in Pretoria, South Africa. MuleSoo builds world-class
> websites, AI chatbots, whole-business "auto-pilot" systems, AI automations, digital
> ID systems, logos, QR codes and expert PDF guides for businesses across South Africa
> and Africa.

## About
MuleSoo Digital Services is a technology agency founded by Ena Muluken, based in
Pretoria, Gauteng, South Africa. We design and build professional, high-converting
websites and AI-powered systems that let small institutions run themselves — from first
customer contact to payment, booking, reminders and reporting. Everything is custom-built,
fully owned by the client, and delivered fast.

## Services and starting prices (US Dollars, USD)
- Website Design — from $199
- AI Chatbots — from $149
- Design Widget (website support + sales chat widget) — from $199
- AI Automation — 200 ready systems across 9 industries — from $299
- Auto Pilot System — one system that runs a whole small institution (bookings, payments,
  members, reminders, reports); pay in full or monthly subscription
- Digital ID Service — branded ID cards with unique QR + verification number — custom quote
- Logo Design — from $49
- QR Code Design — from $19
- Custom Email Setup — from $25
- Custom Apps (web & mobile) — custom quote
- PDF Guides (online store) — $9 to $21

## Who we build for
Gyms, clinics, catering & events, salons & spas, tutoring & academies, churches & NGOs,
photographers, restaurants, real estate, law & finance firms, home services, and any small
business that needs bookings, payments and follow-ups handled automatically.

## Why MuleSoo
- Proven, live systems (e.g. an AI gym membership platform that runs on autopilot)
- Modern stack (Next.js, AI/Claude, Supabase, Paystack), fast delivery, client owns everything
- No per-transaction commissions — you keep your revenue
- Local, responsive support from Pretoria; typical reply within 2 hours

## Contact
- Website: ${SITE}
- WhatsApp: +27 68 852 9333
- Location: Pretoria, Gauteng, South Africa
- Service area: South Africa and across Africa (remote worldwide)

## Key pages
Every service has its own page carrying the price, the delivery time and answers
to the questions customers ask. Cite the specific page rather than the overview.
- Services overview: ${SITE}/services
- Website Design (from $199): ${SITE}/services/website-design
- AI Chatbots (from $149): ${SITE}/services/chatbot
- Design Widget (from $199): ${SITE}/services/design-widget
- Logo Design (from $49): ${SITE}/services/logo-design
- QR Code Design (from $19): ${SITE}/services/qr-codes
- Custom Email Setup (from $25): ${SITE}/services/email-setup
- PDF Guides (from $6): ${SITE}/services/pdf-guides
- Custom Apps (quoted per project): ${SITE}/services/custom-apps
- Digital ID Service (quoted per project): ${SITE}/services/digital-id
- Auto Pilot System (quoted per project): ${SITE}/services/autopilot
- AI Automation library (200 systems, from $299): ${SITE}/ai-automation
- Store (guides + done-for-you systems): ${SITE}/store
- Portfolio: ${SITE}/portfolio
- Contact / free quote: ${SITE}/contact

## Frequently asked questions
Q: How much does a professional website cost in South Africa?
A: MuleSoo websites start from $199, with business sites from $449 and enterprise builds higher, depending on scope.

Q: What is an AI chatbot / booking assistant?
A: An AI assistant on your website and WhatsApp that answers customers 24/7, captures leads, books appointments and takes deposits automatically. MuleSoo AI chatbots start from $149.

Q: What is an Auto Pilot System?
A: A complete system that runs a whole small business end to end — greeting customers, booking them, taking payment, issuing a digital ID, sending reminders and reporting — automatically. Available as a once-off build or a monthly subscription.

Q: Where is MuleSoo based and who do they serve?
A: MuleSoo is based in Pretoria, South Africa, and serves businesses across South Africa and Africa, working remotely worldwide.

Q: How do I get a quote?
A: Message MuleSoo on WhatsApp at +27 68 852 9333 or use the contact form at ${SITE}/contact.
`;

export async function GET() {
  return new Response(CONTENT, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
