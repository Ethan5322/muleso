'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck, X, Mail } from 'lucide-react';
import PageHero from '@/components/PageHero';
import StoreCover from '@/components/StoreCover';
import { STORE_PRODUCTS, type StoreProduct } from '@/lib/storeProducts';

export default function StorePage() {
  const [pending, setPending] = useState<StoreProduct | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startBuy = (product: StoreProduct) => {
    setPending(product);
    setEmail('');
    setError(null);
  };

  const handleCheckout = async () => {
    if (!pending) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email — that’s where your guide is delivered.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/store/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: pending.slug, email }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url; // Paystack hosted checkout
        return;
      }
      setError(data.error || 'Could not start the payment. Please try again.');
    } catch {
      setError('Could not reach the payment service. Please try again.');
    } finally {
      setLoading(false);
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
            Secure card &amp; EFT payment via Paystack • Instant download after purchase
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {STORE_PRODUCTS.map((product, i) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="group relative glass-card overflow-hidden rounded-2xl border border-[var(--border)] flex flex-col transition-all duration-300 hover:border-[var(--accent-gold)] hover:-translate-y-2 hover:shadow-[0_24px_60px_-15px_rgba(232,184,75,0.4)]"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] z-20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 bg-gradient-to-r from-[var(--accent-gold)] via-[#FFC107] to-[var(--accent-blue)]" />

              <div className="relative w-full h-52 overflow-hidden">
                <div className="w-full h-full transition-transform duration-700 group-hover:scale-105">
                  <StoreCover title={product.name} pages={product.pages} difficulty={product.difficulty} accent={product.accent} />
                </div>
                {i === 0 && (
                  <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold font-sora text-black bg-gradient-to-r from-[var(--accent-gold)] to-[#FFD777] shadow-lg">
                    ★ BESTSELLER
                  </span>
                )}
              </div>

              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold font-sora text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-gold)] transition-colors">
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
                        className="text-xs px-2.5 py-1 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] rounded-md group-hover:border-[var(--accent-gold)]/50 transition-colors"
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
                  {product.available ? (
                    <button
                      type="button"
                      onClick={() => startBuy(product)}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[var(--accent-gold)] via-[#FFC107] to-[#E8B84B] text-black font-bold rounded-lg hover:scale-[1.02] transition-transform"
                    >
                      Buy Now
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 border border-[var(--border)] text-[var(--text-secondary)] font-bold rounded-lg cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
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

      {/* Email capture → Paystack checkout */}
      {pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => !loading && setPending(null)}>
          <div className="w-full max-w-md glass-card p-6 border border-[var(--accent-gold)]/50" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold font-sora text-[var(--text-primary)]">Buy {pending.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  <span className="gold-text font-bold">R{pending.price}</span> once-off — instant download after payment.
                </p>
              </div>
              <button type="button" onClick={() => !loading && setPending(null)} className="text-[var(--text-secondary)] hover:text-white" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              Your email (where we send the guide)
            </label>
            <div className="relative mb-2">
              <Mail size={16} className="absolute left-3 top-3 text-[var(--accent-gold)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCheckout()}
                placeholder="you@example.com"
                autoFocus
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-[var(--accent-gold)]"
              />
            </div>
            {error && <p className="text-xs text-red-400 mb-2">{error}</p>}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 mt-2 bg-gradient-to-r from-[var(--accent-gold)] via-[#FFC107] to-[#E8B84B] text-black font-bold rounded-lg hover:scale-[1.02] transition-transform disabled:opacity-60"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Opening payment…</> : `Pay R${pending.price} securely →`}
            </button>
            <p className="text-[11px] text-[var(--text-secondary)] text-center mt-3 inline-flex items-center gap-1 justify-center w-full">
              <ShieldCheck size={12} className="text-[var(--accent-green)]" /> Secured by Paystack • Card &amp; Instant EFT
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
