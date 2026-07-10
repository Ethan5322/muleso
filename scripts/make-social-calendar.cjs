/* MuleSoo — 365-day social content calendar.
 *
 * Generates one post per day per platform, tailored to each platform's voice
 * and length, from a rotation of content pillars. Output is CSV (open in Excel
 * / Google Sheets, or import into Buffer or Later) plus a readable Markdown
 * file you can copy from directly.
 *
 * Honest note on what this is: a *scaffold*, not finished copy. It rotates a
 * large hand-written pool across a year so no post repeats within ~10 weeks,
 * and every post is publishable as-is. But the ones that will actually win are
 * the days marked PROOF — those need a real client result dropped in. A calendar
 * of pure claims with no evidence is what makes an agency look small.
 *
 * Run: node scripts/make-social-calendar.cjs [--year 2026] [--start 2026-01-01]
 * Out: marketing/Social-Calendar/
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(process.cwd(), 'marketing', 'Social-Calendar');
fs.mkdirSync(OUT, { recursive: true });

const arg = (flag, fallback) => {
  const i = process.argv.indexOf(flag);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const START = new Date(arg('--start', '2026-01-01') + 'T00:00:00Z');
const DAYS = 365;

const SITE = 'mulesoo.com';
const WA = 'wa.me/27688529333';

// ── Platforms ────────────────────────────────────────────────────────────────
// Each has its own register. The same sentence does not work on LinkedIn and
// TikTok, and posting identical copy everywhere is the fastest way to look like
// a bot.
const PLATFORMS = [
  { key: 'linkedin', name: 'LinkedIn', maxLen: 1200, tone: 'professional, insight-first, no emoji spam', tags: 3 },
  { key: 'instagram', name: 'Instagram', maxLen: 800, tone: 'warm, visual, friendly', tags: 8 },
  { key: 'facebook', name: 'Facebook', maxLen: 800, tone: 'conversational, community, plain language', tags: 3 },
  // TikTok captions allow 2200 chars; the copy stays short because it is meant
  // to be read aloud over the video, not read on screen.
  { key: 'tiktok', name: 'TikTok', maxLen: 2200, tone: 'fast hook, funny, spoken aloud', tags: 5 },
  // X free tier is 280. 260 leaves room for a link preview.
  { key: 'x', name: 'X', maxLen: 260, tone: 'punchy, one idea, dry wit', tags: 2 },
];

// ── Content pillars ──────────────────────────────────────────────────────────
// A week runs through these in order, so the feed never becomes an advert wall.
// The 80/20 rule holds: only PROMO and OFFER ask for anything.
const PILLARS = [
  { key: 'PROBLEM', label: 'Problem we solve' },
  { key: 'EDUCATE', label: 'Teach something useful' },
  { key: 'PROOF', label: 'Show real work (NEEDS A REAL RESULT)' },
  { key: 'MYTH', label: 'Bust a myth' },
  { key: 'BEHIND', label: 'Behind the scenes' },
  { key: 'PROMO', label: 'Direct offer' },
  { key: 'HUMAN', label: 'Personality / humour' },
];

// ── Services, phrased as customer outcomes rather than deliverables ───────────
const SERVICES = [
  { name: 'Website design', outcome: 'a site that turns visitors into paying clients', price: 'from R3,500', page: '/services/website-design' },
  { name: 'AI chatbots', outcome: 'a assistant that answers customers at 2am so you can sleep', price: 'from R2,500', page: '/services/chatbot' },
  { name: 'Logo & brand identity', outcome: 'a brand people remember after one look', price: 'from R800', page: '/services/logo-design' },
  { name: 'QR codes', outcome: 'a branded code that tells you who scanned it and when', price: 'from R300', page: '/services/qr-codes' },
  { name: 'Business email', outcome: 'an @yourdomain address that stops you looking like a hobby', price: 'from R400', page: '/services/email-setup' },
  { name: 'Auto Pilot systems', outcome: 'bookings, payments and reminders running without you', price: 'custom', page: '/services/autopilot' },
  { name: 'AI automation', outcome: 'the admin work doing itself', price: 'custom', page: '/ai-automation' },
  { name: 'Custom web apps', outcome: 'the internal tool your business actually needs', price: 'custom', page: '/services/custom-apps' },
];

const PROBLEMS = [
  ['Your website loads in 6 seconds', 'Half your visitors left before it finished. Speed is not a luxury; it is the whole shop door.'],
  ['You answer the same WhatsApp question 30 times a week', 'That is not customer service. That is a chatbot that has not been built yet.'],
  ['Your business email is a gmail address', 'Corporate clients notice. They will not say anything. They will just not reply.'],
  ['Your logo was made in Word', 'It shows at 300dpi. It shows on a banner. It shows on a business card.'],
  ['Your booking system is a notebook', 'One lost page is one lost month.'],
  ['You lose leads at 7pm', 'Your competitors do not. Their chatbot picked up.'],
  ['Your site looks great on your laptop', 'Nine of ten of your customers are on a phone. Have you checked?'],
  ['You are quoting by hand every time', 'That is four hours a week. That is five working weeks a year.'],
  ['Nobody finds you on Google', 'Not because you are small. Because nobody told Google your pages exist.'],
  ['Your invoices go out late', 'Cash flow is not a maths problem. It is an admin problem.'],
  ['Your staff share one login', 'That is not a system. That is a liability.'],
  ['You have no idea where clients come from', 'So you cannot spend more on what works.'],
  ['Your contact form goes nowhere', 'We have checked dozens. About a third are broken and nobody knows.'],
  ['Your prices are not on your site', 'So people assume expensive, and leave.'],
  ['You reply to enquiries in two days', 'The one who replied in two hours got the job.'],
  ['Your website has no phone number above the fold', 'People do not scroll to find you. They scroll to leave.'],
  ['You are paying for a website you cannot edit', 'Every text change costs you a phone call and three days.'],
  ['Your team shares files over WhatsApp', 'Somewhere in that chat is the only copy of something important.'],
  ['Your online store has no trust signals', 'No reviews, no returns policy, no real address. Would you buy?'],
  ['You post on social media and nothing happens', 'Because the link goes to a homepage instead of an answer.'],
  ['Your PDFs are 40MB', 'Nobody on mobile data is opening that. Not once.'],
  ['Your site works. On Chrome. On your machine', 'Safari on an old iPhone is where websites go to die.'],
  ['You have three different phone numbers online', 'Google does not know which is real, so it trusts none of them.'],
  ['Your best client found you by accident', 'Imagine if that was a system instead of luck.'],
  ['You track nothing', 'So every marketing decision you make is a guess wearing a suit.'],
  ['Your appointment reminders are manual', 'That is why people no-show. Not because they forgot you. Because nothing reminded them.'],
];

const LESSONS = [
  ['A slow site is a tax you pay every day', 'Every extra second of load time costs roughly 7% of conversions. On R100k of sales that is R7,000 a second.'],
  ['Your homepage has one job', 'Say what you do, who for, and what to click. Everything else is decoration.'],
  ['Buy the domain before the logo', 'Names change. Get the .com or .co.za first, then design around it.'],
  ['Nobody reads. They scan', 'Short paragraphs. Real headings. One idea per screen.'],
  ['Your best salesperson is a FAQ page', 'It answers the objection you are too polite to bring up.'],
  ['A chatbot is not a robot receptionist', 'It is a filter. It catches the easy 70% so a human handles the 30% that pays.'],
  ['Mobile-first is not a style. It is arithmetic', 'Most South African traffic is mobile. Design there and scale up.'],
  ['One clear call to action beats five', 'Every extra button is a decision, and every decision loses people.'],
  ['Speed comes from what you do not load', 'Fonts, sliders, video backgrounds, tracking scripts. Delete first, optimise second.'],
  ['Own your source code', 'If your developer disappears and your site does too, you did not buy a website. You rented one.'],
  ['Structured data is how Google understands you', 'It is a few lines of JSON. Most sites skip it. That is your opening.'],
  ['A QR code with no tracking is a leaflet', 'If you cannot count the scans, you cannot tell if it worked.'],
  ['Automate the boring, not the human', 'Nobody wants an AI to write their condolence note. Everyone wants one to chase invoices.'],
  ['Your reviews are your SEO', 'A Google Business Profile with real reviews outranks a prettier site with none.'],
  ['Do not build the app first', 'Build the landing page. If nobody clicks, you just saved six months.'],
  ['Write the price down', 'Hiding it does not make it smaller. It makes you look unsure.'],
  ['The fold is a myth, the first sentence is not', 'People scroll. They do not read badly-written openings.'],
  ['Every form field costs you customers', 'Ask for what you need to reply. Everything else can wait.'],
  ['Your 404 page is a sales page', 'Someone is lost and still interested. Help them.'],
  ['Compress your images before you blame your host', 'A 4MB hero image is not a hosting problem.'],
  ['Name your pages like a human searches', '"Website design Pretoria" beats "Solutions" every time.'],
  ['One testimonial with a real name beats ten anonymous ones', 'Specificity is the whole currency of trust.'],
  ['Email is not dead. Your email design is', 'Plain text, one link, sent from a person.'],
  ['Back up before you launch, not after', 'The worst day to learn your backup strategy is the day you need it.'],
  ['Measure one number', 'Enquiries per week. If it does not move that, it is decoration.'],
  ['Load shedding is a design constraint', 'Build for offline-first and intermittent connections. It is not optional here.'],
];

const MYTHS = [
  ['"A good website costs six figures."', 'It does not. It costs clarity about what the site is for. We start at R3,500.'],
  ['"AI will replace my staff."', 'It will replace the parts of their day they hate. That is different, and better.'],
  ['"SEO is a scam."', 'Half the industry, yes. The other half is: fast pages, real content, and telling Google your pages exist.'],
  ['"We are too small for automation."', 'Small is exactly when your time is most expensive, because it is all you have.'],
  ['"Nobody in South Africa buys online."', 'Your customers are already buying online. Just not from you.'],
  ['"I will do the website myself, later."', '"Later" is doing a lot of work in that sentence.'],
  ['"Design is subjective."', 'Taste is subjective. Conversion is measurable.'],
  ['"Chatbots annoy customers."', 'Bad ones do. So do phone queues, and you still have one of those.'],
  ['"We do not need a logo, we need sales."', 'The logo is not the point. Being memorable at the moment of decision is.'],
  ['"Just boost the post."', 'Boosting a post that points at a broken site is paying to lose faster.'],
  ['"We will fix the website after we get customers."', 'The website is how you get the customers. You have the order backwards.'],
  ['"Our customers are not online."', 'They are on WhatsApp right now. That is online.'],
  ['"A template is the same as custom."', 'Until you need it to do the one thing your business actually does.'],
  ['"More pages means better SEO."', 'Two hundred thin pages rank worse than ten good ones.'],
  ['"We need to be on every platform."', 'You need to be excellent on one. Pick where your buyers already are.'],
  ['"Dark mode is a feature."', 'It is a preference. Your broken checkout is a feature request.'],
  ['"Nobody scans QR codes."', 'Every restaurant menu in the country disagrees.'],
  ['"AI writes our content now."', 'And your readers can tell. Use it to think, not to speak.'],
  ['"We will launch when it is perfect."', 'You will launch when a competitor forces you to, and it still will not be perfect.'],
  ['"Analytics is spying on customers."', 'Knowing which page loses people is not surveillance. It is basic hygiene.'],
  ['"Our industry is different."', 'Your industry has a booking form, an invoice, and a customer who wants an answer. Same as everyone.'],
  ['"Cheap now, redo it later."', 'Later costs the original price plus the rebuild plus the lost year.'],
];

const BEHIND = [
  'Spent the morning cutting 4MB of unused fonts off a client site. Load time went from 5.1s to 1.3s. No redesign. Just deleting.',
  'Every MuleSoo build ships with the source code. You own it. If you fire us tomorrow, you keep everything.',
  'We test every page at 375px before we call it done. That is an iPhone SE. If it works there, it works.',
  'The chatbot on our own site is the same one we sell. We eat our own cooking.',
  'Today: rebuilt a business card because the fonts were never actually loading. Everything printed was in the wrong typeface and nobody noticed for months.',
  'Found a client site telling Google every page was a duplicate of the homepage. 219 pages invisible. One line of code.',
  'We do not use website builders. Next.js, Tailwind, Supabase. The same stack Vercel and Linear run.',
  'A client asked if we could make the site load faster. We removed the video background. Done.',
  'Half of what we do is talking people out of features they do not need.',
  'Our booking system sends the deposit invoice, the confirmation PDF, and the WhatsApp alert. Nobody touches a keyboard.',
  'Deleted 6MB of unused JavaScript from a client build today. The site did not lose a single feature.',
  'We keep a checklist of things that quietly break: contact forms, SSL renewals, sitemap submissions. Most agencies do not check any of them.',
  'A client wanted 14 pages. We shipped 5. Enquiries went up.',
  'Wrote the copy before the design today. It is always the right order and we always want to skip it.',
  'The QR codes we make track scans. So you know if the flyer worked, or if the flyer was a bin ornament.',
  'Reviewed our own site on a 3G connection this week. Humbling. Fixed three things.',
  'Nobody asks about the database schema. Everybody feels it when it is wrong.',
  'Two hours today spent on a single button. It is the button that takes the money.',
  'We write the refund terms before the invoice. Awkward conversations are cheaper up front.',
  'Every project starts with the same question: what is the one thing this must do?',
  'Turned off a client\'s auto-playing video. Bounce rate dropped by a third.',
  'Our own admin panel logs every action. If we break something, we can prove when and how.',
  'A "quick change" is never quick. An honest estimate is worth more than a fast yes.',
  'Shipped a fix at 6am so nobody would notice the downtime. Nobody noticed.',
  'The best compliment we get: "it just works." That took the whole month.',
];

const HUMAN = [
  'Reminder that "make it pop" is not a design brief, but we will figure out what you meant anyway.',
  'Client: "Can you make the logo bigger?" Us: "Yes." Client: "Bigger." Us: "...Yes."',
  'Nothing humbles you like opening your own website on someone else\'s cracked Android.',
  'The two hardest problems in tech: naming things, cache invalidation, and off-by-one errors.',
  'We measure success in fewer WhatsApp messages at 11pm. Yours, not ours.',
  'Building in Pretoria, shipping to the continent. Load shedding is just a deployment window.',
  '"I want it like Apple\'s site but with more stuff on it" is a sentence that contains its own contradiction.',
  'Every founder thinks their industry is different. Every industry has a booking form.',
  'You do not need a metaverse strategy. You need your contact form to work.',
  'Somewhere out there a business is losing a client right now because their email is @gmail.',
  'Our chatbot is more polite than we are before 8am. That is by design.',
  '"Just a small change" has never once, in recorded history, been a small change.',
  'The website is finished. The website is never finished. Both statements are true and we have made peace with it.',
  'Every logo revision request arrives at 11:47pm. We have stopped asking why.',
  'We named the company MuleSoo because it carries heavy things without complaining. Mostly.',
  'Coffee is a build dependency. It is in the docs.',
  '"Can you make it look more premium" — sir, that is a budget, not an adjective.',
  'Somebody somewhere is still using Comic Sans on an invoice, and honestly, respect.',
  'The client always knows what they do not want. Our job is to find out what they do.',
  'Testing on your own phone is not testing. It is optimism.',
  'A designer, a developer and a client walk into a meeting. The scope walks out.',
  'We do not do rush jobs. We do ordinary jobs, on time, which turns out to be rarer.',
  'Pretoria traffic is our staging environment for patience.',
  'If your password is your business name and the year, we need to talk before we talk about websites.',
  'Ninety percent of "the site is down" is the wifi. The other ten percent keeps us employed.',
];

/**
 * PROOF days are the only ones that convert cold audiences, and the only ones
 * this script cannot write for you. Each frame tells you exactly which piece of
 * evidence to go and fetch.
 */
