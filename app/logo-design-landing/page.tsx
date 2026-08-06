'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Palette, Sparkles, Clock, Zap, Award } from 'lucide-react';
import FaqSection from '@/components/FaqSection';

const LOGO_FAQS = [
  {
    q: 'How many logo concepts do I get?',
    a: 'Starter: 3 concepts. Business: 5 concepts with revisions. Enterprise: unlimited concepts until you\'re happy.',
  },
  {
    q: 'Can I use my logo everywhere?',
    a: 'Yes! You get full ownership and all file formats (PNG, SVG, PDF, AI) for web, print, and merchandise.',
  },
  {
    q: 'How long does logo design take?',
    a: 'Starter: 5-7 days. Business: 3-5 days. Enterprise: 2-3 days with priority turnaround.',
  },
  {
    q: 'What if I don\'t like the designs?',
    a: 'We keep refining until it\'s perfect. Business and Enterprise tiers include unlimited revisions.',
  },
  {
    q: 'Do you design logos for established brands?',
    a: 'Absolutely! We redesign and rebrand established businesses. Just tell us your vision.',
  },
];

export default function LogoDesignLanding() {
  const [selectedTier, setSelectedTier] = useState('business');

  const tiers = [
    {
      name: 'Starter',
      price: 'R800',
      description: 'Perfect for new businesses',
      features: [
        '3 logo concepts',
        '2 rounds of revisions',
        'All file formats (PNG, SVG, PDF)',
        '5-7 day turnaround',
        'Basic consultation',
      ],
      notIncluded: ['Unlimited revisions', 'Brand guidelines', 'Mockups'],
      highlighted: false,
    },
    {
      name: 'Business',
      price: 'R1,800',
      description: 'Most popular choice',
      features: [
        '5 logo concepts',
        'Unlimited revisions',
        'All file formats + AI file',
        '3-5 day turnaround',
        'Deep brand consultation',
        'Logo mockups (website, business card)',
        'Premium support',
      ],
      notIncluded: ['Full brand identity', 'Trademark research'],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'R3,500+',
      description: 'Full brand transformation',
      features: [
        'Unlimited concepts',
        'Unlimited revisions',
        'All file formats + brand guidelines',
        '2-3 day priority turnaround',
        'Strategic brand consultation',
        'Full visual identity (colors, fonts)',
        'Trademark research & guidance',
        'Dedicated designer',
        '30-day after-launch support',
      ],
      notIncluded: [],
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--glow-gold)] to-transparent opacity-20 blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6"
          >
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[var(--glow-gold)] to-transparent border border-[var(--accent-gold)]">
              <span className="text-[var(--accent-gold)] font-sora text-sm font-bold">Professional Logo Design</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-sora leading-[1.05] tracking-tight mb-8"
          >
            <span className="text-[var(--text-primary)]">Your Brand's</span>{' '}
            <span className="gradient-text">Visual Identity</span>
            <br />
            <span className="gold-text">Starting at R800</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            A logo isn't just a picture — it's your brand's first handshake. We design logos that make people remember you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-16"
          >
            <Link href="/contact">
              <button className="px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-purple)] text-[var(--bg-primary)] font-bold font-sora rounded-lg hover:scale-105 transition-transform text-sm sm:text-lg whitespace-nowrap">
                Get Started Now
                <ArrowRight className="inline ml-2" size={20} />
              </button>
            </Link>
            <button className="px-4 sm:px-8 py-3 sm:py-4 border-2 border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold font-sora rounded-lg hover:bg-[var(--glow-gold)] transition-colors text-sm sm:text-lg whitespace-nowrap">
              View Portfolio
            </button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-[var(--text-secondary)]"
          >
            <div className="flex items-center gap-2">
              <Award size={18} className="text-[var(--accent-gold)]" />
              <span>50+ Logos Designed</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-[var(--accent-gold)]" />
              <span>100% Unique Designs</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-[var(--accent-gold)]" />
              <span>Fast Turnaround</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Logo Matters */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold font-sora mb-6 gradient-text">Why Your Logo Matters</h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              80% of customers choose brands based on visual identity. Your logo is your brand's first impression.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Palette,
                title: 'Professional First Impression',
                desc: 'A great logo tells clients you\'re serious, trustworthy, and worth their money.',
              },
              {
                icon: Zap,
                title: 'Memorable Brand Recall',
                desc: 'People remember visual brands 80% more than text. Your logo stays in their mind.',
              },
              {
                icon: Award,
                title: 'Competitive Advantage',
                desc: 'Stand out from competitors. A unique logo is your unfair advantage in the marketplace.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 border border-[var(--border)] rounded-xl hover:border-[var(--accent-gold)] transition-all"
              >
                <item.icon size={40} className="text-[var(--accent-gold)] mb-4" />
                <h3 className="text-2xl font-bold font-sora mb-3">{item.title}</h3>
                <p className="text-[var(--text-secondary)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold font-sora mb-16 text-center gradient-text"
          >
            Our Design Process
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Discovery', desc: 'We learn your brand story, vision, and market' },
              { step: '2', title: 'Concept', desc: 'We sketch multiple unique design directions' },
              { step: '3', title: 'Refine', desc: 'You choose concepts, we polish to perfection' },
              { step: '4', title: 'Deliver', desc: 'You receive all files, ready to use everywhere' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="glass-card p-8 border border-[var(--border)] rounded-xl h-full">
                  <div className="text-5xl font-bold font-sora text-[var(--accent-gold)] mb-4">{item.step}</div>
                  <h3 className="text-2xl font-bold font-sora mb-2">{item.title}</h3>
                  <p className="text-[var(--text-secondary)]">{item.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-[var(--accent-gold)]">
                    <ArrowRight size={24} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold font-sora mb-6 gradient-text">Simple Pricing</h2>
            <p className="text-xl text-[var(--text-secondary)]">Choose the package that fits your needs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`glass-card p-8 border rounded-xl transition-all ${
                  tier.highlighted
                    ? 'border-[var(--accent-gold)] shadow-lg shadow-[var(--glow-gold)] scale-105'
                    : 'border-[var(--border)] hover:border-[var(--accent-gold)]'
                }`}
              >
                {tier.highlighted && (
                  <div className="mb-4 px-4 py-2 bg-[var(--glow-gold)] border border-[var(--accent-gold)] rounded-full w-fit">
                    <span className="text-[var(--accent-gold)] font-bold text-sm">Most Popular</span>
                  </div>
                )}

                <h3 className="text-3xl font-bold font-sora mb-2">{tier.name}</h3>
                <p className="text-[var(--text-secondary)] mb-6">{tier.description}</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold font-sora text-[var(--accent-gold)]">{tier.price}</span>
                  <span className="text-[var(--text-secondary)] ml-2">one-time</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check size={20} className="text-[var(--accent-green)] flex-shrink-0 mt-1" />
                      <span className="text-[var(--text-secondary)]">{feature}</span>
                    </li>
                  ))}
                  {tier.notIncluded.map((feature, i) => (
                    <li key={`not-${i}`} className="flex items-start gap-3 opacity-50">
                      <X size={20} className="text-[var(--text-secondary)] flex-shrink-0 mt-1" />
                      <span className="text-[var(--text-secondary)]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contact">
                  <button
                    className={`w-full py-3 rounded-lg font-bold font-sora transition-all ${
                      tier.highlighted
                        ? 'bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-purple)] text-[var(--bg-primary)] hover:scale-105'
                        : 'border border-[var(--accent-gold)] text-[var(--accent-gold)] hover:bg-[var(--glow-gold)]'
                    }`}
                  >
                    Get Started
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold font-sora mb-16 text-center gradient-text"
          >
            Common Questions
          </motion.h2>
          <FaqSection faqs={LOGO_FAQS} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-primary)] border-y border-[var(--border)]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold font-sora mb-6 gradient-text"
          >
            Ready to Stand Out?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-2xl text-[var(--text-secondary)] mb-12"
          >
            Your perfect logo is just a conversation away.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link href="/contact">
              <button className="px-10 py-4 bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-purple)] text-[var(--bg-primary)] font-bold font-sora text-lg rounded-lg hover:scale-105 transition-transform">
                Start Your Project
              </button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-sm text-[var(--text-secondary)] mt-8"
          >
            ✨ Fast turnaround • 🎯 Unlimited revisions on Business+ • 💯 100% unique designs
          </motion.p>
        </div>
      </section>
    </div>
  );
}
