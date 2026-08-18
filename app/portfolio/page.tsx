'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Gauge, TrendingUp, ExternalLink, Globe } from 'lucide-react';
import PageHero from '@/components/PageHero';
import PortfolioCover from '@/components/PortfolioCover';
import { supabase } from '@/lib/supabase';

type ThemeKey = 'blue' | 'gold' | 'green' | 'dark' | 'purple' | 'rose';

interface Project {
  name: string;
  category: string;
  client: string;
  description: string;
  image: string | null;
  result: string;
  tech: string[];
  link?: string;
  site?: string; // public live site (portfolio proof)
  theme?: ThemeKey;
  fit?: 'cover' | 'contain';
  purpose?: string;
  capabilities?: string[];
  adminTracking?: string[];
  boosts?: string[];
  upcoming?: boolean;
  /** This project's own real flow, in its own words. Falls back to the
   *  generic BOOKING_STEPS (a chatbot: QR → chat → deposit → confirmation)
   *  only for projects actually built on that architecture — MuleSoo, YoYo
   *  Gym, X-Boss, Shime, Tsedi, TSI. Everything else — a content site, a
   *  card-payment device, a clinic, a fundraising platform — has its own
   *  mechanism and needs its own steps; the generic flow was previously
   *  shown unconditionally for every project regardless of fit. */
  howItWorks?: { title: string; text: string }[];
  /** Heading above howItWorks. Only meaningful when howItWorks is set — the
   *  generic path's own heading ("How your customers book") doesn't fit a
   *  church site with no customers or a fundraiser with no booking. */
  howItWorksTitle?: string;
}