const PROOF_FRAMES = [
  { hook: 'Before and after 👇', ask: 'the one number that changed — load time, bookings, no-shows, enquiries' },
  { hook: 'A client said this last week:', ask: 'a verbatim quote, with their name and business, used with permission' },
  { hook: 'What we shipped this month:', ask: 'the actual feature, and what it replaced' },
  { hook: 'The problem they came to us with:', ask: 'their words describing the pain, then what it looks like now' },
  { hook: 'Three weeks. Start to launch.', ask: 'the real timeline and what was delivered in it' },
  { hook: 'This used to take four hours a week.', ask: 'the manual task you automated, and the hours it now takes' },
  { hook: 'They almost did not call us.', ask: 'the objection they had, and what changed their mind' },
  { hook: 'Small change. Big number.', ask: 'the single fix and its measured effect' },
  { hook: 'Here is the whole build, honestly:', ask: 'what went well, what did not, what you would do differently' },
  { hook: 'Screenshot of the dashboard 👇', ask: 'a real (permitted) screenshot with sensitive data blurred' },
  { hook: 'Six months on, is it still working?', ask: 'a follow-up result from an older client — these are the most credible posts you will ever publish' },
  { hook: 'We turned down this brief.', ask: 'a project you declined and why — nothing builds trust faster' },
];

