'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function StorePage() {
  const products = [
    {
      name: 'Claude Code Master Guide',
      price: 'R299',
      pages: '52',
      difficulty: 'Beginner-Friendly',
      description: 'Build any professional website using AI in days, not weeks.',
      features: ['Project setup', '7 master prompts', '3D animations', 'Deployment', 'SEO'],
    },
    {
      name: 'n8n Automation Bible',
      price: 'R249',
      pages: '44',
      difficulty: 'Intermediate',
      description: 'Automate your entire business with zero code.',
      features: ['Email automation', 'Lead capture', 'Payment workflows', 'AI integrations'],
    },
    {
      name: 'Chatbot Business Blueprint',
      price: 'R199',
      pages: '38',
      difficulty: 'Beginner-Friendly',
      description: 'How to start a chatbot agency and land R5,000+ clients.',
      features: ['Niche selection', 'Client scripts', 'Pricing', 'Claude API setup'],
    },
    {
      name: 'Netlify Deployment Guide',
      price: 'R149',
      pages: '28',
      difficulty: 'Beginner-Friendly',
      description: 'Deploy any website professionally in under 30 minutes.',
      features: ['Project setup', 'Environment vars', 'Custom domain', 'CI/CD'],
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text font-sora mb-6">
            Digital Products & Guides
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            Expert knowledge and battle-tested guides built from real projects.
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-4">
            Contact us for pricing and availability
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="glass-card p-8 hover:border-[var(--accent-gold)] transition-all"
            >
              <div className="w-full h-48 bg-gradient-to-br from-[var(--accent-gold)] to-[var(--accent-blue)] rounded-lg mb-6" />

              {i === 0 && (
                <div className="mb-4">
                  <span className="px-3 py-1 bg-[var(--glow-gold)] text-[var(--accent-gold)] text-xs font-bold rounded-full">
                    BESTSELLER
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold font-sora text-[var(--text-primary)] mb-2">
                {product.name}
              </h3>
              <p className="text-[var(--text-secondary)] mb-4">{product.description}</p>

              <div className="mb-6">
                <p className="text-xs text-[var(--text-secondary)] mb-2">
                  <strong>{product.pages} pages</strong> • {product.difficulty}
                </p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {product.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs px-2 py-1 bg-[var(--bg-card)] text-[var(--text-secondary)] rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href="/contact"
                className="block w-full py-3 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-lg hover:scale-105 transition-transform mb-2 text-center"
              >
                Contact for Purchase
              </Link>
              <p className="text-xs text-center text-[var(--text-secondary)]">
                ⭐⭐⭐⭐⭐ 47 downloads
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-[var(--text-secondary)] text-sm mb-4">
            Have questions? <Link href="/contact" className="text-[var(--accent-blue)] hover:underline">Contact us</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
