/**
 * MuleSoo AI Automation Library — 200 systems arranged by department.
 * Names + one-line descriptions are the real catalog; the full detail for each
 * page (problem / how it works / admin control / business boost / why MuleSoo)
 * is generated in the standard sales formula so every page reads professionally.
 */

// [name, one-line description]
const ITEMS: [string, string][] = [
  // Business, Booking & Hospitality (1–25)
  ['AI hotel booking system', 'Helps guests ask about rooms, check availability, book stays, and receive confirmations automatically.'],
  ['AI lodge booking system', 'Manages guest enquiries, availability, and booking follow-up.'],
  ['AI guest inquiry assistant', 'Answers guest questions quickly and routes special requests to staff.'],
  ['AI room availability checker', 'Shows available rooms or dates and encourages instant booking.'],
  ['AI check-in assistant', 'Sends arrival instructions and collects guest details before arrival.'],
  ['AI hotel payment follow-up', 'Reminds guests to complete deposits or outstanding balances.'],
  ['AI hotel concierge bot', 'Answers service questions and improves guest support.'],
  ['AI travel package booking', 'Handles travel enquiries, quotes, and booking confirmations.'],
  ['AI resort activity booking', 'Books spa, tours, and guest activities automatically.'],
  ['AI airport transfer booking', 'Manages pickup requests and driver scheduling.'],
  ['AI car rental booking', 'Checks vehicle availability and confirms bookings.'],
  ['AI tour booking assistant', 'Handles tour questions, dates, and reservations.'],
  ['AI vacation quote assistant', 'Builds quick quotes and follows up on undecided leads.'],
  ['AI lodge guest support', 'Manages guest messages, requests, and service issues.'],
  ['AI stay reminder system', 'Sends reminders before arrival and before checkout.'],
  ['AI cancellation recovery bot', 'Offers alternative dates or packages after cancellations.'],
  ['AI late check-in assistant', 'Guides guests arriving after hours.'],
  ['AI guest upsell assistant', 'Promotes breakfast, upgrades, and extras during booking.'],
  ['AI hotel review recovery', 'Follows up unhappy guests and requests feedback.'],
  ['AI property guest support', 'Handles guest communication for short-stay properties.'],
  ['AI hotel concierge assistant', 'Shares local info, services, and support.'],
  ['AI guest complaint routing', 'Sorts issues and sends them to the right team.'],
  ['AI reservation confirmation bot', 'Confirms bookings instantly and reduces confusion.'],
  ['AI front desk assistant', 'Helps with routine guest questions and admin.'],
  ['AI multi-property booking assistant', 'Manages bookings across several locations.'],
  // Healthcare & Wellness (26–45)
  ['AI dentist booking system', 'Books dental visits, sends reminders, and manages rescheduling.'],
  ['AI clinic intake system', 'Collects patient details and routes them correctly.'],
  ['AI doctor appointment booking', 'Schedules consultations and reduces no-shows.'],
  ['AI physiotherapy booking', 'Handles therapy sessions and repeat visits.'],
  ['AI optometrist booking', 'Manages eye test appointments and reminders.'],
  ['AI vet appointment booking', 'Books pet visits and collects pre-visit details.'],
  ['AI pharmacy refill assistant', 'Reminds customers to refill prescriptions.'],
  ['AI lab test booking', 'Schedules tests and sends preparation instructions.'],
  ['AI vaccination booking', 'Handles vaccine appointments and confirmations.'],
  ['AI patient reminder system', 'Sends appointment and follow-up reminders.'],
  ['AI missed appointment recovery', 'Reaches out to patients who did not show up.'],
  ['AI therapy session booking', 'Supports recurring therapy appointments.'],
  ['AI mental health intake', 'Collects first-contact details and books sessions.'],
  ['AI wellness booking system', 'Manages wellness service appointments.'],
  ['AI home care booking', 'Schedules care visits and manages client needs.'],
  ['AI medical triage bot', 'Asks screening questions and routes patients.'],
  ['AI medical document checker', 'Collects and checks required documents.'],
  ['AI patient follow-up bot', 'Sends follow-up messages after visits.'],
  ['AI claims intake assistant', 'Captures claim details and starts the process.'],
  ['AI medical support chatbot', 'Answers common health service questions.'],
  // Beauty, Fitness & Lifestyle (46–85)
  ['AI salon booking system', 'Books salon services and sends reminders.'],
  ['AI barber booking system', 'Manages haircut bookings and follow-up.'],
  ['AI nail salon assistant', 'Handles nail service appointments.'],
  ['AI spa booking system', 'Books spa treatments and supports repeat visits.'],
  ['AI massage booking bot', 'Manages massage schedules and confirmations.'],
  ['AI beauty consultation bot', 'Collects customer needs and books services.'],
  ['AI bridal makeup booking', 'Handles wedding beauty enquiries and schedules.'],
  ['AI hair treatment assistant', 'Books hair treatments and follow-ups.'],
  ['AI skincare consultation bot', 'Qualifies customer needs and recommends booking.'],
  ['AI salon loyalty assistant', 'Tracks repeat clients and promotions.'],
  ['AI salon reminder system', 'Sends appointment reminders automatically.'],
  ['AI no-show recovery bot', 'Rebooks missed beauty appointments.'],
  ['AI mobile beauty booking', 'Schedules at-home beauty services.'],
  ['AI tattoo booking system', 'Books tattoo sessions and manages deposits.'],
  ['AI piercing booking assistant', 'Handles piercing enquiries and appointments.'],
  ['AI cosmetic clinic lead bot', 'Qualifies leads and books consultations.'],
  ['AI esthetician booking', 'Manages beauty treatment appointments.'],
  ['AI microblading booking', 'Schedules microblading consultations and sessions.'],
  ['AI product upsell bot', 'Recommends beauty products after services.'],
  ['AI beauty membership assistant', 'Manages recurring packages and renewals.'],
  ['AI gym booking system', 'Books classes, membership visits, and trainer sessions.'],
  ['AI class booking system', 'Handles fitness class scheduling and reminders.'],
  ['AI personal trainer assistant', 'Schedules training sessions and follow-up.'],
  ['AI fitness membership bot', 'Manages signups, renewals, and member support.'],
  ['AI sports court booking', 'Books courts and manages available time slots.'],
  ['AI yoga class booking', 'Registers students and sends attendance reminders.'],
  ['AI pilates booking system', 'Handles pilates sessions and rescheduling.'],
  ['AI tennis court booking', 'Manages court reservations and confirmations.'],
  ['AI golf tee-time assistant', 'Books tee times and sends booking details.'],
  ['AI swimming class booking', 'Handles lesson registration and reminders.'],
  ['AI dance class booking', 'Schedules dance classes and student attendance.'],
  ['AI martial arts booking', 'Manages class signups and payment reminders.'],
  ['AI sports event registration', 'Collects registrations and confirms attendance.'],
  ['AI bootcamp booking assistant', 'Handles training bootcamp signups.'],
  ['AI recreation center booking', 'Schedules community facility use.'],
  ['AI workout reminder bot', 'Helps members stay active and return regularly.'],
  ['AI trial-to-member converter', 'Follows up trial users until they join.'],
  ['AI health coaching booking', 'Schedules coaching calls and packages.'],
  ['AI gym payment reminder', 'Tracks unpaid memberships and follows up.'],
  ['AI membership renewal system', 'Automates renewals and retention.'],
  // Food, Restaurants & Catering (86–105)
  ['AI restaurant reservation system', 'Books tables and manages reservations.'],
  ['AI waitlist assistant', 'Handles waiting customers and table updates.'],
  ['AI takeaway order assistant', 'Takes food orders and confirms them.'],
  ['AI catering quote assistant', 'Builds catering quotes quickly.'],
  ['AI private dining booking', 'Handles private event meal bookings.'],
  ['AI event catering booking', 'Schedules catering for functions and events.'],
  ['AI menu FAQ bot', 'Answers menu and service questions instantly.'],
  ['AI restaurant review recovery', 'Follows up unhappy diners.'],
  ['AI order tracking assistant', 'Keeps customers updated on their order.'],
  ['AI table management system', 'Organizes table allocation and booking flow.'],
  ['AI bakery pre-order bot', 'Manages cake and pastry pre-orders.'],
  ['AI coffee loyalty assistant', 'Tracks repeat customers and offers.'],
  ['AI chef consultation booking', 'Books menu and catering consultations.'],
  ['AI food delivery support', 'Handles delivery questions and delays.'],
  ['AI kitchen stock assistant', 'Helps monitor stock and replenishment.'],
  ['AI restaurant promotion bot', 'Sends offers and seasonal campaigns.'],
  ['AI customer complaint assistant', 'Routes complaints to the right team.'],
  ['AI franchise order system', 'Helps manage multiple food outlets.'],
  ['AI meal plan subscription bot', 'Manages recurring meal plans.'],
  ['AI wholesale food sales bot', 'Supports bulk ordering and enquiry follow-up.'],
  // Real Estate & Property (106–125)
  ['AI property viewing scheduler', 'Books viewings and confirms attendance.'],
  ['AI real estate lead bot', 'Captures lead details and follows up fast.'],
  ['AI rental inquiry assistant', 'Answers rental questions and sends available options.'],
  ['AI landlord support bot', 'Handles landlord requests and updates.'],
  ['AI tenant maintenance assistant', 'Logs repair requests and schedules action.'],
  ['AI lease renewal reminder', 'Tracks lease dates and renewals.'],
  ['AI open-house booking assistant', 'Manages open-house attendance.'],
  ['AI mortgage inquiry bot', 'Collects loan questions and routes them.'],
  ['AI property valuation assistant', 'Books valuation enquiries.'],
  ['AI buyer qualification bot', 'Qualifies serious buyers from casual leads.'],
  ['AI seller follow-up bot', 'Keeps sellers updated and engaged.'],
  ['AI inspection scheduler', 'Organizes inspections and property visits.'],
  ['AI moving booking assistant', 'Books moving services for tenants.'],
  ['AI home loan support bot', 'Assists with loan application flow.'],
  ['AI interior design booking', 'Books interior design consultations.'],
  ['AI furnishing consultation bot', 'Manages furnishing appointments.'],
  ['AI estate agent CRM bot', 'Helps agents manage follow-up and notes.'],
  ['AI short-stay support assistant', 'Handles Airbnb and guest support.'],
  ['AI property management ticketing', 'Organizes maintenance and service tickets.'],
  ['AI building maintenance router', 'Sends building issues to the correct contractor.'],
  // Legal, Finance & Professional Services (126–145)
  ['AI law firm intake system', 'Collects case details and books consultations.'],
  ['AI lawyer booking assistant', 'Schedules legal consultations automatically.'],
  ['AI case qualification bot', 'Screens clients before they meet a lawyer.'],
  ['AI document collection bot', 'Requests and tracks legal documents.'],
  ['AI court reminder system', 'Sends reminders for dates and deadlines.'],
  ['AI contract request assistant', 'Routes contract needs to the right person.'],
  ['AI tax consultation booking', 'Books tax advice sessions.'],
  ['AI accountant meeting assistant', 'Schedules accounting appointments.'],
  ['AI bookkeeping lead bot', 'Collects bookkeeping enquiries and qualifies them.'],
  ['AI payroll support bot', 'Assists staff with payroll questions.'],
  ['AI insurance claim assistant', 'Manages claim information and updates.'],
  ['AI policy renewal assistant', 'Tracks policies and renewal dates.'],
  ['AI compliance checklist bot', 'Helps clients stay on track with compliance.'],
  ['AI business registration assistant', 'Supports business setup enquiries.'],
  ['AI trademark booking system', 'Books trademark consultation appointments.'],
  ['AI visa application assistant', 'Helps collect visa-related information.'],
  ['AI debt collection reminder', 'Sends payment reminders automatically.'],
  ['AI client follow-up bot', 'Keeps clients engaged after the first enquiry.'],
  ['AI legal document tracker', 'Monitors document progress and missing files.'],
  ['AI financial advisory booking', 'Books finance consultation calls.'],
  // Education & Training (146–165)
  ['AI school admission assistant', 'Answers parent questions and books tours.'],
  ['AI parent meeting scheduler', 'Books meetings between parents and staff.'],
  ['AI tutoring booking system', 'Schedules tutoring sessions and reminders.'],
  ['AI online course registration', 'Manages course signups and follow-up.'],
  ['AI training workshop booking', 'Handles workshop attendance and confirmations.'],
  ['AI conference registration', 'Registers attendees and manages event flow.'],
  ['AI seminar reminder bot', 'Sends event reminders and attendance prompts.'],
  ['AI language class booking', 'Books language lessons and reschedules.'],
  ['AI music lesson booking', 'Manages music class appointments.'],
  ['AI driving school booking', 'Handles lesson booking and reminders.'],
  ['AI exam booking assistant', 'Books exams and confirms details.'],
  ['AI scholarship assistant', 'Collects scholarship-related enquiries.'],
  ['AI student support bot', 'Answers common student questions.'],
  ['AI career coaching booking', 'Schedules coaching calls.'],
  ['AI alumni event RSVP', 'Manages event attendance.'],
  ['AI internship application assistant', 'Collects applicant details and follows up.'],
  ['AI school transport booking', 'Manages learner transport registration.'],
  ['AI exam revision booking', 'Books study sessions and tutoring.'],
  ['AI student attendance assistant', 'Tracks attendance and sends reminders.'],
  ['AI teacher meeting scheduler', 'Books staff and teacher meetings.'],
  // Home Services, Repairs & Local Businesses (166–185)
  ['AI plumber booking system', 'Captures plumbing issues and books visits.'],
  ['AI electrician booking system', 'Handles electrical service enquiries.'],
  ['AI handyman booking bot', 'Schedules maintenance and repair jobs.'],
  ['AI pest control booking', 'Books inspections and repeat treatments.'],
  ['AI cleaning booking system', 'Manages home and office cleaning appointments.'],
  ['AI laundry pickup bot', 'Schedules pickup and delivery.'],
  ['AI appliance repair assistant', 'Books repair visits and tracks issues.'],
  ['AI AC service booking', 'Handles cooling service requests.'],
  ['AI locksmith booking assistant', 'Books urgent locksmith jobs.'],
  ['AI solar consultation booking', 'Schedules solar sales and installs.'],
  ['AI renovation quote assistant', 'Collects renovation details and sends quotes.'],
  ['AI garden service booking', 'Handles landscaping and garden jobs.'],
  ['AI pool maintenance booking', 'Schedules pool service visits.'],
  ['AI roofing lead assistant', 'Qualifies roofing enquiries and books inspections.'],
  ['AI painting job booking', 'Manages painting quotes and bookings.'],
  ['AI flooring quote bot', 'Collects project details and sends estimates.'],
  ['AI home inspection assistant', 'Books home inspections and reminders.'],
  ['AI emergency dispatch assistant', 'Routes urgent local service requests.'],
  ['AI security quote assistant', 'Books security system enquiries.'],
  ['AI moving service booking', 'Schedules moving jobs and confirmations.'],
  // Logistics, Sales & Operations (186–200)
  ['AI freight quote assistant', 'Collects shipment details and builds quotes.'],
  ['AI logistics booking system', 'Manages transport bookings and schedules.'],
  ['AI warehouse pickup scheduler', 'Books pickups and delivery windows.'],
  ['AI delivery reschedule bot', 'Changes delivery times and informs customers.'],
  ['AI supplier order assistant', 'Helps manage supplier requests and follow-up.'],
  ['AI procurement request bot', 'Collects internal purchase requests.'],
  ['AI fleet service booking', 'Schedules vehicle service and maintenance.'],
  ['AI dealership test-drive booking', 'Handles vehicle test-drive appointments.'],
  ['AI vehicle service reminder', 'Tracks service intervals and reminders.'],
  ['AI customs document assistant', 'Supports document collection and routing.'],
  ['AI import/export inquiry bot', 'Answers trade enquiries and qualifies leads.'],
  ['AI shipping status assistant', 'Updates customers on shipment progress.'],
  ['AI support ticket triage', 'Sorts customer issues and sends them to staff.'],
  ['AI CRM update assistant', 'Logs customer notes and follow-up actions.'],
  ['AI invoice reminder system', 'Sends payment reminders and reduces overdue accounts.'],
];

