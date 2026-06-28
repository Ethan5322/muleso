'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck } from 'lucide-react';
import PageHero from '@/components/PageHero';
import StoreCover from '@/components/StoreCover';

type AccentKey = 'gold' | 'blue' | 'purple' | 'green';

interface Product {
  name: string;
  price: number;
  pages: string;
  difficulty: string;
  description: string;
  features: string[];
  accent: AccentKey;
}

const WHATSAPP = '27759440377';

export default function StorePage() {
  const [loadingName, setLoadingName] = useState<string | null>(null);

  const products: Product[] = [
    {
      name: 'Claude Code Master Guide',
      price: 299,
      pages: '52',
      difficulty: 'Beginner-Friendly',
      description: 'Build any professional website using AI in days, not weeks.',
      features: ['Project setup', '7 master prompts', '3D animations', 'Deployment', 'SEO'],
      accent: 'gold',
    },
    {
      name: 'n8n Automation Bible',
      price: 249,
      pages: '44',
      difficulty: 'Intermediate',
      description: 'Automate your entire business with zero code.',
      features: ['Email automation', 'Lead capture', 'Payment workflows', 'AI integrations'],
      accent: 'blue',
    },
    {
      name: 'Chatbot Business Blueprint',
      price: 199,
      pages: '38',
      difficulty: 'Beginner-Friendly',
      description: 'How to start a chatbot agency and land R5,000+ clients.',
      features: ['Niche selection', 'Client scripts', 'Pricing', 'Claude API setup'],
      accent: 'purple',
    },
    {
      name: 'Netlify Deployment Guide',
      price: 149,
      pages: '28',
      difficulty: 'Beginner-Friendly',
      description: 'Deploy any website professionally in under 30 minutes.',
      features: ['Project setup', 'Environment vars', 'Custom domain', 'CI/CD'],
      accent: 'green',
    },
  ];

  const handleBuy = async (product: Product) => {
    setLoadingName(product.name);
    const whatsappFallback = () => {
      const msg = encodeURIComponent(
        `Hi MuleSoo, I'd like to buy the "${product.name}" guide (R${product.price}). Please send me the payment & download details.`
      );
      window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank', 'noopener,noreferrer');
    };

    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: product.name, amount: product.price }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Stripe checkout
        return;
      }
      whatsappFallback(); // Stripe not configured yet
    } catch (error) {
      console.error('Checkout error:', error);
      whatsappFallback();
    } finally {
      setLoadingName(null);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          title="Digital Products & Guides"
          subtitle="Expert knowledge and battle-tested guides built from real projects. Buy once, use forever."
        />

        <div className="flex justify-center mb-12">
          <span className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 rounded-full">
            <ShieldCheck size={16} className="text-[var(--accent-green)]" />
            Secure payment • Instant delivery after purchase
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="glass-card p-8 hover:border-[var(--accent-gold)] transition-all flex flex-col"
            >
              <div className="w-full h-48 rounded-lg mb-6 overflow-hidden border border-[var(--border)]">
                <StoreCover
                  title={product.name}
                  pages={product.pages}
                  difficulty={product.difficulty}
                  accent={product.accent}
                />
              </div>

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
                <div className="flex gap-2 flex-wrap">
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

              <div className="mt-auto">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold font-sora gold-text">R{product.price}</span>
                  <span className="text-xs text-[var(--text-secondary)]">once-off</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleBuy(product)}
                  disabled={loadingName === product.name}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[var(--accent-gold)] via-[#FFC107] to-[#E8B84B] text-black font-bold rounded-lg hover:scale-[1.02] transition-transform disabled:opacity-60"
                >
                  {loadingName === product.name ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Processing…
                    </>
                  ) : (
                    'Buy Now'
                  )}
                </button>
              </div>
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
            Need a custom guide or bulk licence?{' '}
            <Link href="/contact" className="text-[var(--accent-blue)] hover:underline">
              Contact us
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