const fallbackProjects: Project[] = [
  {
    name: 'MuleSoo Digital Services',
    category: 'Flagship Platform',
    client: 'Our Own Agency Platform',
    description: 'The all-in-one platform that captures leads, books clients with AI, sells products, and runs the entire business from one secure admin panel — you’re looking at it right now.',
    image: 'mulesoo-website.jpg',
    result: 'You are looking at it',
    tech: ['Next.js', 'Supabase', 'Stripe', 'AI'],
    theme: 'blue',
    site: 'https://mulesoo.com',
    purpose:
      'This very website is our proof of work: a premium, animated platform with a real business engine behind it. An AI assistant books clients and generates a professional PDF agreement, an online store takes card payments, and a complete admin panel lets us run everything — leads, bookings, content, services, testimonials and payments — from one place, secured with a password, email 2FA, and even face-recognition login.',
    capabilities: [
      'AI booking chatbot that guides clients end-to-end and generates a branded PDF agreement with a QR code',
      'Instant lead capture with email + WhatsApp notifications on every enquiry',
      'Online store with secure Stripe checkout for digital products',
      'Editable everything — portfolio, services & pricing, testimonials, homepage — with no code',
      'Premium animated design, mobile-first and SEO-ready',
      'Face-recognition admin login via QR + phone camera (plus password & email 2FA)',
      'Installable as a private admin app (PWA)',
    ],
    adminTracking: [
      'Live dashboard — leads, bookings, conversion, visitors & QR scans',
      'Leads inbox with a New / Contacted / Won / Lost pipeline + email/WhatsApp actions',
      'Bookings management with status, notes & CSV export',
      'Visitor and QR-scan analytics',
      'Edit portfolio, services/pricing, testimonials, pages & business info live',
      'Change password (securely hashed), activity/audit log, role-based access',
    ],
    boosts: [
      'Turns visitors into booked, paying clients 24/7 — even while you sleep',
      'Positions the brand as premium and trustworthy from the first scroll',
      'Automates enquiries, bookings and admin — hours saved every week',
      'One secure command center for the whole business',
    ],
  },
  {
    name: 'YoYo Gym — AI Membership Platform',
    category: 'Gym Platform',
    client: 'Premium Fitness Brand',
    description: 'A complete AI-powered gym platform: members join by scanning a QR and chatting to an assistant, pay online, and check in by face — while it automatically bills, fills classes, and wins back lapsing members.',
    image: 'yoyo-gym.jpg',
    result: 'Runs the gym on autopilot',
    tech: ['Auto Pilot System', 'React', 'Supabase', 'Paystack', 'Face Recognition'],
    theme: 'green',
    site: 'https://yoyogym.vercel.app',
    purpose:
      'This is a full membership, booking, billing and marketing platform that runs a gym almost on autopilot. New members scan a QR, get guided through joining by an AI assistant — health screening, goals, plan choice and e-signature — pay securely online, and receive a digital membership card. From there it handles recurring billing, class bookings, face & QR check-in, staff roles, campaigns and analytics — all from one modern admin panel.',
    capabilities: [
      'AI join-flow: QR scan → chatbot collects details, runs a PAR-Q health screening, goals & plan',
      'Members choose membership tiers & add-ons (priced live from your catalog) and e-sign the agreement',
      'Secure online payments + automatic recurring billing (Paystack), with failed-payment recovery',
      'Instant digital membership-card PDF + verification code',
      'Face-recognition and QR check-in at the door',
      'Member portal: check in, book classes (with waitlists), view plan, expiry & balance',
      'Automated welcome emails + owner WhatsApp/Telegram alerts on every join & payment',
      'POPIA-compliant: consent capture, secure data, right-to-erasure',
    ],
    adminTracking: [
      'Live dashboard — revenue, active members, check-ins, expiries & alert banners',
      'Members: search, profiles, suspend/reactivate, notes, manual registration',
      'One-tap Verify (auto check-in on valid code) and face check-in',
      'Classes & trainers management, calendar, waitlists & automatic class reminders',
      'Payments: record manual, export CSV, full billing history',
      'Analytics on growth, most-popular plans & attendance',
      'Communications: email blasts and automated re-engagement campaigns',
      'Catalog (plans & add-ons) — edits flow straight into the AI join-flow',
      'Staff roles (owner / manager / reception / trainer) with secure permissions',
    ],
    boosts: [
      'Sells memberships 24/7 — people join and pay without a single phone call',
      'Recovers failed payments automatically, so you stop losing revenue silently',
      'Wins back lapsing members with automated re-engagement campaigns',
      'Fills classes with reminders & waitlists — higher attendance, less admin',
      'Face/QR check-in kills door queues and stops membership sharing',
      'One screen shows the whole business — money, members and attendance',
    ],
  },
  {
    name: 'X-Boss Photography',
    category: 'Photography',
    client: 'Professional Photographer',
    description: 'A cinematic showcase that makes the work unforgettable — and turns admirers into booked, paying shoots.',
    image: 'xboss-photography.jpg',
    result: 'Online bookings enabled',
    tech: ['Next.js', 'Image Optimization', 'Tailwind CSS'],
    theme: 'dark',
    site: 'https://xbossphotography.vercel.app',
    purpose:
      'A striking showcase that makes a photographer’s work unforgettable and turns admirers into paying clients.',
    capabilities: [
      'Full-bleed, high-resolution galleries',
      'Themed collections (weddings, portraits, events)',
      'Simple “Book a shoot” enquiry',
      'Optimised, razor-sharp image loading',
    ],
    adminTracking: [
      'Capture every shoot enquiry',
      'Know which collections drive interest',
      'Organise and reply to leads',
    ],
    boosts: [
      'Showcases talent in the best possible light',
      'Books more shoots from the website',
      'Builds a premium, professional reputation',
    ],
  },
  {
    name: 'Shime Events',
    category: 'Events',
    client: 'Luxury Event Planning',
    description: 'A bilingual (English & Amharic) AI booking assistant that takes clients from “hello” to a paid deposit — with instant PDF contracts and a full admin panel to run it all.',
    image: 'shime-events.jpg',
    result: 'AI bookings + online deposits',
    tech: ['React', 'Supabase', 'Chapa', 'jsPDF'],
    theme: 'rose',
    site: 'https://shimeeventplaning.vercel.app',
    purpose:
      'A complete event-booking system for a luxury events business. Clients chat with a bilingual AI assistant that collects everything, checks date availability, takes the deposit online, and issues a signed PDF contract — while the owner manages every booking from a secure admin panel.',
    capabilities: [
      'Bilingual AI chat (English & Amharic) guides clients through a full booking',
      'Captures client + event details and checks date/time availability in real time',
      'Clients pick a package (Signature / Elegance / Premium / Exclusive) and accept terms',
      'Secure online deposit payment (Chapa) — or cash/manual',
      'Auto-generates a booking reference, verification code, and a multi-page PDF contract',
      'WhatsApp & Telegram sharing built in',
    ],
    adminTracking: [
      'Look up any booking instantly by its verification code',
      'See full client info, event details, deposit amount, and payment status',
      'Book clients manually in 4 guided steps (walk-in, phone, or WhatsApp)',
      'Choose online (Chapa) or cash payment per booking — auto-updates when paid',
      'Every booking saved with reference, PIN, status & timestamps for revenue insight',
    ],
    boosts: [
      'Books clients 24/7 in their own language — no staff needed to start',
      'Takes real deposits online, so every booking is committed',
      'Professional PDF contracts build instant trust and look premium',
      'One dashboard to track payments, events, and your most popular packages',
    ],
  },
  {
    name: 'Tsedi Catering & Events',
    category: 'Catering',
    client: 'Catering & Event Management',
    description: 'A single QR code that becomes a personal AI booking assistant — clients scan, chat, check live availability, and pay a deposit in one conversation. No website needed.',
    image: 'tsedi.jpg',
    result: 'QR-to-deposit in one chat',
    tech: ['React', 'Supabase', 'Paystack', 'Google Calendar'],
    theme: 'gold',
    site: 'https://tsedicatering.vercel.app',
    purpose:
      'Tsedi turns one QR code into a warm, personal booking assistant. Clients scan it and the AI chats them through their whole event booking — details, guests, special requests, date & time — checks the calendar live, takes a secure deposit, and issues a verification code. It books events 24/7 so the owner never has to reply to every enquiry by hand.',
    capabilities: [
      'One QR code opens a friendly AI booking assistant — no website to build or maintain',
      'Collects full booking details: contact, event type, guest count & special requests (dietary, theme, dishes)',
      'Live Google Calendar availability check — offers the next open slots if a time is taken',
      'Secure deposit payment (Paystack) tailored per event: weddings, birthdays, corporate, private parties',
      'Instant verification code + email confirmation, shown right inside the chat',
      'Automatically adds the confirmed event to the owner’s Google Calendar',
    ],
    adminTracking: [
      'Scan-to-verify: enter a client’s code on event day → instantly confirms & checks them in',
      'Today’s Bookings tab — every booking for the day with one-tap check-in',
      'Every booking saved with full details, deposit status & verification code',
      'Password-protected, owner-only admin access',
    ],
    boosts: [
      'Books events 24/7 — no more replying to every enquiry by hand',
      'Takes real deposits upfront, so only serious clients book — no time-wasters',
      'Never double-books — the live calendar keeps the diary accurate',
      'Frees the owner to cater, not chase admin',
    ],
  },
  {
    name: 'TSI AI Booking Assistant',
    category: 'Chatbot',
    client: 'Hospitality / Reservations',
    description: 'A tireless AI receptionist that answers customers and takes bookings around the clock — so you never miss a sale.',
    image: 'tsi-ai-booking-portfolio.png',
    result: '24/7 automation',
    tech: ['Claude API', 'Supabase', 'Next.js'],
    theme: 'green',
    site: 'https://tsedicatering.vercel.app',
    purpose:
      'A tireless digital receptionist that talks to customers, takes bookings, and never misses an enquiry — day or night.',
    capabilities: [
      'Natural-language reservations and FAQs',
      'Qualifies and captures every lead',
      'Works 24/7 on the website and WhatsApp',
      'Saves every conversation for review',
    ],
    adminTracking: [
      'Every conversation and booking logged',
      'See customer intent and common questions',
      'Track and follow up captured leads',
    ],
    boosts: [
      'Never miss a booking, even after hours',
      'Cuts customer-service workload dramatically',
      'Responds instantly — improving conversion',
    ],
  },
  {
    name: 'Hamere Noh Kidane Mihret Church',
    category: 'Church Website',
    client: 'Pretoria Hamere Noh Kidane Mihret Church',
    description: 'A dignified, fully bilingual home for an Ethiopian Orthodox Tewahedo parish — service times, sermons, saints and the liturgical calendar, in English and Amharic side by side, editable by the church itself.',
    image: 'kidane-mihret-portfolio.jpg',
    result: 'Live bilingual parish website',
    tech: ['Next.js', 'Supabase', 'Bilingual CMS', 'RLS Security'],
    theme: 'gold',
    site: 'https://pretoriakidanemihretchurch-beta.vercel.app',
    purpose:
      'A complete, production website for an Ethiopian Orthodox Tewahedo church in Pretoria — built so the parish never depends on a developer to keep it current. Every piece of content, from service times to the priest’s details to a new sermon, is edited from a secure admin panel and shown correctly in both English and Amharic.',
    capabilities: [
      'Full bilingual site — English and Amharic treated as equals throughout, not a translated afterthought',
      'A 13-table content system: posts, events, saints & feast days, sermons, gallery, calendar and pages',
      'Liturgical calendar with recurring feast days and services',
      'Sermon library with audio/video and bilingual summaries',
      'Saints & feast-day pages with bilingual biographies',
      'Row-level security on every table, audit logging and role-based admin access',
    ],
    adminTracking: [
      'Edit service times, priest, address and contact — live, no code touched',
      'Publish posts, events and sermons in both languages from one screen',
      'Manage the gallery and saints/feast content directly',
      'Every admin action audit-logged, with role-based permissions',
    ],
    boosts: [
      'The congregation always finds correct service times — no more outdated WhatsApp forwards',
      'Content stays current because the church updates it directly, in minutes',
      'A dignified, corporate-level presentation that matches the institution',
      'One accurate source of truth in both languages, instead of two out-of-sync ones',
    ],
    howItWorksTitle: 'How the church keeps it current',
    howItWorks: [
      { title: 'A visitor opens the site', text: 'In English or Amharic — service times, sermons, saints, gallery and the calendar, correct in either language.' },
      { title: 'The church logs into Admin', text: 'A secure panel, separate from the code — no developer needed to change a service time or add a sermon.' },
      { title: 'Content is edited directly', text: 'Posts, events and sermons are written once, in both languages, from the same screen.' },
      { title: 'It appears live, instantly', text: 'No rebuild, no deploy, no waiting — the congregation sees the update the moment it is saved.' },
    ],
  },
  {
    name: 'Yewogen Derash (ወገን ደራሽ)',
    category: 'Community Fundraising',
    client: 'Community Fundraising — Ethiopia & Abroad',
    description: 'A community fundraising platform built for Ethiopians at home and abroad — a simple, trusted way to raise help for a family, a cause, or a community need, free to use and open to anyone who wants to give.',
    image: 'yewogen-derash-portfolio.jpg',
    result: 'Live — community fundraising',
    tech: ['Next.js', 'Prisma', 'Supabase', 'Chapa'],
    theme: 'blue',
    site: 'https://yewogenderash.vercel.app',
    purpose:
      'Built for society, not for profit from it: a place where Ethiopians — at home and in the diaspora — can come together to help one another. Anyone can start a cause and anyone can give, wherever they are, in a way that feels honest and trustworthy rather than another anonymous donation box.',
    capabilities: [
      'Free for anyone to use — starting a cause or giving to one costs nothing extra',
      'Open to donors both inside Ethiopia and abroad',
      'Every campaign owner is verified, so donors know who they are actually helping',
      'Funds for each cause are kept separate and accounted for',
    ],
    adminTracking: [
      'Oversight of campaigns and the people running them',
      'A clear record of funds raised and paid out for every cause',
    ],
    boosts: [
      'Makes it easy for the diaspora to help family and community back home',
      'Donors give with confidence, knowing who they are supporting',
      'A platform built to serve the community, not just process payments',
    ],
    howItWorksTitle: 'How giving works',
    howItWorks: [
      { title: 'Someone starts a cause', text: 'They explain the need and go through identity verification, so donors know it is real.' },
      { title: 'The cause goes live', text: 'Shareable with family and community, in Ethiopia or with the diaspora abroad.' },
      { title: 'Anyone can give', text: 'From home or from abroad — no account needed, just a cause worth supporting.' },
      { title: 'Funds are kept separate', text: 'Every cause has its own record, so what was raised for it is what it receives.' },
    ],
  },
  {
    name: 'Sena — AI Voice Receptionist',
    category: 'Hospitality AI',
    client: 'Hotel Front Desk Automation',
    description: 'An autonomous AI voice receptionist for hotels. A guest clicks Call Reception; Sena answers, says plainly she is an AI, checks live availability, quotes real rates, takes payment, and issues a single-use QR guest ID.',
    image: 'sena-portfolio.jpg',
    result: 'Upcoming — in active development',
    tech: ['LiveKit', 'faster-whisper', 'Piper', 'Claude API'],
    theme: 'purple',
    upcoming: true,
    purpose:
      'A voice receptionist that answers the phone the moment a guest clicks Call Reception — no hold music, no night-shift gap. Sena states plainly that she is an AI, checks real availability, quotes the actual rate, takes the guest’s details, sends a payment link during the call itself, and issues a booking confirmation with a single-use QR guest ID. Anything she is unsure of, she hands to a human.',
    capabilities: [
      'Answers instantly, any hour, and always discloses she is an AI first',
      'Checks live room availability and quotes real rates — never invented ones',
      'Takes the deposit or payment during the call, with a Paystack webhook verified server-side',
      'Issues a single-use QR guest ID — cancelled the moment it is scanned at the door',
      'Cancellations free the room immediately; scheduled jobs expire holds automatically',
      'Escalates to a human the moment she is unsure, rather than guessing',
      'The entire voice stack is self-hosted — no per-minute voice vendor',
    ],
    adminTracking: [
      'Every booking, hold and cancellation tracked against a real ledger',
      'Front-desk scanner verifies and consumes each guest’s single-use QR',
      'Payment link and guest ID delivered by email — no extra apps for the guest',
    ],
    boosts: [
      'Answers the phone at 3am without a night shift on payroll',
      'Collects payment during the call instead of chasing it afterwards',
      'A guest never has to queue to prove who they are — the QR does it',
      'No Vapi, no ElevenLabs, no Twilio — the only running cost is the thinking',
    ],
  },
  {
    name: 'Telga',
    category: 'Fintech / POS',
    client: 'Card-Payment Airtime & Bill Vending — Ethiopia',
    description: 'An entrepreneur-led card-payment business for Ethiopia — airtime and bill payments sold on a POS terminal or Android app, anywhere a card can be tapped or swiped: any shop, any market stall, any location.',
    image: 'telga-portfolio.jpg',
    result: 'Upcoming — in active development',
    tech: ['Android', 'POS Terminal SDK', 'Next.js', 'Supabase'],
    theme: 'gold',
    upcoming: true,
    purpose:
      'Telga is a card-payment vending business an entrepreneur can run anywhere — not tied to one kind of shop or one location. A vendor taps or swipes a customer\'s card on a POS terminal or an Android phone, sells airtime or a bill payment in seconds, and earns on every transaction. No cash handling, no stock to carry — just a device and a card reader, set up wherever there is foot traffic: a shop counter, a market stall, an event, anywhere.',
    capabilities: [
      'Two ways to run it: a dedicated POS terminal, or an Android app on an existing phone',
      'Card payment only — tap or swipe, select amount, done — no cash handling',
      'Airtime and bill-payment vending in one flow, usable at any location',
      'Per-vendor accounts, commission tracking and a running transaction ledger',
    ],
    adminTracking: [
      'Vendor network management — onboarding, commission rates, activity',
      'Every transaction logged against a vendor reference for reconciliation',
      'Live view of network-wide sales volume',
    ],
    boosts: [
      'A real card-payment business an entrepreneur can start with one device',
      'Works anywhere — no fixed shop or location required',
      'Vendors earn commission on every card transaction, with no stock or cash risk',
    ],
    howItWorksTitle: 'How a vendor earns from it',
    howItWorks: [
      { title: 'An entrepreneur sets up a device', text: 'A POS terminal, or just the Android app on a phone they already own — no shop or fixed location required.' },
      { title: 'A customer wants airtime or a bill paid', text: 'They walk up wherever the vendor is standing — a counter, a stall, a market, an event.' },
      { title: 'The card is tapped or swiped', text: 'The vendor selects the amount and confirms — no cash changes hands.' },
      { title: 'Payment processes instantly', text: 'The customer gets what they paid for on the spot, and the vendor earns commission, logged automatically to their account.' },
    ],
  },
  {
    name: 'DR. Hospital — AI Clinic System',
    category: 'Healthcare',
    client: 'Clinic & Hospital Management',
    description: 'An AI-powered clinic & hospital platform that connects patients, doctors, nurses and management in one live system — from a QR booking and AI symptom intake all the way to a fully tracked, AI-drafted discharge.',
    image: null,
    result: 'Upcoming — in active development',
    tech: ['Next.js', 'Supabase', 'Claude AI', 'Paystack'],
    theme: 'blue',
    upcoming: true,
    purpose:
      'DR. Hospital runs the entire patient journey for a clinic or small hospital — from the first QR scan to walking out with a discharge summary. It automates the repetitive intake and admin work with structured AI workflows, while every clinical decision stays with licensed doctors and nurses. It connects the three groups that normally work in disconnected tools — patients, clinical staff and management — into one live, role-aware platform.',
    capabilities: [
      'Patient journey: scan QR → pay booking fee → capture personal details → AI-guided symptom & pain intake (pain mapping, severity, history, red-flag screening) → automatic queue placement → WhatsApp/SMS updates',
      'Doctors & nurses open a pre-organised AI summary of the complaint (not a raw form), capture vitals, write a structured note, and issue prescriptions — AI drafts, the clinician always approves',
      'Deterministic, clinician-reviewable red-flag emergency screening',
      'Discharge done properly: AI-drafted patient-friendly summary, completion checklist (payment, prescription, follow-up) and a same-day satisfaction check-in',
      'WhatsApp-first — works on budget Android phones and unreliable clinic Wi-Fi',
      'Built for POPIA, the National Health Act & HPCSA confidentiality from day one',
    ],
    adminTracking: [
      'Management dashboard — revenue, doctor utilisation, wait times, no-show rate & patient satisfaction, live',
      'Front-desk live scheduling, payments & walk-in management',
      'Role-aware access for patients, reception, nurses, doctors & management',
      'Every stage tracked — intake, consultation, prescription, discharge & follow-up',
    ],
    boosts: [
      'Patients stop repeating their symptoms to three people — captured once, structured',
      'Doctors start every consultation with context, not a blank page',
      'Management sees revenue, wait times & no-shows live — no month-end spreadsheet scramble',
      'Fewer no-shows, faster throughput, and a discharge that actually follows up',
    ],
    howItWorksTitle: 'A patient\'s journey through the clinic',
    howItWorks: [
      { title: 'The patient scans a QR code and pays the booking fee', text: 'No queueing at reception just to start — booking begins on their own phone.' },
      { title: 'AI-guided intake takes their symptoms', text: 'Pain mapping, severity, history and red-flag screening — captured once, structured, before they see anyone.' },
      { title: 'They\'re placed in the queue automatically', text: 'With WhatsApp and SMS updates, so there\'s no guessing how long the wait is.' },
      { title: 'A doctor or nurse reviews the organised summary', text: 'Vitals are captured, a note is written, and prescriptions are issued — AI drafts, the clinician always approves.' },
      { title: 'Discharge is drafted and followed up', text: 'A patient-friendly summary, a completion checklist, and a same-day check-in to see how they\'re doing.' },
    ],
  },
];

