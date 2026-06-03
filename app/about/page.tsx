'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-7xl font-bold font-sora mb-6">
            <span className="text-[var(--text-primary)]">The Builder Behind</span>{' '}
            <span className="gradient-text">MuleSoo</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            One entrepreneur. Multiple ventures. One mission: bring world-class tech to African businesses.
          </p>
        </motion.div>

        {/* Founder Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center"
        >
          <div className="w-full h-96 bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] rounded-2xl border-2 border-[var(--accent-gold)] overflow-hidden relative">
            {/* CEO Image - Upload /public/CEO.jpg to display Ethan's photo */}
            <div className="relative w-full h-full">
              <Image
                src="/CEO.jpg"
                alt="Ethan - CEO of MuleSoo"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Fallback text when image not found */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-blue)]/50 to-[var(--accent-purple)]/50 flex items-center justify-center pointer-events-none">
              <span className="text-[var(--text-secondary)] text-center">
                <p className="text-sm">Add Ethan's photo</p>
                <p className="text-xs mt-2 opacity-60">/public/CEO.jpg</p>
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold font-sora text-[var(--text-primary)]">Hi, I&apos;m Ethan.</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              I&apos;m an entrepreneur and digital builder based in Pretoria, South Africa. I run MuleSoo Digital
              Services alongside Habesha Celebration Events — a full-service Ethiopian wedding planning company. I
              build websites, chatbots, automation systems, and educational content because I believe every African
              business deserves world-class digital tools.
            </p>

            <div>
              <p className="text-sm font-sora font-bold text-[var(--accent-gold)] uppercase mb-3">
                What I&apos;m currently building:
              </p>
              <div className="flex flex-wrap gap-3">
                {['MuleSoo.com 🛠️', 'Habesha Events 🎊', 'YouTube AI Channel 🎥'].map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 bg-[var(--glow-blue)] text-[var(--accent-blue)] rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              {[
                { name: 'LinkedIn', url: '#' },
                { name: 'GitHub', url: '#' },
                { name: 'YouTube', url: '#' },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.url}
                  className="px-4 py-2 border border-[var(--accent-blue)] text-[var(--accent-blue)] rounded-lg hover:bg-[var(--glow-blue)] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-card p-12 text-center mb-20 border border-[var(--border)]"
        >
          <p className="text-3xl italic text-[var(--text-primary)] mb-4">
            &quot;Africa doesn&apos;t need cheaper versions of Western tech. It needs builders who understand the
            culture AND the code.&quot;
          </p>
          <p className="text-[var(--text-secondary)]">— Ethan, Founder of MuleSoo</p>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: '💎', title: 'Quality First', desc: 'We build to the highest standard, every time.' },
              { emoji: '⚡', title: 'Speed', desc: 'Clients get results fast. Most projects launch within 3 weeks.' },
              { emoji: '🤝', title: 'Honesty', desc: 'We tell you exactly what you&apos;ll get and when.' },
              {
                emoji: '🔬',
                title: 'Innovation',
                desc: 'We use the latest AI tools so you benefit from cutting-edge tech.',
              },
            ].map((value) => (
              <div key={value.title} className="glass-card p-6 text-center">
                <p className="text-4xl mb-3">{value.emoji}</p>
                <h3 className="text-lg font-bold font-sora text-[var(--text-primary)] mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">{value.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold font-sora mb-6 gradient-text">
            Let&apos;s Build Your Vision Together
          </h2>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform text-lg"
          >
            Schedule a Call
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
