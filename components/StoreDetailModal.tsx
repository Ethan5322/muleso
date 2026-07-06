'use client';

import { X, Check, Zap, ArrowRight } from 'lucide-react';
import type { AccentKey } from '@/lib/storeProducts';

export interface StoreDetailItem {
  title: string;
  category: string;
  description: string;
  features: string[];
  fromPrice: number;
  monthly: number;
  accent: AccentKey;
  kind: 'system' | 'automation';
}

const ACCENT_HEX: Record<AccentKey, string> = {
  gold: '#E8B84B',
  blue: '#00C8FF',
  purple: '#9D6BFF',
  green: '#00FF88',
};

const INCLUDED = [
  'Fully built & branded to your business',
  'Set up, tested and launched for you',
  'An admin dashboard to control everything',
  'Team training + full handover',
  '30 days of free support after launch',
  'Hosting, updates & priority support on the monthly plan',
];

export default function StoreDetailModal({
  item,
  onBook,
  onClose,
}: {
  item: StoreDetailItem;
  onBook: (plan: 'full' | 'monthly') => void;
  onClose: () => void;
}) {
  const c = ACCENT_HEX[item.accent];
  const label = item.kind === 'system' ? 'AUTO PILOT SYSTEM' : 'AI AUTOMATION';

  const problem =
    `Right now, every missed message, slow reply and forgotten follow-up in your ${item.category.toLowerCase()} ` +
    `is money walking out the door. Doing it all by hand doesn't scale — and the competitor who replies first wins the customer.`;
  const result =
    `Now imagine it running itself: enquiries answered in seconds, bookings and deposits captured automatically, ` +
    `customers reminded without you lifting a finger — 24 hours a day, 7 days a week. That is exactly what this does.`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto glass-card rounded-2xl"
        style={{ border: `1px solid ${c}55` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 pb-5" style={{ background: `linear-gradient(135deg, ${c}22, transparent)` }}>
          <button type="button" onClick={onClose} className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-white" aria-label="Close">
            <X size={20} />
          </button>
          <span
            className="inline-block text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full mb-3"
            style={{ color: c, border: `1px solid ${c}66`, background: `${c}18` }}
          >
            {label}
          </span>
          <h3 className="text-2xl font-bold font-sora text-[var(--text-primary)]">{item.title}</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{item.category}</p>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {/* Problem */}
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-red-400 mb-1">The problem it kills</p>
            <p className="text-sm text-[var(--text-secondary)]">{problem}</p>
          </div>

          {/* What it does */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: c }}>What it does for you</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-[var(--text-primary)]">
                <Zap size={15} style={{ color: c }} className="mt-0.5 shrink-0" /> {item.description}
              </li>
              {item.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                  <Zap size={15} style={{ color: c }} className="mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Result */}
          <div className="rounded-xl p-4" style={{ background: `${c}12`, border: `1px solid ${c}44` }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: c }}>The result</p>
            <p className="text-sm text-[var(--text-primary)]">{result}</p>
          </div>

          {/* Included */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--accent-green)] mb-2">Everything included</p>
            <ul className="grid grid-cols-1 gap-1.5">
              {INCLUDED.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                  <Check size={15} className="text-[var(--accent-green)] mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Two ways to buy */}
          <div className="rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)] mb-3">Choose how to pay</p>

            {/* Option 1 — pay in full */}
            <button
              type="button"
              onClick={() => onBook('full')}
              className="w-full flex items-center justify-between gap-3 p-3.5 mb-2.5 rounded-xl bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white hover:scale-[1.02] transition-transform"
            >
              <span className="text-left">
                <span className="block font-bold font-sora">💳 Pay in full</span>
                <span className="block text-xs opacity-90">Deposit now, balance on delivery — you own it outright</span>
              </span>
              <span className="text-right shrink-0">
                <span className="block text-lg font-bold font-sora">From R{item.fromPrice.toLocaleString('en-ZA')}</span>
              </span>
            </button>

            {/* Option 2 — monthly subscription */}
            <button
              type="button"
              onClick={() => onBook('monthly')}
              className="w-full flex items-center justify-between gap-3 p-3.5 rounded-xl border border-[var(--accent-green)]/50 bg-[var(--accent-green)]/10 text-[var(--text-primary)] hover:border-[var(--accent-green)] transition-colors"
            >
              <span className="text-left">
                <span className="block font-bold font-sora text-[var(--accent-green)]">🔄 Subscribe monthly</span>
                <span className="block text-xs text-[var(--text-secondary)]">Spread the cost — low monthly, cancel anytime</span>
              </span>
              <span className="text-right shrink-0">
                <span className="block text-lg font-bold font-sora text-[var(--accent-green)]">R{item.monthly.toLocaleString('en-ZA')}/mo</span>
              </span>
            </button>

            <p className="text-[11px] text-[var(--text-secondary)] mt-3 inline-flex items-center gap-1">
              <ArrowRight size={12} /> Either way, booking continues in the chat to confirm your details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
