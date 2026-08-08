'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';


export default function WebsiteDesignLandingClient() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Minimal Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur border-b border-[var(--border)] px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-lg font-bold font-sora">
            <span className="text-[var(--color-action-on-dark)]">MULE</span>
            <span>SOO</span>
          </Link>
          <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--color-action-on-dark)]">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* HERO: Problem + Solution */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[var(--glow-action)] border border-[var(--color-action-on-dark)]/40 text-sm font-bold text-[var(--color-action-on-dark)]">
              Website Design That Converts
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold font-sora mb-6 leading-tight"
          >
            Your Website Should Make Money, Not Look Pretty
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Most websites lose 90% of visitors. Ours don't. We build fast, beautiful websites that turn browsers into paying customers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <Link
              href="/contact?service=Website%20Design"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-8 py-3 sm:py-4 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-hover)] text-[var(--color-action-ink)] font-bold rounded-lg hover:scale-105 transition-transform text-sm sm:text-lg whitespace-nowrap"
            >
              Book Free Consultation <ArrowRight size={20} />
            </Link>
            <Link
              href="/case-studies"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-8 py-3 sm:py-4 border border-[var(--color-action-on-dark)] text-[var(--color-action-on-dark)] font-bold rounded-lg hover:bg-[var(--glow-action)] transition-colors text-sm sm:text-lg whitespace-nowrap"
            >
              See Our Work
            </Link>
          </motion.div>
        </div>
      </section>

      {/* THE PROBLEM: What's Killing Your Sales */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-sora mb-12 text-center gradient-text"
          >
            Why Your Current Website Isn't Working
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '❌', title: 'Slow & Outdated', desc: 'Customers bounce before it loads. Google ranks you lower.' },
              { icon: '❌', title: 'No Clear Path', desc: 'Visitors don\'t know what to do next — so they leave.' },
              { icon: '❌', title: 'No Mobile Love', desc: '60% use phones. Your site looks broken on mobile?' },
              { icon: '❌', title: 'Looks Generic', desc: 'Your site looks like 1,000 others. Nothing stands out.' },
              { icon: '❌', title: 'No AI Automation', desc: 'You answer the same questions manually. Waste of time.' },
              { icon: '❌', title: 'Lost Leads', desc: 'Visitors interested but no way to capture them. They go to competitors.' },
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

      {/* THE SOLUTION: What We Do */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-sora mb-4 text-center gradient-text"
          >
            MuleSoo Websites Are Different
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center text-[var(--text-secondary)] text-lg mb-12 max-w-2xl mx-auto"
          >
            We don't build websites. We build lead-generation machines.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Loads in under 2 seconds. Google ranks you higher. Visitors stay.' },
              { icon: '🎯', title: 'Converts Visitors', desc: 'Clear path from "hello" to "book now". Every element has a job.' },
              { icon: '📱', title: 'Mobile Perfect', desc: 'Flawless on phones, tablets, desktops. No breakage, no headaches.' },
              { icon: '✨', title: 'Premium Design', desc: 'Custom built for YOUR brand. Stands out. Makes competitors jealous.' },
              { icon: '🤖', title: 'AI Chatbot Included', desc: 'Answers questions 24/7. Captures leads while you sleep.' },
              { icon: '📊', title: 'Analytics Ready', desc: 'Track everything. Know exactly what\'s working and what\'s not.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-6 border border-[var(--border)] hover:border-[var(--color-action-on-dark)] transition-colors"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF: Real Results */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-sora mb-12 gradient-text"
          >
            Real Results From Real Clients
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="glass-card p-8 border border-[var(--border)] mb-8"
          >
            <p className="text-3xl font-bold gradient-text mb-3">+300% Bookings</p>
            <p className="text-[var(--text-secondary)] mb-4">Yoyo Gym's website now brings in 3x more member sign-ups per month.</p>
            <p className="text-sm text-[var(--text-secondary)]">
              <strong>"We went from 20 inquiries/month to 60+. The website design is clean, the AI chatbot handles FAQs automatically, and our phone stopped ringing with basic questions."</strong>
              <br /> — Kgosi, Yoyo Gym
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
              { metric: '10 days', label: 'From Brief to Launch' },
              { metric: '99%', label: 'Page Speed Score' },
              { metric: '24/7', label: 'Lead Capture (AI)' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 border border-[var(--border)]">
                <p className="text-3xl font-bold gradient-text mb-2">{item.metric}</p>
                <p className="text-sm text-[var(--text-secondary)]">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PROCESS: How We Work */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-sora mb-12 text-center gradient-text"
          >
            Our Process (4 Weeks, Simplified)
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: 1, title: 'Discovery', desc: 'We learn your business, goals, audience in detail.' },
              { num: 2, title: 'Design', desc: 'We present 2 visual mockups in Figma for approval.' },
              { num: 3, title: 'Build', desc: 'We code + set up AI chatbot. You review + give feedback.' },
              { num: 4, title: 'Launch', desc: 'We deploy, test, hand you full access + source code.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 border border-[var(--border)]"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--color-action-primary)] flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-lg">{item.num}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING: Transparent Tiers */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-sora mb-12 text-center gradient-text"
          >
            Simple Pricing (No Surprises)
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter',
                price: 'R3,500',
                desc: 'Perfect if you\'re just starting online',
                features: [
                  '3 pages (Home, About, Contact)',
                  'Mobile responsive',
                  'Basic SEO setup',
                  'Contact form',
                  'Simple chatbot',
                  '2-week delivery',
                ],
              },
              {
                name: 'Business',
                price: 'R7,500',
                desc: 'Most popular. Best for growing businesses',
                features: [
                  '6+ pages + subpages',
                  'Premium animations',
                  'Advanced AI chatbot',
                  'Full SEO setup',
                  'Analytics setup',
                  '3-week delivery',
                ],
                popular: true,
              },
              {
                name: 'Enterprise',
                price: 'R15,000+',
                desc: 'For serious growth. Custom everything.',
                features: [
                  'Unlimited pages',
                  '3D animations',
                  'E-commerce ready',
                  'Advanced integrations',
                  'Monthly maintenance',
                  '4-week delivery',
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
                    ? 'border-[var(--color-action-on-dark)] bg-[var(--glow-action)]/10 ring-2 ring-[var(--color-action-on-dark)]/30'
                    : 'border-[var(--border)]'
                }`}
              >
                {tier.popular && (
                  <div className="mb-4 inline-block px-3 py-1 rounded-full bg-[var(--color-action-primary)] text-white text-xs font-bold">
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
                  href="/contact?service=Website%20Design"
                  className={`block text-center py-3 rounded-lg font-bold transition-all ${
                    tier.popular
                      ? 'bg-[var(--color-action-primary)] hover:bg-[var(--color-action-hover)] text-[var(--color-action-ink)] hover:scale-105'
                      : 'border border-[var(--color-action-on-dark)] text-[var(--color-action-on-dark)] hover:bg-[var(--glow-action)]'
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
            <p className="text-2xl font-bold mb-4">🛡️ 100% Satisfaction Guarantee</p>
            <p className="text-lg text-[var(--text-secondary)] mb-6">
              If you're not 100% happy with your website, we refund your deposit in full. No questions asked. That's how confident we are in our work.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[
                { icon: '✓', label: 'Unlimited Revisions' },
                { icon: '✓', label: '30-Day Free Support' },
                { icon: '✓', label: 'You Own Everything' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-3xl text-[var(--accent-green)] mb-2">{item.icon}</p>
                  <p className="text-sm font-bold">{item.label}</p>
                </div>
              ))}
            </div>
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
            Questions? We've Got Answers.
          </motion.h2>

          <div className="space-y-4">
            {[
              {
                q: 'How long does a website take to build?',
                a: 'Typically 2-4 weeks depending on complexity. Most clients get a website in 3 weeks.',
              },
              {
                q: 'Will it work on mobile?',
                a: 'Yes. Every website we build is 100% mobile-responsive. We test on phones, tablets, desktops.',
              },
              {
                q: 'Do I own the website after launch?',
                a: 'Absolutely. You get full source code, all assets, and complete access. No ongoing fees or surprises.',
              },
              {
                q: 'Can you add the AI chatbot?',
                a: 'Yes! The chatbot is included in Business and Enterprise tiers. It handles FAQs and captures leads 24/7.',
              },
              {
                q: 'What if I need changes after launch?',
                a: 'All websites include 30 days of free fixes post-launch. After that, we offer affordable maintenance plans.',
              },
              {
                q: 'How much does hosting/domain cost?',
                a: 'Domain is ~R100-300/year. Hosting is ~R50-100/month. We can set these up for you or you handle it.',
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
              Ready to Build a Website That Works?
            </h2>
            <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
              Book a free 30-minute consultation. No pitch, no pressure. Just a real conversation about what's possible for your business.
            </p>
            <Link
              href="/contact?service=Website%20Design"
              className="inline-flex items-center gap-2 px-10 py-4 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-hover)] text-[var(--color-action-ink)] font-bold rounded-lg hover:scale-105 transition-transform text-lg"
            >
              Book Your Free Consultation <ArrowRight size={20} />
            </Link>
            <p className="text-sm text-[var(--text-secondary)] mt-6">
              💬 Or chat with us: <a href="https://wa.me/27688529333" className="text-[var(--color-action-on-dark)] hover:underline">WhatsApp</a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
