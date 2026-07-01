'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Sparkles, Bot, Zap, ShieldCheck, Clock } from 'lucide-react';
import { AUTOMATIONS, CATEGORIES } from '@/lib/aiAutomations';

export default function AiAutomationLibrary() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | string>('All');

  const q = query.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      AUTOMATIONS.filter(
        (a) =>
          (category === 'All' || a.category === category) &&
          (q === '' ||
            a.name.toLowerCase().includes(q) ||
            a.desc.toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q))
      ),
    [q, category]
  );

  // group filtered results by department, preserving CATEGORIES order
  const grouped = useMemo(
    () =>
      CATEGORIES.map((dept) => ({
        dept,
        items: filtered.filter((a) => a.category === dept),
      })).filter((g) => g.items.length > 0),
    [filtered]
  );

  return (
    <div className="min-h-screen pb-20">
      {/* ===== CORPORATE COVER ===== */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        {/* layered glow backdrop */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full bg-[var(--accent-blue)] opacity-[0.07] blur-[120px]" />
          <div className="absolute top-20 -right-40 w-[500px] h-[500px] rounded-full bg-[var(--accent-purple)] opacity-[0.08] blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
              backgroundSize: '54px 54px',
              maskImage: 'radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)',
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold font-sora text-[var(--accent-blue)] border border-[var(--accent-blue)]/40 bg-[var(--glow-blue)]"
          >
            <Bot size={14} /> MuleSoo AI Automation Library
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold font-sora leading-[1.05]"
          >
            <span className="text-[var(--text-primary)]">What do you want us to</span>
            <br />
            <span className="gradient-text">build for you?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed"
          >
            200 ready-to-build AI systems across 9 industries — smart booking, payments, support,
            lead capture and workflow automation. Pick one, or ask us to build it fully custom.
          </motion.p>

          {/* trust chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[var(--text-secondary)]"
          >
            <span className="inline-flex items-center gap-1.5"><Zap size={15} className="text-[var(--accent-blue)]" /> 200 systems</span>
            <span className="inline-flex items-center gap-1.5"><Clock size={15} className="text-[var(--accent-green)]" /> Works 24/7</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={15} className="text-[var(--accent-gold)]" /> You control everything</span>
          </motion.div>

          {/* search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-xl mx-auto mt-10"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 200 systems… (e.g. salon, hotel, dentist, invoice)"
              className="w-full bg-[var(--bg-card)]/80 backdrop-blur border border-[var(--border)] text-[var(--text-primary)] pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-[var(--accent-blue)]"
            />
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* department filter */}
        <div className="sticky top-16 z-20 -mx-4 px-4 py-4 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)]">
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
                {c === 'All' ? 'All departments' : c}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-[var(--text-secondary)] mt-3">
            {filtered.length} system{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* department sections */}
        <div className="mt-10 space-y-14">
          {grouped.map(({ dept, items }) => (
            <section key={dept}>
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-lg sm:text-xl font-bold font-sora text-[var(--text-primary)]">{dept}</h2>
                <span className="text-xs font-semibold text-[var(--accent-blue)] bg-[var(--glow-blue)] px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((a, i) => (
                  <motion.div
                    key={a.slug}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i, 8) * 0.02 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={`/ai-automation/${a.slug}`}
                      className="group block h-full glass-card rounded-xl border border-[var(--border)] p-5 transition-all hover:border-[var(--accent-blue)] hover:-translate-y-1 hover:shadow-[0_16px_40px_-15px_rgba(0,200,255,0.35)]"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                          #{String(a.id).padStart(3, '0')}
                        </span>
                        <span className="w-9 h-9 rounded-lg bg-[var(--glow-blue)] flex items-center justify-center text-[var(--accent-blue)] group-hover:scale-110 transition-transform">
                          <Bot size={17} />
                        </span>
                      </div>
                      <h3 className="font-bold font-sora text-[var(--text-primary)] leading-tight mb-1.5 group-hover:text-[var(--accent-blue)] transition-colors">
                        {a.name.replace(/^AI\s+/, '')}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{a.desc}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-blue)] mt-3">
                        See how it works <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}

          {grouped.length === 0 && (
            <p className="text-center text-[var(--text-secondary)] py-16">
              No systems match “{query}”. Try another word — or request a custom build below.
            </p>
          )}
        </div>

        {/* custom request */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 glass-card rounded-2xl border border-[var(--accent-gold)] p-10 text-center"
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
