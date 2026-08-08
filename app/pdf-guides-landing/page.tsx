import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, BookOpen, TrendingUp, Users, Shield, Download } from 'lucide-react';
import FaqSection from '@/components/FaqSection';

const PDF_FAQS = [
  {
    q: 'Can I resell these guides?',
    a: 'Yes! You get full resale rights. Create your own store, sell on Gumroad, or bundle with your services. The guides are yours to monetize.',
  },
  {
    q: 'What format do I get?',
    a: 'PDF files optimized for reading. Each guide includes a cover page, table of contents, detailed sections with images/diagrams, and actionable checklists.',
  },
  {
    q: 'Can I customize the guides with my branding?',
    a: 'Yes! We provide the editable source files (Canva or Word) so you can add your logo, colors, and contact details.',
  },
  {
    q: 'How often are new guides released?',
    a: 'New guides launch monthly. Customers get lifetime access to all new releases added to their tier.',
  },
  {
    q: 'What if I don\'t find the guide I need?',
    a: 'Request custom guides! We can create specialized content for your niche or business model.',
  },
];

export const metadata: Metadata = pageMetadata({
  title: 'Expert PDF Guides & Digital Products | MuleSoo',
  description: 'Battle-tested guides built from real projects. Learn, build, and monetize. Resale rights included on all products. Starting from R149.',
  path: '/pdf-guides-landing',
  keywords: ['PDF guides', 'digital products', 'expert knowledge', 'online courses', 'resale rights'],
});

