'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Check, Building2, CreditCard, FileText, Share2 } from 'lucide-react';
import QRCodeFrame from '@/components/QRCodeFrame';

const WEBSITE_URL = 'https://mulesoo.com';

const USE_CASES = [
  { icon: Building2, title: 'Office & Reception', desc: 'Frame it at your front desk so visitors reach you instantly.' },
  { icon: CreditCard, title: 'Business Cards', desc: 'Print on the back — one scan opens your full portfolio.' },
  { icon: FileText, title: 'Invoices & Proposals', desc: 'Add to documents for quick access to your services.' },
  { icon: Share2, title: 'Social & Print', desc: 'Use in flyers, ads, and posts across every platform.' },
];

export default function ContactQRCodePage() {
  const [copied, setCopied] = useState(false);

  const copyURL = () => {
    navigator.clipboard.writeText(WEBSITE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back to contact */}
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--color-action-primary)] transition-colors mb-10"
        >
          <ArrowLeft size={16} /> Back to Contact
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-action-primary)] border border-[var(--color-action-primary)]/40 rounded-full px-3 py-1 mb-5">
            Marketing Toolkit
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-sora text-[var(--text-primary)] mb-4">
            Your <span className="gradient-text">MuleSoo</span> QR Code
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
            A print-ready QR code that takes anyone straight to your website. Download it, frame it,
            and let your work speak for itself.
          </p>
        </motion.div>

        {/* Main card: QR + details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card border border-[var(--border)] rounded-2xl p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center mb-14"
        >
          <div className="flex justify-center">
            <QRCodeFrame url={WEBSITE_URL} frameStyle="elegant" size={260} showDownload={true} />
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-sora text-[var(--text-primary)] mb-2">
                Download & Display
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                High-resolution and crystal-clear for both screen and print. Tap the download button on the
                code to save it.
              </p>
            </div>

            {/* URL copy row */}
            <div>
              <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">
                Links to
              </p>
              <div className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-3">
                <code className="flex-1 text-sm text-[var(--color-action-primary)] truncate">{WEBSITE_URL}</code>
                <button
                  type="button"
                  onClick={copyURL}
                  className="inline-flex items-center gap-1.5 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-hover)] text-[var(--color-action-ink)] text-sm font-semibold px-3 py-1.5 rounded-md hover:opacity-90 transition"
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li className="flex items-center gap-2"><span className="text-[var(--accent-green)]">✓</span> Print-ready, high resolution</li>
              <li className="flex items-center gap-2"><span className="text-[var(--accent-green)]">✓</span> Works with any smartphone camera</li>
              <li className="flex items-center gap-2"><span className="text-[var(--accent-green)]">✓</span> Never expires — one code, forever</li>
            </ul>
          </div>
        </motion.div>

        {/* Use cases */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {USE_CASES.map((u, i) => {
            const Icon = u.icon;
            return (
              <motion.div
                key={u.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                viewport={{ once: true }}
                className="glass-card border border-[var(--border)] rounded-xl p-6 hover:border-[var(--color-action-primary)] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--glow-action)] flex items-center justify-center mb-4">
                  <Icon className="text-[var(--color-action-primary)]" size={20} />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1.5">{u.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{u.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-[var(--text-secondary)] mb-4">Want a custom-branded QR code for your own business?</p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3.5 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-hover)] text-[var(--color-action-ink)] font-bold font-sora rounded-lg hover:scale-105 transition-transform"
          >
            Talk to Us
          </Link>
        </div>
      </div>
    </main>
  );
}
