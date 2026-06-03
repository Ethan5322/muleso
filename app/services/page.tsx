'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';

export default function ServicesPage() {
  const services = [
    {
      title: 'Website Design',
      href: '/services/website-design',
      description: 'Stunning websites that convert visitors into paying customers.',
      features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', '30-Day Support', 'Source Code Included'],
      icon: '🌐',
    },
    {
      title: 'AI Chatbots',
      href: '/services/chatbot',
      description: '24/7 AI assistants that handle customer service automatically.',
      features: ['Natural Language', 'Lead Collection', 'WhatsApp Integration', 'Analytics', 'Custom Training'],
      icon: '🤖',
    },
    {
      title: 'Logo Design',
      href: '/services/logo-design',
      description: 'Professional brand identity that stands out.',
      features: ['Original Design', 'Multiple Concepts', 'All Formats', 'Brand Guidelines', 'Unlimited Revisions'],
      icon: '🎨',
    },
    {
      title: 'PDF Guides',
      href: '/services/pdf-guides',
      description: 'Sell expert knowledge as downloadable digital products.',
      features: ['Professional Layout', 'SEO Optimized', 'Secure Distribution', 'Analytics', 'Evergreen Income'],
      icon: '📄',
    },
    {
      title: 'QR Code Design',
      href: '/services/qr-codes',
      description: 'Custom branded QR codes with built-in tracking.',
      features: ['Custom Design', 'Analytics', 'Dynamic Links', 'Multiple Formats', 'Lifetime Support'],
      icon: '📱',
    },
    {
      title: 'Custom Email Setup',
      href: '/services/email-setup',
      description: 'Professional @yourdomain.com email for instant credibility.',
      features: ['Domain Setup', 'Email Configuration', 'Security', 'Backups', 'Technical Support'],
      icon: '📧',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <PageHero
        title="Our Services"
        subtitle="Complete digital solutions to build and grow your business"
      />

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-8 hover:border-[var(--accent-blue)] transition-all duration-300"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold font-sora text-[var(--text-primary)] mb-4">
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
                <Link
                  href={service.href}
                  className="inline-block px-6 py-2 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform"
                >
                  View Details
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
