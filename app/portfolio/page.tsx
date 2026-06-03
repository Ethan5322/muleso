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
            { name: 'Habesha Celebration Events', category: 'Website', client: 'Events Business', image: 'habesha-events' },
            { name: 'Restaurant Booking Bot', category: 'Chatbot', client: 'Restaurant', image: 'restaurant-bot' },
            { name: 'Law Firm Secretary AI', category: 'Chatbot', client: 'Legal', image: 'law-firm-ai' },
            { name: 'Ethiopian Food Store', category: 'Website', client: 'E-commerce', image: 'food-store' },
            { name: 'Church Community Site', category: 'Website', client: 'Religious Org', image: 'church-site' },
            { name: 'Habesha Events Logo', category: 'Logo', client: 'Events Business', image: 'habesha-logo' },
          ].map((project: any) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="glass-card p-6 hover:border-[var(--accent-blue)] transition-all overflow-hidden"
            >
              <div className="w-full h-40 bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] rounded-lg mb-4 overflow-hidden relative">
                {/* Project Image - Upload /public/portfolio-{image-name}.jpg */}
                <Image
                  src={`/portfolio-${project.image}.jpg`}
                  alt={project.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
                {/* Fallback gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-blue)]/40 to-[var(--accent-purple)]/40 flex items-center justify-center pointer-events-none">
                  <span className="text-white/40 text-xs text-center">
                    <p>{project.category}</p>
                    <p className="text-[10px] mt-1 opacity-60">/public/portfolio-{project.image}.jpg</p>
                  </span>
                </div>
              </div>
              <span className="inline-block px-3 py-1 bg-[var(--glow-blue)] text-[var(--accent-blue)] text-xs font-bold rounded-full mb-2">
                {project.category}
              </span>
              <h3 className="text-lg font-bold font-sora text-[var(--text-primary)] mb-1">
                {project.name}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">{project.client}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
