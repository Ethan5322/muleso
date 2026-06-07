'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';

export default function ChatbotPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          title="Your Business, On Autopilot"
          subtitle="AI chatbots that answer questions, book appointments, and qualify leads. 24 hours a day."
        />

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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 glass-card p-12 text-center border border-[var(--accent-blue)]"
        >
          <h2 className="text-4xl font-bold font-sora mb-6 gradient-text">Custom Pricing for Every Budget</h2>
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            Chatbot costs vary based on complexity, integration needs, and support level. We create custom solutions that fit your budget.
          </p>
          <div className="mb-8 space-y-4">
            <div>
              <p className="text-lg text-[var(--accent-blue)] font-sora font-bold mb-2">
                Contact Ethan Directly for Custom Pricing
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:mulukenendashaw68@gmail.com"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-lg hover:scale-105 transition-transform"
                >
                  Email: mulukenendashaw68@gmail.com
                </a>
                <a
                  href="https://wa.me/27759440377"
                  className="inline-block px-6 py-3 bg-[#25D366] text-white font-bold rounded-lg hover:scale-105 transition-transform"
                >
                  WhatsApp: +27 (781) 500-968
                </a>
              </div>
            </div>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            We will discuss your specific needs and provide a custom quote within 2 hours.
          </p>
        </motion.div>

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
