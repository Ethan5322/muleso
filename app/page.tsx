'use client';

import Link from 'next/link';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';
import HeroBackground from '@/components/HeroBackground';

const StatCounter = ({ value, label }: { value: string; label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="text-6xl font-bold gradient-text font-sora mb-3">{value}</div>
      <div className="text-[var(--text-secondary)] text-base font-light">{label}</div>
    </motion.div>
  );
};

const ServiceCard = ({
  icon,
  title,
  description,
  delay,
}: {
  icon: string;
  title: string;
  description: string;
  delay: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-8 hover:border-[var(--accent-blue)] hover:glow-blue transition-all duration-300 hover:-translate-y-2 group"
    >
      <div className="w-14 h-14 rounded-full bg-[var(--glow-blue)] flex items-center justify-center mb-6 group-hover:bg-[var(--accent-blue)] text-2xl">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-sora text-[var(--text-primary)] mb-3">
        {title}
      </h3>
      <p className="text-base text-[var(--text-secondary)] mb-6 leading-relaxed">{description}</p>
      <Link
        href="/services"
        className="text-[var(--accent-blue)] text-base font-medium hover:gap-2 inline-flex items-center transition-all"
      >
        Learn more <span className="ml-1">→</span>
      </Link>
    </motion.div>
  );
};

export default function Home() {
  return (
    <>
      <HeroBackground />

      {/* SECTION 1 - HERO */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto w-full text-center">
          <motion.div className="space-y-6">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-block"
            >
              <div className="border border-[var(--accent-blue)] bg-[var(--glow-blue)] px-4 py-2 rounded-full w-fit mx-auto">
                <span className="text-[var(--accent-blue)] font-sora text-sm font-bold">
                  🚀 AI-Powered Digital Solutions
                </span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-7xl lg:text-8xl font-bold font-sora leading-tight gradient-text"
            >
              Digital Excellence
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-light"
            >
              Professional websites, AI chatbots, logos, and digital solutions built for businesses across South Africa.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            >
              <Link
                href="/services"
                className="px-10 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform hover:shadow-[0_0_30px_var(--glow-blue)]"
              >
                Explore Services
              </Link>
              <Link
                href="/portfolio"
                className="px-10 py-4 border-2 border-[var(--accent-blue)] text-[var(--accent-blue)] font-bold font-sora rounded-lg hover:bg-[var(--glow-blue)] transition-colors"
              >
                View Our Work
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 - STATS BAR */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <StatCounter value="50+" label="Projects Delivered" />
            <StatCounter value="100%" label="Client Satisfaction" />
            <StatCounter value="3+" label="Years Experience" />
            <StatCounter value="24/7" label="Support Available" />
          </div>
        </div>
      </section>

      {/* SECTION 3 - SERVICES GRID */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-bold gradient-text font-sora mb-6">
              Our Services
            </h2>
            <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-3xl mx-auto font-light">
              Complete digital solutions to build and grow your business
            </p>
          </motion.div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              icon="🌐"
              title="Website Design"
              description="Stunning, fast websites built to convert visitors into clients."
              delay={0}
            />
            <ServiceCard
              icon="🤖"
              title="AI Chatbots"
              description="24/7 intelligent assistants that handle your customer service."
              delay={0.08}
            />
            <ServiceCard
              icon="🎨"
              title="Logo Design"
              description="Professional brand identity that makes you unforgettable."
              delay={0.16}
            />
            <ServiceCard
              icon="📄"
              title="PDF Guides"
              description="Expert knowledge packaged as downloadable products you sell forever."
              delay={0.24}
            />
            <ServiceCard
              icon="📱"
              title="QR Code Design"
              description="Custom branded QR codes with built-in analytics tracking."
              delay={0.32}
            />
            <ServiceCard
              icon="📧"
              title="Custom Email"
              description="Professional @yourdomain.com email that builds instant credibility."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* SECTION 4 - PROCESS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-6xl md:text-7xl font-bold gradient-text text-center font-sora mb-20"
          >
            How We Work
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: 1, title: 'Discovery', icon: '🔍', desc: 'We learn your business, goals, and audience in detail.' },
              { number: 2, title: 'Design', icon: '📐', desc: 'We craft wireframes and visual concepts for your approval.' },
              { number: 3, title: 'Build', icon: '⚙️', desc: 'We develop with precision using the world&apos;s best tech stack.' },
              { number: 4, title: 'Launch', icon: '🚀', desc: 'We deploy, test, and hand you the keys to your new digital asset.' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="glass-card p-6 h-full">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center mb-4 text-lg">
                    <span className="text-white font-bold font-sora">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-bold font-sora text-[var(--text-primary)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 - FINAL CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-y border-[var(--border)]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-5xl md:text-7xl font-bold gradient-text font-sora mb-8">
            Let&apos;s Start Building
          </h2>
          <p className="text-[var(--text-secondary)] text-lg md:text-xl mb-10 font-light">
            Get in touch to discuss your project. We respond within 2 hours.
          </p>
          <Link
            href="/contact"
            className="inline-block px-12 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform text-lg hover:shadow-[0_0_30px_var(--glow-blue)]"
          >
            Get In Touch
          </Link>
        </motion.div>
      </section>
    </>
  );
}
