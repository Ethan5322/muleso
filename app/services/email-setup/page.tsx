'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import AnswerBlock from '@/components/AnswerBlock';
import PageHero from '@/components/PageHero';

export default function EmailSetupPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          eyebrow="Business Email · Pretoria · South Africa"
          title="Professional Email Setup"
          subtitle="Your own @yourdomain.com email for instant credibility. Full setup, migration and support for South African businesses — handled from Pretoria."
          trust="Setup, migration & support included"
        />

        <AnswerBlock slug="email-setup" />

        {/* Why Professional Email Matters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 glass-card p-12 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-card)]"
        >
          <h2 className="text-3xl font-bold font-sora mb-6 gradient-text">Why Professional Email?</h2>
          <div className="space-y-4 text-[var(--text-secondary)]">
            <p className="text-lg">An email like <strong>hello@yourbusiness.com</strong> looks infinitely more professional than <em>yourname@gmail.com</em></p>
            <ul className="space-y-3 ml-6">
              <li>✓ <strong>Builds Trust</strong> - Customers see you as established and legitimate</li>
              <li>✓ <strong>Protects Your Reputation</strong> - Your brand controls your email identity</li>
              <li>✓ <strong>Improves Deliverability</strong> - Business emails land in inboxes, not spam</li>
              <li>✓ <strong>Team Collaboration</strong> - Multiple team members with branded emails</li>
              <li>✓ <strong>Professional Branding</strong> - Every email is a brand touchpoint</li>
            </ul>
          </div>
        </motion.div>

        {/* What We Setup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">What We Handle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Domain Configuration', desc: 'MX records, SPF, DKIM setup for security' },
              { title: 'Email Hosting', desc: 'Reliable hosting with 99.9% uptime guarantee' },
              { title: 'Multiple Users', desc: 'Setup team members with branded email addresses' },
              { title: 'Email Forwarding', desc: 'Redirect emails to where you manage them' },
              { title: 'Security & Backups', desc: 'Automatic backups, spam filtering, encryption' },
              { title: 'Full Training', desc: 'We show you how to use your new email system' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-6 hover:border-[var(--accent-blue)] transition-all"
              >
                <h3 className="font-bold text-[var(--text-primary)] mb-2">✓ {item.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Setup Process */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">Simple Setup Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: 1, title: 'Consultation', desc: 'Discuss your email needs and team size' },
              { num: 2, title: 'Configuration', desc: 'We configure all settings and security' },
              { num: 3, title: 'Testing', desc: 'Verify everything works perfectly' },
              { num: 4, title: 'Training', desc: 'You\'re ready to start using your new email' },
            ].map((item) => (
              <div key={item.num} className="glass-card p-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center mb-4">
                  <span className="text-white font-bold font-sora">{item.num}</span>
                </div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Common Questions */}
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
              { q: 'How many email addresses can I have?', a: 'Unlimited! Add as many team members as you need.' },
              { q: 'What if I already have a domain?', a: 'Perfect! We\'ll configure your existing domain.' },
              { q: 'Can I access email on my phone?', a: 'Yes! Works on iPhone, Android, and desktop apps.' },
              { q: 'Is my email secure?', a: 'Yes, with encryption, spam filtering, and automatic backups.' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 hover:border-[var(--accent-blue)] transition-all">
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
          className="glass-card p-12 text-center border border-[var(--accent-blue)]"
        >
          <h2 className="text-4xl font-bold font-sora mb-6 gradient-text">Get Professional Email Today</h2>
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            Let's set up your branded email and boost your professional image.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hello@mulesoo.com"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-lg hover:scale-105 transition-transform"
            >
              📧 Email: hello@mulesoo.com
            </a>
            <a
              href="https://wa.me/27688529333"
              className="inline-block px-8 py-4 bg-[#25D366] text-white font-bold rounded-lg hover:scale-105 transition-transform"
            >
              💬 WhatsApp: +27 68 852 9333
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

