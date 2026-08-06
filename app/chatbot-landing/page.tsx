'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ArrowRight, MessageCircle } from 'lucide-react';

export default function ChatbotLanding() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Minimal Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur border-b border-[var(--border)] px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-lg font-bold font-sora">
            <span className="text-[var(--accent-blue)]">MULE</span>
            <span>SOO</span>
          </Link>
          <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)]">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[var(--glow-blue)] border border-[var(--accent-blue)]/40 text-sm font-bold text-[var(--accent-blue)]">
              AI Chatbot That Books Clients 24/7
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold font-sora mb-6 leading-tight"
          >
            Stop Answering The Same Questions. Let AI Do It.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            An intelligent chatbot that handles customer inquiries 24/7, books appointments, captures leads, and qualifies prospects — so you can focus on closing deals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/contact?service=AI%20Chatbot"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-lg hover:scale-105 transition-transform text-lg"
            >
              Book Free Consultation <ArrowRight size={20} />
            </Link>
            <Link
              href="/case-studies"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[var(--accent-blue)] text-[var(--accent-blue)] font-bold rounded-lg hover:bg-[var(--glow-blue)] transition-colors text-lg"
            >
              See Results
            </Link>
          </motion.div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-sora mb-12 text-center gradient-text"
          >
            The Customer Service Trap
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '⏰', title: 'Time Waster', desc: 'Spending 10+ hours/week answering "What are your hours?" and "What\'s your pricing?"' },
              { icon: '😫', title: 'Missed Leads', desc: 'Customers message at 11 PM, you respond at 9 AM next day. They\'ve already booked someone else.' },
              { icon: '💸', title: 'Expensive Team', desc: 'Hiring someone to do customer service costs R8K-15K/month. And they still miss inquiries.' },
              { icon: '🎯', title: 'No Qualification', desc: 'You spend time on tire-kickers instead of hot prospects.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-6 border border-[var(--border)]"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* THE SOLUTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-sora mb-4 text-center gradient-text"
          >
            Your Personal Booking Agent
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center text-[var(--text-secondary)] text-lg mb-12 max-w-2xl mx-auto"
          >
            An AI chatbot trained on YOUR business. It handles 80%+ of inquiries automatically.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: '💬', title: 'Answers Instantly', desc: 'Customers get replies in seconds, not hours. Even at 2 AM.' },
              { icon: '📅', title: 'Books Appointments', desc: 'Takes reservations, sends confirmations, reduces no-shows with reminders.' },
              { icon: '💰', title: 'Captures Leads', desc: 'Collects emails, phone numbers, project details automatically.' },
              { icon: '🎯', title: 'Qualifies Prospects', desc: 'Asks the right questions. Passes hot leads to you. Wastes no time on tire-kickers.' },
              { icon: '💬', title: 'Bilingual (Optional)', desc: 'Speak English and another language? We can do that.' },
              { icon: '🤖', title: 'Gets Smarter', desc: 'The more it interacts, the better it gets. Learns your tone and processes.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-6 border border-[var(--border)] hover:border-[var(--accent-blue)] transition-colors"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-sora mb-12 gradient-text"
          >
            Results That Speak For Themselves
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="glass-card p-8 border border-[var(--border)] mb-8"
          >
            <p className="text-3xl font-bold gradient-text mb-3">100% of Inquiries Captured</p>
            <p className="text-[var(--text-secondary)] mb-4">Shime Events used to miss 40% of customer inquiries because staff were busy. Now they capture every single one — 24/7.</p>
            <p className="text-sm text-[var(--text-secondary)]">
              <strong>"The chatbot handles everything. Customers love the instant responses. We haven't missed a single lead since we launched it."</strong>
              <br /> — Thabo, Shime Events
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { metric: '80%+', label: 'Inquiries Automated' },
              { metric: 'Instant', label: 'Response Time' },
              { metric: '24/7', label: 'Always Available' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 border border-[var(--border)]">
                <p className="text-3xl font-bold gradient-text mb-2">{item.metric}</p>
                <p className="text-sm text-[var(--text-secondary)]">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-sora mb-12 text-center gradient-text"
          >
            Works For Any Business
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '🏋️', business: 'Gym/Fitness', use: 'Takes membership inquiries, books consultations, answers "Do you have a pool?" 1,000 times/month so you don\'t.' },
              { icon: '🎉', business: 'Events/Planning', use: 'Handles bookings, quotes, "What\'s the price for 100 guests?" Gets leads qualified.' },
              { icon: '🍽️', business: 'Restaurant/Catering', use: 'Takes reservations, answers menu questions, reduces no-shows with reminders.' },
              { icon: '👨‍💼', business: 'Agencies/Services', use: 'Qualifies prospects on budget/timeline. Only books high-fit clients.' },
              { icon: '🏥', business: 'Medical/Wellness', use: 'Books appointments, confirms attendance, asks health questions upfront.' },
              { icon: '🛍️', business: 'E-Commerce', use: 'Tracks orders, handles returns, upsells with smart recommendations.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-6 border border-[var(--border)]"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.business}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.use}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-sora mb-12 text-center gradient-text"
          >
            Simple Pricing
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter',
                price: 'R2,500',
                desc: 'Basic chatbot for small businesses',
                features: [
                  'FAQ automation',
                  'Email capture',
                  'Basic responses',
                  'Admin dashboard',
                  'Chat logs',
                  '1-week setup',
                ],
              },
              {
                name: 'Business',
                price: 'R4,500',
                desc: 'Full-featured chatbot. Most popular.',
                features: [
                  'All Starter features',
                  'Appointment booking',
                  'WhatsApp integration',
                  'Lead qualification',
                  'Analytics',
                  '2-week setup',
                ],
                popular: true,
              },
              {
                name: 'Enterprise',
                price: 'R8,000+',
                desc: 'Advanced AI. Custom everything.',
                features: [
                  'All Business features',
                  'Bilingual support',
                  'Custom integrations',
                  'SMS/voice support',
                  'Monthly optimization',
                  '3-week setup',
                ],
              },
            ].map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`glass-card p-8 border rounded-xl ${
                  tier.popular
                    ? 'border-[var(--accent-blue)] bg-[var(--glow-blue)]/10 ring-2 ring-[var(--accent-blue)]/30'
                    : 'border-[var(--border)]'
                }`}
              >
                {tier.popular && (
                  <div className="mb-4 inline-block px-3 py-1 rounded-full bg-[var(--accent-blue)] text-white text-xs font-bold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">{tier.desc}</p>
                <p className="text-4xl font-bold gradient-text mb-6">{tier.price}</p>
                <div className="space-y-3 mb-8">
                  {tier.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2">
                      <Check size={18} className="text-[var(--accent-green)] flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feat}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/contact?service=AI%20Chatbot"
                  className={`block text-center py-3 rounded-lg font-bold transition-all ${
                    tier.popular
                      ? 'bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white hover:scale-105'
                      : 'border border-[var(--accent-blue)] text-[var(--accent-blue)] hover:bg-[var(--glow-blue)]'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-card p-12 border-2 border-[var(--accent-green)]"
          >
            <p className="text-2xl font-bold mb-4">🛡️ Money-Back Guarantee</p>
            <p className="text-lg text-[var(--text-secondary)]">
              If your chatbot doesn't capture leads or automate inquiries, we refund you. Guaranteed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-sora mb-12 text-center gradient-text"
          >
            Common Questions
          </motion.h2>

          <div className="space-y-4">
            {[
              {
                q: 'How long to set up?',
                a: 'Typically 1-3 weeks depending on complexity. We handle everything — you just review and approve.',
              },
              {
                q: 'Can it handle complex questions?',
                a: 'Yes. It uses advanced AI (Claude API) that understands context. It learns from your previous interactions.',
              },
              {
                q: 'Will it feel "robotic"?',
                a: 'No. We train it on your tone and voice. Customers think they\'re chatting with a real person.',
              },
              {
                q: 'What if it makes a mistake?',
                a: 'You set rules. If confidence is low, it hands off to you via email or WhatsApp.',
              },
              {
                q: 'Can it integrate with my existing systems?',
                a: 'Yes. We can connect it to your CRM, scheduling system, Stripe, or whatever you use.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="glass-card p-6 border border-[var(--border)]"
              >
                <h3 className="font-bold text-lg mb-2">{item.q}</h3>
                <p className="text-[var(--text-secondary)]">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold font-sora mb-6 gradient-text">
              Ready to Stop Answering The Same Questions?
            </h2>
            <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
              Book a free consultation. We'll show you exactly how a chatbot would handle your business.
            </p>
            <Link
              href="/contact?service=AI%20Chatbot"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-lg hover:scale-105 transition-transform text-lg"
            >
              Book Free Consultation <ArrowRight size={20} />
            </Link>
            <p className="text-sm text-[var(--text-secondary)] mt-6">
              💬 Or WhatsApp: <a href="https://wa.me/27688529333" className="text-[var(--accent-blue)] hover:underline">Chat Now</a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
