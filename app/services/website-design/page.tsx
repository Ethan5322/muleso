'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import AnswerBlock from '@/components/AnswerBlock';
import PageHero from '@/components/PageHero';
import StartBookingButton from '@/components/StartBookingButton';

export default function WebsiteDesignPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          eyebrow="Web Design · Pretoria · South Africa"
          title="Websites That Make Your Competition Nervous"
          subtitle="Custom-built websites for South African businesses that load in under 2 seconds, convert visitors into customers, and rank on Google from day one. Designed in Pretoria."
          trust="50+ projects delivered · Yoyo Gym, Shime Events & X-Boss Photography"
        />

        <AnswerBlock slug="website-design" />

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
            ].map((item, i) => (
              <motion.div key={item} whileHover={{ translateY: -4 }} className="glass-card p-6 text-center border border-[var(--border)] transition-all duration-300 hover:border-[var(--color-action-on-dark)] hover:shadow-lg hover:shadow-[var(--glow-action)]">
                <p className="text-[var(--text-primary)] font-sora font-bold">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Custom Pricing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 glass-card p-12 text-center border border-[var(--color-action-on-dark)]"
        >
          <h2 className="text-4xl font-bold font-sora mb-6 gradient-text">Custom Pricing</h2>
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            Every project is unique. Let's discuss your specific needs and create a custom package tailored to your goals.
          </p>
          <div className="mb-8 space-y-4">
            <div>
              <p className="text-lg text-[var(--color-action-on-dark)] font-sora font-bold mb-4">
                Contact Ena Muluken Directly for Custom Pricing
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <a
                    href="mailto:hello@mulesoo.com"
                    className="inline-block px-6 py-3 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-hover)] text-[var(--color-action-ink)] font-bold rounded-lg shadow-lg hover:shadow-[0_8px_30px_var(--glow-action)] transition-shadow"
                  >
                    Email: hello@mulesoo.com
                  </a>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <a
                    href="https://wa.me/27688529333"
                    className="inline-block px-6 py-3 bg-[#25D366] text-white font-bold rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-shadow"
                  >
                    WhatsApp: +27 68 852 9333
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            We'll respond within 2 hours on business days.
          </p>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">Website Design FAQ</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: 'How much does a website cost?',
                a: 'Websites start at R3,500 (Starter - 3 pages) up to R15,000+ (Enterprise). Most clients choose the R7,500 Business tier which includes 6+ pages, AI chatbot, and advanced SEO. Get a custom quote in 5 minutes.',
              },
              {
                q: 'How long does it take to build?',
                a: 'Typically 2-4 weeks depending on complexity. Starter sites: 2 weeks. Business tier: 3 weeks. Enterprise: 4 weeks. We provide an exact timeline before you commit.',
              },
              {
                q: 'Do I own the website after it\'s built?',
                a: 'Yes, 100%. You get the complete source code, all design files, and full access to your domain and hosting. No licensing fees or ongoing royalties. It\'s yours to keep, modify, or move anytime.',
              },
              {
                q: 'Can you redesign my existing website?',
                a: 'Absolutely! We can redesign your current site or migrate it to a faster, modern platform. Usually takes 3-4 weeks depending on scope. We\'ll ensure zero downtime during the transition.',
              },
              {
                q: 'Do you do SEO and Google ranking?',
                a: 'Yes. All websites include SEO setup: technical optimization, keyword research, meta tags, structured data, and sitemap. Ranking on Google takes 2-6 months of consistent effort. We can discuss an ongoing SEO plan if you want to accelerate it.',
              },
              {
                q: 'What if I need changes after launch?',
                a: 'Included! Every website comes with 30 days of free fixes post-launch. After that, we offer affordable maintenance plans (R500-2,000/month) for ongoing updates and support.',
              },
              {
                q: 'Can you add an AI chatbot to my website?',
                a: 'Yes! The Business and Enterprise tiers include a custom AI chatbot. It answers questions 24/7, captures leads, and handles booking inquiries automatically. Included in your package.',
              },
              {
                q: 'What about mobile? Will it work on phones?',
                a: '100%. Every website we build is fully responsive and tested on all devices. Mobile-first design is our standard, not an add-on.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="glass-card p-6 hover:border-[var(--color-action-on-dark)] transition-all duration-300 border border-[var(--border)]"
              >
                <h3 className="font-bold text-[var(--text-primary)] mb-3 text-lg">{item.q}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
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
          <motion.div className="max-w-md mx-auto" whileHover={{ scale: 1.05 }}>
            <StartBookingButton text="🚀 Book Your Website Now" size="lg" />
          </motion.div>
          <p className="text-sm text-[var(--text-secondary)] mt-4">
            Chat with Ena Muluken directly — get a quote in minutes!
          </p>
        </motion.div>
      </div>
    </div>
  );
}