const imgSrc = (image: string | null) =>
  !image ? null : image.startsWith('http') ? image : `/${image}`;

// The end-to-end booking journey we build into every project.
const BOOKING_STEPS: { title: string; text: string }[] = [
  { title: 'Get your QR code', text: 'We create a custom branded QR code — print it and place it anywhere: your shop, flyers, packaging, or event.' },
  { title: 'Customer scans & chats', text: 'They scan the code and instantly start chatting with your AI assistant — no app to download, no long forms.' },
  { title: 'AI collects everything', text: 'The assistant captures their full details and event/project info, then helps them choose the right package.' },
  { title: 'Secure online payment', text: 'The customer pays online through the system in a few taps — safe and instant.' },
  { title: 'Instant confirmation', text: 'They receive a unique verification code and an email confirmation straight away.' },
  { title: 'You track & deliver', text: 'You get the verification code and track the payment, event, or project in your dashboard — then deliver your service, all in one place.' },
];

// Portfolio order — live, finished projects first; "in active development"
// projects grouped together near the end.
const rankOf = (name: string): number => {
  const n = name.toLowerCase();
  if (n.includes('mulesoo')) return 0;
  if (n.includes('yoyo') || n.includes('gym')) return 1;
  if (n.includes('boss') || n.includes('photograph')) return 2;
  if (n.includes('catering')) return 3;
  if (n.includes('tsi') || n.includes('booking assistant')) return 4;
  if (n.includes('shime')) return 5;
  if (n.includes('kidane') || n.includes('hamere')) return 6;
  if (n.includes('yewogen')) return 7; // live, completed
  if (n.includes('hospital') || n.includes('dr.')) return 8;
  if (n.includes('sena')) return 9;
  if (n.includes('telga')) return 10;
  return 50;
};

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [selected, setSelected] = useState<Project | null>(null);

  const orderedProjects = [...projects].sort((a, b) => rankOf(a.name) - rankOf(b.name));

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase.from('portfolio').select('*').order('order', { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
          setProjects(
            data.map((item: any) => ({
              name: item.title,
              category: item.category,
              client: item.client_name || item.client_type || '',
              description: item.description || '',
              image: item.image_url || null,
              result: item.result || '',
              tech: Array.isArray(item.tech_stack) ? item.tech_stack : [],
              link: item.link || undefined,
              site: item.link || undefined,
              purpose: item.solution || item.description || '',
              capabilities: item.challenge ? [item.challenge] : [],
              boosts: item.result ? [item.result] : [],
            }))
          );
        }
      } catch {
        /* keep curated fallback */
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          title="Portfolio"
          subtitle="Real digital products that grow real businesses. Click any project to see how it works — and how one like it could grow yours."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {orderedProjects.map((project, index) => {
            const src = imgSrc(project.image);
            return (
              <motion.button
                type="button"
                key={`${project.name}-${index}`}
                onClick={() => setSelected(project)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ translateY: -6 }}
                className="group relative glass-card overflow-hidden rounded-2xl border border-[var(--border)] text-left transition-all duration-300 hover:border-[var(--color-action-on-dark)] hover:shadow-xl hover:shadow-[var(--glow-action)]"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] z-20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 bg-gradient-to-r from-[var(--color-action-primary)] via-[var(--accent-purple)] to-[var(--accent-gold)]" />

                {project.upcoming && (
                  <span className="absolute top-3 right-3 z-30 px-3 py-1 rounded-full text-[10px] font-bold font-sora text-black bg-gradient-to-r from-[var(--accent-gold)] to-[#FFD777] shadow-lg tracking-wider">
                    COMING SOON
                  </span>
                )}

                <div className="relative w-full aspect-[16/9] overflow-hidden bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-card)]">
                  {src ? (
                    <>
                      <Image src={src} alt={project.name} width={1200} height={675} className={`w-full h-full transition-transform duration-700 group-hover:scale-110 ${project.fit === 'contain' ? 'object-contain p-8' : 'object-cover'}`} priority={index < 2} quality={90} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/15 to-transparent pointer-events-none" />
                      <span className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-[11px] font-bold font-sora text-white bg-black/45 backdrop-blur-sm border border-white/20">{project.category.toUpperCase()}</span>
                      <span className="absolute top-3 right-3 z-10 text-[11px] font-bold font-sora text-white/75">MULE<span className="text-[var(--accent-gold)]">●</span>SOO</span>
                      {project.result && (
                        <span className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-black bg-gradient-to-r from-[var(--accent-gold)] to-[#FFD777] shadow-lg">✨ {project.result}</span>
                      )}
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--color-action-primary)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold font-sora text-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-300">View Project →</span>
                      </div>
                    </>
                  ) : (
                    <PortfolioCover title={project.name} category={project.category} tagline={project.result} theme={project.theme} />
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold font-sora text-[var(--text-primary)] leading-tight group-hover:text-[var(--color-action-on-dark)] transition-colors">{project.name}</h3>
                  {project.client && <p className="text-xs text-[var(--accent-gold)] font-semibold">{project.client}</p>}
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-3">{project.description}</p>
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-xs font-semibold text-[var(--color-action-on-dark)]">View project details →</p>
                    {project.site && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--accent-green)]">
                        <Globe size={11} /> Live site
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center">
          <h2 className="text-3xl font-bold font-sora mb-4 gradient-text">Ready to Build Your Next Project?</h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">Let&apos;s create something amazing together. Start with a free consultation.</p>
          <motion.a href="/contact" whileHover={{ scale: 1.05 }} className="inline-block px-10 py-4 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-hover)] text-[var(--color-action-ink)] font-bold font-sora rounded-lg shadow-lg hover:shadow-[0_8px_30px_var(--glow-action)] transition-shadow">Get Started</motion.a>
        </motion.div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card border border-[var(--border)] rounded-2xl w-full max-w-2xl my-8 overflow-hidden"
            >
              {/* Header image */}
              <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-card)]">
                {imgSrc(selected.image) ? (
                  <Image src={imgSrc(selected.image) as string} alt={selected.name} width={1200} height={675} className={`w-full h-full ${selected.fit === 'contain' ? 'object-contain p-8' : 'object-cover'}`} />
                ) : (
                  <PortfolioCover title={selected.name} category={selected.category} tagline={selected.result} theme={selected.theme} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
                <motion.button type="button" onClick={() => setSelected(null)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                  <X size={20} />
                </motion.button>
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold font-sora text-white bg-black/45 border border-white/20">{selected.category.toUpperCase()}</span>
                    {selected.upcoming && (
                      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold font-sora text-black bg-gradient-to-r from-[var(--accent-gold)] to-[#FFD777]">COMING SOON</span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold font-sora text-white leading-tight">{selected.name}</h3>
                  <p className="text-[var(--accent-gold)] text-sm font-semibold">{selected.client}</p>
                </div>
              </div>

              <div className="p-6 space-y-6 max-h-[55vh] overflow-y-auto">
                {/* About */}
                <div>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{selected.purpose || selected.description}</p>
                </div>

                {/* Live site — portfolio proof */}
                {selected.site && (
                  <a
                    href={selected.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-action-on-dark)]/40 bg-[var(--glow-action)] px-4 py-3.5 hover:border-[var(--color-action-on-dark)] transition-colors"
                  >
                    <span className="flex items-center gap-2 text-sm text-[var(--text-primary)] font-semibold">
                      <Globe size={17} className="text-[var(--color-action-on-dark)]" />
                      Want proof? Visit the live working site
                    </span>
                    <span className="inline-flex items-center gap-1 text-[var(--color-action-on-dark)] font-bold text-sm whitespace-nowrap">
                      Open <ExternalLink size={14} />
                    </span>
                  </a>
                )}

                {/* Capabilities */}
                {selected.capabilities && selected.capabilities.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold font-sora text-[var(--color-action-on-dark)] uppercase tracking-wide mb-3">What it does</h4>
                    <ul className="space-y-2">
                      {selected.capabilities.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                          <Check size={16} className="text-[var(--accent-green)] mt-0.5 flex-shrink-0" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Admin tracking */}
                {selected.adminTracking && selected.adminTracking.length > 0 && (
                  <div className="bg-[var(--glow-action)] border border-[var(--color-action-on-dark)]/40 rounded-xl p-4">
                    <h4 className="text-sm font-bold font-sora text-[var(--color-action-on-dark)] uppercase tracking-wide mb-3 flex items-center gap-2">
                      <Gauge size={15} /> What you can track (Admin Panel)
                    </h4>
                    <ul className="space-y-2">
                      {selected.adminTracking.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                          <Check size={16} className="text-[var(--color-action-on-dark)] mt-0.5 flex-shrink-0" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Boosts */}
                {selected.boosts && selected.boosts.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold font-sora text-[var(--accent-gold)] uppercase tracking-wide mb-3 flex items-center gap-2">
                      <TrendingUp size={15} /> How it grows your business
                    </h4>
                    <ul className="space-y-2">
                      {selected.boosts.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                          <span className="text-[var(--accent-gold)] mt-0.5">★</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* How it works — each project's own flow, falling back to the
                    generic booking journey only for projects actually built on it */}
                <div className="border-t border-[var(--border)] pt-5">
                  <h4 className="text-sm font-bold font-sora text-[var(--accent-purple)] uppercase tracking-wide mb-4">
                    {selected.howItWorksTitle || 'How your customers book — end to end'}
                  </h4>
                  <ol className="space-y-3">
                    {(selected.howItWorks && selected.howItWorks.length > 0 ? selected.howItWorks : BOOKING_STEPS).map((step, i) => (
                      <li key={step.title} className="flex gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--color-action-primary)] hover:bg-[var(--color-action-hover)] text-[var(--color-action-ink)] text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">{step.title}</p>
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* CTA */}
                <div className="border-t border-[var(--border)] pt-5">
                  <p className="text-center text-[var(--text-primary)] font-semibold mb-4">Want a project like this for your business?</p>
                  <Link
                    href={`/contact?service=${encodeURIComponent(`a project like "${selected.name}"`)}`}
                    className="block w-full text-center px-6 py-3.5 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-hover)] text-[var(--color-action-ink)] font-bold rounded-lg hover:scale-[1.02] transition-transform"
                  >
                    Book a Free Consultation →
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
