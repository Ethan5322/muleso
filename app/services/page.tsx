'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bot, ArrowRight, Zap, ShieldCheck, Clock } from 'lucide-react';
import PageHero from '@/components/PageHero';

interface Service {
  title: string;
  href: string;
  description: string;
  features: string[];
  icon: string;
  price: string;
}

const FALLBACK_SERVICES: Service[] = [
  { title: 'Website Design', href: '/services/website-design', description: 'Stunning websites that convert visitors into paying customers.', features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', '30-Day Support', 'Source Code Included'], icon: '🌐', price: 'From R3,500' },
  { title: 'AI Chatbots', href: '/services/chatbot', description: '24/7 AI assistants that handle customer service automatically.', features: ['Natural Language', 'Lead Collection', 'WhatsApp Integration', 'Analytics', 'Custom Training'], icon: '🤖', price: 'From R2,500' },
  { title: 'Logo Design', href: '/services/logo-design', description: 'Professional brand identity that stands out.', features: ['Original Design', 'Multiple Concepts', 'All Formats', 'Brand Guidelines', 'Unlimited Revisions'], icon: '🎨', price: 'From R800' },
  { title: 'PDF Guides', href: '/services/pdf-guides', description: 'Sell expert knowledge as downloadable digital products.', features: ['Professional Layout', 'SEO Optimized', 'Secure Distribution', 'Analytics', 'Evergreen Income'], icon: '📄', price: 'From R99' },
  { title: 'QR Code Design', href: '/services/qr-codes', description: 'Custom branded QR codes with built-in tracking.', features: ['Custom Design', 'Analytics', 'Dynamic Links', 'Multiple Formats', 'Lifetime Support'], icon: '📱', price: 'From R300' },
  { title: 'Custom Email Setup', href: '/services/email-setup', description: 'Professional @yourdomain.com email for instant credibility.', features: ['Domain Setup', 'Email Configuration', 'Security', 'Backups', 'Technical Support'], icon: '📧', price: 'From R400' },
  { title: 'Custom Apps Building', href: '/services/custom-apps', description: 'We build bespoke web & mobile applications tailored to your exact business workflow.', features: ['Web & Mobile Apps', 'Custom Dashboards', 'API & Database Integration', 'Scalable Architecture', 'Ongoing Maintenance'], icon: '📲', price: 'Custom quote' },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(FALLBACK_SERVICES);

  useEffect(() => {
    fetch('/api/admin/services')
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => {
        if (Array.isArray(d) && d.length > 0) {
          setServices(
            d.map((s: any) => ({
              title: s.title,
              href: s.href || '/services',
              description: s.description || '',
              features: Array.isArray(s.features) ? s.features : [],
              icon: s.icon || '✨',
              price: s.price || '',
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <PageHero
        title="Our Services"
        subtitle="Complete digital solutions to build and grow your business"
      />

      {/* Featured: AI Automation Library */}
      <section className="pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative overflow-hidden glass-card rounded-2xl border border-[var(--accent-blue)] p-8 md:p-10"
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--glow-blue)] to-[var(--glow-purple)] opacity-60" />
            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
              <div className="flex-1">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-sora text-[var(--accent-blue)] bg-[var(--glow-blue)] border border-[var(--accent-blue)]/40 mb-4">
                  <Zap size={13} /> 200 Systems · 9 Industries
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-sora gradient-text mb-3 flex items-center gap-3">
                  <Bot className="text-[var(--accent-blue)]" size={32} /> AI Automation
                </h2>
                <p className="text-[var(--text-secondary)] max-w-2xl mb-5">
                  Smart booking, payment, support and workflow systems engineered to
                  <span className="text-[var(--text-primary)] font-semibold"> outperform the latest software your industry already uses</span> —
                  built around your exact business, owned entirely by you.
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)] mb-6">
                  <span className="inline-flex items-center gap-1.5"><Clock size={15} className="text-[var(--accent-green)]" /> Works 24/7</span>
                  <span className="inline-flex items-center gap-1.5"><ShieldCheck size={15} className="text-[var(--accent-gold)]" /> You own it</span>
                  <span className="inline-flex items-center gap-1.5"><Zap size={15} className="text-[var(--accent-blue)]" /> No commission</span>
                </div>
                <Link
                  href="/ai-automation"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform shadow-lg hover:shadow-[0_0_25px_var(--glow-blue)]"
                >
                  Explore the AI Automation Library <ArrowRight size={18} />
                </Link>
              </div>
              <div className="hidden lg:flex flex-shrink-0 w-40 h-40 rounded-2xl bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] items-center justify-center shadow-[0_20px_50px_-15px_rgba(0,200,255,0.5)]">
                <Bot className="text-white" size={72} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={`${service.title}-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-8 hover:border-[var(--accent-blue)] transition-all duration-300 flex flex-col"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold font-sora text-[var(--text-primary)] mb-3">
                  {service.title}
                </h3>
                <p className="text-[var(--text-secondary)] mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                      <span className="text-[var(--accent-green)]">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  {service.price && (
                    <p className="text-lg font-bold gold-text font-sora mb-4">{service.price}</p>
                  )}
                  <Link
                    href={service.href}
                    className="inline-block px-8 py-3 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform shadow-lg hover:shadow-[0_0_20px_var(--glow-blue)] w-full text-center"
                  >
                    View Full Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
