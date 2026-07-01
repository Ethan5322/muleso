'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, AlertCircle, Cog, Gauge, TrendingUp, MessageCircle, Sparkles } from 'lucide-react';
import { findAutomation, getDetail } from '@/lib/aiAutomations';

const WHATSAPP = '27688529333';

export default function AutomationDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const automation = slug ? findAutomation(slug) : undefined;

  if (!automation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center py-20">
        <h1 className="text-3xl font-bold font-sora gradient-text mb-4">Automation not found</h1>
        <p className="text-[var(--text-secondary)] mb-8">This system may have moved or been renamed.</p>
        <Link href="/ai-automation" className="px-8 py-3 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-lg">
          ← Back to the AI Automation Library
        </Link>
      </div>
    );
  }

  const d = getDetail(automation.name);
  const title = automation.name.replace(/^AI\s+/, '');
  const waText = encodeURIComponent(`Hi MuleSoo, I'd like you to build the "${automation.name}" for my business.`);

  const Section = ({ icon: Icon, color, label, children }: { icon: any; color: string; label: string; children: React.ReactNode }) => (
    <div>
      <h2 className="flex items-center gap-2 text-sm font-bold font-sora uppercase tracking-wide mb-2" style={{ color }}>
        <Icon size={16} /> {label}
      </h2>
      <div className="text-[var(--text-secondary)] leading-relaxed">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/ai-automation" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-blue)] hover:underline mb-8">
          <ArrowLeft size={16} /> Back to Library
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold font-sora text-[var(--accent-blue)] bg-[var(--glow-blue)] mb-4">
            {automation.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-sora gradient-text mb-4">{title}</h1>
          <p className="text-lg text-[var(--text-secondary)] mb-10">{d.short}</p>

          <div className="glass-card rounded-2xl p-8 space-y-7">
            <Section icon={AlertCircle} color="#FF6B6B" label="The problem">
              {d.problem}
            </Section>
            <Section icon={Cog} color="var(--accent-blue)" label="How it works">
              {d.howItWorks}
            </Section>
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold font-sora uppercase tracking-wide mb-3 text-[var(--accent-purple)]">
                <Sparkles size={16} /> Features
              </h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {d.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <Check size={16} className="text-[var(--accent-green)] mt-0.5 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <Section icon={Gauge} color="var(--accent-blue)" label="Admin control">
              {d.adminControl}
            </Section>
            <Section icon={TrendingUp} color="var(--accent-gold)" label="How it grows your business">
              {d.businessBenefit}
            </Section>
            <div className="border-t border-[var(--border)] pt-5 text-sm text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)]">Why MuleSoo: </span>{d.whyMuleSoo}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 glass-card rounded-2xl border border-[var(--accent-blue)] p-8 text-center">
            <p className="text-[var(--text-primary)] font-semibold mb-4">Want this built for your business?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact" className="px-6 py-3 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-lg hover:scale-[1.02] transition-transform">
                Build This System
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold rounded-lg hover:scale-[1.02] transition-transform"
              >
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-4">
              Need it tweaked or combined with another system?{' '}
              <Link href="/contact" className="text-[var(--accent-blue)] hover:underline">Request a custom build →</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
