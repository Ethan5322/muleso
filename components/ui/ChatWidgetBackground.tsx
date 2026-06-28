'use client';

import { motion } from 'framer-motion';

/**
 * Scoped animated background for the chatbot panel.
 * Mirrors the brand "elegant shape" motion language used on the site
 * (ShapeLandingHero) but contained inside the widget. Renders behind the
 * chat content (sits at the bottom of the stacking order, pointer-events off).
 */
function Shape({
  className,
  delay = 0,
  size = 160,
  gradient = 'from-cyan-500/[0.18]',
}: {
  className?: string;
  delay?: number;
  size?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.6, delay, ease: [0.23, 0.86, 0.39, 0.96] }}
      className={`absolute ${className ?? ''}`}
    >
      <motion.div
        animate={{ y: [0, 14, 0], x: [0, 8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay }}
        style={{ width: size, height: size }}
        className={`rounded-full bg-gradient-to-r ${gradient} to-transparent blur-2xl`}
      />
    </motion.div>
  );
}

export default function ChatWidgetBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.06] via-transparent to-cyan-500/[0.06]" />
      <Shape delay={0.1} size={200} gradient="from-cyan-500/[0.18]" className="top-[-10%] left-[-10%]" />
      <Shape delay={0.3} size={170} gradient="from-violet-500/[0.18]" className="bottom-[-12%] right-[-8%]" />
      <Shape delay={0.5} size={120} gradient="from-amber-500/[0.14]" className="top-[40%] right-[-6%]" />
      <Shape delay={0.7} size={110} gradient="from-indigo-500/[0.16]" className="bottom-[25%] left-[-6%]" />
    </div>
  );
}
