'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';

export default function WebsiteDesignPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          title="Websites That Make Your Competition Nervous"
          subtitle="Custom-built websites that load in under 2 seconds, convert visitors into customers, and rank on Google from day one."
        />

        {/* What You Get */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">What You Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Responsive Design',
              'SEO Optimised',
              'Blazing Fast',
              '3D Animations',
              'Contact Forms',
              'Custom Domain',
              '30-Day Support',
              'Source Code',
            ].map((item) => (
              <div key={item} className="glass-card p-6 text-center">
                <p className="text-[var(--text-primary)] font-sora font-bold">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'STARTER', price: 'R3,500', features: ['3 pages', 'Mobile responsive', 'Basic SEO', 'Contact form', '2-week delivery'] },
              { name: 'BUSINESS', price: 'R7,500', features: ['6 pages', 'Advanced animations', 'AI chatbot included', 'SEO full setup', '3-week delivery'], popular: true },
              { name: 'ENTERPRISE', price: 'R15,000+', features: ['Unlimited pages', '3D animations', 'E-commerce ready', 'Monthly maintenance', 'Priority support'] },
            ].map((tier) => (
              <motion.div
                key={tier.name}
                whileHover={{ scale: 1.05 }}
                className={`glass-card p-8 ${tier.popular ? 'border-2 border-[var(--accent-blue)] glow-blue' : 'border border-[var(--border)]'}`}
              >
                {tier.popular && (
                  <div className="text-center mb-4">
                    <span className="px-4 py-1 bg-[var(--glow-blue)] text-[var(--accent-blue)] rounded-full text-xs font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold font-sora mb-2">{tier.name}</h3>
                <p className="text-3xl font-bold gold-text mb-6">{tier.price}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                      <span className="text-[var(--accent-green)]">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="block w-full py-3 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold text-center rounded-lg hover:scale-105 transition-transform"
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold font-sora mb-6 gradient-text">Ready to Launch?</h2>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform text-lg"
          >
            Book a Free Consultation
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
