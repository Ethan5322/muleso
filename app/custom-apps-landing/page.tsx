import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

export const metadata: Metadata = pageMetadata({
  title: 'Custom Software Development | Enterprise Apps | MuleSoo',
  description: 'Custom web and mobile applications built for your exact business workflow. Scalable, secure, and tailored to your needs. Starting from R20,000.',
  path: '/custom-apps-landing',
  keywords: ['custom software', 'enterprise apps', 'web application development', 'mobile app development', 'business automation'],
});

export default function CustomAppsLanding() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Minimal Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur border-b border-[var(--border)] px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-lg font-bold font-sora">
            <span className="text-[var(--color-action-primary)]">MULE</span>
            <span>SOO</span>
          </Link>
          <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--color-action-primary)]">
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
            <span className="inline-block px-4 py-2 rounded-full bg-[var(--glow-blue)] border border-[var(--color-action-primary)]/40 text-sm font-bold text-[var(--color-action-primary)]">
              Custom Software Built For Your Business
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold font-sora mb-6 leading-tight"
          >
            Generic Software Forces You To Change. We Build The Opposite.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Custom applications built around YOUR workflow. Scale from 10 to 10,000 users. You own the code, data, and product.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <Link
              href="/contact?service=Custom%20Apps"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[var(--color-action-primary)] to-[var(--accent-purple)] text-white font-bold rounded-lg hover:scale-105 transition-transform text-sm sm:text-lg whitespace-nowrap"
            >
              Book Strategy Call <ArrowRight size={20} />
            </Link>
            <Link
              href="/case-studies"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-8 py-3 sm:py-4 border border-[var(--color-action-primary)] text-[var(--color-action-primary)] font-bold rounded-lg hover:bg-[var(--glow-blue)] transition-colors text-sm sm:text-lg whitespace-nowrap"
            >
              See Examples
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
            Why Generic Software Doesn't Work
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '❌', title: 'Wrong Workflow', desc: 'Off-the-shelf software forces YOU to change how you work. Inefficient.' },
              { icon: '❌', title: 'Overkill Features', desc: 'Paying for 200 features you don\'t need. Confuses your team.' },
              { icon: '❌', title: 'You Don\'t Own It', desc: 'Your data is locked in their platform. Can\'t leave without losing everything.' },
              { icon: '❌', title: 'Expensive Forever', desc: 'Monthly fees forever. Per-transaction fees eating your margins.' },
              { icon: '❌', title: 'Can\'t Integrate', desc: 'Doesn\'t work with YOUR tools. Stuck in data silos.' },
              { icon: '❌', title: 'Won\'t Scale', desc: 'Works at 10 users. Breaks at 1,000. Have to rebuild.' },
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
            Custom Software That Fits
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center text-[var(--text-secondary)] text-lg mb-12 max-w-2xl mx-auto"
          >
            Built around YOUR business. Scales with you. You own everything.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: '✓', title: 'Designed For You', desc: 'Every feature maps to your actual workflow. No bloat, no waste.' },
              { icon: '✓', title: 'Scales Infinitely', desc: 'Built on enterprise architecture. Grows from 10 to 10,000 users.' },
              { icon: '✓', title: 'You Own It', desc: 'Complete source code, data, and product are yours after payment.' },
              { icon: '✓', title: 'Your Integrations', desc: 'Connects to tools you already use. Stripe, Supabase, APIs, everything.' },
              { icon: '✓', title: 'Modern Stack', desc: 'Built with latest tech (Next.js, React, Node). Easy to maintain.' },
              { icon: '✓', title: 'Ongoing Support', desc: 'Maintenance plans keep it running and secure. Updates included.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-6 border border-[var(--border)] hover:border-[var(--color-action-primary)] transition-colors"
              >
                <div className="text-4xl mb-4 text-[var(--accent-green)]">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE BUILD */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-sora mb-12 text-center gradient-text"
          >
            Custom Apps We've Built
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '🏋️', title: 'Member Management', desc: 'Gym booking, attendance tracking, face-recognition check-in, recurring billing.' },
              { icon: '🎉', title: 'Event Management', desc: 'Registration, ticketing, attendee tracking, analytics, email marketing.' },
              { icon: '🚚', title: 'Logistics Platform', desc: 'Driver app, real-time tracking, delivery verification, customer notifications.' },
              { icon: '💼', title: 'Admin Dashboards', desc: 'Custom dashboards for your team. Real-time data, automated reports.' },
              { icon: '🔐', title: 'ID Verification', desc: 'Digital ID system with QR codes, face recognition, verification backend.' },
              { icon: '📊', title: 'Analytics Systems', desc: 'Real-time dashboards, custom reports, predictive analytics.' },
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
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-sora mb-12 text-center gradient-text"
          >
            How We Build It (8-12 Weeks)
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: 1, title: 'Discovery', desc: 'Deep dive into your workflows, data, and requirements.' },
              { num: 2, title: 'Architecture', desc: 'We design the system. You approve before we code.' },
              { num: 3, title: 'Development', desc: 'We build in milestones with regular demos.' },
              { num: 4, title: 'Launch & Support', desc: 'Deploy, train team, provide 30-day support.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 border border-[var(--border)]"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color-action-primary)] to-[var(--accent-purple)] flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-lg">{item.num}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
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
            className="text-4xl font-bold font-sora mb-4 text-center gradient-text"
          >
            Pricing Depends On Scope
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center text-[var(--text-secondary)] text-lg mb-12"
          >
            Every app is different. We quote based on YOUR requirements, not a template.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'MVP (Minimum)',
                price: 'R20,000+',
                desc: 'Smallest possible version',
                features: ['Core features only', '2-3 months build', 'Basic hosting', 'Launch support'],
              },
              {
                name: 'Professional',
                price: 'R50,000+',
                desc: 'Full-featured application',
                features: [
                  'All planned features',
                  '3-4 months build',
                  'Premium hosting',
                  'Admin panel',
                  'Analytics',
                ],
                popular: true,
              },
              {
                name: 'Enterprise',
                price: 'R100,000+',
                desc: 'Advanced, scalable system',
                features: [
                  'Everything + advanced features',
                  '4-6 months build',
                  'Enterprise hosting',
                  'Mobile app',
                  'Annual maintenance',
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
                    ? 'border-[var(--color-action-primary)] bg-[var(--glow-blue)]/10 ring-2 ring-[var(--color-action-primary)]/30'
                    : 'border-[var(--border)]'
                }`}
              >
                {tier.popular && (
                  <div className="mb-4 inline-block px-3 py-1 rounded-full bg-[var(--color-action-primary)] text-white text-xs font-bold">
                    Most Common
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
                  href="/contact?service=Custom%20Apps"
                  className={`block text-center py-3 rounded-lg font-bold transition-all ${
                    tier.popular
                      ? 'bg-gradient-to-r from-[var(--color-action-primary)] to-[var(--accent-purple)] text-white hover:scale-105'
                      : 'border border-[var(--color-action-primary)] text-[var(--color-action-primary)] hover:bg-[var(--glow-blue)]'
                  }`}
                >
                  Discuss Your App
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 glass-card p-6 border border-[var(--border)] text-center"
          >
            <p className="text-[var(--text-secondary)]">
              💡 <strong>Pro Tip:</strong> Start with an MVP, add features as you grow. No need for R100K if R30K gets you launched.
            </p>
          </motion.div>
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
            <p className="text-2xl font-bold mb-4">🛡️ You Own Everything</p>
            <p className="text-lg text-[var(--text-secondary)] mb-6">
              Source code, data, and the entire product are 100% yours after payment. No licensing fees. No per-user costs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[
                { icon: '✓', label: 'Source Code Included' },
                { icon: '✓', label: 'Your Data, Always' },
                { icon: '✓', label: 'No Vendor Lock-In' },
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

      {/* FINAL CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold font-sora mb-6 gradient-text">
              Let's Build Something Custom
            </h2>
            <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
              Book a strategy call. We'll understand your workflow and design a solution that fits perfectly.
            </p>
            <Link
              href="/contact?service=Custom%20Apps"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[var(--color-action-primary)] to-[var(--accent-purple)] text-white font-bold rounded-lg hover:scale-105 transition-transform text-lg"
            >
              Book Strategy Call <ArrowRight size={20} />
            </Link>
            <p className="text-sm text-[var(--text-secondary)] mt-6">
              💬 Questions? <a href="https://wa.me/27688529333" className="text-[var(--color-action-primary)] hover:underline">WhatsApp us</a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
