'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          title="Our Portfolio"
          subtitle="From Ethiopian wedding platforms to corporate chatbots — we build the digital products that matter."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
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
          ].map((project: any, index: number) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card overflow-hidden hover:border-[var(--accent-blue)] hover:glow-blue transition-all group"
            >
              {/* Project Image */}
              <div className="w-full h-56 bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] overflow-hidden relative">
                {project.image ? (
                  <Image
                    src={`/${project.image}`}
                    alt={project.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--accent-blue)]/20 to-[var(--accent-purple)]/20">
                    <div className="text-center">
                      <p className="text-[var(--accent-blue)] text-2xl font-bold mb-2">🚀</p>
                      <p className="text-[var(--text-secondary)] text-sm">{project.category}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 bg-[var(--glow-blue)] text-[var(--accent-blue)] text-xs font-bold rounded-full">
                    {project.category}
                  </span>
                  {project.result && (
                    <span className="text-xs text-[var(--accent-gold)] font-bold">{project.result}</span>
                  )}
                </div>

                <h3 className="text-lg font-bold font-sora text-[var(--text-primary)] mb-2">
                  {project.name}
                </h3>

                <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
                  {project.description}
                </p>

                <p className="text-xs text-[var(--accent-gold)] mb-3 font-semibold">
                  {project.client}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech: string) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <button className="w-full py-2 text-sm font-bold text-[var(--accent-blue)] hover:bg-[var(--glow-blue)] rounded transition-colors">
                  View Details →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