const DEPARTMENTS: { name: string; start: number; end: number }[] = [
  { name: 'Business, Booking & Hospitality', start: 1, end: 25 },
  { name: 'Healthcare & Wellness', start: 26, end: 45 },
  { name: 'Beauty, Fitness & Lifestyle', start: 46, end: 85 },
  { name: 'Food, Restaurants & Catering', start: 86, end: 105 },
  { name: 'Real Estate & Property', start: 106, end: 125 },
  { name: 'Legal, Finance & Professional Services', start: 126, end: 145 },
  { name: 'Education & Training', start: 146, end: 165 },
  { name: 'Home Services, Repairs & Local Businesses', start: 166, end: 185 },
  { name: 'Logistics, Sales & Operations', start: 186, end: 200 },
];

export const CATEGORIES = DEPARTMENTS.map((d) => d.name);

const departmentFor = (id: number) =>
  DEPARTMENTS.find((r) => id >= r.start && id <= r.end)?.name || 'Business';

const slugify = (name: string) =>
  name.toLowerCase().replace(/^ai\s+/, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export interface Automation {
  id: number;
  name: string;
  slug: string;
  category: string;
  desc: string;
}

export const AUTOMATIONS: Automation[] = ITEMS.map(([name, desc], i) => ({
  id: i + 1,
  name,
  slug: slugify(name),
  category: departmentFor(i + 1),
  desc,
}));

export const findAutomation = (slug: string) => AUTOMATIONS.find((a) => a.slug === slug);

// What the admin controls (from the sales formula) — shown on every detail page.
export const ADMIN_CONTROLS = [
  'Services & pricing',
  'Working hours & availability',
  'Booking rules & deposits',
  'Messages & reply templates',
  'Customer records & follow-up timing',
  'Reports & analytics',
];

// What every automation can do.
export const SYSTEM_CAN_DO = [
  'Answer customer questions',
  'Qualify and capture leads',
  'Book appointments or services',
  'Send reminders & confirmations',
  'Request payment / deposit',
  'Recover missed leads & no-shows',
  'Route requests to your staff',
  'Log activity & generate reports',
];

export interface AutomationDetail {
  problem: string;
  howItWorks: string;
  features: string[];
  adminControl: string;
  businessBenefit: string;
  whyMuleSoo: string;
}

const WHY = 'Custom-built around your exact business, easier for staff to use, with a dashboard you control and ongoing support.';

export function getDetail(name: string): AutomationDetail {
  const n = name.toLowerCase();
  const has = (...k: string[]) => k.some((x) => n.includes(x));

  if (has('reminder')) {
    return {
      problem: 'The business loses money to no-shows and forgotten appointments, and staff waste time chasing people manually.',
      howItWorks: 'The AI sends timed WhatsApp, SMS and email reminders before each appointment, and lets customers confirm or reschedule in one tap.',
      features: ['Automated multi-channel reminders', 'One-tap confirm or reschedule', 'Smart timing rules', 'No-show tracking'],
      adminControl: 'Control reminder timing, message templates, and follow-up rules.',
      businessBenefit: 'Fewer no-shows, a fuller schedule, and more revenue from the same slots.',
      whyMuleSoo: WHY,
    };
  }
  if (has('recovery', 'no-show', 'missed', 'cancellation')) {
    return {
      problem: 'Cancellations, no-shows and drop-offs are lost revenue that almost never gets followed up.',
      howItWorks: 'When a booking is cancelled or missed, the AI automatically reaches out with a friendly rebooking offer and fills the gap.',
      features: ['Automatic win-back outreach', 'Alternative dates & offers', 'Waitlist fill', 'Recovered-revenue tracking'],
      adminControl: 'Control offers, messaging, and how aggressively the system follows up.',
      businessBenefit: 'Turns lost bookings back into paying customers — automatically.',
      whyMuleSoo: WHY,
    };
  }
  if (has('follow-up', 'follow up', 'crm', 'onboarding')) {
    return {
      problem: 'Leads go cold and clients feel forgotten when follow-ups depend on someone remembering.',
      howItWorks: 'The AI follows up at the right moments over WhatsApp and email, answers questions, and nudges people to the next step.',
      features: ['Timed automated follow-ups', 'Personalised messages', 'Answers common questions', 'Human handover when ready'],
      adminControl: 'Control follow-up timing, message templates, and customer records.',
      businessBenefit: 'Close more by never letting a lead or client go quiet.',
      whyMuleSoo: WHY,
    };
  }
  if (has('availability', 'checker', 'status', 'tracking', 'valuation')) {
    return {
      problem: 'Customers give up when they can’t quickly find out what’s available or what’s happening.',
      howItWorks: 'The AI checks your live data and answers instantly in chat, then guides the customer straight into booking.',
      features: ['Live lookups, 24/7', 'Instant, accurate answers', 'Next-best suggestions', 'Leads straight into booking'],
      adminControl: 'Control the data, availability, pricing and rules behind every answer.',
      businessBenefit: 'Convert more enquiries by answering instantly, day or night.',
      whyMuleSoo: WHY,
    };
  }
  if (has('intake', 'document', 'triage', 'checklist', 'qualification', 'lead')) {
    return {
      problem: 'Manual intake and lead handling is slow, inconsistent, and lets good enquiries slip through.',
      howItWorks: 'An AI conversation captures and validates all the details, screens/qualifies, and organises everything for your team.',
      features: ['Guided AI intake & screening', 'Validated, structured data', 'Instant routing to the right person', 'CRM-ready records'],
      adminControl: 'Control forms, questions, routing rules, and approval steps.',
      businessBenefit: 'Faster, cleaner intake — more qualified leads and less admin.',
      whyMuleSoo: WHY,
    };
  }
  if (has('quote')) {
    return {
      problem: 'Slow quotes lose deals to faster competitors.',
      howItWorks: 'The AI gathers the customer’s needs and returns an instant estimate, then books a consultation or follow-up.',
      features: ['Instant AI quoting', 'Captures full requirements', 'Books the next step', 'Lead saved automatically'],
      adminControl: 'Control pricing rules, services, and quote follow-up timing.',
      businessBenefit: 'Respond first, quote fast, and win more jobs.',
      whyMuleSoo: WHY,
    };
  }
  if (has('upsell', 'loyalty', 'membership', 'renewal', 'subscription', 'converter', 'promotion')) {
    return {
      problem: 'Upsells and renewals are missed when staff are busy or forget to ask.',
      howItWorks: 'At the right moment, the AI suggests relevant add-ons, upgrades or renewals that increase customer value.',
      features: ['Smart offers & upgrades', 'Automated renewals', 'Perfectly-timed prompts', 'Uplift tracking'],
      adminControl: 'Control offers, pricing, packages, and timing.',
      businessBenefit: 'Increase spend and retention with zero extra effort.',
      whyMuleSoo: WHY,
    };
  }
  if (has('support', 'chatbot', 'concierge', 'faq', 'complaint', 'ticket', 'inquiry', 'enquiry', 'assistant')) {
    return {
      problem: 'Repetitive questions overwhelm your team and slow replies frustrate customers.',
      howItWorks: 'A trained AI assistant answers questions, guides customers, captures details, and escalates only what needs a human.',
      features: ['24/7 instant answers', 'Trained on your business', 'Captures & routes requests', 'Every chat logged'],
      adminControl: 'Control answers, routing, templates, and escalation rules.',
      businessBenefit: 'Happier customers, faster response, and far less support workload.',
      whyMuleSoo: WHY,
    };
  }
  if (has('order', 'pre-order', 'procurement', 'supplier', 'sales', 'invoice', 'payment')) {
    return {
      problem: 'Manual orders, payments and invoices are slow, easy to get wrong, and hard to chase.',
      howItWorks: 'Customers order, pay or settle in a simple chat; the AI confirms, records, and follows up automatically.',
      features: ['Conversational ordering/payment', 'Confirmations & tracking', 'Automatic reminders', 'Clean records'],
      adminControl: 'Control pricing, payment rules, reminders, and reporting.',
      businessBenefit: 'More orders paid on time, fewer errors, and less admin.',
      whyMuleSoo: WHY,
    };
  }
  // Default: booking / scheduler / registration / system
  return {
    problem: 'Doing this manually is slow and error-prone — and every missed message is a lost customer.',
    howItWorks: 'Customers scan a QR or click a link, chat with a friendly AI that collects their details, checks availability, and confirms — automatically, 24/7.',
    features: ['Conversational AI booking', 'Works 24/7 on web & WhatsApp', 'Instant confirmation & records', 'Optional online deposit/payment'],
    adminControl: 'Control services, pricing, hours, availability, and booking rules.',
    businessBenefit: 'Capture more bookings around the clock while cutting admin to near zero.',
    whyMuleSoo: WHY,
  };
}
