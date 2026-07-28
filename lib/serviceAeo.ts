import { SITE_URL } from '@/lib/seo';

/**
 * Answer-engine data for the ten core service pages.
 *
 * WHY THIS EXISTS
 * The 200 /ai-automation pages each carry Service + BreadcrumbList JSON-LD, but
 * the ten service pages that actually sell the work carried none — only the
 * site-wide Organization/LocalBusiness/WebSite blocks inherited from the root
 * layout. So the pages with real prices on them were the pages a machine could
 * say the least about.
 *
 * Two things follow from how answer engines (ChatGPT, Perplexity, Google AI
 * Overviews) actually build a reply:
 *
 *  1. They quote a short, self-contained passage that answers the question
 *     directly. `answer` is written to be exactly that — the question restated
 *     as a claim, price and place included, no pronouns pointing at earlier
 *     paragraphs, quotable standing alone.
 *  2. They trust facts they can parse. `price` becomes a schema.org Offer, so
 *     "from R3,500" is a machine-readable number rather than a string in a
 *     hero image.
 *
 * Everything here is copied from the live pages — prices from the services
 * index, delivery times and inclusions from each page's own body. Nothing is
 * invented, because an answer engine repeating an invented promise makes it a
 * promise you have to keep.
 */

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface ServiceAeo {
  /** Path segment under /services. */
  slug: string;
  /** Human name, used in schema and the breadcrumb trail. */
  name: string;
  /** schema.org serviceType — the category, not the brand name. */
  serviceType: string;
  /** Starting price in ZAR, or null when the work is quoted per project. */
  price: number | null;
  /** The question this page should win. */
  question: string;
  /** 40–70 words. The passage an answer engine can lift whole. */
  answer: string;
  faqs: ServiceFaq[];
}

const CONTACT =
  'Get a quote on WhatsApp at +27 68 852 9333 or at mulesoo.com/contact.';

