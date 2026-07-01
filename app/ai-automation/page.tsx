'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { AUTOMATIONS, CATEGORIES, getDetail } from '@/lib/aiAutomations';

export default function AiAutomationLibrary() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | string>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AUTOMATIONS.filter(
      (a) =>
        (category === 'All' || a.category === category) &&
        (q === '' || a.name.toLowerCase().includes(q))
    );
  }, [query, category]);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          title="What do you want us to build for you?"
          subtitle="Choose from 199 AI automation systems — or request a fully custom build. Smart booking, payment, support and workflow systems that save time, cut errors, and grow your business."
        />

        {/* Search + filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search automations… (e.g. salon, hotel, dentist, invoice)"
              className="w-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-[var(--accent-blue)]"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {['All', ...CATEGORIES].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  category === c
                    ? 'bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white border-transparent'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--accent-blue)]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-[var(--text-secondary)]">
            {filtered.length} automation{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((a, i) => (
            <motion.div
              key={a.slug}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i, 12) * 0.02 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/ai-automation/${a.slug}`}
                className="group block h-full glass-card rounded-xl border border-[var(--border)] p-5 transition-all hover:border-[var(--accent-blue)] hover:-translate-y-1 hover:shadow-[0_16px_40px_-15px_rgba(0,200,255,0.35)]"
              >
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sora text-[var(--accent-blue)] bg-[var(--glow-blue)] mb-3">
                  {a.category}
                </span>
                <h3 className="font-bold font-sora text-[var(--text-primary)] leading-tight mb-1.5 group-hover:text-[var(--accent-blue)] transition-colors">
                  {a.name.replace(/^AI\s+/, '')}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{getDetail(a.name).short}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-blue)] mt-3">
                  See how it works <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Custom request card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 glass-card rounded-2xl border border-[var(--accent-gold)] p-10 text-center"
        >
          <Sparkles className="text-[var(--accent-gold)] mx-auto mb-4" size={32} />
          <h2 className="text-3xl font-bold font-sora gold-text mb-3">Need something custom?</h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto mb-6">
            Don’t see the exact fit? Tell us your workflow. We build fully custom AI systems for bookings,
            payments, support, lead handling, internal admin, reporting — anything your business needs.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[var(--accent-gold)] via-[#FFC107] to-[#E8B84B] text-black font-bold font-sora rounded-lg hover:scale-105 transition-transform"
          >
            Build My Custom System →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
