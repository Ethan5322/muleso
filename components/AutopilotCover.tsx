'use client';

import { motion } from 'framer-motion';
import { Plane, CheckCircle2, Calendar, CreditCard, Bell, Users } from 'lucide-react';

/**
 * A premium "product screenshot" style cover for the Auto Pilot System service:
 * a mock control dashboard showing the institution running itself — live stats
 * and an auto-action feed. Pure CSS/brand styling, no external image.
 */
export default function AutopilotCover() {
  const stats = [
    { icon: Calendar, label: 'Bookings today', value: '38', color: 'var(--accent-blue)' },
    { icon: CreditCard, label: 'Payments in', value: 'R 12,400', color: 'var(--accent-green)' },
    { icon: Bell, label: 'Reminders sent', value: '126', color: 'var(--accent-gold)' },
    { icon: Users, label: 'New members', value: '14', color: 'var(--accent-purple)' },
  ];

  const feed = [
    { t: '09:12', a: 'New member enrolled & digital ID issued', ok: true },
    { t: '09:05', a: 'Deposit received via Paystack — booking confirmed', ok: true },
    { t: '08:58', a: 'WhatsApp reminder sent to 42 members', ok: true },
    { t: '08:40', a: 'AI assistant answered 7 enquiries', ok: true },
  ];

  return (
    <div className="glass-card p-4 sm:p-5 border border-[var(--accent-blue)]/40 shadow-[0_20px_60px_-20px_var(--glow-blue)]">
      {/* Window chrome + status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
          <span className="ml-2 text-xs font-semibold text-[var(--text-secondary)] font-sora">
            MuleSoo Autopilot
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent-green)]/15 border border-[var(--accent-green)]/40">
          <motion.span
            className="w-2 h-2 rounded-full bg-[var(--accent-green)]"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <span className="text-[10px] font-bold text-[var(--accent-green)] uppercase tracking-wide">Active</span>
        </div>
      </div>

      {/* Autopilot toggle banner */}
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-[var(--accent-blue)]/15 to-[var(--accent-purple)]/15 border border-[var(--accent-blue)]/30 px-4 py-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center">
            <Plane className="text-white" size={18} />
          </div>
          <div>
            <p className="text-sm font-bold font-sora text-[var(--text-primary)]">Autopilot</p>
            <p className="text-[11px] text-[var(--text-secondary)]">Running your operation 24/7</p>
          </div>
        </div>
        <div className="w-12 h-6 rounded-full bg-[var(--accent-green)]/30 border border-[var(--accent-green)]/50 relative">
          <span className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-[var(--accent-green)] shadow" />
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] p-3">
              <Icon size={16} style={{ color: s.color }} />
              <p className="text-lg font-bold font-sora text-[var(--text-primary)] mt-1 leading-none">{s.value}</p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Live activity feed */}
      <div className="rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
          Auto actions — live
        </p>
        <div className="space-y-2">
          {feed.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-xs"
            >
              <CheckCircle2 size={13} className="text-[var(--accent-green)] shrink-0" />
              <span className="text-[var(--text-secondary)] tabular-nums">{f.t}</span>
              <span className="text-[var(--text-primary)] truncate">{f.a}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