export const SERVICE_AEO: ServiceAeo[] = [
  {
    slug: 'website-design',
    name: 'Website Design',
    serviceType: 'Web design and development',
    price: 3500,
    question: 'How much does a professional website cost in South Africa?',
    answer:
      'A professional website from MuleSoo Digital Services starts at R3,500 in South Africa. Most sites launch in two to four weeks and include mobile-responsive design, SEO setup, and 30 days of free support after launch. The client owns the domain and the full source code outright, with no monthly licence fee. MuleSoo builds from Pretoria for clients across South Africa and Africa.',
    faqs: [
      {
        q: 'How much does a website cost in South Africa?',
        a: 'MuleSoo websites start at R3,500. The final price depends on the number of pages, whether you need e-commerce or booking functionality, and how much content has to be written or migrated. You get a fixed quote before any work begins, so the number does not move afterwards.',
      },
      {
        q: 'How long does a website take to build?',
        a: 'Most websites launch within two to four weeks, depending on complexity and scope. You are involved throughout with regular updates, and the timeline is agreed up front rather than discovered as it goes.',
      },
      {
        q: 'Do I own the website after it is built?',
        a: 'Yes, completely. You own the website, the domain and all the source code. MuleSoo can transfer everything to the hosting provider you prefer, or manage it for you if you would rather not. There is no lock-in and no licence fee.',
      },
      {
        q: 'Can you redesign my existing website?',
        a: 'Yes. MuleSoo can redesign your current site, migrate your content, improve its SEO and add new features. Existing search rankings are protected during the move rather than rebuilt from scratch afterwards.',
      },
      {
        q: 'What happens if I need changes after launch?',
        a: 'Every website includes 30 days of free support and fixes. After that you can take a maintenance package at a fixed rate, or make changes yourself — you own the code, so you are never dependent on us to edit your own site.',
      },
      {
        q: 'Do you work with clients outside South Africa?',
        a: 'Yes. MuleSoo is based in Pretoria and works with clients across Africa and internationally. Everything runs over WhatsApp and email, so time zones do not slow the project down.',
      },
    ],
  },
  {
    slug: 'chatbot',
    name: 'AI Chatbots',
    serviceType: 'AI chatbot development',
    price: 2500,
    question: 'How much does an AI chatbot cost for a small business?',
    answer:
      'An AI chatbot from MuleSoo Digital Services starts at R2,500. It answers customer questions on your website and WhatsApp around the clock, captures leads, qualifies enquiries and takes bookings while you sleep. Each bot is trained on your own services, pricing and policies rather than generic templates, and is built in Pretoria for South African businesses.',
    faqs: [
      {
        q: 'What does an AI chatbot actually do for my business?',
        a: 'It answers customer questions instantly at any hour, collects the details of everyone who enquires, qualifies which of them are worth your time, and books appointments directly. The enquiries that used to arrive overnight and go cold by morning get handled the moment they come in.',
      },
      {
        q: 'How much does an AI chatbot cost?',
        a: 'MuleSoo AI chatbots start at R2,500. The price depends on how many services the bot must understand, whether it needs to take payments or deposits, and whether it connects to WhatsApp as well as your website.',
      },
      {
        q: 'Can the chatbot work on WhatsApp?',
        a: 'Yes. The assistant can connect to WhatsApp so customers talk to it where they already are, and hand the conversation over to a human when it needs to. Most South African customers would rather message than fill in a form.',
      },
      {
        q: 'Is the chatbot trained on my business specifically?',
        a: 'Yes. It is trained on your services, prices, policies and tone, so it answers as your business rather than as a generic bot. It will say it does not know instead of inventing an answer, which matters when a wrong price becomes a promise.',
      },
      {
        q: 'How long does it take to set up an AI chatbot?',
        a: 'Most chatbots are live within one to two weeks once you have supplied your service list, pricing and the questions customers ask most. ' + CONTACT,
      },
    ],
  },
  {
    slug: 'design-widget',
    name: 'Design Widget',
    serviceType: 'Website support and sales widget',
    price: 3500,
    question: 'What is a website sales and support widget?',
    answer:
      'A sales and support widget is a chat panel that sits in the corner of your website, greets every visitor, answers questions instantly, captures leads and books customers 24 hours a day. MuleSoo Digital Services builds them from R3,500, styled to match your brand, with a handover to WhatsApp when a human is needed.',
    faqs: [
      {
        q: 'How is a widget different from a chatbot?',
        a: 'The widget is the visible panel on your site — the greeting, the design, the booking and payment steps a visitor sees. The chatbot is the intelligence answering inside it. MuleSoo builds them together so the experience is one thing rather than a bot bolted onto a page.',
      },
      {
        q: 'Will it match my brand?',
        a: 'Yes. Colours, fonts, wording and the greeting are all set to your brand, so it reads as part of your site rather than a third-party plugin dropped on top of it.',
      },
      {
        q: 'Can it take deposits and bookings?',
        a: 'Yes. The widget can book a customer in and take a deposit or full payment in the same conversation, then send a confirmation, so an interested visitor becomes a paid booking without leaving the page.',
      },
      {
        q: 'What happens when the widget cannot answer?',
        a: 'It hands the conversation to WhatsApp with the context already captured, so the customer does not have to repeat themselves and you pick up a warm enquiry rather than a cold one.',
      },
      {
        q: 'How much does the Design Widget cost?',
        a: 'It starts at R3,500, depending on how much your assistant needs to know and whether it takes payments. ' + CONTACT,
      },
    ],
  },
  {
    slug: 'logo-design',
    name: 'Logo Design',
    serviceType: 'Logo and brand identity design',
    price: 800,
    question: 'How much does a professional logo cost in South Africa?',
    answer:
      'A custom logo from MuleSoo Digital Services starts at R800 in South Africa. You get original concepts rather than stock marks, unlimited revisions until it is right, every file format needed for print and screen, and full ownership of the finished design. Brand guidelines covering colour and typography are included so the logo is used consistently.',
    faqs: [
      {
        q: 'How much does a logo cost in South Africa?',
        a: 'MuleSoo logo design starts at R800. That covers original concepts, revisions until you are happy, and all the final file formats. Price rises with the number of concepts and whether you need a full brand guideline document.',
      },
      {
        q: 'What files do I receive?',
        a: 'You receive the logo in every format you will realistically need — vector files that scale to a billboard without blurring, plus transparent PNGs for web and social. Print shops and web developers can both work from what you are given.',
      },
      {
        q: 'Do I own the logo?',
        a: 'Yes, fully. The design is yours to use, trademark and reproduce however you like. There is no licensing arrangement and no ongoing fee.',
      },
      {
        q: 'How many revisions do I get?',
        a: 'Unlimited revisions on the direction you choose. The logo is finished when you say it is finished, not when a revision counter runs out.',
      },
      {
        q: 'How long does logo design take?',
        a: 'First concepts usually arrive within a few days, with the finished files following once you have chosen a direction and signed off the revisions. ' + CONTACT,
      },
    ],
  },
  {
    slug: 'qr-codes',
    name: 'QR Code Design',
    serviceType: 'Branded QR code design',
    price: 300,
    question: 'How much does a custom branded QR code cost?',
    answer:
      'A custom branded QR code from MuleSoo Digital Services starts at R300. Unlike a free generator, it carries your logo and colours, tracks how many people scan it and where, and uses a dynamic link so you can change the destination later without reprinting anything. Files are supplied print-ready for menus, packaging and signage.',
    faqs: [
      {
        q: 'Why pay for a QR code when generators are free?',
        a: 'A free code is a static black square pointing at a fixed link. If that link changes, every printed menu, flyer and label becomes wrong. A MuleSoo code is branded, tracked, and dynamic — you can repoint it later without reprinting a thing.',
      },
      {
        q: 'Can I see how many people scan it?',
        a: 'Yes. You get scan analytics showing how many scans happened and roughly where, so you can tell which flyer, table or product package is actually working.',
      },
      {
        q: 'Can I change where the QR code points after printing?',
        a: 'Yes. The codes are dynamic, so the destination can be changed at any time while the printed code stays the same. This is the main reason to use a designed code rather than a generated one.',
      },
      {
        q: 'What formats do I get for printing?',
        a: 'You receive print-ready files that stay sharp at any size, from a business card to a shopfront window, along with web versions for digital use.',
      },
      {
        q: 'How much does a branded QR code cost?',
        a: 'Branded QR codes start at R300 with lifetime support on the code. ' + CONTACT,
      },
    ],
  },
  {
    slug: 'email-setup',
    name: 'Custom Email Setup',
    serviceType: 'Business email setup',
    price: 400,
    question: 'How do I get a professional email address with my own domain?',
    answer:
      'MuleSoo Digital Services sets up professional email at your own domain — you@yourbusiness.co.za — from R400. That covers domain configuration, mailbox creation, migration of your existing mail, and the security records that stop your messages landing in spam. Setup is handled from Pretoria for businesses across South Africa.',
    faqs: [
      {
        q: 'Why does a business email address matter?',
        a: 'A quote from a Gmail address and the same quote from you@yourbusiness.co.za are read differently, and the second one wins work the first one loses. It costs very little to fix and it is the cheapest credibility a small business can buy.',
      },
      {
        q: 'Will I lose my existing emails?',
        a: 'No. Existing mail and contacts are migrated across as part of the setup, so nothing is left behind on the old account.',
      },
      {
        q: 'Will my emails end up in spam?',
        a: 'Not once the setup is done properly. The security records that prove your mail is genuinely from your domain are configured as part of the job, which is the step most self-service setups skip and then wonder why their invoices are never received.',
      },
      {
        q: 'How much does business email setup cost?',
        a: 'Setup starts at R400, which covers domain configuration, mailboxes, migration and security. Your mailbox hosting is billed by the provider separately. ' + CONTACT,
      },
    ],
  },
  {
    slug: 'pdf-guides',
    name: 'PDF Guides',
    serviceType: 'Digital product and PDF guide production',
    price: 99,
    question: 'How can I sell my expertise as a digital product?',
    answer:
      'MuleSoo Digital Services turns expertise into professionally designed PDF guides you can sell online, from R99. Each guide is laid out to a publishable standard, distributed securely so it cannot be freely copied around, and tracked so you can see what sells. Once written, a guide earns without any further work from you.',
    faqs: [
      {
        q: 'What makes a PDF guide worth paying for?',
        a: 'Layout and specificity. A well-designed guide that solves one real problem for one clear audience sells; a wall of text does not, regardless of how good the advice inside it is.',
      },
      {
        q: 'How is the guide protected from being shared?',
        a: 'Guides are distributed through a secure delivery system rather than as a link anyone can forward, so a single purchase does not turn into unlimited free copies.',
      },
      {
        q: 'Can I sell the guide from my own website?',
        a: 'Yes. MuleSoo can put the guide on your site with payment attached, so buyers pay you directly rather than through a marketplace that takes a share.',
      },
      {
        q: 'How much does a PDF guide cost to produce?',
        a: 'Guide production starts at R99 depending on length and how much design and structuring the content needs. ' + CONTACT,
      },
    ],
  },
  {
    slug: 'custom-apps',
    name: 'Custom Apps Building',
    serviceType: 'Custom web and mobile application development',
    price: null,
    question: 'When should a business build a custom app instead of using off-the-shelf software?',
    answer:
      'Build custom when your business runs a process that ready-made software cannot follow, and you are paying staff to bridge the gap by hand. MuleSoo Digital Services builds bespoke web and mobile applications around your actual workflow — custom dashboards, database and API integrations, scalable architecture — quoted per project, with the source code owned by you.',
    faqs: [
      {
        q: 'How much does a custom app cost?',
        a: 'Custom apps are quoted per project, because the honest answer depends entirely on what the app has to do. You get a fixed quote after a scoping conversation rather than an estimate that grows during the build.',
      },
      {
        q: 'Do I own the source code?',
        a: 'Yes. The code is yours. You can take it to another developer at any point, which is exactly the leverage you should want and the thing most agencies quietly withhold.',
      },
      {
        q: 'What technology do you build on?',
        a: 'Next.js, Supabase and Stripe — a modern, widely used stack. That matters for you rather than for us: common tools mean any competent developer can maintain the app later.',
      },
      {
        q: 'Can the app work on phones as well as desktop?',
        a: 'Yes. Applications are built to work on phones and desktop from the start, since most South African users will reach it on a phone.',
      },
      {
        q: 'What happens after the app is delivered?',
        a: 'Ongoing maintenance is available, but it is optional — because you own the code, you are never obliged to keep paying us to keep your own system running. ' + CONTACT,
      },
    ],
  },
  {
    slug: 'digital-id',
    name: 'Digital ID Service',
    serviceType: 'Digital ID card and verification system',
    price: null,
    question: 'What is a digital ID card and how does verification work?',
    answer:
      'A digital ID card is a branded card carrying a unique QR code and verification number tied to the holder. Anyone can scan it with an ordinary phone camera and the holder\'s record appears instantly, so the card can be checked rather than merely presented. MuleSoo Digital Services builds these for gyms, clinics, schools, churches and staff teams, quoted per project.',
    faqs: [
      {
        q: 'What stops someone forging a digital ID card?',
        a: 'The card is not the proof — the record behind it is. Anyone can copy a printed card, but the QR and verification number resolve to your live database, so a forged card shows no record when it is scanned.',
      },
      {
        q: 'Do people need an app to check an ID?',
        a: 'No. Any ordinary phone camera scans the QR code and opens the verification page. Requiring an app would mean nobody ever checks, which defeats the point.',
      },
      {
        q: 'Can it work with barcode scanners at a door?',
        a: 'Yes. Cards carry a barcode alongside the QR, so existing hardware scanners at a gate or reception can read them without new equipment.',
      },
      {
        q: 'Who uses digital ID cards?',
        a: 'Gyms and clubs for membership, clinics for patients, schools and academies for students, churches and NGOs for members, and businesses for staff credentials.',
      },
      {
        q: 'How much does a digital ID system cost?',
        a: 'Digital ID systems are quoted per project, since the price depends on how many cards you issue and what the verification page must show. ' + CONTACT,
      },
    ],
  },
  {
    slug: 'autopilot',
    name: 'Auto Pilot System',
    serviceType: 'Business management and automation system',
    price: null,
    question: 'What is an auto pilot system for a small business?',
    answer:
      'An auto pilot system is one connected system that runs a small institution end to end — taking bookings, collecting payments, managing members, issuing digital IDs, sending reminders and producing reports, without anyone driving it. MuleSoo Digital Services builds these for gyms, clinics, academies and event businesses, available as a once-off build or a monthly subscription.',
    faqs: [
      {
        q: 'What does an auto pilot system replace?',
        a: 'The scattered mix most small institutions actually run on: a booking notebook, a WhatsApp thread, a spreadsheet of members, manual payment chasing and reminders somebody has to remember to send. It becomes one system where a booking flows through to payment, membership and reporting on its own.',
      },
      {
        q: 'Who is it built for?',
        a: 'Small institutions that book people in and collect money from them regularly — gyms, clinics, salons and spas, tutoring academies, catering and event companies, churches and NGOs.',
      },
      {
        q: 'Do you take a commission on my bookings or payments?',
        a: 'No. MuleSoo charges no per-transaction commission — your revenue stays yours. Your payment provider takes its own processing fee, as it would anyway.',
      },
      {
        q: 'Can I pay monthly instead of all at once?',
        a: 'Yes. The Auto Pilot System is available as a once-off build you own, or as a monthly subscription if you would rather not pay for the whole system up front.',
      },
      {
        q: 'Is there a real example of this running?',
        a: 'Yes — Yoyo Gym runs on a MuleSoo-built AI membership platform handling members, check-in and payments. You can see it under our portfolio at mulesoo.com/portfolio.',
      },
      {
        q: 'How much does an Auto Pilot System cost?',
        a: 'It is quoted per project, because a gym and a clinic need different things from it. ' + CONTACT,
      },
    ],
  },
];