// ── Hashtags per platform ────────────────────────────────────────────────────
const TAGS = {
  core: ['#MuleSoo', '#Pretoria', '#SouthAfrica'],
  web: ['#WebDesign', '#WebDevelopment', '#NextJS'],
  ai: ['#AIAutomation', '#Chatbot', '#ArtificialIntelligence'],
  biz: ['#SmallBusiness', '#SmeSouthAfrica', '#Entrepreneur'],
  design: ['#LogoDesign', '#BrandIdentity', '#GraphicDesign'],
};
const tagPool = [...TAGS.core, ...TAGS.web, ...TAGS.ai, ...TAGS.biz, ...TAGS.design];

const pick = (arr, i) => arr[i % arr.length];

/** Which tag family fits the service being talked about that day. */
function topicTags(svc) {
  const p = svc.page;
  if (p.includes('logo')) return TAGS.design;
  if (p.includes('chatbot') || p.includes('automation') || p.includes('autopilot')) return TAGS.ai;
  if (p.includes('website') || p.includes('custom-apps')) return TAGS.web;
  return TAGS.biz;
}

/**
 * Tags follow the post's topic. Random tags — an AI post filed under
 * #GraphicDesign — read as automated and get suppressed by every algorithm.
 */
const tagsFor = (platform, seed, svc) => {
  if (platform.tags === 0) return '';
  const relevant = [...TAGS.core, ...topicTags(svc), ...TAGS.biz];
  const out = [];
  for (let k = 0; k < platform.tags && k < relevant.length; k++) {
    out.push(relevant[(seed + k) % relevant.length]);
  }
  return [...new Set(out)].join(' ');
};

