'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';
import { supabase } from '@/lib/supabase';

interface Project {
  name: string;
  category: string;
  client: string;
  description: string;
  image: string | null;
  result: string;
  tech: string[];
  link?: string;
}

// Curated fallback — shown if the portfolio table is empty or unavailable.
const fallbackProjects: Project[] = [
  {
    name: 'Habesha Celebration Events',
    category: 'Website',
    client: 'Full-Service Ethiopian Wedding & Event Planning',
    description: 'Professional event booking platform with responsive design and integrated payment system.',
    image: 'habesha-celebration-portfolio.png',
    result: '+300% bookings increase',
    tech: ['Next.js', 'React', 'Stripe'],
  },
  {
    name: 'Restaurant Booking Bot',
    category: 'Chatbot',
    client: 'Restaurant Reservation System',
    description: 'AI-powered chatbot for reservation management, menu inquiries, and order tracking.',
    image: 'tsi-ai-booking-portfolio.png',
    result: '24/7 availability',
    tech: ['Claude API', 'Node.js', 'Supabase'],
  },
  {
    name: 'Law Firm Secretary AI',
    category: 'Chatbot',
    client: 'Legal Services',
    description: 'Intelligent AI assistant for client intake screening and appointment scheduling.',
    image: null,
    result: '80% time saved',
    tech: ['GPT-4o', 'Supabase', 'Twilio'],
  },
  {
    name: 'Ethiopian Food Store',
    category: 'E-commerce',
    client: 'Online Retail',
    description: 'Full-featured e-commerce platform with product catalog, shopping cart, and payment integration.',
    image: null,
    result: '$50K+ revenue',
    tech: ['Next.js', 'Stripe', 'React'],
  },
  {
    name: 'Church Community Site',
    category: 'Website',
    client: 'Religious Organization',
    description: 'Community platform for event management, member communication, and donation processing.',
    image: null,
    result: '500+ members',
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    name: 'Habesha Events Logo & Branding',
    category: 'Logo Design',
    client: 'Brand Identity',
    description: 'Professional logo design and complete brand identity system for events company.',
    image: null,
    result: 'Award-winning design',
    tech: ['Adobe Illustrator', 'Canva Pro'],
  },
];

const imgSrc = (image: string | null) =>
  !image ? null : image.startsWith('http') ? image : `/${image}`;

const categoryEmoji = (category: string) =>
  category === 'Website' ? '🌐'
  : category === 'Chatbot' ? '🤖'
  : category === 'E-commerce' ? '🛍️'
  : category === 'Logo' || category === 'Logo Design' ? '🎨'
  : category === 'QR Code' ? '📱'
  : category === 'PDF' ? '📄'
  : '✨';

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
                    <div className="relative w-full h-full bg-black/10">
                      <Image
                        src={src}
                        alt={project.name}
                        width={1200}
                        height={675}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        priority={index < 2}
                        quality={90}
                      />
                      <div className="absolute inset-0 border-2 border-[var(--accent-gold)]/20 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--accent-blue)]/20 to-[var(--accent-purple)]/20 backdrop-blur-sm">
                      <div className="text-center">
                        <p className="text-4xl font-bold mb-3">{categoryEmoji(project.category)}</p>
                        <p className="text-[var(--text-secondary)] text-sm font-semibold">{project.category}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-[var(--glow-blue)] text-[var(--accent-blue)] text-xs font-bold rounded-full mb-2">
                      {project.category}
                    </span>
                    <h3 className="text-lg font-bold font-sora text-[var(--text-primary)] leading-tight">
                      {project.name}
                    </h3>
                  </div>

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
