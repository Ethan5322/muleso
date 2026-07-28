'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import AnswerBlock from '@/components/AnswerBlock';
import PageHero from '@/components/PageHero';

export default function LogoDesignPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          eyebrow="Logo & Brand Design · Pretoria · South Africa"
          title="Professional Logo Design"
          subtitle="Custom brand identity for South African businesses that makes you unforgettable and instantly recognisable. Print-ready files, full ownership — designed in Pretoria."
          trust="Trusted by Yoyo Gym, Shime Events & Tsedi Catering"
        />

        <AnswerBlock slug="logo-design" />

        {/* What You Get */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">What You Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Original Design', desc: '100% unique, custom-created for your brand' },
              { title: 'Multiple Concepts', desc: '3-5 diverse design directions to choose from' },
              { title: 'Unlimited Revisions', desc: 'We refine until it\'s absolutely perfect' },
              { title: 'All File Formats', desc: 'PNG, SVG, PDF, AI, PSD - ready to use anywhere' },
              { title: 'Brand Guidelines', desc: 'Color codes, sizing, usage rules documentation' },
              { title: 'Fast Turnaround', desc: 'Complete logo design in 5-10 business days' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-6 hover:border-[var(--accent-blue)] transition-all"
              >
                <h3 className="font-bold text-[var(--text-primary)] mb-2 text-lg">✓ {item.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Logo Matters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 glass-card p-12 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-card)]"
        >
          <h2 className="text-3xl font-bold font-sora mb-6 gradient-text">Why Your Logo Matters</h2>
          <div className="space-y-4 text-[var(--text-secondary)]">
            <p>Your logo is the first impression. It appears on your website, business cards, social media, and packaging. A professional logo builds trust instantly.</p>
            <p>We design logos that:</p>
            <ul className="space-y-2 ml-6">
              <li>✓ Reflect your brand values and personality</li>
              <li>✓ Stand out from competitors</li>
              <li>✓ Work in black & white AND color</li>
              <li>✓ Scale from business card to billboard</li>
              <li>✓ Last 10+ years without looking dated</li>
            </ul>
          </div>
        </motion.div>

        {/* Process */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">Our Design Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Briefing', desc: 'We dive deep into your brand, values, and vision' },
              { step: 2, title: 'Concepts', desc: '3-5 unique design directions for your review' },
              { step: 3, title: 'Refine', desc: 'You choose your favorite - we perfect it' },
              { step: 4, title: 'Deliver', desc: 'All files, formats, and brand guidelines included' },
            ].map((item) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: (item.step - 1) * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center mb-4">
                  <span className="text-white font-bold font-sora text-lg">{item.step}</span>
                </div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Custom Pricing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 glass-card p-12 text-center border border-[var(--accent-blue)]"
        >
          <h2 className="text-4xl font-bold font-sora mb-6 gradient-text">Custom Logo Package</h2>
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            Every brand is unique. We create custom packages based on your specific needs and vision.
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

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold font-sora text-center mb-12 gradient-text">Common Questions</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              { q: 'How long does logo design take?', a: 'Typically 5-10 business days from briefing to final files.' },
              { q: 'Can I request changes?', a: 'Absolutely! Unlimited revisions until you\'re 100% happy.' },
              { q: 'What if I don\'t like any concept?', a: 'We\'ll create new directions. Your satisfaction is guaranteed.' },
              { q: 'Do I get all file types?', a: 'Yes! PNG, SVG, PDF, AI, and more - ready for any use.' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 hover:border-[var(--accent-blue)] transition-all">
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{item.q}</h3>
                <p className="text-[var(--text-secondary)] text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold font-sora mb-6 gradient-text">Ready for Your Logo?</h2>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform text-lg"
          >
            Book Your Design Session
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

