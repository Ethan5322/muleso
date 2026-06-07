'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import PageHero from '@/components/PageHero';
import StartBookingButton from '@/components/StartBookingButton';

const FAQItem = ({ question, answer, delay }: { question: string; answer: string; delay: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ once: true }}
      className="glass-card overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between hover:border-[var(--accent-blue)] transition-colors"
      >
        <h3 className="text-lg font-sora font-bold text-[var(--text-primary)] text-left">{question}</h3>
        <ChevronDown
          size={24}
          className={`text-[var(--accent-blue)] flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-[var(--border)]"
          >
            <p className="p-6 text-[var(--text-secondary)] leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

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
                ðŸ’¬ Contact Ethan Directly for Custom Pricing
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:mulukenendashaw68@gmail.com"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-lg hover:scale-105 transition-transform"
                >
                  ðŸ“§ Email: mulukenendashaw68@gmail.com
                </a>
                <a
                  href="https://wa.me/27759440377"
                  className="inline-block px-6 py-3 bg-[#25D366] text-white font-bold rounded-lg hover:scale-105 transition-transform"
                >
                  ðŸ’¬ WhatsApp: +27 (781) 500-968
                </a>
              </div>
            </div>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            We'll respond within 2 hours on business days.
          </p>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">Common Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <FAQItem
              question="How long does a website take to build?"
              answer="Most websites launch within 2-4 weeks, depending on complexity and scope. We work fast without cutting corners. You'll be involved throughout the process with regular updates."
              delay={0}
            />
            <FAQItem
              question="Do I own the website after it's built?"
              answer="Yes, 100%. You own the website, the domain, and all the source code. We can transfer everything to your preferred hosting provider or manage it for you (optional)."
              delay={0.1}
            />
            <FAQItem
              question="Can you redesign my existing website?"
              answer="Absolutely. We can redesign your current site, migrate your content, improve SEO, and add new features. We'll make sure your ranking doesn't drop in the process."
              delay={0.2}
            />
            <FAQItem
              question="Do you work with clients outside South Africa?"
              answer="Yes! We work with clients across Africa and internationally. Time zones don't matter â€” we're always responsive on WhatsApp and email."
              delay={0.3}
            />
            <FAQItem
              question="What happens if I need changes after launch?"
              answer="Every website includes 30 days of free support and fixes. After that, we offer maintenance packages at friendly rates, or you can make changes yourself since you own the code."
              delay={0.4}
            />
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
          <div className="max-w-md mx-auto">
            <StartBookingButton text="ðŸš€ Book Your Website Now" size="lg" />
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-4">
            Chat with Ethan directly â€” get a quote in minutes!
          </p>
        </motion.div>
      </div>
    </div>
  );
}

