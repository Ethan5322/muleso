'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 1.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 flex items-center justify-center -z-10"
      >
        <div className="w-96 h-96 rounded-full bg-gradient-to-br from-[var(--accent-purple)] opacity-10 blur-3xl" />
      </motion.div>

      <div className="max-w-2xl mx-auto text-center">
        {/* 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 1.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-9xl md:text-[150px] font-black gradient-text font-sora leading-none">404</h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-sora text-[var(--text-primary)]">
            You&apos;ve drifted into deep space.
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
        </motion.div>

        {/* Animated Astronaut */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="my-12"
        >
          <div className="text-6xl">🧑‍🚀</div>
        </motion.div>

        {/* Floating Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
              }}
              className="absolute text-xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <Link
            href="/"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[var(--accent-gold)] to-[#fff] text-[#000] font-bold font-sora rounded-lg hover:scale-105 transition-transform text-lg glow-gold"
          >
            Take Me Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
