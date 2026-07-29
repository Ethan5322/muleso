'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import AnswerBlock from '@/components/AnswerBlock';
import PageHero from '@/components/PageHero';

export default function PDFGuidesPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          title="Expert Knowledge as Digital Products"
          subtitle="Beautifully designed PDF guides packed with practical, actionable insights you can use immediately."
        />

        <AnswerBlock slug="pdf-guides" />

        {/* Why PDF Guides */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 glass-card p-12 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-card)]"
        >
          <h2 className="text-3xl font-bold font-sora mb-6 gradient-text">Our PDF Guides Deliver Real Value</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[var(--text-secondary)]">
            <div>
              <h3 className="font-bold text-[var(--text-primary)] mb-3">✓ Professionally Designed</h3>
              <p>Beautiful layouts, clear typography, premium appearance</p>
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-primary)] mb-3">✓ Highly Practical</h3>
              <p>Step-by-step instructions, real examples, copy-paste ready</p>
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-primary)] mb-3">✓ Instantly Downloadable</h3>
              <p>Get access immediately after payment, no waiting</p>
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-primary)] mb-3">✓ Updated Regularly</h3>
              <p>Latest strategies, current tools, and best practices</p>
            </div>
          </div>
        </motion.div>

        {/* Current Guides */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">Available Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Claude Code Master Guide',
                pages: '52 pages',
                level: 'Beginner-Friendly',
                desc: 'Master AI-powered web development using Claude Code. Build professional websites in days, not weeks.',
                includes: ['Project setup', 'Master prompts', '3D animations', 'Deployment', 'SEO optimization'],
              },
              {
                title: 'n8n Automation Bible',
                pages: '44 pages',
                level: 'Intermediate',
                desc: 'Automate your entire business with zero code. Real workflows, tested solutions, ready to implement.',
                includes: ['Email automation', 'Lead capture', 'Payment flows', 'AI integrations', 'Error handling'],
              },
              {
                title: 'Chatbot Business Blueprint',
                pages: '38 pages',
                level: 'Beginner-Friendly',
                desc: 'Start your own chatbot agency and land $300+ clients. Complete business roadmap included.',
                includes: ['Niche selection', 'Client scripts', 'Pricing strategy', 'API setup', 'Sales scripts'],
              },
              {
                title: 'Netlify Deployment Guide',
                pages: '28 pages',
                level: 'Beginner-Friendly',
                desc: 'Deploy any website professionally in under 30 minutes. Covers everything from setup to domain.',
                includes: ['Environment setup', 'Custom domains', 'SSL certificates', 'CI/CD pipelines', 'Troubleshooting'],
              },
            ].map((guide, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 hover:border-[var(--accent-blue)] transition-all"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{guide.title}</h3>
                  <div className="flex gap-3 text-xs text-[var(--text-secondary)]">
                    <span className="bg-[var(--bg-card)] px-2 py-1 rounded">{guide.pages}</span>
                    <span className="bg-[var(--bg-card)] px-2 py-1 rounded">{guide.level}</span>
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] mb-4">{guide.desc}</p>
                <div className="border-t border-[var(--border)] pt-4">
                  <p className="text-xs font-bold text-[var(--accent-blue)] mb-2">INCLUDES:</p>
                  <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
                    {guide.includes.map((item, j) => (
                      <li key={j}>✓ {item}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Custom PDF Creation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 glass-card p-12 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-card)]"
        >
          <h2 className="text-3xl font-bold font-sora mb-6 gradient-text">Create Custom PDF Guides</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Need a custom guide for your business, course, or product? We create professional PDF guides tailored to your needs.
          </p>
          <ul className="space-y-3 text-[var(--text-secondary)] ml-6 mb-8">
            <li>✓ Professional design and layout</li>
            <li>✓ Practical, actionable content</li>
            <li>✓ Print-ready or digital format</li>
            <li>✓ Custom branding and styling</li>
            <li>✓ SEO-optimized for digital</li>
          </ul>
          <p className="text-[var(--accent-blue)] font-semibold">Perfect for courses, lead magnets, or product sales</p>
        </motion.div>

        {/* Store CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <Link
            href="/store"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[var(--accent-gold)] to-[#E8B84B] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform text-lg"
          >
            Browse & Purchase Guides →
          </Link>
        </motion.div>

        {/* Custom Guide CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-card p-12 text-center border border-[var(--accent-blue)]"
        >
          <h2 className="text-4xl font-bold font-sora mb-6 gradient-text">Need a Custom PDF?</h2>
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            Let's discuss your guide idea and create a professional PDF product for your business.
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