export default function PDFGuidesLanding() {
  const tiers = [
    {
      name: 'Starter Bundle',
      price: 'R299',
      description: 'Single expert guide',
      features: [
        '1 PDF guide (50+ pages)',
        'Instant download',
        'Lifetime access',
        'All updates included',
        'Resale rights included',
      ],
      notIncluded: ['Multiple guides', 'Private community', 'Email support'],
      highlighted: false,
      popular: false,
    },
    {
      name: 'Professional Bundle',
      price: 'R799',
      description: 'All-access to current collection',
      features: [
        'Access to 5+ guides',
        'Monthly new guides',
        'All formats (PDF, Word)',
        'Lifetime updates',
        'Resale & commercial rights',
        'Email support',
        'Private community access',
      ],
      notIncluded: ['Custom training', 'Live consultation'],
      highlighted: true,
      popular: true,
    },
    {
      name: 'Enterprise License',
      price: 'R1,999',
      description: 'For agencies & teams',
      features: [
        'Unlimited guides',
        'Team access (up to 10 people)',
        'All file formats + editable source',
        'Custom branding setup',
        'Priority support',
        'Private Slack community',
        'Quarterly live training calls',
        'Custom guide creation',
      ],
      notIncluded: [],
      highlighted: false,
      popular: false,
    },
  ];

  const guides = [
    {
      title: 'Claude Code Master Guide',
      pages: 52,
      price: 'R299',
      description: 'Build professional websites using AI in 1/10th the time',
      topics: ['Project setup', 'Master prompts', '3D animations', 'Deployment', 'SEO basics'],
      bestseller: true,
    },
    {
      title: 'n8n Automation Bible',
      pages: 44,
      price: 'R249',
      description: 'Automate your entire business with zero code',
      topics: ['Email workflows', 'Lead capture', 'Payment automation', 'AI integrations', 'Data sync'],
      bestseller: false,
    },
    {
      title: 'Chatbot Business Blueprint',
      pages: 38,
      price: 'R199',
      description: 'How to start a chatbot agency and land R5K+ clients',
      topics: ['Niche selection', 'Client scripts', 'Pricing strategy', 'API setup', 'Delivery'],
      bestseller: false,
    },
    {
      title: 'Netlify Deployment Guide',
      pages: 28,
      price: 'R149',
      description: 'Deploy any website professionally in under 30 minutes',
      topics: ['Setup', 'Environment variables', 'Custom domains', 'SSL setup', 'CI/CD'],
      bestseller: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--glow-blue)] to-transparent opacity-20 blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6"
          >
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[var(--glow-blue)] to-transparent border border-[var(--color-action-primary)]">
              <span className="text-[var(--color-action-primary)] font-sora text-sm font-bold">Expert Knowledge on Demand</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-sora leading-[1.05] tracking-tight mb-8"
          >
            <span className="text-[var(--text-primary)]">Learn, Build,</span>{' '}
            <span className="gradient-text">Make Money</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Master battle-tested frameworks. Get step-by-step guides. Sell them to your audience. Or keep them for yourself.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-16"
          >
            <Link href="/store">
              <button className="px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[var(--color-action-primary)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform text-sm sm:text-lg whitespace-nowrap">
                Browse Guides
                <ArrowRight className="inline ml-2" size={20} />
              </button>
            </Link>
            <button className="px-4 sm:px-8 py-3 sm:py-4 border-2 border-[var(--color-action-primary)] text-[var(--color-action-primary)] font-bold font-sora rounded-lg hover:bg-[var(--glow-blue)] transition-colors text-sm sm:text-lg whitespace-nowrap">
              See What's Inside
            </button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-[var(--text-secondary)]"
          >
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-[var(--color-action-primary)]" />
              <span>5+ Guides Published</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-[var(--color-action-primary)]" />
              <span>2,000+ Readers</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-[var(--color-action-primary)]" />
              <span>Resale Rights Included</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Guides Matter */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold font-sora mb-6 gradient-text">Why Expert Guides Work</h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              In a world of YouTube tutorials and random advice, structured guides cut through the noise.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Learn at Your Pace',
                desc: 'No videos to watch, no waiting for live calls. Read, highlight, reference anytime.',
              },
              {
                icon: Shield,
                title: 'Battle-Tested Methods',
                desc: 'Every guide is based on real projects we\'ve shipped. You get proven frameworks, not theory.',
              },
              {
                icon: TrendingUp,
                title: 'Resale Rights Included',
                desc: 'Your guides, your store. Sell on your own site, Gumroad, or bundle with your services.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 border border-[var(--border)] rounded-xl hover:border-[var(--color-action-primary)] transition-all"
              >
                <item.icon size={40} className="text-[var(--color-action-primary)] mb-4" />
                <h3 className="text-2xl font-bold font-sora mb-3">{item.title}</h3>
                <p className="text-[var(--text-secondary)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold font-sora mb-4 text-center gradient-text"
          >
            Featured Guides
          </motion.h2>
          <p className="text-center text-[var(--text-secondary)] text-xl mb-16 max-w-2xl mx-auto">
            Each guide is 30-50+ pages of distilled expertise, real examples, and step-by-step instructions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {guides.map((guide, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 border border-[var(--border)] rounded-xl hover:border-[var(--color-action-primary)] transition-all group"
              >
                {guide.bestseller && (
                  <div className="mb-4 inline-block px-3 py-1 bg-[var(--glow-gold)] border border-[var(--accent-gold)] rounded-full">
                    <span className="text-[var(--accent-gold)] font-bold text-xs">BESTSELLER</span>
                  </div>
                )}

                <h3 className="text-2xl font-bold font-sora mb-2 group-hover:text-[var(--color-action-primary)] transition-colors">
                  {guide.title}
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">{guide.description}</p>

                <div className="flex items-center gap-4 mb-6 text-sm text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1">
                    <BookOpen size={16} /> {guide.pages} pages
                  </span>
                  <span className="text-[var(--color-action-primary)] font-bold">{guide.price}</span>
                </div>

                <div className="mb-6 space-y-2">
                  <p className="text-sm font-bold text-[var(--text-secondary)]">What's inside:</p>
                  <div className="flex flex-wrap gap-2">
                    {guide.topics.map((topic, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <Link href="/store">
                  <button className="w-full py-3 bg-gradient-to-r from-[var(--color-action-primary)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                    <Download size={18} /> Download Now
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold font-sora mb-6 gradient-text">Membership Tiers</h2>
            <p className="text-xl text-[var(--text-secondary)]">Buy individual guides or get unlimited access</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`glass-card p-8 border rounded-xl transition-all ${
                  tier.highlighted
                    ? 'border-[var(--color-action-primary)] shadow-lg shadow-[var(--glow-blue)] scale-105'
                    : 'border-[var(--border)] hover:border-[var(--color-action-primary)]'
                }`}
              >
                {tier.popular && (
                  <div className="mb-4 px-4 py-2 bg-[var(--glow-blue)] border border-[var(--color-action-primary)] rounded-full w-fit">
                    <span className="text-[var(--color-action-primary)] font-bold text-sm">Most Popular</span>
                  </div>
                )}

                <h3 className="text-3xl font-bold font-sora mb-2">{tier.name}</h3>
                <p className="text-[var(--text-secondary)] mb-6">{tier.description}</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold font-sora text-[var(--color-action-primary)]">{tier.price}</span>
                  <span className="text-[var(--text-secondary)] ml-2">one-time</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check size={20} className="text-[var(--accent-green)] flex-shrink-0 mt-1" />
                      <span className="text-[var(--text-secondary)]">{feature}</span>
                    </li>
                  ))}
                  {tier.notIncluded.map((feature, i) => (
                    <li key={`not-${i}`} className="flex items-start gap-3 opacity-50">
                      <X size={20} className="text-[var(--text-secondary)] flex-shrink-0 mt-1" />
                      <span className="text-[var(--text-secondary)]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/store">
                  <button
                    className={`w-full py-3 rounded-lg font-bold font-sora transition-all ${
                      tier.highlighted
                        ? 'bg-gradient-to-r from-[var(--color-action-primary)] to-[var(--accent-purple)] text-white hover:scale-105'
                        : 'border border-[var(--color-action-primary)] text-[var(--color-action-primary)] hover:bg-[var(--glow-blue)]'
                    }`}
                  >
                    Get Access
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold font-sora mb-16 text-center gradient-text"
          >
            Common Questions
          </motion.h2>
          <FaqSection items={PDF_FAQS} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-primary)] border-y border-[var(--border)]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold font-sora mb-6 gradient-text"
          >
            Stop Guessing. Start Learning.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-2xl text-[var(--text-secondary)] mb-12"
          >
            Get battle-tested frameworks for less than the cost of a single coffee.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link href="/store">
              <button className="px-10 py-4 bg-gradient-to-r from-[var(--color-action-primary)] to-[var(--accent-purple)] text-white font-bold font-sora text-lg rounded-lg hover:scale-105 transition-transform">
                Browse All Guides
              </button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-sm text-[var(--text-secondary)] mt-8"
          >
            ✨ Instant access after purchase • 🚀 All formats included • 💰 Resale rights for all guides
          </motion.p>
        </div>
      </section>
    </div>
  );
}
