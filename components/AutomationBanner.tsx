'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import AutomationIcon from '@/components/AutomationIcon';
import { useChatbot } from '@/context/ChatbotContext';

interface Line {
  from: 'bot' | 'user';
  text: string;
}

/** Build a short, relevant demo conversation from the system name. */
function demoFor(name: string): Line[] {
  const n = name.toLowerCase();
  const has = (...k: string[]) => k.some((x) => n.includes(x));

  if (has('reminder')) {
    return [
      { from: 'bot', text: '⏰ Friendly reminder: your appointment is tomorrow at 14:00.' },
      { from: 'user', text: 'Yes, I’ll be there 👍' },
      { from: 'bot', text: '✓ Confirmed. See you then! Reply RESCHEDULE if anything changes.' },
    ];
  }
  if (has('quote')) {
    return [
      { from: 'user', text: 'Hi, how much would this cost?' },
      { from: 'bot', text: 'Based on your details, your estimate is R2,500. 🧾' },
      { from: 'bot', text: 'Want me to lock it in and book you a slot?' },
    ];
  }
  if (has('payment', 'invoice', 'order', 'takeaway', 'pre-order', 'deposit')) {
    return [
      { from: 'user', text: 'I’d like to place an order please.' },
      { from: 'bot', text: 'Perfect — that comes to R300. Here’s your secure payment link 🔒' },
      { from: 'bot', text: '✓ Payment received. Your order is confirmed! 🎉' },
    ];
  }
  if (has('lead', 'intake', 'qualification', 'inquiry', 'enquiry', 'claim', 'application')) {
    return [
      { from: 'bot', text: 'Happy to help! May I get your name and what you need?' },
      { from: 'user', text: 'Thabo — I need a consultation this week.' },
      { from: 'bot', text: '✓ Thanks Thabo, I’ve logged your details and booked your consult.' },
    ];
  }
  if (has('support', 'faq', 'concierge', 'complaint', 'assistant', 'chatbot', 'menu', 'status', 'tracking')) {
    return [
      { from: 'user', text: 'Hi, what are your opening hours?' },
      { from: 'bot', text: 'We’re open Mon–Fri 8:00–18:00 and Sat 9:00–13:00. 😊' },
      { from: 'bot', text: 'Anything else I can help you with?' },
    ];
  }
  // default: booking / scheduler / registration
  return [
    { from: 'user', text: 'Hi! Do you have space this Saturday?' },
    { from: 'bot', text: 'Yes — I have 10:00 and 14:00 open. Which suits you?' },
    { from: 'user', text: '14:00 please 🙌' },
    { from: 'bot', text: '✓ Booked for Sat 14:00. Confirmation sent! 🎉' },
  ];
}

export default function AutomationBanner({
  name,
  title,
  iconKey,
  color,
  glow,
  onStart,
}: {
  name: string;
  title: string;
  iconKey: string;
  color: string;
  glow: string;
  onStart?: () => void;
}) {
  const lines = demoFor(name);
  const { isOpen } = useChatbot();

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="automation-banner"
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md mx-auto"
        >
      {/* ambient glow */}
      <div
        className="absolute -inset-6 -z-10 rounded-[2rem] blur-3xl opacity-40"
        style={{ background: `radial-gradient(circle at 60% 20%, ${color}, transparent 70%)` }}
      />

      {/* floating trust pills */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute -left-3 top-16 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-sora bg-[var(--bg-card)] border border-[var(--border)] shadow-xl"
        style={{ color }}
      >
        <Zap size={12} /> Instant reply
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute -right-3 bottom-24 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-sora bg-[var(--bg-card)] border border-[var(--border)] shadow-xl text-[var(--accent-green)]"
      >
        <ShieldCheck size={12} /> 24/7 · Automated
      </motion.div>

      {/* device frame */}
      <motion.div
        initial={{ opacity: 0, y: 24, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-secondary)] shadow-2xl overflow-hidden"
      >
        {/* header */}
        <div
          className="flex items-center gap-3 px-4 py-3.5"
          style={{ background: `linear-gradient(135deg, ${color}, var(--accent-purple))` }}
        >
          <span className="w-10 h-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-white">
            <AutomationIcon iconKey={iconKey} size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-white font-bold font-sora text-sm leading-tight truncate">{title}</p>
            <p className="text-white/85 text-[11px] flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-green)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-green)]" />
              </span>
              Online · replies instantly
            </p>
          </div>
        </div>

        {/* chat body */}
        <div className="px-4 py-5 space-y-3 bg-[var(--bg-primary)] min-h-[300px]">
          {lines.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.35, duration: 0.4 }}
              className={`flex ${l.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-3.5 py-2.5 text-[13px] leading-snug shadow-sm ${
                  l.from === 'user'
                    ? 'text-white rounded-[14px_14px_4px_14px]'
                    : 'bg-[var(--bg-card)] text-[var(--text-primary)] rounded-[14px_14px_14px_4px] border border-[var(--border)]'
                }`}
                style={l.from === 'user' ? { background: `linear-gradient(135deg, ${color}, var(--accent-purple))` } : undefined}
              >
                {l.text}
              </div>
            </motion.div>
          ))}

          {/* typing indicator that resolves into "confirmed" feel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + lines.length * 0.35 }}
            className="flex justify-start"
          >
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-full px-3 py-2 flex items-center gap-1">
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: color }}
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* start bar — tapping hands off to the real booking widget */}
        <button
          type="button"
          onClick={onStart}
          className="w-full flex items-center gap-2 px-3 py-3 border-t border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] transition-colors text-left"
        >
          <div className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-full px-4 py-2 text-[12px] text-[var(--text-secondary)]">
            Tap to start your booking…
          </div>
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${color}, var(--accent-purple))` }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </span>
        </button>
      </motion.div>

      {/* primary CTA — starts the live booking with this system pre-selected */}
      <button
        type="button"
        onClick={onStart}
        className="mt-4 w-full py-3 rounded-xl font-bold font-sora text-white flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
        style={{ background: `linear-gradient(135deg, ${color}, var(--accent-purple))`, boxShadow: `0 12px 30px -12px ${glow}` }}
      >
        Start with this system <ArrowRight size={17} />
      </button>

      {/* footer tag */}
      <p className="text-center text-[11px] text-[var(--text-secondary)] mt-3">
        🔒 Powered by <span className="font-semibold text-[var(--text-primary)]">MuleSoo AI</span> · works on web &amp; WhatsApp
      </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
