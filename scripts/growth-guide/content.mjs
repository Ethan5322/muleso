// The MuleSoo Growth Playbook — content model.
// Shorthand block builders keep the source readable.
const part = (title, subtitle) => ({ type: 'part', title, subtitle });
const chapter = (title, intro) => ({ type: 'chapter', title, intro });
const h2 = (text) => ({ type: 'h2', text });
const h3 = (text) => ({ type: 'h3', text });
const p = (text) => ({ type: 'p', text });
const ul = (...items) => ({ type: 'ul', items });
const ol = (...items) => ({ type: 'ol', items });
const call = (title, text) => ({ type: 'callout', title, text });
const quote = (text) => ({ type: 'quote', text });

export default [
  // ===================================================================
  part('The Mindset & The Market', 'Why most agencies stay invisible — and how you will not.'),

  chapter('The Brutal Truth About "Everyone Is a Builder"',
    'You are right: today anyone can spin up a website. That is exactly why you can win — because the market is flooded with builders and starved of trusted partners.'),
  p('There has never been more competition in web design, chatbots, and “digital services.” Templates, AI site builders, and R500 Fiverr gigs are everywhere. Most new agencies look at this and panic. They should not. Abundance of supply at the bottom creates scarcity of trust at the top.'),
  p('Clients are not actually buying “a website.” They are buying an outcome they cannot produce themselves: more bookings, more credibility, less stress, a business that looks serious. The person who can credibly promise and deliver that outcome — and be trusted with real money — is rare. That person is not the cheapest builder. It is the clearest, most trusted specialist.'),
  h2('The three markets you can compete in'),
  ol(
    'The Cheap market — race to the bottom on price. Fiverr, template resellers. You never want to live here; it attracts the worst clients and destroys your margins.',
    'The Commodity market — “I build websites.” Undifferentiated, competing on features. Most agencies die here, invisible.',
    'The Trusted-Specialist market — “I help [specific business] get [specific result] using [specific method].” Fewer competitors, higher prices, clients who refer.'
  ),
  p('This entire playbook is about moving MuleSoo permanently into the third market and never leaving it.'),
  call('Your unfair advantages', 'You already have three things most Pretoria builders do not: (1) genuine world-class craft — your portfolio proves it; (2) an existing trusted network through Habesha Celebration Events; (3) speed via AI tooling. Most of this guide is about weaponising these three.'),
  quote('People do not buy the best product. They buy the product they understand and trust the most.'),

  chapter('Who You Actually Are (And Why It Sells)',
    'Before tactics, get your identity right. Confused positioning is the number-one reason good builders stay broke.'),
  p('MuleSoo is not “a web design company.” That is a category, not a position. Your identity is the intersection of what you are excellent at, what a specific market desperately needs, and what almost no competitor can honestly claim.'),
  h2('The MuleSoo identity statement'),
  p('Fill this in and use it everywhere — website, bio, proposals, DMs:'),
  call('Positioning formula', 'MuleSoo helps [specific type of business] in [place] win more [specific outcome] with [premium websites / AI chatbots / digital systems] — built to a world-class standard, fast, and by someone who understands both the culture and the code.'),
  p('Example you can use today: “MuleSoo builds premium websites and AI booking assistants for events businesses, restaurants, and professional practices across South Africa — the kind of digital presence that makes a small business look like a market leader.”'),
  h2('Why “culture AND code” is your moat'),
  p('You understand the Ethiopian and broader African business community from the inside through Habesha Events. That is not a soft detail — it is trust that foreign template-sellers and generic agencies can never manufacture. A Habesha wedding planner, an Ethiopian restaurant, a diaspora entrepreneur will choose the builder who gets them. Lead with that where it applies, and lead with pure craft everywhere else.'),

  chapter('Choosing Your Niche Without Losing Opportunities',
    'Niching feels like saying no to money. Done right, it is how you finally start making it.'),
  p('A niche does not mean you refuse other work. It means you become famous for one thing so referrals and marketing compound. You can always take the restaurant job that comes your way — but your marketing should hammer one or two niches until you own them.'),
  h2('How to pick MuleSoo’s beachhead niche'),
  ol(
    'Access — where do you already have warm relationships? (Events businesses, Ethiopian/diaspora SMEs, restaurants, faith organisations.)',
    'Pain — who is visibly losing money from a bad or missing website / no booking system?',
    'Budget — who can pay R5,000–R15,000 and see it as an investment, not a cost?',
    'Repeatability — if you nail one, are there 500 more just like it you can reach?'
  ),
  p('Strong beachhead candidates for MuleSoo: (a) events & wedding businesses, (b) restaurants and food businesses needing bookings/menus/ordering, (c) professional practices (law, medical, accounting) needing credibility + intake chatbots. Start with one for your marketing, stay open for the rest.'),
  call('The 100-business list', 'Before any marketing, build a spreadsheet of 100 real businesses in your chosen niche within reach (Pretoria, Gauteng, diaspora networks). Name, owner, current website (or none), Instagram, phone/WhatsApp, one specific problem you noticed. This list is the fuel for everything in Part 4.'),

  // ===================================================================
  part('The Irresistible Offer', 'What you sell, how you package it, and what you charge.'),

  chapter('Productize: Stop Selling Hours, Start Selling Outcomes',
    'Custom-everything is slow to sell and hard to scale. Productized offers close faster and command trust.'),
  p('A productized service is a clearly named package with a fixed scope, a fixed (or banded) price, and a promised outcome and timeline. It removes the buyer’s biggest fear — uncertainty — and lets you market one thing repeatedly.'),
  h2('Turn your services into named products'),
  ul(
    'The Launch Site — a 3–5 page premium website, live in 2 weeks, from R3,500. For businesses that need to exist online credibly, now.',
    'The Growth Site — 6+ pages, advanced animation, SEO, an AI chatbot included, in 3 weeks, from R7,500. For businesses that want to actively win clients online.',
    'The Market-Leader System — unlimited pages, 3D, e-commerce/booking, monthly care, from R15,000. For businesses that intend to dominate their category.',
    'Soo Assistant — a trained AI chatbot that answers, qualifies, and books 24/7, from R2,500. Sold standalone or bolted onto any site.',
    'The Credibility Kit — logo + brand basics + QR + professional email, from R2,000. A fast “yes” that opens the door to bigger work.'
  ),
  h2('The value ladder'),
  p('Design offers so a client can enter cheaply and climb. A QR code or logo client becomes a website client becomes a care-plan client becomes a referral source. Always know what the next step up is and mention it.'),
  call('Name everything', 'Named offers feel real and premium. “The Growth Site” outsells “a 6-page website” every time — even at a higher price. Put these names on your services page, your proposals, and your social content.'),

  chapter('Pricing With Confidence (and Psychology)',
    'You are not expensive. You are precise. Here is how to price so clients feel smart saying yes.'),
  p('Under-pricing signals low quality and attracts the worst clients. Your job is not to be cheap; it is to be clearly worth it. Use these levers:'),
  h3('Anchor high, then offer the middle'),
  p('Always present three tiers. The top tier makes the middle look reasonable; the middle is what you actually want most clients to choose. Most buyers pick the middle — so load your best margin and best-fit scope there.'),
  h3('Charge for the outcome, not the pixels'),
  p('A booking website that brings a restaurant 20 extra covers a week is worth vastly more than “5 pages.” In your pitch, translate the work into money: “If this brings you two extra bookings a month, it pays for itself in the first month and every month after.”'),
  h3('Price in ranges publicly, exact in proposals'),
  p('“From R7,500” filters out tyre-kickers without scaring serious buyers. Give the exact number in a proposal after a short discovery, once you understand their situation.'),
  h2('Payment terms that protect you'),
  ul(
    'Take 50% deposit before any work starts — non-negotiable. It commits the client and funds your time.',
    'Offer a payment plan (e.g. 3 instalments) for larger jobs — this closes clients who want it but fear one big number.',
    'Accept EFT, card (Stripe), and a local option like PayFast — friction in payment kills deals.',
    'For recurring care plans, use debit order / recurring card so revenue is predictable.'
  ),
  call('The care plan is your freedom', 'A monthly care plan (hosting, updates, backups, small changes, priority support) at R450–R1,500/month per client is the single most important thing you can sell. Ten care plans is a baseline income before you sell a single new site. Attach one to every project by default.'),

  chapter('Guarantees and Risk Reversal',
    'The client is scared of wasting money. Take that fear off the table and watch close rates climb.'),
  p('You do not need to promise the impossible. You need to make saying “yes” feel safe. Options, from softest to boldest:'),
  ul(
    'Milestone guarantee: “You approve the design before we build a single page.”',
    'Timeline guarantee: “Live in 3 weeks or your next month of care is free.”',
    'Satisfaction guarantee: “30 days of free fixes after launch — if it’s broken, we fix it, no charge.”',
    'Deposit-back trial: “If you don’t love the first design concept, get your deposit back, minus a small design fee.”'
  ),
  p('Pick one you can honestly honour and state it plainly. Certainty sells.'),

  // ===================================================================
  part('Proof: Turn Craft Into Trust', 'Your portfolio and reputation are your best salespeople.'),

  chapter('Your Portfolio Is a Weapon — Load It Properly',
    'You already build beautifully. Now make every project sell the next one.'),
  p('A gallery of pretty screenshots is nice. A portfolio of outcomes is a sales machine. For each project, tell a three-part story: the Problem, what you Did, the Result.'),
  h2('The case-study formula'),
  ol(
    'The client and their problem — “A Pretoria events business had no online booking and lost enquiries to WhatsApp chaos.”',
    'What you built — “A premium site with an AI assistant that captures every enquiry and books consultations automatically.”',
    'The result — “Enquiries now captured 24/7; the owner saves ~5 hours a week and looks like the most professional planner in the city.”',
    'A visual — before/after, or a clean device mockup.',
    'A one-line client quote — even a WhatsApp message screenshot builds trust.'
  ),
  p('You already have real projects — MuleSoo, YoYo Gym, X-Boss Photography, Tsedi Catering, Shime Events, Habesha. Write a proper case study for each with a “Visit the live site” link. Live proof beats any claim.'),
  call('Get results even when you don’t have numbers yet', 'No hard numbers on an early project? Use qualitative proof: “The owner said it’s the first time their business looked as good online as it does in person.” Screenshots of happy client messages are gold. Ask for them every single time.'),

  chapter('Testimonials, Reviews, and Social Proof',
    'People trust other people far more than they trust you. Engineer that trust on purpose.'),
  p('Proof is not luck — it is a system. Build these habits into every project:'),
  ul(
    'At launch, while the client is thrilled, ask: “Would you record a 20-second voice note or video saying what it was like working with me?” Voice/video converts far better than text.',
    'Give them the words: send 2–3 sample sentences they can approve or tweak, so it is effortless.',
    'Collect Google reviews on your Google Business Profile — these also boost local search.',
    'Screenshot positive WhatsApp/Instagram messages (with permission) and post them.',
    'Turn every testimonial into a social post, a website block, and a proposal slide.'
  ),
  quote('One specific, believable testimonial from a real local business outperforms ten generic five-star ratings.'),

  chapter('Build a Personal Brand as “The Builder”',
    'In a market of faceless agencies, a trusted face wins. People hire Ethan, not just MuleSoo.'),
  p('Your personal story — an engineer and entrepreneur building world-class tech for African businesses — is magnetic and impossible to copy. Show the human. Founders who post get clients; anonymous logos get ignored.'),
  ul(
    'Show your face and your work regularly. Behind-the-scenes of a build. A tip you learned. A project reveal.',
    'Teach what you know. Every time you explain how something works, you prove expertise and attract buyers.',
    'Be consistent, not perfect. Frequency and authenticity beat polish on social media.'
  ),

  // ===================================================================
  part('Getting Clients: The Lead Machine', 'Seven channels that reliably fill your pipeline.'),

  chapter('The Seven Channels (and Where to Start)',
    'You do not need all seven at once. Master one warm channel and one content channel first.'),
  p('Every client comes from one of these. Rank them by speed-to-cash for a new agency:'),
  ol(
    'Warm network & referrals — fastest, free, highest trust. Start HERE.',
    'Direct outreach (WhatsApp / DM / email) — fast, controllable, scalable with effort.',
    'Local SEO & Google Business Profile — compounding, brings inbound “ready to buy” leads.',
    'Organic social content — builds authority and inbound over months.',
    'Partnerships & referral deals — other businesses feed you clients.',
    'Community & events — local presence, diaspora networks, markets, expos.',
    'Paid ads — fastest to scale once your offer and proof convert, but costs money.'
  ),
  call('The 90-day focus', 'For your first 90 days: (1) mine your warm network, (2) run daily direct outreach from your 100-business list, (3) set up and optimise your Google Business Profile, (4) post 3–4 times a week. Ignore paid ads until you have closed a few clients and know your offer converts.'),

  chapter('Warm Network & Referrals — Your First Clients Live Here',
    'You are not starting from zero. You have Habesha, family, community, and every business you already know.'),
  p('Your first 3–5 paying clients almost certainly already know you or are one introduction away. Work this deliberately:'),
  h2('The network activation message'),
  call('Send to people who know you', 'Hi [name] — quick update: I’ve launched MuleSoo, where I build premium websites and AI booking assistants for businesses here in SA. I’m taking on a few new clients this month. Do you know any business — a restaurant, events company, salon, practice — that looks average online but shouldn’t? A quick intro would mean a lot, and there’s a thank-you from me for any that turns into a project.'),
  h2('The referral engine'),
  ul(
    'Offer a referral reward: R500 cash or credit for any introduction that becomes a paid project. Make it public.',
    'Ask at the peak moment — right after a client says they love the work.',
    'Make referring easy: give clients a one-line message they can forward, plus your link.',
    'Leverage Habesha: every events client needs a website, a logo, a booking bot. You are already in the room.'
  ),

  chapter('Direct Outreach That Doesn’t Feel Like Spam',
    'Cold outreach fails when it’s about you. It works when it’s a specific, useful observation about them.'),
  p('The secret to outreach is personalisation and value. Never send “I build websites, do you need one?” Instead, notice a real problem and lead with help.'),
  h2('The 3-step outreach method'),
  ol(
    'Find — pull 10 businesses a day from your list with weak or no website / no booking system.',
    'Personalise — spend 60 seconds finding ONE specific thing you’d improve for each.',
    'Offer value first — send a short message that gives before it asks.'
  ),
  h3('WhatsApp / DM script (soft, high-response)'),
  call('Outreach message', 'Hi [name], I came across [business] — love what you do with [specific detail]. I build premium websites and AI booking assistants for SA businesses and I noticed [specific issue: your site isn’t mobile-friendly / there’s no easy way to book online / there’s no site yet]. I actually put together a quick idea of how it could look — want me to send it over? No cost, no pressure.'),
  h3('The “free mockup” power move'),
  p('For a high-value target, build a quick homepage concept before they ask. Send a screenshot. Nothing converts like showing someone their own business, transformed. Even a 30-minute mockup can close a R7,500 job.'),
  h3('Email script (for practices / corporates)'),
  call('Cold email', 'Subject: a quick idea for [business]\n\nHi [name], I help professional practices in Gauteng look as credible online as they are in person. I had a look at [business] and spotted three quick wins that would help you win more clients from Google. I’m happy to send a short 2-minute video walking through them — would that be useful? — Ethan, MuleSoo'),
  call('Outreach math', 'Direct outreach is a numbers game with skill on top. A reasonable early benchmark: 10 quality, personalised messages a day = ~200 a month. At a modest 3–5% conversion to a call, that’s 6–10 calls a month; close a third and you have 2–3 new clients monthly from outreach alone.'),

  chapter('Get Found: Local SEO & Google Business Profile',
    'When a Pretoria business owner googles “web designer near me,” you want to be the first trusted result.'),
  p('Local search brings buyers who are already looking. It compounds — set it up once and it pays for years.'),
  h2('Google Business Profile (do this first, it’s free)'),
  ol(
    'Create/claim your Google Business Profile as “MuleSoo Digital Services,” category Website Designer / Marketing Agency.',
    'Add area served (Pretoria, Gauteng, South Africa), hours, WhatsApp, and a strong description with your keywords.',
    'Post your projects as updates regularly — Google rewards active profiles.',
    'Collect reviews relentlessly — every happy client, every time. Reviews are the #1 local ranking factor you control.'
  ),
  h2('Website SEO basics that actually move the needle'),
  ul(
    'Target real search phrases: “web design Pretoria,” “website designer South Africa,” “AI chatbot for business South Africa,” “restaurant website designer.”',
    'One clear page per service and per location you serve, each with the phrase in the title, headings, and copy.',
    'Fast, mobile-first pages (you already build these) — speed is a ranking factor and a conversion factor.',
    'Get listed in SA directories and relevant communities; earn a few quality backlinks.',
    'Publish helpful articles (“How much should a website cost in South Africa?”) that answer what buyers google.'
  ),
  call('The buyer-intent article', 'Write one honest article: “What a professional website actually costs in South Africa (2025).” Buyers search this constantly. Rank for it and you catch people at the exact moment they’re ready to spend.'),

  chapter('Partnerships & Referral Deals',
    'Other businesses already have your future clients. Turn them into a sales force.'),
  p('Find businesses that serve the same clients but don’t compete with you, and build simple referral relationships.'),
  ul(
    'Photographers, videographers, event planners, printers, marketing freelancers, accountants, business consultants — they all meet businesses that need websites.',
    'Offer a clean deal: “Send me clients; I pay you 10% of any project, or we cross-refer.”',
    'Make partners look good — deliver brilliantly for anyone they send, so referring you feels safe.',
    'White-label: offer to be the “web/AI department” for a marketing agency or designer who doesn’t build.'
  ),

  // ===================================================================
  part('Social Media Mastery', 'Turn attention into trust into clients — platform by platform.'),

  chapter('The Content System (Before Any Platform)',
    'Random posting fails. A simple repeatable system wins. Here is the whole engine on one page.'),
  p('You do not need to be everywhere or go viral. You need consistent, valuable content aimed at your buyers, on 1–2 platforms you can sustain.'),
  h2('Your four content pillars'),
  ol(
    'Proof — project reveals, before/after, case studies, testimonials. (Builds trust and desire.)',
    'Educate — tips, “how a good website makes you money,” common mistakes. (Proves expertise.)',
    'Personal — you, your story, behind-the-scenes of a build, your “why.” (Builds connection.)',
    'Offer — clear calls to work with you, packages, availability, results. (Converts.)'
  ),
  p('Rough mix: 40% proof, 30% educate, 20% personal, 10% direct offer. Most builders only ever post offers and wonder why nobody engages.'),
  h2('The hook rule'),
  p('The first line/three seconds decide everything. Lead with the result or the tension: “This R7,500 website tripled a restaurant’s weekend bookings.” “Your website is losing you customers every day — here’s why.”'),
  call('Batch to stay consistent', 'Once a week, film 5–8 short clips and draft 5–8 posts in one sitting. Consistency is the entire game, and batching is how busy founders stay consistent.'),

  chapter('Instagram & Facebook (Your Core in SA)',
    'For local SMEs in South Africa, Instagram and Facebook are where your buyers already are — especially via Reels.'),
  h2('What to post'),
  ul(
    'Reels of project reveals (screen-record scrolling a site you built, with music and captions) — highest reach.',
    'Before/after carousels — old vs new site side by side.',
    'Short tips as Reels or carousels — “3 things every restaurant website needs.”',
    'Stories daily — behind-the-scenes, polls, “DM me for a free mockup,” client wins.',
    'Testimonial screenshots and voice notes.'
  ),
  h2('Growth tactics'),
  ul(
    'Post Reels 3–5x/week; Stories daily. Reels are your reach engine.',
    'Use local + niche hashtags (#PretoriaBusiness #SouthAfricaWebDesign #EventsSA) and geotags.',
    'Reply to every comment and DM fast — the algorithm and buyers both reward responsiveness.',
    'Engage with your target clients’ posts daily so they notice you before you pitch.',
    'Put a clear CTA and WhatsApp link in your bio.'
  ),
  h2('Facebook specifics'),
  ul(
    'Join local SA business groups, events groups, and diaspora community groups; be helpful, not spammy.',
    'A Facebook Business Page adds credibility and enables reviews and (later) ads.',
    'Facebook Marketplace and community groups can surface businesses that need work.'
  ),

  chapter('LinkedIn (For Corporate & Professional Clients)',
    'If you want law firms, medical practices, accountants, and corporates, LinkedIn is where they take you seriously.'),
  ul(
    'Optimise your profile as a specialist: headline “I build premium websites & AI assistants for [niche] in South Africa.”',
    'Post 2–3x/week: results, professional insights, case studies framed around business outcomes.',
    'Connect with local business owners and decision-makers; send a warm, non-salesy note referencing their business.',
    'Comment thoughtfully on prospects’ posts for weeks before you ever pitch — familiarity closes.',
  ),

  chapter('TikTok, YouTube & X (Reach and Authority)',
    'Optional but powerful multipliers once your core is running.'),
  h3('TikTok'),
  p('Massive organic reach in SA. Repurpose your Instagram Reels. Fast build clips, “I redesigned this ugly website in 60 seconds,” and blunt tips do well. Great for brand awareness and reaching younger business owners.'),
  h3('YouTube'),
  p('Long-form builds deep authority and never stops working. A channel showing how you build sites and use AI positions you as the expert and can itself become a lead source (and ties to your PDF products). Even one strong video a month compounds.'),
  h3('X (Twitter)'),
  p('Best for connecting with the tech/founder community, sharing builds, and networking. Lower priority for local SME clients, higher for reputation among builders and potential partners.'),

  chapter('WhatsApp Business — The SA Closing Machine',
    'In South Africa, deals happen on WhatsApp. Treat it as a core sales channel, not an afterthought.'),
  ul(
    'Use WhatsApp Business with a professional profile, catalogue of your packages, and quick replies.',
    'Set a greeting and away message so no lead is ever ignored.',
    'Use Broadcast lists (not spam) to share new work and offers with people who opted in.',
    'Your own “Soo Assistant” chatbot can qualify and book leads 24/7 — demo it live; it sells itself.',
    'Reply fast. In SA, the first business to reply on WhatsApp usually wins the job.'
  ),
  call('A 30-day content calendar (repeatable)', 'Week 1: Mon project reveal · Wed tip Reel · Fri testimonial · daily Stories. Week 2: Mon before/after · Wed “why your site loses customers” · Fri behind-the-scenes · offer post Sunday. Week 3: Mon case study · Wed AI chatbot demo · Fri client win. Week 4: Mon myth-buster · Wed mini-tutorial · Fri availability/offer. Repeat, swapping topics.'),

  // ===================================================================
  part('Sales: Turning Conversations Into Cash', 'From first reply to signed deposit.'),

  chapter('The Discovery Call',
    'You do not sell on price. You sell by understanding the client better than anyone else has.'),
  p('When a lead responds, move to a short call or voice chat. Your goal is not to pitch — it is to diagnose. The person who asks the best questions wins.'),
  h2('Questions that sell for you'),
  ol(
    'Tell me about your business — how do clients find you now?',
    'What happens when someone wants to book / buy / enquire today?',
    'What do you want your business to look like a year from now?',
    'What has stopped you from sorting out your website/system before now?',
    'If we got this right, what would that be worth to you?'
  ),
  p('Listen more than you talk. Then reflect their goal back and connect your package to it: “So the real goal is capturing every enquiry without you glued to your phone — that’s exactly what The Growth Site with Soo Assistant does.”'),

  chapter('Proposals That Close',
    'A great proposal restates their problem, shows the outcome, and makes the next step obvious.'),
  p('Keep it short and outcome-focused. Structure:'),
  ol(
    'Their goal, in their words (proves you listened).',
    'The recommended package and exactly what’s included.',
    'The outcome and timeline.',
    'Proof — one relevant case study/testimonial.',
    'Investment — three tiers, with the recommended one highlighted.',
    'The guarantee.',
    'One clear next step: “Reply YES and pay the 50% deposit to start; we go live in 3 weeks.”'
  ),
  call('Send it fast, follow up faster', 'Send the proposal within 24 hours while excitement is high. Then follow up — most sales are lost to silence, not to “no.” A simple “Hi [name], did you get a chance to look? Happy to tweak anything” recovers a huge share of deals.'),

  chapter('Handling Objections Without Discounting',
    'Objections are requests for reassurance, not rejections. Answer the fear, keep the price.'),
  h3('“It’s too expensive.”'),
  p('“I understand — it’s a real investment. Let’s look at what it returns: if it brings even two extra clients a month, it pays for itself and then profits every month after. We can also split it into instalments so it’s easier on cash flow — would that help?”'),
  h3('“I can get it cheaper / my cousin can do it.”'),
  p('“Absolutely, there’s always cheaper. The question is what it costs you when a cheap site loses customers, breaks, or never gets finished. You’re paying me to get it right, fast, and to stand behind it. That’s the difference.”'),
  h3('“Let me think about it.”'),
  p('“Of course. Usually when people say that, there’s one specific thing they’re unsure about — is it the price, the timing, or whether it’ll actually work for you? Let’s sort that out now.”'),
  h3('“Can you do it for free / for exposure?”'),
  p('Politely decline. “I appreciate that, but I build businesses that pay, and I put the same world-class work into every project. I can offer a payment plan, but not free work.” Protect your value from day one.'),

  chapter('Follow-Up: The Money Is in the Reminders',
    'Most builders send one message and give up. Fortunes are made in the follow-up.'),
  ul(
    'Day 1: send proposal. Day 2: “Did it land ok?” Day 4: add value (a relevant example). Day 7: “Still keen? I’m booking [month] now.” Day 14: “Closing my calendar for the month — want your spot?”',
    'Always give a reason to act now: limited monthly slots, a start-date, a bonus for deciding this week.',
    'Keep a simple pipeline (your Tasks board works perfectly) — never let a warm lead go cold from neglect.'
  ),

  // ===================================================================
  part('Deliver, Retain, and Multiply', 'Happy clients are your cheapest marketing.'),

  chapter('Onboarding & Delivery That Wows',
    'The experience of working with you should feel as premium as the work itself.'),
  ul(
    'Send a simple, professional onboarding: a welcome message, a short brief form, and clear next steps and dates.',
    'Communicate proactively — a quick update even when there’s nothing new prevents anxiety and builds trust.',
    'Show the design before building; get approval; avoid endless revisions with a clear “2 rounds included” scope.',
    'Deliver a little more than promised — a small surprise (an extra section, a quick how-to video) creates raving fans.',
    'Launch like an event — celebrate it with the client and turn it into content.'
  ),

  chapter('Retention & Recurring Revenue',
    'A client you keep is worth ten you chase. Build income that recurs.'),
  ul(
    'Attach a care plan to every project by default (hosting, updates, backups, small edits, priority support).',
    'Schedule a check-in a month after launch — catch issues, gather a testimonial, spot upsells.',
    'Offer ongoing services: SEO, content, new features, seasonal campaigns, more chatbots.',
    'Track renewal and upsell as deliberate tasks, not afterthoughts.'
  ),
  quote('It is far cheaper to keep and grow a client than to find a new one. Your existing clients are your best growth channel.'),

  chapter('The Referral & Review Loop',
    'Engineer a system where every happy client produces the next one.'),
  ol(
    'Deliver an outcome the client is proud of.',
    'Ask for a testimonial and a Google review at the peak moment.',
    'Ask for one introduction to someone who could use the same result.',
    'Reward referrals visibly (cash or credit).',
    'Turn the whole story into content that attracts strangers.'
  ),

  // ===================================================================
  part('Scaling & Staying Powerful', 'From solo builder to a business that runs.'),

  chapter('Systems, SOPs, and Your Corporate Admin',
    'You already built the internal system to run a real agency — now use it to scale.'),
  p('MuleSoo’s corporate admin (departments, tasks, reports, ID cards, chat) is not just a demo — it is how you run and eventually staff the business. Use it to track every lead, project, and client task; to onboard sub-admins/contractors; and to prove, with reports, that work is getting done.'),
  ul(
    'Document how you do each service as a simple checklist (SOP) so it can be repeated and delegated.',
    'Use the Tasks board as your single source of truth for every client project.',
    'When demand exceeds your hours, bring in a contractor for one repeatable part (e.g. content, QA) before hiring.',
    'Measure department reports/completion so quality holds as you grow.'
  ),

  chapter('Paid Ads — Only When You’re Ready',
    'Ads pour fuel on a fire. Light the fire first with a proven offer and real proof.'),
  p('Do not run ads until you have closed several clients organically and know your offer converts. Then use ads to scale what already works.'),
  ul(
    'Start with Meta (Instagram/Facebook) retargeting and a simple lead campaign to a strong offer (“free website mockup / free consult”).',
    'Use Google Search ads for high-intent terms (“web designer Pretoria”) — expensive but buyer-ready.',
    'Send ad traffic to a single focused landing page with proof and one clear action.',
    'Start small (R50–R150/day), measure cost per lead and per client, and only scale what profits.'
  ),

  chapter('Money, Metrics & Targets',
    'What gets measured gets managed. Know your numbers and set clear targets.'),
  h2('The few numbers that matter'),
  ul(
    'Leads per week (from all channels).',
    'Calls/consults booked, and your close rate.',
    'Average project value and monthly recurring revenue (care plans).',
    'Revenue vs a simple monthly target.'
  ),
  h2('An example first-year path'),
  ol(
    'Months 1–3: land your first 3–5 clients from warm network + outreach; nail delivery; collect proof.',
    'Months 4–6: lean into the niche you’re winning; add care plans; get referrals compounding.',
    'Months 7–9: turn on content + local SEO inbound; raise prices as your proof grows.',
    'Months 10–12: add paid ads or a contractor to scale; aim for predictable monthly recurring revenue that covers your baseline.'
  ),
  call('Raise your prices on schedule', 'Every few clients, raise your prices. As your portfolio and proof grow, so should your rates. The builders who stay cheap stay stuck; the ones who periodically raise prices — and keep delivering — build wealth.'),

  chapter('The First 30 Days: Your Action Plan',
    'Stop reading, start doing. Here is exactly what to do next.'),
  ol(
    'Write your positioning statement and update your website bio, Instagram bio, and WhatsApp Business profile with it.',
    'Turn your services into named packages with clear prices and a care-plan add-on.',
    'Write proper case studies (Problem / Did / Result + live link) for your existing projects.',
    'Build your list of 100 target businesses.',
    'Send the network activation message to 20 people who know you.',
    'Start daily outreach: 10 personalised messages a day, value-first, with a free-mockup offer for the best targets.',
    'Set up and optimise your Google Business Profile and ask your first clients for reviews.',
    'Batch a week of content around the four pillars and post 3–4x this week.',
    'Set up your Tasks pipeline so no lead is ever dropped.',
    'Book and run your first discovery call using the questions in this guide — and ask for the deposit.'
  ),
  quote('You already build world-class work. This playbook is simply the bridge between what you can build and the clients who will pay you well to build it. Now go win.'),
];
