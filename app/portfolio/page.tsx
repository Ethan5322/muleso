'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
  theme?: ThemeKey;
  icon?: string;
  fit?: 'cover' | 'contain';
}

// Curated fallback — shown if the portfolio table is empty or unavailable.
const fallbackProjects: Project[] = [
  {
    name: 'MuleSoo Digital Services',
    category: 'Website',
    client: 'Our Flagship Platform',
    description:
      'Our own corporate website — a fast, animated Next.js platform with an AI booking assistant, secure admin dashboard, live portfolio, and integrated lead capture.',
    image: 'mulesoo-website.jpg',
    result: 'You are looking at it',
    tech: ['Next.js', 'Supabase', 'Framer Motion', 'AI'],
    theme: 'blue',
  },
  {
    name: 'Habesha Celebration Events',
    category: 'Website',
    client: 'Ethiopian Wedding & Event Planning',
    description:
      'A full-service event-planning platform with elegant galleries, package showcases, and a streamlined enquiry-to-booking flow — built to turn browsers into booked clients.',
    image: 'habesha-celebration-portfolio.png',
    result: 'Live booking platform',
    tech: ['Next.js', 'React', 'Framer Motion', 'Netlify'],
    theme: 'rose',
  },
  {
    name: 'YoYo Gym',
    category: 'Website',
    client: 'Fitness & Wellness Brand',
    description:
      'A high-energy website for a modern gym — class schedules, membership tiers, trainer profiles, and a bold join-now flow designed to convert visitors into members.',
    image: 'yoyo-gym.jpg',
    result: 'Membership-ready site',
    tech: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
    theme: 'green',
    icon: '💪',
  },
  {
    name: 'X-Boss Photography',
    category: 'Photography',
    client: 'Professional Photographer',
    description:
      'A cinematic portfolio site that lets the imagery lead — full-bleed galleries, themed collections, and a clean booking enquiry, optimised for fast, sharp image loading.',
    image: 'xboss-photography.jpg',
    result: 'Online bookings enabled',
    tech: ['Next.js', 'Image Optimization', 'Tailwind CSS'],
    theme: 'dark',
    icon: '📷',
  },
  {
    name: 'Shime Events',
    category: 'Events',
    client: 'Events & Celebrations',
    description:
      'A vibrant brand site with service packages, highlight galleries, and instant WhatsApp enquiry — paired with a custom branded QR code for on-the-ground marketing.',
    image: 'shime-events.jpg',
    result: 'Site + branded QR',
    tech: ['React', 'QR Codes', 'WhatsApp API'],
    theme: 'rose',
    icon: '🎉',
  },
  {
    name: 'Tsedi',
    category: 'Branding',
    client: 'Brand Identity & Outreach',
    description:
      'Brand identity work paired with a custom branded QR-code system for client outreach — a consistent visual identity across print and digital touchpoints.',
    image: 'tsedi.jpg',
    result: 'Brand kit delivered',
    tech: ['Illustrator', 'QR Codes', 'Canva Pro'],
    theme: 'gold',
    icon: '🎨',
  },
  {
    name: 'TSI AI Booking Assistant',
    category: 'Chatbot',
    client: 'Hospitality / Reservations',
    description:
      'An AI booking assistant that handles reservations, answers FAQs, and qualifies leads 24/7 — integrated directly into the business workflow with saved conversation history.',
    image: 'tsi-ai-booking-portfolio.png',
    result: '24/7 automation',
    tech: ['Claude API', 'Supabase', 'Next.js'],
    theme: 'green',
  },
];

const imgSrc = (image: string | null) =>
  !image ? null : image.startsWith('http') ? image : `/${image}`;

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio')
          .select('*')
          .order('order', { ascending: true });

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
            }))
          );
        }
      } catch {
        // keep the curated fallback
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          title="Portfolio"
          subtitle="From Ethiopian wedding platforms to corporate chatbots — we build the digital products that matter."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projects.map((project, index) => {
            const src = imgSrc(project.image);
            return (
              <motion.div
                key={`${project.name}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="glass-card overflow-hidden hover:border-[var(--accent-blue)] hover:shadow-lg transition-all group"
              >
                {/* Project Image */}
                <div className="relative w-full h-64 bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] overflow-hidden border-b-4 border-[var(--accent-gold)]">
                  {src ? (
                    <div className="relative w-full h-full bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-card)]">
                      <Image
                        src={src}
                        alt={project.name}
                        width={1200}
                        height={675}
                        className={`w-full h-full group-hover:scale-105 transition-transform duration-300 ${
                          project.fit === 'contain' ? 'object-contain p-8' : 'object-cover'
                        }`}
                        priority={index < 2}
                        quality={90}
                      />
                      {/* Designed overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]/10 pointer-events-none" />
                      <div className="absolute inset-0 border-2 border-[var(--accent-gold)]/25 pointer-events-none" />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold font-sora text-white bg-black/45 backdrop-blur-sm border border-white/20">
                        {project.category.toUpperCase()}
                      </span>
                      <span className="absolute bottom-2 right-3 text-[11px] font-bold font-sora text-white/80">
                        MULE<span className="text-[var(--accent-gold)]">●</span>SOO
                      </span>
                    </div>
                  ) : (
                    <PortfolioCover
                      title={project.name}
                      category={project.category}
                      tagline={project.result}
                      theme={project.theme}
                    />
                  )}
                </div>

                {/* Project Info */}
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-bold font-sora text-[var(--text-primary)] leading-tight">
                    {project.name}
                  </h3>

                  {project.client && (
                    <p className="text-xs text-[var(--accent-gold)] font-semibold">{project.client}</p>
                  )}

                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2 min-h-10">
                    {project.description}
                  </p>

                  {project.result && (
                    <div className="pt-2 border-t border-[var(--border)]">
                      <p className="text-xs text-[var(--accent-gold)] font-bold">✨ {project.result}</p>
                    </div>
                  )}

                  {project.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.tech.map((tech: string) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] rounded hover:border-[var(--accent-blue)] transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-2 mt-2 text-center text-sm font-bold text-[var(--accent-blue)] bg-[var(--glow-blue)]/30 hover:bg-[var(--glow-blue)] rounded transition-colors"
                    >
                      Visit Live Site →
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold font-sora mb-4 gradient-text">
            Ready to Build Your Next Project?
          </h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            Let&apos;s create something amazing together. Start with a free consultation.
          </p>
          <a
            href="/contact"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform"
          >
            Get Started
          </a>
        </motion.div>
      </div>
    </div>
  );
}
