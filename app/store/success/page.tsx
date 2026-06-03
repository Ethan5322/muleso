'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-7xl mb-8"
        >
          ✅
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-bold gradient-text font-sora mb-6">
          Payment Confirmed! 🎉
        </h1>

        <p className="text-xl text-[var(--text-secondary)] mb-4">
          Thank you for your purchase! Your PDF has been sent to your email.
        </p>

        <p className="text-[var(--text-secondary)] mb-8">
          You&apos;ll also receive a copy in your email within 5 minutes. Check your spam folder just in case.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-gradient-to-r from-[var(--accent-gold)] to-[#fff] text-[#000] font-bold font-sora rounded-lg hover:scale-105 transition-transform">
            Download Now
          </button>
          <Link
            href="/store"
            className="px-8 py-3 border-2 border-[var(--accent-blue)] text-[var(--accent-blue)] font-bold font-sora rounded-lg hover:bg-[var(--glow-blue)] transition-colors"
          >
            Explore More Guides
          </Link>
        </div>

        <p className="text-[var(--text-secondary)] text-sm mt-8">
          Questions? <Link href="/contact" className="text-[var(--accent-blue)] hover:underline">Contact us</Link>
        </p>
      </motion.div>
    </div>
  );
}
