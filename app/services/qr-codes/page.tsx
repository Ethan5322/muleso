'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';

export default function QRCodesPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          title="Custom Branded QR Codes"
          subtitle="QR codes with your brand, built-in analytics, and complete tracking capabilities."
        />

        {/* What's Included */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Your Brand Colors', desc: 'QR codes with your logo, colors, and design' },
              { title: 'Live Analytics', desc: 'Track scans, location, device type, and time' },
              { title: 'Dynamic URLs', desc: 'Change destination without reprinting codes' },
              { title: 'Multiple Formats', desc: 'PNG, SVG, EPS - print-ready at any size' },
              { title: 'Lifetime Access', desc: 'Dashboard to manage and monitor all QR codes' },
              { title: 'Custom Design', desc: 'QR pattern, corner styles, and logo placement' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-6 hover:border-[var(--accent-blue)] transition-all"
              >
                <h3 className="font-bold text-[var(--text-primary)] mb-2">✓ {item.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Use Cases */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 glass-card p-12 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-card)]"
        >
          <h2 className="text-3xl font-bold font-sora mb-8 gradient-text">Perfect For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '🏪', use: 'Retail', desc: 'Product packaging, shelf displays, in-store promotions' },
              { icon: '🎫', use: 'Events', desc: 'Tickets, registration, entry verification' },
              { icon: '📱', use: 'Marketing', desc: 'Social media campaigns, email marketing, ads' },
              { icon: '🏢', use: 'Business', desc: 'Business cards, brochures, invoices' },
              { icon: '📍', use: 'Location', desc: 'Store locations, directions, WiFi access' },
              { icon: '🎁', use: 'Promotions', desc: 'Discount codes, referral programs, loyalty' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-[var(--text-primary)]">{item.use}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: 1, title: 'Choose Design', desc: 'Select colors, logo placement, QR pattern' },
              { num: 2, title: 'Set Destination', desc: 'Links to website, landing page, or app' },
              { num: 3, title: 'Get Analytics', desc: 'Dashboard shows all scans in real-time' },
              { num: 4, title: 'Print & Deploy', desc: 'Use in marketing, packaging, anywhere!' },
            ].map((item) => (
              <div key={item.num} className="glass-card p-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center mb-4">
                  <span className="text-white font-bold font-sora">{item.num}</span>
                </div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-card p-12 text-center border border-[var(--accent-blue)]"
        >
          <h2 className="text-4xl font-bold font-sora mb-6 gradient-text">Ready to Get QR Codes?</h2>
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            Contact us to discuss your QR code needs and get a custom quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:mulukenendashaw68@gmail.com"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-lg hover:scale-105 transition-transform"
            >
              📧 Email: mulukenendashaw68@gmail.com
            </a>
            <a
              href="https://wa.me/27759440377"
              className="inline-block px-8 py-4 bg-[#25D366] text-white font-bold rounded-lg hover:scale-105 transition-transform"
            >
              💬 WhatsApp: +27 (781) 500-968
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

