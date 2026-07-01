/**
 * MuleSoo AI Automation Library — 199 systems + custom request.
 * Names come from the source list; the sales detail for each is generated from
 * the automation "type" so every card/detail page reads professionally.
 */

const NAMES: string[] = [
  // Hospitality & Travel (1–20)
  'AI hotel booking system', 'AI lodge booking system', 'AI guest inquiry assistant', 'AI room availability checker',
  'AI check-in assistant', 'AI hotel payment follow-up', 'AI hotel concierge bot', 'AI travel package booking',
  'AI resort activity booking', 'AI airport transfer booking', 'AI car rental booking', 'AI tour booking assistant',
  'AI vacation quote assistant', 'AI lodge guest support', 'AI stay reminder system', 'AI cancellation recovery bot',
  'AI late check-in assistant', 'AI guest upsell assistant', 'AI hotel review recovery', 'AI property guest support',
  // Health & Medical (21–40)
  'AI dentist booking system', 'AI clinic intake system', 'AI doctor appointment booking', 'AI physiotherapy booking',
  'AI optometrist booking', 'AI vet appointment booking', 'AI pharmacy refill assistant', 'AI lab test booking',
  'AI vaccination booking', 'AI patient reminder system', 'AI missed appointment recovery', 'AI therapy session booking',
  'AI mental health intake', 'AI wellness booking system', 'AI home care booking', 'AI medical triage bot',
  'AI medical document checker', 'AI patient follow-up bot', 'AI claims intake assistant', 'AI medical support chatbot',
  // Beauty & Salon (41–60)
  'AI salon booking system', 'AI barber booking system', 'AI nail salon assistant', 'AI spa booking system',
  'AI massage booking bot', 'AI beauty consultation bot', 'AI bridal makeup booking', 'AI hair treatment assistant',
  'AI skincare consultation bot', 'AI salon loyalty assistant', 'AI salon reminder system', 'AI no-show recovery bot',
  'AI mobile beauty booking', 'AI tattoo booking system', 'AI piercing booking assistant', 'AI cosmetic clinic lead bot',
  'AI esthetician booking', 'AI microblading booking', 'AI product upsell bot', 'AI beauty membership assistant',
  // Fitness & Sports (61–80)
  'AI gym booking system', 'AI class booking system', 'AI personal trainer assistant', 'AI fitness membership bot',
  'AI sports court booking', 'AI yoga class booking', 'AI pilates booking system', 'AI tennis court booking',
  'AI golf tee-time assistant', 'AI swimming class booking', 'AI dance class booking', 'AI martial arts booking',
  'AI sports event registration', 'AI bootcamp booking assistant', 'AI recreation center booking', 'AI workout reminder bot',
  'AI trial-to-member converter', 'AI health coaching booking', 'AI gym payment reminder', 'AI membership renewal system',
  // Restaurant & Food (81–100)
  'AI restaurant reservation system', 'AI waitlist assistant', 'AI takeaway order assistant', 'AI catering quote assistant',
  'AI private dining booking', 'AI event catering booking', 'AI menu FAQ bot', 'AI restaurant review recovery',
  'AI order tracking assistant', 'AI table management system', 'AI bakery pre-order bot', 'AI coffee loyalty assistant',
  'AI chef consultation booking', 'AI food delivery support', 'AI kitchen stock assistant', 'AI restaurant promotion bot',
  'AI customer complaint assistant', 'AI franchise order system', 'AI meal plan subscription bot', 'AI wholesale food sales bot',
  // Real Estate & Property (101–120)
  'AI property viewing scheduler', 'AI real estate lead bot', 'AI rental inquiry assistant', 'AI landlord support bot',
  'AI tenant maintenance assistant', 'AI lease renewal reminder', 'AI open-house booking assistant', 'AI mortgage inquiry bot',
  'AI property valuation assistant', 'AI buyer qualification bot', 'AI seller follow-up bot', 'AI inspection scheduler',
  'AI moving booking assistant', 'AI home loan support bot', 'AI interior design booking', 'AI furnishing consultation bot',
  'AI estate agent CRM bot', 'AI short-stay support assistant', 'AI property management ticketing', 'AI building maintenance router',
  // Legal & Finance (121–140)
  'AI law firm intake system', 'AI lawyer booking assistant', 'AI case qualification bot', 'AI document collection bot',
  'AI court reminder system', 'AI contract request assistant', 'AI tax consultation booking', 'AI accountant meeting assistant',
  'AI bookkeeping lead bot', 'AI payroll support bot', 'AI insurance claim assistant', 'AI policy renewal assistant',
  'AI compliance checklist bot', 'AI business registration assistant', 'AI trademark booking system', 'AI visa application assistant',
  'AI debt collection reminder', 'AI client follow-up bot', 'AI legal document tracker', 'AI financial advisory booking',
  // Education & Training (141–160)
  'AI school admission assistant', 'AI parent meeting scheduler', 'AI tutoring booking system', 'AI online course registration',
  'AI training workshop booking', 'AI conference registration', 'AI seminar reminder bot', 'AI language class booking',
  'AI music lesson booking', 'AI driving school booking', 'AI exam booking assistant', 'AI scholarship assistant',
  'AI student support bot', 'AI career coaching booking', 'AI alumni event RSVP', 'AI internship application assistant',
  'AI school transport booking', 'AI exam revision booking', 'AI student attendance assistant', 'AI teacher meeting scheduler',
  // Home & Trade Services (161–180)
  'AI plumber booking system', 'AI electrician booking system', 'AI handyman booking bot', 'AI pest control booking',
  'AI cleaning booking system', 'AI laundry pickup bot', 'AI appliance repair assistant', 'AI AC service booking',
  'AI locksmith booking assistant', 'AI solar consultation booking', 'AI renovation quote assistant', 'AI garden service booking',
  'AI pool maintenance booking', 'AI roofing lead assistant', 'AI painting job booking', 'AI flooring quote bot',
  'AI home inspection assistant', 'AI emergency dispatch assistant', 'AI security quote assistant', 'AI moving service booking',
  // Logistics & Business Ops (181–199)
  'AI freight quote assistant', 'AI logistics booking system', 'AI warehouse pickup scheduler', 'AI delivery reschedule bot',
  'AI supplier order assistant', 'AI procurement request bot', 'AI fleet service booking', 'AI dealership test-drive booking',
  'AI vehicle service reminder', 'AI customs document assistant', 'AI import/export inquiry bot', 'AI shipping status assistant',
  'AI support ticket triage', 'AI CRM update assistant', 'AI invoice reminder system', 'AI payment recovery bot',
  'AI sales lead qualification', 'AI proposal follow-up bot', 'AI customer onboarding assistant',
];

