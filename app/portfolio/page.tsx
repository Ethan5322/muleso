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
    name: 'Habesha Celebration Events',
    category: 'Website',
    client: 'Ethiopian Wedding & Event Planning',
    description: 'An elegant events platform that turns wedding dreams into confirmed bookings — working for you 24/7, even mid-event.',
    image: 'habesha-celebration-portfolio.png',
    result: 'Live booking platform',
    tech: ['Next.js', 'React', 'Framer Motion', 'Netlify'],
    theme: 'rose',
    purpose:
      'A refined online home for a wedding & events business — designed to make couples fall in love with the brand and book with confidence.',
    capabilities: [
      'Elegant photo galleries and package showcases',
      'Instant enquiry form + WhatsApp booking',
      'Mobile-first, fast-loading design',
      'Testimonials that build trust',
    ],
    adminTracking: [
      'Every enquiry captured and organised',
      'See which packages get the most interest',
      'Follow up leads with status tracking',
    ],
    boosts: [
      'Turns browsers into booked events',
      'Handles enquiries 24/7 — even during events',
      'Elevates the brand above local competitors',
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

// Portfolio order — projects with a live public site first; Habesha (no site yet) last.
const rankOf = (name: string): number => {
  const n = name.toLowerCase();
  if (n.includes('mulesoo')) return 0;
  if (n.includes('yoyo') || n.includes('gym')) return 1;
  if (n.includes('boss') || n.includes('photograph')) return 2;
  if (n.includes('catering')) return 3;
  if (n.includes('tsi') || n.includes('booking assistant')) return 4;
  if (n.includes('shime')) return 5;
  if (n.includes('hospital') || n.includes('dr.')) return 6;
  if (n.includes('habesha')) return 99; // no live site yet — always last
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
                className="group relative glass-card overflow-hidden rounded-2xl border border-[var(--border)] text-left transition-all duration-300 hover:border-[var(--accent-blue)] hover:shadow-xl hover:shadow-[var(--glow-blue)]"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] z-20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 bg-gradient-to-r from-[var(--accent-blue)] via-[var(--accent-purple)] to-[var(--accent-gold)]" />

                {project.upcoming && (
                  <span className="absolute top-3 right-3 z-30 px-3 py-1 rounded-full text-[10px] font-bold font-sora text-black bg-gradient-to-r from-[var(--accent-gold)] to-[#FFD777] shadow-lg tracking-wider">
                    COMING SOON
                  </span>
                )}

                <div className="relative w-full h-60 overflow-hidden bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-card)]">
                  {src ? (
                    <>
                      <Image src={src} alt={project.name} width={1200} height={675} className={`w-full h-full transition-transform duration-700 group-hover:scale-110 ${project.fit === 'contain' ? 'object-contain p-8' : 'object-cover'}`} priority={index < 2} quality={90} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/15 to-transparent pointer-events-none" />
                      <span className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-[11px] font-bold font-sora text-white bg-black/45 backdrop-blur-sm border border-white/20">{project.category.toUpperCase()}</span>
                      <span className="absolute top-3 right-3 z-10 text-[11px] font-bold font-sora text-white/75">MULE<span className="text-[var(--accent-gold)]">●</span>SOO</span>
                      {project.result && (
                        <span className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-black bg-gradient-to-r from-[var(--accent-gold)] to-[#FFD777] shadow-lg">✨ {project.result}</span>
                      )}
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--accent-blue)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold font-sora text-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-300">View Project →</span>
                      </div>
                    </>
                  ) : (
                    <PortfolioCover title={project.name} category={project.category} tagline={project.result} theme={project.theme} />
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold font-sora text-[var(--text-primary)] leading-tight group-hover:text-[var(--accent-blue)] transition-colors">{project.name}</h3>
                  {project.client && <p className="text-xs text-[var(--accent-gold)] font-semibold">{project.client}</p>}
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-3">{project.description}</p>
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-xs font-semibold text-[var(--accent-blue)]">View project details →</p>
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
          <motion.a href="/contact" whileHover={{ scale: 1.05 }} className="inline-block px-10 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg shadow-lg hover:shadow-[0_0_30px_var(--glow-blue)] transition-shadow">Get Started</motion.a>
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
              <div className="relative w-full h-56 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-card)]">
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
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--accent-blue)]/40 bg-[var(--glow-blue)] px-4 py-3.5 hover:border-[var(--accent-blue)] transition-colors"
                  >
                    <span className="flex items-center gap-2 text-sm text-[var(--text-primary)] font-semibold">
                      <Globe size={17} className="text-[var(--accent-blue)]" />
                      Want proof? Visit the live working site
                    </span>
                    <span className="inline-flex items-center gap-1 text-[var(--accent-blue)] font-bold text-sm whitespace-nowrap">
                      Open <ExternalLink size={14} />
                    </span>
                  </a>
                )}

                {/* Capabilities */}
                {selected.capabilities && selected.capabilities.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold font-sora text-[var(--accent-blue)] uppercase tracking-wide mb-3">What it does</h4>
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
                  <div className="bg-[var(--glow-blue)] border border-[var(--accent-blue)]/40 rounded-xl p-4">
                    <h4 className="text-sm font-bold font-sora text-[var(--accent-blue)] uppercase tracking-wide mb-3 flex items-center gap-2">
                      <Gauge size={15} /> What you can track (Admin Panel)
                    </h4>
                    <ul className="space-y-2">
                      {selected.adminTracking.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                          <Check size={16} className="text-[var(--accent-blue)] mt-0.5 flex-shrink-0" /> {c}
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

                {/* How customers book */}
                <div className="border-t border-[var(--border)] pt-5">
                  <h4 className="text-sm font-bold font-sora text-[var(--accent-purple)] uppercase tracking-wide mb-4">
                    How your customers book — end to end
                  </h4>
                  <ol className="space-y-3">
                    {BOOKING_STEPS.map((step, i) => (
                      <li key={step.title} className="flex gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] text-white text-xs font-bold flex items-center justify-center">
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
                    className="block w-full text-center px-6 py-3.5 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-lg hover:scale-[1.02] transition-transform"
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