export const findServiceAeo = (slug: string): ServiceAeo | undefined =>
  SERVICE_AEO.find((s) => s.slug === slug);

/**
 * Service + Offer JSON-LD. The Offer only appears when there is a real starting
 * price: schema.org offers with a fabricated or zero price are worse than none,
 * and "quoted per project" is a legitimate answer that structured data has no
 * honest way to express as a number.
 */
export function serviceJsonLd(service: ServiceAeo) {
  const url = `${SITE_URL}/services/${service.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.answer,
    serviceType: service.serviceType,
    url,
    provider: {
      '@type': 'Organization',
      name: 'MuleSoo Digital Services',
      url: SITE_URL,
      areaServed: [
        { '@type': 'Country', name: 'South Africa' },
        { '@type': 'Place', name: 'Africa' },
      ],
    },
    areaServed: { '@type': 'Country', name: 'South Africa' },
    ...(service.price !== null
      ? {
          offers: {
            '@type': 'Offer',
            price: service.price,
            priceCurrency: 'ZAR',
            priceSpecification: {
              '@type': 'PriceSpecification',
              price: service.price,
              priceCurrency: 'ZAR',
              // The prices on site are "from" prices, and minPrice is how
              // schema.org says so. Publishing it as a flat price would be a
              // quotable claim that the quote then contradicts.
              minPrice: service.price,
              valueAddedTaxIncluded: false,
            },
            availability: 'https://schema.org/InStock',
            url,
          },
        }
      : {}),
  };
}

/** Home › Services › <this service>. */
export function serviceBreadcrumbJsonLd(service: ServiceAeo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.name,
        item: `${SITE_URL}/services/${service.slug}`,
      },
    ],
  };
}