const CATEGORY_RANGES: { name: string; start: number; end: number }[] = [
  { name: 'Hospitality & Travel', start: 1, end: 20 },
  { name: 'Health & Medical', start: 21, end: 40 },
  { name: 'Beauty & Salon', start: 41, end: 60 },
  { name: 'Fitness & Sports', start: 61, end: 80 },
  { name: 'Restaurant & Food', start: 81, end: 100 },
  { name: 'Real Estate & Property', start: 101, end: 120 },
  { name: 'Legal & Finance', start: 121, end: 140 },
  { name: 'Education & Training', start: 141, end: 160 },
  { name: 'Home & Trade Services', start: 161, end: 180 },
  { name: 'Logistics & Business Ops', start: 181, end: 199 },
];

export const CATEGORIES = CATEGORY_RANGES.map((c) => c.name);

const categoryFor = (id: number) =>
  CATEGORY_RANGES.find((r) => id >= r.start && id <= r.end)?.name || 'Business';

const slugify = (name: string) =>
  name.toLowerCase().replace(/^ai\s+/, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export interface Automation {
  id: number;
  name: string;
  slug: string;
  category: string;
}

export const AUTOMATIONS: Automation[] = NAMES.map((name, i) => ({
  id: i + 1,
  name,
  slug: slugify(name),
  category: categoryFor(i + 1),
}));

export const findAutomation = (slug: string) => AUTOMATIONS.find((a) => a.slug === slug);

export interface AutomationDetail {
  short: string;
  problem: string;
  howItWorks: string;
  features: string[];
  adminControl: string;
  businessBenefit: string;
  whyMuleSoo: string;
}

const WHY = 'Built around your exact workflow — a custom system with a dashboard you control and ongoing support.';

export function getDetail(name: string): AutomationDetail {
  const label = name.replace(/^AI\s+/, '');
  const n = name.toLowerCase();
  const has = (...k: string[]) => k.some((x) => n.includes(x));

  if (has('reminder')) {
    return {
      short: 'Automatically reminds customers so they never forget — and you cut no-shows.',
      problem: 'No-shows and forgotten appointments waste slots and quietly lose you money.',
      howItWorks: 'It sends timed WhatsApp, SMS and email reminders before each appointment, and lets people confirm or reschedule in one tap.',
      features: ['Automated multi-channel reminders', 'One-tap confirm or reschedule', 'Smart timing', 'No-show tracking'],
      adminControl: 'See who confirmed, who didn’t, and reschedule in seconds from your dashboard.',
      businessBenefit: 'Fewer no-shows, a fuller schedule, and more revenue from the same slots.',
      whyMuleSoo: WHY,
    };
  }
  if (has('recovery', 'no-show', 'missed', 'cancellation')) {
    return {
      short: 'Wins back cancellations, no-shows and drop-offs automatically.',
      problem: 'Every cancellation or no-show is lost revenue that usually never gets followed up.',
      howItWorks: 'When a booking is cancelled or missed, the AI reaches out with a friendly rebooking offer and fills the gap from your waitlist.',
      features: ['Automatic win-back outreach', 'Rebooking offers', 'Waitlist fill', 'Recovered-revenue tracking'],
      adminControl: 'Track recovered bookings and revenue from your dashboard.',
      businessBenefit: 'Turn lost bookings back into paying customers — automatically.',
      whyMuleSoo: WHY,
    };
  }
  if (has('follow-up', 'follow up', 'onboarding')) {
    return {
      short: 'Follows up every lead and client automatically, so none slip through.',
      problem: 'Leads go cold and clients feel forgotten when follow-ups depend on someone remembering.',
      howItWorks: 'The AI follows up at the right moments over WhatsApp and email, answers questions, and nudges people to the next step.',
      features: ['Timed automated follow-ups', 'Personalised messages', 'Answers common questions', 'Human handover when ready'],
      adminControl: 'See every conversation and status in one inbox.',
      businessBenefit: 'Close more by never letting a lead or client go quiet.',
      whyMuleSoo: WHY,
    };
  }
  if (has('availability', 'checker', 'status', 'tracking')) {
    return {
      short: 'Gives customers instant answers — no waiting on your team.',
      problem: 'Customers give up when they can’t quickly find out what’s available or what’s happening.',
      howItWorks: 'The AI checks your live data and answers instantly in chat, then guides the customer to the next step.',
      features: ['Live lookups, 24/7', 'Instant, accurate answers', 'Next-best suggestions', 'Leads straight into booking'],
      adminControl: 'Control the data, rules and responses from your dashboard.',
      businessBenefit: 'Convert more enquiries by answering instantly, day or night.',
      whyMuleSoo: WHY,
    };
  }
  if (has('intake', 'document', 'triage', 'checklist')) {
    return {
      short: 'Collects complete, structured information before anyone lifts a finger.',
      problem: 'Handwritten or repeated intake wastes time and creates errors and gaps.',
      howItWorks: 'An AI conversation captures all the required details, validates them, and organises everything for your team ahead of time.',
      features: ['Guided AI intake', 'Validated, structured data', 'Ready before the appointment', 'Secure, compliant storage'],
      adminControl: 'Review every submission and history from the dashboard.',
      businessBenefit: 'Save time, cut errors, and start every job fully prepared.',
      whyMuleSoo: WHY,
    };
  }
  if (has('lead', 'qualification')) {
    return {
      short: 'Captures and qualifies leads automatically, 24/7.',
      problem: 'Enquiries arrive at all hours and go unanswered — and unqualified ones waste your time.',
      howItWorks: 'The AI engages every enquiry, asks the right qualifying questions, and routes hot leads to you instantly.',
      features: ['24/7 lead capture', 'Smart qualification', 'Instant alerts & routing', 'CRM-ready records'],
      adminControl: 'See, score and follow up every lead in one place.',
      businessBenefit: 'More qualified leads, faster response, higher conversion.',
      whyMuleSoo: WHY,
    };
  }
  if (has('quote')) {
    return {
      short: 'Gives instant, professional quotes and captures the lead.',
      problem: 'Slow quotes lose deals to faster competitors.',
      howItWorks: 'The AI gathers the customer’s needs and returns an instant estimate, then books a consultation or follow-up.',
      features: ['Instant AI quoting', 'Captures full requirements', 'Books the next step', 'Lead saved automatically'],
      adminControl: 'Review quotes and leads from your dashboard.',
      businessBenefit: 'Respond first, quote fast, and win more jobs.',
      whyMuleSoo: WHY,
    };
  }
  if (has('upsell', 'loyalty', 'membership', 'renewal', 'subscription', 'converter', 'promotion')) {
    return {
      short: 'Grows revenue automatically with smart offers and renewals.',
      problem: 'Upsells and renewals are missed when staff are busy or forget to ask.',
      howItWorks: 'At the right moment, the AI suggests relevant add-ons, upgrades or renewals that increase customer value.',
      features: ['Smart offers & upgrades', 'Automated renewals', 'Perfectly-timed prompts', 'Uplift tracking'],
      adminControl: 'Configure offers and track extra revenue from the dashboard.',
      businessBenefit: 'Increase spend and retention with zero extra effort.',
      whyMuleSoo: WHY,
    };
  }
  if (has('support', 'chatbot', 'concierge', 'faq', 'complaint', 'ticket')) {
    return {
      short: 'Answers customer questions instantly, 24/7, in a friendly chat.',
      problem: 'Repetitive questions overwhelm your team and slow replies frustrate customers.',
      howItWorks: 'A trained AI assistant answers FAQs, guides customers, and escalates only what truly needs a human.',
      features: ['24/7 instant answers', 'Trained on your business', 'Smart escalation', 'Every chat logged'],
      adminControl: 'Review conversations and common questions in the dashboard.',
      businessBenefit: 'Happier customers and far less support workload.',
      whyMuleSoo: WHY,
    };
  }
  if (has('scheduler', 'meeting scheduler', 'rsvp', 'attendance')) {
    return {
      short: 'Schedules appointments and meetings automatically — no back-and-forth.',
      problem: 'Coordinating times by message is slow, and double-bookings happen.',
      howItWorks: 'The AI offers open times, books the slot, and syncs it to your calendar with confirmations and reminders.',
      features: ['Self-service scheduling', 'Calendar sync', 'Auto confirmations & reminders', 'No double-bookings'],
      adminControl: 'Manage the whole schedule from one dashboard.',
      businessBenefit: 'Fill your calendar with zero manual coordination.',
      whyMuleSoo: WHY,
    };
  }
  if (has('order', 'pre-order', 'procurement', 'supplier', 'sales')) {
    return {
      short: 'Takes and manages orders automatically, around the clock.',
      problem: 'Manual orders by phone and message are slow and easy to get wrong.',
      howItWorks: 'Customers place and track orders in a simple chat; the AI confirms, records, and notifies your team.',
      features: ['Conversational ordering', 'Order confirmation & tracking', 'Automatic records', 'Optional online payment'],
      adminControl: 'See and manage every order from your dashboard.',
      businessBenefit: 'More orders, fewer mistakes, and less admin.',
      whyMuleSoo: WHY,
    };
  }
  // Default: booking / assistant / bot / system
  return {
    short: `Let customers handle ${label.replace(/ (system|assistant|bot)$/i, '')} in a simple AI chat — 24/7, no calls.`,
    problem: 'Doing this manually is slow, error-prone, and every missed message is a lost customer.',
    howItWorks: 'Customers scan a QR or click a link, chat with a friendly AI that collects their details, checks availability, and confirms — automatically.',
    features: ['Conversational AI flow', 'Works 24/7 on web & WhatsApp', 'Instant confirmation & records', 'Optional online deposit/payment'],
    adminControl: 'Manage every booking, payment and customer from one secure dashboard.',
    businessBenefit: 'Capture more business around the clock while cutting admin to near zero.',
    whyMuleSoo: WHY,
  };
}