// ── Post composition, per pillar per platform ────────────────────────────────
function compose(pillar, platform, i) {
  const svc = pick(SERVICES, i);
  const cta = pick([`${SITE}`, `DM us`, `${WA}`, `${SITE}${svc.page}`], i);

  switch (pillar.key) {
    case 'PROBLEM': {
      const [hook, body] = pick(PROBLEMS, i);
      if (platform.key === 'tiktok') return `${hook}.\n\n${body}\n\nFix it → ${SITE}`;
      if (platform.key === 'x') return `${hook}.\n\n${body}`;
      if (platform.key === 'linkedin')
        return `${hook}.\n\n${body}\n\nWe see this weekly with South African businesses. It is almost never a budget problem — it is a "nobody told me this was costing me money" problem.\n\nIf that sounded familiar: ${cta}`;
      return `${hook} 👀\n\n${body}\n\nWe fix exactly this. ${cta}`;
    }
    case 'EDUCATE': {
      const [hook, body] = pick(LESSONS, i);
      if (platform.key === 'tiktok') return `${hook}.\n\n${body}\n\nSave this one.`;
      if (platform.key === 'x') return `${hook}.\n\n${body}`;
      if (platform.key === 'linkedin')
        return `${hook}.\n\n${body}\n\nMost of our work is not clever. It is doing the obvious thing properly, and doing it first.\n\nWhat would you add?`;
      return `💡 ${hook}\n\n${body}\n\nSave this for later.`;
    }
    case 'PROOF': {
      // Deliberately a template. Fill with a REAL client result before posting.
      // Never invent a client, a number, or a quote — it is the fastest way to
      // lose a corporate deal, and in South Africa it is a Consumer Protection
      // Act problem, not just an ethical one.
      const frame = pick(PROOF_FRAMES, i);
      const line = `[REAL RESULT: ${frame.ask}]`;
      if (platform.key === 'x') return `${frame.hook}\n\n${line}`;
      if (platform.key === 'tiktok') return `${frame.hook}\n\n${line}\n\n${SITE}`;
      if (platform.key === 'linkedin')
        return `${frame.hook}\n\n${line}\n\nWhat we built: ${svc.name.toLowerCase()} — ${svc.outcome}.\n\nHappy to walk anyone through how it works. No pitch.`;
      return `${frame.hook}\n\n${line}\n\n${svc.name}: ${svc.outcome}.\n\n${cta}`;
    }
    case 'MYTH': {
      const [myth, truth] = pick(MYTHS, i);
      if (platform.key === 'tiktok') return `Myth: ${myth}\n\nTruth: ${truth}`;
      if (platform.key === 'x') return `${myth}\n\n${truth}`;
      if (platform.key === 'linkedin')
        return `A myth I hear constantly: ${myth}\n\n${truth}\n\nDisagree? Genuinely interested — the comments are open.`;
      return `❌ Myth: ${myth}\n\n✅ Truth: ${truth}`;
    }
    case 'BEHIND': {
      const b = pick(BEHIND, i);
      if (platform.key === 'x' || platform.key === 'tiktok') return b;
      if (platform.key === 'linkedin') return `${b}\n\nSmall things, compounded. That is the whole job.`;
      return `Behind the scenes 🛠️\n\n${b}`;
    }
    case 'PROMO': {
      if (platform.key === 'x') return `${svc.name} — ${svc.outcome}.\n${svc.price}.\n${SITE}${svc.page}`;
      if (platform.key === 'tiktok') return `${svc.name}, ${svc.price}.\n\n${svc.outcome}.\n\nLink in bio.`;
      if (platform.key === 'linkedin')
        return `${svc.name} — ${svc.price}.\n\nWhat you actually get: ${svc.outcome}.\n\nNo contracts, no setup fees. If it is not a fit we will say so on the call.\n\n${SITE}${svc.page}`;
      return `${svc.name} — ${svc.price} ✨\n\n${svc.outcome[0].toUpperCase()}${svc.outcome.slice(1)}.\n\n🔒 No contracts. No setup fees.\n${SITE}${svc.page}`;
    }
    case 'HUMAN': {
      const h = pick(HUMAN, i);
      if (platform.key === 'linkedin') return `${h}\n\n(It is Friday. Normal service resumes Monday.)`;
      return h;
    }
    default:
      return '';
  }
}

