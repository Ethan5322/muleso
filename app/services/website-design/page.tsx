'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';
import StartBookingButton from '@/components/StartBookingButton';

export default function WebsiteDesignPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          title="Websites That Make Your Competition Nervous"
          subtitle="Custom-built websites that load in under 2 seconds, convert visitors into customers, and rank on Google from day one."
        />

        {/* What You Get */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">What You Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Responsive Design',
              'SEO Optimised',
              'Blazing Fast',
              '3D Animations',
              'Contact Forms',
              'Custom Domain',
              '30-Day Support',
              'Source Code',
            ].map((item) => (
              <div key={item} className="glass-card p-6 text-center">
                <p className="text-[var(--text-primary)] font-sora font-bold">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Custom Pricing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 glass-card p-12 text-center border border-[var(--accent-blue)]"
        >
          <h2 className="text-4xl font-bold font-sora mb-6 gradient-text">Custom Pricing</h2>
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            Every project is unique. Let's discuss your specific needs and create a custom package tailored to your goals.
          </p>
          <div className="mb-8 space-y-4">
            <div>
              <p className="text-lg text-[var(--accent-blue)] font-sora font-bold mb-4">
                💬 Contact Ethan Directly for Custom Pricing
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
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            We'll respond within 2 hours on business days.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold font-sora mb-6 gradient-text">Ready to Launch?</h2>
          <div className="max-w-md mx-auto">
            <StartBookingButton text="🚀 Book Your Website Now" size="lg" />
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-4">
            Chat with Ethan directly — get a quote in minutes!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
