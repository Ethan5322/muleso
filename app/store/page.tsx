'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck, X, Mail } from 'lucide-react';
import PageHero from '@/components/PageHero';
import EmojiCover from '@/components/EmojiCover';
import StoreDetailModal, { type StoreDetailItem } from '@/components/StoreDetailModal';
import { STORE_PRODUCTS, type StoreProduct } from '@/lib/storeProducts';
import { SYSTEM_PRODUCTS, systemDisplayName, type SystemProduct } from '@/lib/storeSystems';
import { AUTOMATION_PICKS, AUTOMATION_FEATURES, type AutomationPick } from '@/lib/storeAutomations';
import { useChatbot } from '@/context/ChatbotContext';

type Plan = 'full' | 'monthly';

export default function StorePage() {
  const { openChatbot } = useChatbot();
  const [pending, setPending] = useState<StoreProduct | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rich "exaggerated detail" modal for systems + automations.
  const [detail, setDetail] = useState<{ item: StoreDetailItem; book: (plan: Plan) => void } | null>(null);

  const priceLine = (fromPrice: number, monthly: number, plan: Plan) =>
    plan === 'monthly'
      ? `R${monthly.toLocaleString('en-ZA')}/month (subscription)`
      : `From R${fromPrice.toLocaleString('en-ZA')} (pay in full)`;

  // Systems are custom builds — booking opens the chatbot with the chosen plan.
  const bookSystem = (s: SystemProduct, plan: Plan) => {
    openChatbot({
      service: systemDisplayName(s),
      price: priceLine(s.fromPrice, s.monthly, plan),
      details: `I'd like to build ${systemDisplayName(s)} (${s.category}) — ${plan === 'monthly' ? 'Monthly subscription' : 'Full payment'}. ${s.description}`,
    });
  };

  const bookAutomation = (a: AutomationPick, plan: Plan) => {
    openChatbot({
      service: a.name,
      price: priceLine(a.fromPrice, a.monthly, plan),
      details: `I'd like the ${a.name} (${a.category}) — ${plan === 'monthly' ? 'Monthly subscription' : 'Full payment'}. ${a.desc}`,
    });
  };

  const openSystemDetail = (s: SystemProduct) =>
    setDetail({
      item: { title: systemDisplayName(s), category: s.category, description: s.description, features: s.features, fromPrice: s.fromPrice, monthly: s.monthly, accent: s.accent, kind: 'system' },
      book: (plan) => { setDetail(null); bookSystem(s, plan); },
    });

  const openAutomationDetail = (a: AutomationPick) =>
    setDetail({
      item: { title: a.name, category: a.category, description: a.desc, features: AUTOMATION_FEATURES, fromPrice: a.fromPrice, monthly: a.monthly, accent: a.accent, kind: 'automation' },
      book: (plan) => { setDetail(null); bookAutomation(a, plan); },
    });

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

        <div className="text-center mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent-gold)] mb-2">📘 Department 1</p>
          <h2 className="text-3xl sm:text-4xl font-bold font-sora gold-text mb-3">Digital Guides</h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            Battle-tested guides you can buy and download instantly — delivered to your email with a password only you can use.
          </p>
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
                  <EmojiCover emoji={product.emoji} title={product.name} label="DIGITAL GUIDE" category={`${product.pages} pages`} accent={product.accent} />
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

        {/* Done-for-you systems */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent-blue)] mb-2">🛫 Department 2</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-sora gradient-text mb-3">Auto Pilot Systems</h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Proven, ready-to-brand platforms that run your business on autopilot. Pay in full, or subscribe monthly —
              pick one, and we tailor it to you.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {SYSTEM_PRODUCTS.map((s, i) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.08 }}
                viewport={{ once: true }}
                className="group relative glass-card overflow-hidden rounded-2xl border border-[var(--border)] flex flex-col transition-all duration-300 hover:border-[var(--accent-blue)] hover:-translate-y-2 hover:shadow-[0_24px_60px_-15px_var(--glow-blue)]"
              >
                <div className="relative w-full h-52 overflow-hidden">
                  <div className="w-full h-full transition-transform duration-700 group-hover:scale-105">
                    <EmojiCover emoji={s.emoji} title={systemDisplayName(s)} label="AUTO PILOT SYSTEM" category={s.category} accent={s.accent} />
                  </div>
                  {s.enterprise && (
                    <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold font-sora text-black bg-gradient-to-r from-[var(--accent-blue)] to-[#7DE0FF] shadow-lg">
                      ★ ENTERPRISE
                    </span>
                  )}
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold font-sora text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-blue)] transition-colors">
                    {systemDisplayName(s)}
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-4">{s.description}</p>

                  <div className="flex gap-2 flex-wrap mb-6">
                    {s.features.map((f) => (
                      <span
                        key={f}
                        className="text-xs px-2.5 py-1 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] rounded-md group-hover:border-[var(--accent-blue)]/50 transition-colors"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-4 flex-wrap">
                      <span className="text-3xl font-bold font-sora gradient-text">From R{s.fromPrice.toLocaleString('en-ZA')}</span>
                      <span className="text-sm font-semibold text-[var(--accent-green)]">+ R{s.monthly.toLocaleString('en-ZA')}/mo</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openSystemDetail(s)}
                      className="w-full py-3 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-lg hover:scale-[1.02] transition-transform"
                    >
                      View &amp; Book →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Essential AI automations */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent-blue)] mb-2">🤖 Department 3</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-sora gradient-text mb-3">Essential AI Automations</h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              The most-in-demand AI system from every industry — affordable to start, working for you 24/7.
              Pay in full or subscribe monthly; we tailor it to your business.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AUTOMATION_PICKS.map((a, i) => (
              <motion.div
                key={a.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                viewport={{ once: true }}
                className="group relative glass-card overflow-hidden rounded-2xl border border-[var(--border)] flex flex-col transition-all duration-300 hover:border-[var(--accent-blue)] hover:-translate-y-2 hover:shadow-[0_24px_60px_-15px_var(--glow-blue)]"
              >
                <div className="relative w-full h-40 overflow-hidden">
                  <div className="w-full h-full transition-transform duration-700 group-hover:scale-105">
                    <EmojiCover emoji={a.emoji} title={a.name} label="AI AUTOMATION" category={a.category} accent={a.accent} />
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold font-sora text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-blue)] transition-colors">
                    {a.name}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm mb-4">{a.desc}</p>

                  <div className="flex gap-1.5 flex-wrap mb-5">
                    {AUTOMATION_FEATURES.map((f) => (
                      <span key={f} className="text-[11px] px-2 py-0.5 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] rounded">
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-4 flex-wrap">
                      <span className="text-2xl font-bold font-sora gradient-text">From R{a.fromPrice.toLocaleString('en-ZA')}</span>
                      <span className="text-sm font-semibold text-[var(--accent-green)]">+ R{a.monthly.toLocaleString('en-ZA')}/mo</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openAutomationDetail(a)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-lg hover:scale-[1.02] transition-transform text-sm"
                      >
                        View &amp; Book
                      </button>
                      <Link
                        href={`/ai-automation/${a.slug}`}
                        className="px-3 py-2.5 border border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-colors text-sm font-semibold flex items-center"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/ai-automation" className="text-[var(--accent-blue)] hover:underline font-semibold">
              See all 200 AI automation systems →
            </Link>
          </div>
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

      {/* Exaggerated detail → two ways to buy */}
      {detail && <StoreDetailModal item={detail.item} onBook={detail.book} onClose={() => setDetail(null)} />}

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