// ── Build the year ───────────────────────────────────────────────────────────
const iso = (d) => d.toISOString().slice(0, 10);
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const rows = [];
for (let day = 0; day < DAYS; day++) {
  const date = new Date(START.getTime() + day * 86400000);
  const pillar = PILLARS[day % PILLARS.length];
  for (const platform of PLATFORMS) {
    // Offsetting the seed per platform stops the five feeds saying the same
    // thing on the same morning.
    const seed = day + PLATFORMS.indexOf(platform) * 5;
    let text = compose(pillar, platform, seed);
    const tags = tagsFor(platform, seed, pick(SERVICES, seed));
    if (tags) text += `\n\n${tags}`;
    rows.push({
      date: iso(date),
      dow: DOW[date.getUTCDay()],
      day: day + 1,
      platform: platform.name,
      pillar: pillar.key,
      needsRealResult: pillar.key === 'PROOF' ? 'YES' : '',
      chars: text.length,
      overLimit: text.length > platform.maxLen ? 'OVER' : '',
      text,
    });
  }
}

// ── CSV (Buffer / Later / Sheets) ────────────────────────────────────────────
const csvCell = (v) => `"${String(v).replace(/"/g, '""')}"`;
const header = ['date', 'day_of_week', 'day_number', 'platform', 'pillar', 'needs_real_result', 'characters', 'over_limit', 'post_text'];
const csv = [header.join(',')]
  .concat(rows.map((r) => [r.date, r.dow, r.day, r.platform, r.pillar, r.needsRealResult, r.chars, r.overLimit, r.text].map(csvCell).join(',')))
  .join('\r\n');
