'use client';

import { motion } from 'framer-motion';

export default function PageHero({
  title,
  subtitle
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <section className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-20">
      <div className="max-w-5xl mx-auto w-full text-center">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
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
        </motion.div>
      </div>
    </section>
  );
}
