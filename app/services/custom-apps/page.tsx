'use client';

import { motion } from 'framer-motion';
import AnswerBlock from '@/components/AnswerBlock';
import PageHero from '@/components/PageHero';

export default function CustomAppsPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          eyebrow="Custom Software · Pretoria · South Africa"
          title="Custom Apps Building"
          subtitle="Bespoke web and mobile applications engineered around your exact business workflow — not off-the-shelf templates. Built in Pretoria for South African businesses."
          trust="Next.js · Supabase · Stripe — you own the source code"
        />

        <AnswerBlock slug="custom-apps" />

        {/* Why Custom Apps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 glass-card p-12 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-card)]"
        >
          <h2 className="text-3xl font-bold font-sora mb-6 gradient-text">Software That Fits Your Business</h2>
          <div className="space-y-4 text-[var(--text-secondary)]">
            <p className="text-lg">
              Generic software forces you to change how you work. A <strong>custom app</strong> does the opposite —
              it&apos;s built around the way <em>your</em> business already runs.
            </p>
            <ul className="space-y-3 ml-6">
              <li>✓ <strong>Built For You</strong> - Every feature maps to a real workflow in your business</li>
              <li>✓ <strong>Scales With You</strong> - Architecture designed to grow from 10 to 10,000 users</li>
              <li>✓ <strong>Fully Owned</strong> - You own the source code, data, and the product</li>
              <li>✓ <strong>Connected</strong> - Integrates with the tools, payments, and APIs you already use</li>
              <li>✓ <strong>Future-Proof</strong> - Modern stack that&apos;s easy to maintain and extend</li>
            </ul>
          </div>
        </motion.div>

        {/* What We Build */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">What We Build</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🌐', title: 'Web Applications', desc: 'Fast, secure web apps and SaaS platforms built with Next.js.' },
              { icon: '📱', title: 'Mobile Apps', desc: 'Cross-platform iOS & Android apps from a single codebase.' },
              { icon: '📊', title: 'Admin Dashboards', desc: 'Custom dashboards to manage bookings, sales, and operations.' },
              { icon: '🔌', title: 'API & Integrations', desc: 'Connect payments, WhatsApp, CRMs, and third-party services.' },
              { icon: '🗄️', title: 'Databases & Backends', desc: 'Reliable, scalable data layers with Supabase / PostgreSQL.' },
              { icon: '🤖', title: 'AI-Powered Features', desc: 'Smart automation and AI assistants embedded into your app.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-6 border border-[var(--border)] hover:border-[var(--color-action-primary)] hover:shadow-lg hover:shadow-[var(--glow-action)] transition-all duration-300"
                whileHover={{ translateY: -4 }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Build Process */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">How We Build It</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: 1, title: 'Discovery', desc: 'We map your workflows, users, and goals in detail.' },
              { num: 2, title: 'Design & Plan', desc: 'Wireframes, architecture, and a clear delivery roadmap.' },
              { num: 3, title: 'Development', desc: 'We build in milestones with regular demos and feedback.' },
              { num: 4, title: 'Launch & Support', desc: 'Deploy, train your team, and provide ongoing maintenance.' },
            ].map((item) => (
              <motion.div key={item.num} whileHover={{ translateY: -4 }} className="glass-card p-6 border border-[var(--border)] hover:border-[var(--accent-purple)] hover:shadow-lg hover:shadow-[var(--glow-purple)] transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-[var(--color-action-primary)] flex items-center justify-center mb-4">
                  <span className="text-white font-bold font-sora">{item.num}</span>
                </div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold font-sora text-center mb-12 gradient-text">FAQ</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              { q: 'How much does a custom app cost?', a: 'Pricing is quoted per project based on scope. Book a free consultation for a tailored estimate.' },
              { q: 'How long does it take to build?', a: 'Most apps launch a first version in 4–10 weeks, depending on complexity.' },
              { q: 'Do I own the code?', a: 'Yes. After full payment, the complete source code and data are 100% yours.' },
              { q: 'Can you maintain it after launch?', a: 'Absolutely. We offer ongoing maintenance and feature plans.' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 hover:border-[var(--color-action-primary)] transition-all">
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{item.q}</h3>
                <p className="text-[var(--text-secondary)] text-sm">{item.a}</p>
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
          className="glass-card p-12 text-center border border-[var(--color-action-primary)]"
        >
          <h2 className="text-4xl font-bold font-sora mb-6 gradient-text">Ready to Build Your Next Project?</h2>
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            Let&apos;s create something amazing together. Start with a free consultation — tell us exactly what you need
            and we&apos;ll turn it into a professional, scalable application.
          </p>
          <a
            href="/contact?service=Custom%20Apps%20Building"
            className="inline-block px-10 py-4 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-hover)] text-[var(--color-action-ink)] font-bold font-sora rounded-lg hover:scale-105 transition-transform"
          >
            Get Started →
          </a>
        </motion.div>
      </div>
    </div>
  );
}