fs.writeFileSync(path.join(OUT, 'MuleSoo-Social-Calendar-365.csv'), '﻿' + csv, 'utf8');

// ── Per-platform Markdown, easy to copy from on a phone ──────────────────────
for (const platform of PLATFORMS) {
  const mine = rows.filter((r) => r.platform === platform.name);
  const md = [
    `# MuleSoo — ${platform.name}: 365 days`,
    '',
    `Tone: ${platform.tone}. Soft limit ${platform.maxLen} characters.`,
    '',
    `**Days marked \`PROOF\` are templates.** Replace the bracketed line with a real client result before posting. Do not invent one.`,
    '',
    '---',
    '',
  ];
  for (const r of mine) {
    md.push(`### Day ${r.day} — ${r.date} (${r.dow}) · ${r.pillar}${r.overLimit ? ` · ⚠️ ${r.chars} chars, over limit` : ''}`);
    md.push('');
    md.push('```');
    md.push(r.text);
    md.push('```');
    md.push('');
  }
  fs.writeFileSync(path.join(OUT, `${platform.name}-365.md`), md.join('\n'), 'utf8');
}

// ── Report ───────────────────────────────────────────────────────────────────
const over = rows.filter((r) => r.overLimit).length;
const proof = rows.filter((r) => r.needsRealResult).length;
console.log(`posts:            ${rows.length}  (${DAYS} days × ${PLATFORMS.length} platforms)`);
console.log(`over char limit:  ${over}`);
console.log(`need real proof:  ${proof}  <- fill these in before posting`);
for (const p of PLATFORMS) {
  const mine = rows.filter((r) => r.platform === p.name);
  const uniq = new Set(mine.map((r) => r.text)).size;
  console.log(`  ${p.name.padEnd(10)} ${mine.length} posts, ${uniq} unique (${Math.round((uniq / mine.length) * 100)}%)`);
}
console.log(`\nWritten to marketing/Social-Calendar/`);
