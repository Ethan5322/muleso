'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';

/**
 * An elegant mock of a website support widget — used as the cover for the
 * Design Widget service. Pure CSS/brand, no external assets.
 */
export default function WidgetPreview() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Chat panel */}
      <div className="glass-card rounded-2xl overflow-hidden border border-[var(--accent-blue)]/40 shadow-[0_24px_60px_-20px_var(--glow-blue)]">
        {/* Header */}
        <div className="px-4 py-3 flex items-center gap-3 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)]">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="text-white" size={18} />
          </div>
          <div className="leading-tight">
            <p className="text-white font-bold font-sora text-sm flex items-center gap-1.5">
              Soo
              <motion.span
                className="w-2 h-2 rounded-full bg-[var(--accent-green)] inline-block"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            </p>
            <p className="text-white/80 text-[11px]">Online — replies instantly</p>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 space-y-2.5 bg-[var(--bg-primary)]">
          <div className="max-w-[80%] bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-[var(--text-primary)]">
            👋 Hi! How can I help you today?
          </div>
          <div className="max-w-[80%] ml-auto bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white rounded-2xl rounded-tr-sm px-3 py-2 text-sm">
            Do you deliver on weekends?
          </div>
          <div className="max-w-[85%] bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-[var(--text-primary)]">
            Yes! We deliver 7 days a week 🚚 Want me to book your slot?
          </div>

          {/* quick chips */}
          <div className="flex gap-1.5 flex-wrap pt-1">
            {['📅 Book now', '💰 Pricing', '📞 Call me'].map((c) => (
              <span key={c} className="text-[11px] px-2.5 py-1 rounded-full border border-[var(--accent-blue)]/50 text-[var(--accent-blue)] bg-[var(--glow-blue)]">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-3 py-2.5 flex items-center gap-2 bg-[var(--bg-card)] border-t border-[var(--border)]">
          <div className="flex-1 text-xs text-[var(--text-secondary)] bg-[var(--bg-primary)] border border-[var(--border)] rounded-full px-3 py-2">
            Type your message…
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center">
            <Send className="text-white" size={14} />
          </div>
        </div>
      </div>

      {/* Floating launcher bubble */}
      <motion.div
        className="absolute -bottom-5 -right-3 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] shadow-2xl flex items-center justify-center"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MessageCircle className="text-white" size={24} />
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--accent-green)] text-black text-[11px] font-bold flex items-center justify-center">1</span>
      </motion.div>
    </div>
  );
}
