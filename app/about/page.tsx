'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { parseTeam, type TeamAccent } from '@/lib/siteSettings';

// The team is fully editable from the admin panel (Site Content → Team).
const ACCENT: Record<TeamAccent, string> = {
  blue: 'var(--color-action-primary)',
  purple: 'var(--accent-purple)',
  green: 'var(--accent-green)',
  gold: 'var(--accent-gold)',
};

const initials = (name: string) =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

export default function AboutPage() {
  const settings = useSiteSettings();
  const team = parseTeam(settings.team_members);
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <PageHero
          compact
          title="The Team Behind MuleSoo"
          subtitle="Not one person — a team of builders, marketers and closers on one mission: bring world-class tech to African businesses."
        />

        {/* Founder Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 lg:gap-14 mt-10 mb-24 items-center"
        >
          <div className="flex flex-col items-center lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="w-full max-w-[300px]"
            >
              <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[var(--accent-gold)] glow-gold shadow-2xl mb-5"
                style={{
                  aspectRatio: '4/5',
                  boxShadow: '0 0 40px rgba(217, 118, 69, 0.3), 0 0 80px rgba(217, 118, 69, 0.15)'
                }}>
                <Image
                  src="/CEO.jpg"
                  alt="Ena Muluken - Founder and CEO of MuleSoo"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold font-sora text-[var(--accent-gold)] mb-1">Ena Muluken</h3>
                <p className="text-lg font-sora text-[var(--text-primary)] font-bold">Founder and CEO</p>
                <p className="text-sm text-[var(--text-secondary)] mt-2">MuleSoo Digital Services</p>
              </div>
            </motion.div>
          </div>

          <div className="space-y-5">
            <p className="text-sm font-sora font-bold text-[var(--color-action-on-dark)] uppercase tracking-wide">Meet the Founder</p>
            <h2 className="text-4xl font-bold font-sora text-[var(--text-primary)] -mt-2">Hi, I&apos;m Ena Muluken.</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
              I founded <span className="text-[var(--text-primary)] font-semibold">MuleSoo Digital Services</span> to give
              African businesses the same world-class websites, AI chatbots and automation the biggest brands use — built
              by a team that understands both the <span className="text-[var(--accent-gold)]">culture</span> and the{' '}
              <span className="text-[var(--color-action-on-dark)]">code</span>.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Based in Pretoria, South Africa, I also run Habesha Celebration Events and share what we learn on YouTube.
              Every day, our team turns ambitious ideas into digital products that win.
            </p>

            <div>
              <p className="text-sm font-sora font-bold text-[var(--accent-gold)] uppercase mb-3">
                What we&apos;re currently building:
              </p>
              <div className="flex flex-wrap gap-3">
                {['MuleSoo.com 🛠️', 'Habesha Events 🎊', 'YouTube AI Channel 🎥'].map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 bg-[var(--glow-action)] text-[var(--color-action-on-dark)] rounded-full text-sm"
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
                <motion.div key={link.name} whileHover={{ scale: 1.05 }}>
                  <Link
                    href={link.url}
                    className="inline-block px-4 py-2 border border-[var(--color-action-on-dark)] text-[var(--color-action-on-dark)] rounded-lg hover:bg-[var(--glow-action)] hover:shadow-lg hover:shadow-[var(--glow-action)]/50 transition-all"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Meet the Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-3 gradient-text">Meet the Team</h2>
          <p className="text-center text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
            MuleSoo is built and run by a team — real people behind every project, not a one-person show.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m, i) => {
              const color = ACCENT[m.accent] || 'var(--color-action-primary)';
              return (
                <motion.div key={`${m.name}-${i}`} whileHover={{ translateY: -4 }} className="glass-card p-6 flex flex-col items-center text-center border border-[var(--border)] hover:border-[var(--color-action-on-dark)] hover:shadow-lg hover:shadow-[var(--glow-action)] transition-all duration-300">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden mb-4 border-2 shrink-0" style={{ borderColor: color }}>
                    {m.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-[var(--bg-card)]">
                        <User size={20} className="text-[var(--text-secondary)]/50" />
                        <span className="text-2xl font-bold font-sora" style={{ color }}>
                          {initials(m.name)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold font-sora text-[var(--text-primary)]">{m.name}</h3>
                  <p className="text-sm font-semibold mb-3" style={{ color }}>{m.role}</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{m.bio}</p>
                </motion.div>
              );
            })}
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
          <p className="text-[var(--text-secondary)]">— Ena Muluken, Founder of MuleSoo</p>
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
              <motion.div key={value.title} whileHover={{ translateY: -4 }} className="glass-card p-6 text-center border border-[var(--border)] hover:border-[var(--accent-purple)] hover:shadow-lg hover:shadow-[var(--glow-purple)] transition-all duration-300">
                <p className="text-4xl mb-3">{value.emoji}</p>
                <h3 className="text-lg font-bold font-sora text-[var(--text-primary)] mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">{value.desc}</p>
              </motion.div>
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
            className="inline-block px-10 py-4 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-hover)] text-[var(--color-action-ink)] font-bold font-sora rounded-lg hover:scale-105 transition-transform text-lg"
          >
            Schedule a Call
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
