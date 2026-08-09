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
  gradient = 'from-[rgba(127,179,255,0.18)]',
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

/* This sits behind the chat widget on every page, so it was carrying Tailwind's
   own cyan/indigo/violet/amber ramp sitewide — a set of colours the palette does
   not contain. Named utilities like `from-cyan-500` are a syntax no hex or rgba
   search finds, which is how they survived the colour passes.

   Values are literal rather than var(): Tailwind's opacity modifier does not
   apply to a custom property, so the alpha is baked in here. No spaces inside
   the brackets — a space terminates an arbitrary value. */
export default function ChatWidgetBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(29,78,216,0.08)] via-transparent to-[rgba(123,47,255,0.06)]" />
      <Shape delay={0.1} size={200} gradient="from-[rgba(127,179,255,0.18)]" className="top-[-10%] left-[-10%]" />
      <Shape delay={0.3} size={170} gradient="from-[rgba(123,47,255,0.18)]" className="bottom-[-12%] right-[-8%]" />
      <Shape delay={0.5} size={120} gradient="from-[rgba(217,118,69,0.14)]" className="top-[40%] right-[-6%]" />
      <Shape delay={0.7} size={110} gradient="from-[rgba(29,78,216,0.16)]" className="bottom-[25%] left-[-6%]" />
    </div>
  );
}
