'use client';

import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';

export default function QRCodesPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <PageHero
          title="Custom Branded QR Codes"
          subtitle="QR codes with your brand, built-in analytics, and tracking."
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 p-12 glass-card text-center border border-[var(--accent-blue)]"
        >
          <h2 className="text-4xl font-bold font-sora mb-6 gradient-text">Custom QR Code Solutions</h2>
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            Stand out with branded QR codes. Perfect for marketing campaigns, product packaging, events, and more.
          </p>

          <div className="mb-8 space-y-4">
            <p className="text-lg text-[var(--accent-blue)] font-sora font-bold">
              💬 Contact Ethan for Custom Pricing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:mulukenendashaw68@gmail.com"
                className="inline-block px-6 py-3 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-lg hover:scale-105 transition-transform"
              >
                📧 Email: mulukenendashaw68@gmail.com
              </a>
              <a
                href="https://wa.me/27781500968"
                className="inline-block px-6 py-3 bg-[#25D366] text-white font-bold rounded-lg hover:scale-105 transition-transform"
              >
                💬 WhatsApp: 0781500968
              </a>
            </div>
          </div>

          <p className="text-sm text-[var(--text-secondary)]">
            Tell us your use case and get a custom quote within 2 hours.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
