'use client';

import { motion } from 'framer-motion';

export default function PageHero({
  title,
  subtitle,
  compact = false,
  eyebrow,
  trust,
}: {
  title: string;
  subtitle: string;
  /** Tighter hero (no 60vh min-height) — for content-heavy pages like About. */
  compact?: boolean;
  /**
   * Small line above the H1. Use it to place the location signal
   * ("Pretoria · Gauteng · South Africa") in the crawlable text near the top
   * of the page, where mobile-first indexing weighs it most — not just the
   * footer. It also gives a search snippet a local cue that lifts CTR.
   */
  eyebrow?: string;
  /**
   * A real trust signal above the fold — completed-project count or named
   * clients. This is what makes someone click one of two similar-looking
   * results. Keep it TRUE: named clients are real portfolio work.
   */
  trust?: string;
}) {
  return (
    <section
      className={`flex items-center justify-center px-4 sm:px-6 lg:px-8 relative ${
        compact ? 'pt-24 pb-4' : 'min-h-[60vh] pt-20'
      }`}
    >
      <div className="max-w-5xl mx-auto w-full text-center">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {eyebrow && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-xs md:text-sm font-semibold font-sora tracking-[0.2em] uppercase text-[var(--accent-blue)]"
            >
              {eyebrow}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text font-sora"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto font-light leading-relaxed"
          >
            {subtitle}
          </motion.p>

          {trust && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] border border-[var(--border)] rounded-full px-4 py-2 bg-[var(--glow-blue)]"
            >
              <span className="text-[var(--accent-green)]">★</span>
              {trust}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
