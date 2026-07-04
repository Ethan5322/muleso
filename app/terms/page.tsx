'use client';

import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import { generateCleanTermsPDF } from '@/lib/generateCleanTermsPDF';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function TermsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadTerms = async () => {
    try {
      setIsLoading(true);
      await generateCleanTermsPDF();
      toast.success('📄 Terms & Conditions PDF downloaded!');
    } catch (error) {
      console.error('Failed to download terms:', error);
      toast.error('Failed to download Terms & Conditions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold font-sora text-[var(--text-primary)]">
            Terms & <span className="gradient-text">Conditions</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Clear, transparent agreements to protect both you and us
          </p>
        </motion.div>

        {/* Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-8 md:p-12 rounded-2xl border border-[var(--border)] mb-16"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: File Icon & Description */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-[var(--glow-gold)] flex items-center justify-center">
                  <FileText size={32} className="text-[var(--bg-primary)]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-sora text-[var(--text-primary)]">
                    Official Terms & Conditions
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Download as PDF
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Our Terms & Conditions protect both you and MuleSoo by clearly outlining:
                </p>
                <ul className="space-y-2">
                  {[
                    '💰 Payment & Deposit Requirements',
                    '📦 Deliverables & Ownership',
                    '⏰ Timeline & Delivery Schedule',
                    '🔧 Support & Revision Policy',
                    '⚖️ Liability & Legal Protection',
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-[var(--text-secondary)]"
                    >
                      <span className="text-lg">{item.split(' ')[0]}</span>
                      <span>{item.slice(item.indexOf(' ') + 1)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Download Button & Info */}
            <div className="space-y-6">
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 space-y-4">
                <div>
                  <p className="text-sm text-[var(--text-secondary)] uppercase font-semibold mb-2">
                    Document Format
                  </p>
                  <p className="text-lg font-bold text-[var(--accent-gold)]">
                    PDF (Print-Ready)
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[var(--text-secondary)] uppercase font-semibold mb-2">
                    File Size
                  </p>
                  <p className="text-lg font-bold text-[var(--text-primary)]">
                    ~200 KB
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[var(--text-secondary)] uppercase font-semibold mb-2">
                    Includes
                  </p>
                  <p className="text-sm text-[var(--text-primary)]">
                    ✓ QR code linking to this page<br/>
                    ✓ Signature fields<br/>
                    ✓ Company contact info
                  </p>
                </div>
              </div>

              {/* Download Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadTerms}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-blue)] text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                <Download size={20} />
                {isLoading ? 'Generating...' : 'Download Terms PDF'}
              </motion.button>

              <p className="text-center text-xs text-[var(--text-secondary)]">
                Professional document ready to print and sign
              </p>
            </div>
          </div>
        </motion.div>

        {/* Terms Summary */}
        <div className="space-y-8">
          {[
            {
              icon: '💰',
              title: '1. Payment & Deposit',
              content: [
                '50% deposit required to secure your booking',
                'The deposit is credited in full toward your total project fee',
                'Remaining 50% due on delivery — you only pay the other half on completion',
                'Proceed & receive the service: the deposit forms part of your fee (never lost)',
                'Cancel after paying: the deposit is non-refundable and forfeited',
                'Pay by card or Instant EFT via Paystack, or bank transfer (EFT)',
              ],
            },
            {
              icon: '📦',
              title: '2. Deliverables',
              content: [
                'Source code & files provided after full payment',
                'Ownership transfers upon completion',
                'We retain portfolio usage rights',
              ],
            },
            {
              icon: '⏰',
              title: '3. Timeline & Delivery',
              content: [
                'Project timelines are estimates',
                'Client delays do not extend our deadlines',
                'Final delivery upon full payment',
              ],
            },
            {
              icon: '🔧',
              title: '4. Support & Revisions',
              content: [
                '30 days of FREE support for bug fixes',
                'Up to 3 revision rounds included',
                'Additional support available at R250/hour',
              ],
            },
            {
              icon: '⚖️',
              title: '5. Liability',
              content: [
                'Our liability limited to amount paid',
                'Not responsible for client negligence',
                'All disputes governed by South African law',
              ],
            },
          ].map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-2xl border border-[var(--border)]"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">{section.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold font-sora text-[var(--text-primary)] mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.content.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="flex items-start gap-3 text-[var(--text-secondary)]"
                      >
                        <span className="text-[var(--accent-green)] font-bold mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass-card p-8 rounded-2xl border border-[var(--border)]">
            <h2 className="text-2xl font-bold font-sora text-[var(--text-primary)] mb-4">
              Questions About Our Terms?
            </h2>
            <p className="text-[var(--text-secondary)] mb-6 max-w-2xl mx-auto">
              We're happy to discuss any concerns. Reach out to us at{' '}
              <span className="text-[var(--accent-blue)] font-semibold">
                hello@mulesoo.com
              </span>
            </p>
            <a
              href="mailto:hello@mulesoo.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-blue)] text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              Send us a Message
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
