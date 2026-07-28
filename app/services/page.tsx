'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bot, ArrowRight, Zap } from 'lucide-react';
import PageHero from '@/components/PageHero';
import JsonLd from '@/components/JsonLd';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import FaqSection, { type Faq } from '@/components/FaqSection';

const SITE = process.env.NEXT_PUBLIC_URL || 'https://mulesoo.com';
const priceNum = (p: string) => {
  const n = parseInt((p || '').replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const SERVICE_FAQS: Faq[] = [
  { q: 'How much does a professional website cost in South Africa?', a: 'MuleSoo websites start from R3,500. Business sites (more pages, animations, an AI chatbot) start from R7,500, and larger enterprise builds are quoted on scope.' },
  { q: 'What services does MuleSoo offer?', a: 'Website design, AI chatbots, website support/sales widgets, AI automation (200 systems across 9 industries), complete Auto Pilot business systems, Digital ID systems, logo design, QR codes, custom email setup and custom web/mobile apps.' },
  { q: 'Do you build AI chatbots and automation?', a: 'Yes. Our AI chatbots start from R2,500 and answer customers 24/7 on your website and WhatsApp, capture leads, book appointments and take deposits. Full AI automation systems start from R5,000.' },
  { q: 'Where is MuleSoo based and do you work remotely?', a: 'MuleSoo is based in Pretoria, South Africa, and serves businesses across South Africa and Africa, working remotely worldwide.' },
  { q: 'How do I get a quote?', a: 'Message us on WhatsApp at +27 68 852 9333 or fill in the free quote form on our contact page. We usually reply within 2 hours.' },
];

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
  { title: 'Design Widget', href: '/services/design-widget', description: 'A beautiful support & sales widget for your site that greets, answers and books customers 24/7.', features: ['Answers Instantly', 'Captures Every Lead', 'Books & Takes Deposits', 'WhatsApp Handoff', 'Fully On-Brand'], icon: '💬', price: 'From R3,500' },
  { title: 'Logo Design', href: '/services/logo-design', description: 'Professional brand identity that stands out.', features: ['Original Design', 'Multiple Concepts', 'All Formats', 'Brand Guidelines', 'Unlimited Revisions'], icon: '🎨', price: 'From R800' },
  { title: 'PDF Guides', href: '/services/pdf-guides', description: 'Sell expert knowledge as downloadable digital products.', features: ['Professional Layout', 'SEO Optimized', 'Secure Distribution', 'Analytics', 'Evergreen Income'], icon: '📄', price: 'From R99' },
  { title: 'QR Code Design', href: '/services/qr-codes', description: 'Custom branded QR codes with built-in tracking.', features: ['Custom Design', 'Analytics', 'Dynamic Links', 'Multiple Formats', 'Lifetime Support'], icon: '📱', price: 'From R300' },
  { title: 'Custom Email Setup', href: '/services/email-setup', description: 'Professional @yourdomain.com email for instant credibility.', features: ['Domain Setup', 'Email Configuration', 'Security', 'Backups', 'Technical Support'], icon: '📧', price: 'From R400' },
  { title: 'Custom Apps Building', href: '/services/custom-apps', description: 'We build bespoke web & mobile applications tailored to your exact business workflow.', features: ['Web & Mobile Apps', 'Custom Dashboards', 'API & Database Integration', 'Scalable Architecture', 'Ongoing Maintenance'], icon: '📲', price: 'Custom quote' },
  { title: 'Digital ID Service', href: '/services/digital-id', description: 'Branded digital ID cards with a unique QR & verification number — scan to instantly reveal the holder’s details.', features: ['Unique QR + Verification Number', 'Scan-to-Verify Any Camera', 'Barcode for Hardware Scanners', 'Face / PIN Security Add-ons', 'For Any Institution'], icon: '🪪', price: 'Custom quote' },
  { title: 'Auto Pilot System', href: '/services/autopilot', description: 'One complete system that runs your whole small institution — bookings, payments, members, reminders & reports, automatically.', features: ['Runs Your Whole Operation 24/7', 'AI Bookings + Paystack Payments', 'Digital IDs & QR Check-in', 'WhatsApp/SMS Reminders', 'Live Admin Dashboard'], icon: '🛫', price: 'Custom quote' },
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

  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      { title: 'AI Automation', href: '/ai-automation', description: '200 AI systems across 9 industries, custom-built to your workflow.', price: 'From R5,000' },
      ...services,
    ].map((s, i) => {
      const price = priceNum((s as { price?: string }).price || '');
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Service',
          name: s.title,
          description: (s as { description?: string }).description || '',
          url: `${SITE}${s.href}`,
          provider: { '@type': 'Organization', name: 'MuleSoo Digital Services', url: SITE },
          areaServed: 'South Africa',
          ...(price ? { offers: { '@type': 'Offer', price: String(price), priceCurrency: 'ZAR' } } : {}),
        },
      };
    }),
  };

  return (
    <div className="min-h-screen">
      <JsonLd data={serviceLd} />
      {/* Lives on the page, not the layout: app/services/layout.tsx also wraps
          the ten service pages, which publish their own longer Home › Services ›
          X trail. Emitting this there would give each of them two trails. */}
      <PageBreadcrumb name="Services" path="/services" />
      <PageHero
        title="Our Services"
        subtitle="Complete digital solutions to build and grow your business"
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Flagship: AI Automation — same card shape, elegantly highlighted */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative glass-card p-8 border border-[var(--accent-blue)] shadow-[0_0_30px_-12px_var(--glow-blue)] hover:shadow-[0_0_35px_-8px_var(--glow-blue)] transition-all duration-300 flex flex-col"
            >
              <span className="absolute top-5 right-5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-sora uppercase tracking-wide text-[var(--accent-blue)] bg-[var(--glow-blue)] border border-[var(--accent-blue)]/40">
                <Zap size={11} /> Flagship
              </span>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center mb-4 shadow-[0_10px_25px_-10px_rgba(0,200,255,0.6)]">
                <Bot className="text-white" size={30} />
              </div>
              <h3 className="text-2xl font-bold font-sora text-[var(--text-primary)] mb-3">
                AI Automation
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                200 AI systems across 9 industries — engineered to outperform the latest software your competitors use.
              </p>
              <ul className="space-y-2 mb-6">
                {['200 systems, 9 industries', 'Works 24/7 on web & WhatsApp', 'Beats the latest industry tools', 'No commission — you own it', 'Custom-built to your workflow'].map((feature) => (
                  <li key={feature} className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                    <span className="text-[var(--accent-green)]">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <p className="text-lg font-bold gold-text font-sora mb-4">From R5,000</p>
                <Link
                  href="/ai-automation"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform shadow-lg hover:shadow-[0_0_20px_var(--glow-blue)] w-full text-center"
                >
                  Explore the Library <ArrowRight size={17} />
                </Link>
              </div>
            </motion.div>

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

      <section className="px-4 sm:px-6 lg:px-8 pb-10">
        <FaqSection title="Services — FAQ" items={SERVICE_FAQS} />
      </section>
    </div>
  );
}
