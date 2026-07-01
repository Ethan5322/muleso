'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Gauge, TrendingUp, MessageCircle } from 'lucide-react';
import PageHero from '@/components/PageHero';
import PortfolioCover from '@/components/PortfolioCover';
import { supabase } from '@/lib/supabase';
import { useSiteSettings } from '@/lib/useSiteSettings';

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
  theme?: ThemeKey;
  fit?: 'cover' | 'contain';
  purpose?: string;
  capabilities?: string[];
  adminTracking?: string[];
  boosts?: string[];
}

const fallbackProjects: Project[] = [
  {
    name: 'MuleSoo Digital Services',
    category: 'Website',
    client: 'Our Flagship Platform',
    description: 'Our own corporate platform — a fast, animated Next.js site with an AI booking assistant and a full admin control center.',
    image: 'mulesoo-website.jpg',
    result: 'You are looking at it',
    tech: ['Next.js', 'Supabase', 'Framer Motion', 'AI'],
    theme: 'blue',
    purpose:
      'This very website is proof of what we deliver: a premium, lightning-fast digital experience with real business tools built in — not just a pretty page, but a system that runs the business.',
    capabilities: [
      'AI chatbot that captures bookings 24/7',
      'Secure admin dashboard with face-recognition login',
      'Live portfolio, testimonials, services & pricing you edit yourself',
      'Automatic WhatsApp & email notifications on every lead',
    ],
    adminTracking: [
      'Every lead and booking in one inbox with status pipeline',
      'Visitor analytics and QR-scan tracking',
      'Conversion rate and content — all editable without code',
    ],
    boosts: [
      'Turns visitors into booked clients while you sleep',
      'Positions your brand as premium and trustworthy',
      'Saves hours by automating enquiries and admin',
    ],
  },
  {
    name: 'Habesha Celebration Events',
    category: 'Website',
    client: 'Ethiopian Wedding & Event Planning',
    description: 'A full-service event-planning platform with elegant galleries, package showcases, and a smooth enquiry-to-booking flow.',
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
    name: 'YoYo Gym',
    category: 'Website',
    client: 'Fitness & Wellness Brand',
    description: 'A high-energy website for a modern gym — class schedules, membership tiers, trainer profiles, and a bold join-now flow.',
    image: 'yoyo-gym.jpg',
    result: 'Membership-ready site',
    tech: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
    theme: 'green',
    purpose:
      'A website built to fill classes and grow memberships — motivating visitors to sign up the moment they land.',
    capabilities: [
      'Class schedules and membership plans',
      'Trainer profiles and success stories',
      'One-tap "Join Now" and enquiry flow',
      'Energetic, mobile-first design',
    ],
    adminTracking: [
      'Track new sign-up enquiries as they arrive',
      'See which membership tiers attract interest',
      'Manage and follow up prospects',
    ],
    boosts: [
      'Converts website visitors into paying members',
      'Fills classes with less manual effort',
      'Makes the gym look established and premium',
    ],
  },
  {
    name: 'X-Boss Photography',
    category: 'Photography',
    client: 'Professional Photographer',
    description: 'A cinematic portfolio site that lets the imagery lead — full-bleed galleries and a clean booking enquiry.',
    image: 'xboss-photography.jpg',
    result: 'Online bookings enabled',
    tech: ['Next.js', 'Image Optimization', 'Tailwind CSS'],
    theme: 'dark',
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
    client: 'Events & Celebrations',
    description: 'A vibrant brand site with service packages, galleries, instant WhatsApp enquiry, and a custom branded QR code.',
    image: 'shime-events.jpg',
    result: 'Site + branded QR',
    tech: ['React', 'QR Codes', 'WhatsApp API'],
    theme: 'rose',
    purpose:
      'An eye-catching events brand presence that works online and on the ground — scan the QR at a venue and book in seconds.',
    capabilities: [
      'Service packages and highlight galleries',
      'Instant WhatsApp enquiry button',
      'Custom branded QR code for flyers & venues',
      'Colourful, celebratory design',
    ],
    adminTracking: [
      'Track enquiries from web and QR scans',
      'See what’s driving bookings',
      'Follow up every lead',
    ],
    boosts: [
      'Bridges offline marketing to instant online booking',
      'Makes the brand memorable and shareable',
      'Increases enquiries from every flyer and event',
    ],
  },
  {
    name: 'Tsedi',
    category: 'Branding',
    client: 'Brand Identity & Outreach',
    description: 'Brand identity paired with a custom branded QR-code system for client outreach — one consistent look across print and digital.',
    image: 'tsedi.jpg',
    result: 'Brand kit delivered',
    tech: ['Illustrator', 'QR Codes', 'Canva Pro'],
    theme: 'gold',
    purpose:
      'A complete brand identity that makes a business instantly recognisable — and a QR system that turns any surface into a lead source.',
    capabilities: [
      'Logo and complete brand identity',
      'Branded QR codes for outreach',
      'Consistent visuals across print & digital',
      'Marketing-ready assets',
    ],
    adminTracking: [
      'Track QR-code scans and engagement',
      'See which touchpoints perform best',
    ],
    boosts: [
      'Builds instant trust with a professional look',
      'Makes the brand memorable and consistent',
      'Turns everyday materials into marketing',
    ],
  },
  {
    name: 'TSI AI Booking Assistant',
    category: 'Chatbot',
    client: 'Hospitality / Reservations',
    description: 'An AI assistant that handles reservations, answers FAQs, and qualifies leads 24/7 — with full conversation history.',
    image: 'tsi-ai-booking-portfolio.png',
    result: '24/7 automation',
    tech: ['Claude API', 'Supabase', 'Next.js'],
    theme: 'green',
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
];

const imgSrc = (image: string | null) =>
  !image ? null : image.startsWith('http') ? image : `/${image}`;

export default function PortfolioPage() {
  const settings = useSiteSettings();
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [selected, setSelected] = useState<Project | null>(null);

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
          {projects.map((project, index) => {
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
                className="group relative glass-card overflow-hidden rounded-2xl border border-[var(--border)] text-left transition-all duration-300 hover:border-[var(--accent-blue)] hover:-translate-y-2 hover:shadow-[0_24px_60px_-15px_rgba(0,200,255,0.4)]"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] z-20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 bg-gradient-to-r from-[var(--accent-blue)] via-[var(--accent-purple)] to-[var(--accent-gold)]" />

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
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2 min-h-10">{project.description}</p>
                  {project.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {project.tech.map((tech) => (
                        <span key={tech} className="text-xs px-2.5 py-1 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] rounded-md">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center">
          <h2 className="text-3xl font-bold font-sora mb-4 gradient-text">Ready to Build Your Next Project?</h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">Let&apos;s create something amazing together. Start with a free consultation.</p>
          <a href="/contact" className="inline-block px-10 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform">Get Started</a>
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
                <button type="button" onClick={() => setSelected(null)} className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70">
                  <X size={20} />
                </button>
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold font-sora text-white bg-black/45 border border-white/20 mb-2">{selected.category.toUpperCase()}</span>
                  <h3 className="text-2xl font-bold font-sora text-white leading-tight">{selected.name}</h3>
                  <p className="text-[var(--accent-gold)] text-sm font-semibold">{selected.client}</p>
                </div>
              </div>

              <div className="p-6 space-y-6 max-h-[55vh] overflow-y-auto">
                {/* About */}
                <div>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{selected.purpose || selected.description}</p>
                </div>

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

                {/* Tech */}
                {selected.tech.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selected.tech.map((t) => (
                      <span key={t} className="text-xs px-2.5 py-1 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] rounded-md">{t}</span>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <div className="border-t border-[var(--border)] pt-5">
                  <p className="text-center text-[var(--text-primary)] font-semibold mb-4">Want a project like this for your business?</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/contact" className="flex-1 text-center px-6 py-3 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-lg hover:scale-[1.02] transition-transform">
                      Book a Free Consultation
                    </Link>
                    <a
                      href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hi MuleSoo, I saw the "${selected.name}" project in your portfolio and I'd like something similar for my business.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold rounded-lg hover:scale-[1.02] transition-transform"
                    >
                      <MessageCircle size={18} /> Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
