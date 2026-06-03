'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ChatbotPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl font-bold gradient-text font-sora mb-6">
            Your Business, On Autopilot
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            AI chatbots that answer questions, book appointments, and qualify leads — 24 hours a day.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">What Makes Our Bots Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Natural Language', desc: 'Understands conversational messages' },
              { title: 'Trained on Your Business', desc: 'Knows your products, prices, policies' },
              { title: 'Lead Collection', desc: 'Captures name, email, and intent' },
              { title: 'WhatsApp Integration', desc: 'Can connect to WhatsApp Business API' },
              { title: 'Supabase Logging', desc: 'Every conversation is saved and searchable' },
              { title: 'Easy to Embed', desc: 'One script tag on any website' },
            ].map((feature) => (
              <div key={feature.title} className="glass-card p-6">
                <h3 className="text-lg font-bold font-sora text-[var(--text-primary)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Use Cases */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">Who Benefits Most</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { type: 'Restaurant', use: 'Takes reservations and answers menu questions' },
              { type: 'Law Firm', use: 'Screens client intake and books consultations' },
              { type: 'Events Business', use: 'Handles pricing enquiries and package bookings' },
              { type: 'E-commerce', use: 'Tracks orders and handles returns' },
              { type: 'Medical Practice', use: 'Books appointments and answers FAQ' },
              { type: 'Services', use: 'Qualifies leads before handing to sales team' },
            ].map((item) => (
              <div key={item.type} className="glass-card p-6">
                <p className="text-lg font-bold font-sora text-[var(--accent-gold)] mb-2">
                  {item.type}
                </p>
                <p className="text-[var(--text-secondary)] text-sm">{item.use}</p>
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
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Starter', price: 'R2,500/mo', features: ['Single bot', 'Basic training', 'Email support', 'Analytics'] },
              { name: 'Business', price: 'R4,500/mo', features: ['Multiple bots', 'Advanced training', 'WhatsApp integration', 'Priority support', 'Custom domain'] },
              { name: 'Enterprise', price: 'R8,000+/mo', features: ['Unlimited bots', 'Custom AI model', 'API access', 'Dedicated support', 'Custom integrations'] },
            ].map((tier) => (
              <div key={tier.name} className="glass-card p-8">
                <h3 className="text-2xl font-bold font-sora mb-2">{tier.name}</h3>
                <p className="text-3xl font-bold gold-text mb-6">{tier.price}</p>
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                      <span className="text-[var(--accent-green)]">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
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
          <h2 className="text-4xl font-bold font-sora mb-6 gradient-text">Ready to Automate?</h2>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform text-lg"
          >
            Schedule Your Demo
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
