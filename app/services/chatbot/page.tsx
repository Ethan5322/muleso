'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import AnswerBlock from '@/components/AnswerBlock';
import PageHero from '@/components/PageHero';

export default function ChatbotPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          eyebrow="Pretoria · Gauteng · South Africa"
          title="Your Business, On Autopilot"
          subtitle="AI chatbots and booking systems that answer questions, take reservations, and qualify leads — 24 hours a day. Built in Pretoria for South African businesses."
          trust="Live for Tsedi Catering, Shime Events & Yoyo Gym"
        />

        <AnswerBlock slug="chatbot" />

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
              <motion.div key={feature.title} whileHover={{ translateY: -4 }} className="glass-card p-6 border border-[var(--border)] transition-all duration-300 hover:border-[var(--color-action-on-dark)] hover:shadow-lg hover:shadow-[var(--glow-action)]">
                <h3 className="text-lg font-bold font-sora text-[var(--text-primary)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm">{feature.desc}</p>
              </motion.div>
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
              <motion.div key={item.type} whileHover={{ translateY: -4 }} className="glass-card p-6 border border-[var(--border)] transition-all duration-300 hover:border-[var(--accent-gold)] hover:shadow-lg hover:shadow-[rgba(232,184,75,0.3)]">
                <p className="text-lg font-bold font-sora text-[var(--accent-gold)] mb-2">
                  {item.type}
                </p>
                <p className="text-[var(--text-secondary)] text-sm">{item.use}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dedicated target for the "restaurant booking system" search — the exact
            phrase in the H2, with location, so the page clearly matches the intent
            rather than only mentioning restaurants in passing. */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 glass-card p-8 md:p-12 border border-[var(--accent-gold)]"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-sora mb-4 gold-text">
            Restaurant Booking System in South Africa
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed max-w-3xl mb-6">
            Need a restaurant booking system that never misses a reservation? Our AI takes
            table bookings, answers menu and opening-hours questions, and confirms every guest
            automatically — day and night. Diners book straight from your website, Instagram or a
            QR code on the table, while you keep a live view of every reservation. Built in
            Pretoria for restaurants and caterers across Gauteng and South Africa.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { t: 'Takes reservations 24/7', d: 'No missed calls, no double-bookings, no front-of-house admin.' },
              { t: 'Answers menu questions', d: 'Dietary, pricing and opening hours, answered instantly.' },
              { t: 'Confirms every guest', d: 'Automatic WhatsApp or email confirmation and reminders.' },
            ].map((f) => (
              <motion.div key={f.t} whileHover={{ translateY: -3 }} className="glass-card p-5 border border-[var(--border)] transition-all duration-300 hover:border-[var(--accent-gold)] hover:shadow-md hover:shadow-[rgba(232,184,75,0.25)]">
                <h3 className="font-bold font-sora text-[var(--text-primary)] mb-1">{f.t}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{f.d}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-6">
            Live proof: our booking systems already run for Tsedi Catering and Shime Events.{' '}
            <Link href="/contact" className="text-[var(--color-action-on-dark)] font-semibold hover:underline">
              Get a restaurant booking system →
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 glass-card p-12 text-center border border-[var(--color-action-on-dark)]"
        >
          <h2 className="text-4xl font-bold font-sora mb-6 gradient-text">Custom Pricing for Every Budget</h2>
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            Chatbot costs vary based on complexity, integration needs, and support level. We create custom solutions that fit your budget.
          </p>
          <div className="mb-8 space-y-4">
            <div>
              <p className="text-lg text-[var(--color-action-on-dark)] font-sora font-bold mb-2">
                Contact Ena Muluken Directly for Custom Pricing
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <a
                    href="mailto:hello@mulesoo.com"
                    className="inline-block px-6 py-3 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-hover)] text-[var(--color-action-ink)] font-bold rounded-lg shadow-lg hover:shadow-[0_8px_30px_var(--glow-action)] transition-shadow"
                  >
                    Email: hello@mulesoo.com
                  </a>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <a
                    href="https://wa.me/27688529333"
                    className="inline-block px-6 py-3 bg-[#25D366] text-white font-bold rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-shadow"
                  >
                    WhatsApp: +27 68 852 9333
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            We will discuss your specific needs and provide a custom quote within 2 hours.
          </p>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">Chatbot FAQ</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: 'How much does a chatbot cost?',
                a: 'Chatbots start at R2,500 (Starter) up to R8,000+ (Enterprise). The R4,500 Business tier is most popular — includes appointment booking, WhatsApp integration, and lead qualification. Get a custom quote in minutes.',
              },
              {
                q: 'How long to set up?',
                a: 'Typically 1-3 weeks depending on complexity. We handle the entire setup — you just review and approve. We\'ll have it live and handling inquiries within 21 days.',
              },
              {
                q: 'Can it handle complex questions?',
                a: 'Yes. We train it on your specific business knowledge — pricing, policies, procedures, FAQs. It uses advanced AI (Claude API) that understands context and learns from every interaction.',
              },
              {
                q: 'Will customers know it\'s an AI?',
                a: 'We train it to match your tone and voice. Most customers think they\'re chatting with a real person. If needed, we can transparently say "I\'m an AI, but I can help" upfront.',
              },
              {
                q: 'What if it gives wrong information?',
                a: 'You set rules and confidence thresholds. If the chatbot isn\'t confident about an answer, it automatically hands off to you via email or WhatsApp. You maintain full control.',
              },
              {
                q: 'Can it take payments?',
                a: 'Yes! The Business and Enterprise tiers can take deposits and payments through Stripe. It can even send digital agreements via email.',
              },
              {
                q: 'Can it work in other languages?',
                a: 'Absolutely. Enterprise tier supports bilingual (or more) chatbots. Great for serving diverse customer bases.',
              },
              {
                q: 'Do you provide support after launch?',
                a: 'Yes. 30 days of free fixes included. After that, we offer monthly optimization and training plans (R1,000-3,000/month) to keep it sharp.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="glass-card p-6 hover:border-[var(--color-action-on-dark)] transition-all duration-300 border border-[var(--border)]"
              >
                <h3 className="font-bold text-[var(--text-primary)] mb-3 text-lg">{item.q}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
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
            className="inline-block px-10 py-4 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-hover)] text-[var(--color-action-ink)] font-bold font-sora rounded-lg hover:scale-105 transition-transform text-lg"
          >
            Schedule Your Demo
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
