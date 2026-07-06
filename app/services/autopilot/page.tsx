'use client';

import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';
import AutopilotCover from '@/components/AutopilotCover';

export default function AutopilotPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          title="Auto Pilot System"
          subtitle="Your entire small institution — running itself, 24/7. Bookings, payments, members, reminders, records and reports, all connected into one system that works while you sleep."
        />

        {/* Cover + hook */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="order-2 lg:order-1 space-y-4 text-[var(--text-secondary)]">
            <h2 className="text-3xl font-bold font-sora gradient-text">Stop Running Your Business by Hand</h2>
            <p className="text-lg">
              Most small institutions drown in manual work — answering the same questions, chasing payments,
              writing reminders, updating spreadsheets, checking people in. It never ends.
            </p>
            <p>
              The <strong>Auto Pilot System</strong> takes over the whole loop. One integrated system that greets your
              customers, books them in, takes the deposit, issues their ID, sends the reminders, checks them in, and
              hands you clean reports — <strong>automatically</strong>. You stop being the operator and become the owner.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {['Works 24/7', 'No manual admin', 'You fully own it', 'Runs on autopilot'].map((b) => (
                <span
                  key={b}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold bg-[var(--glow-blue)] border border-[var(--accent-blue)]/40 text-[var(--accent-blue)]"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <AutopilotCover />
          </div>
        </motion.div>

        {/* How it's DIFFERENT from AI Automation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-3 gradient-text">
            Auto Pilot vs AI Automation
          </h2>
          <p className="text-center text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
            Both are powerful — they solve different problems. Here&apos;s how to choose.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="glass-card p-8">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="text-2xl font-bold font-sora text-[var(--text-primary)] mb-2">AI Automation</h3>
              <p className="text-[var(--text-secondary)] mb-4">
                Pick individual smart <strong>tools</strong> from our library of 200 to automate specific tasks in a
                business you already run.
              </p>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="text-[var(--accent-blue)]">•</span> Modular — add one system at a time</li>
                <li className="flex gap-2"><span className="text-[var(--accent-blue)]">•</span> Automates a <em>task</em> (e.g. a chatbot, a lead capture)</li>
                <li className="flex gap-2"><span className="text-[var(--accent-blue)]">•</span> Best when you already have systems in place</li>
                <li className="flex gap-2"><span className="text-[var(--accent-blue)]">•</span> Plug into your existing workflow</li>
              </ul>
            </div>

            <div className="glass-card p-8 border border-[var(--accent-blue)] shadow-[0_0_30px_-12px_var(--glow-blue)]">
              <div className="text-4xl mb-3">🛫</div>
              <h3 className="text-2xl font-bold font-sora text-[var(--text-primary)] mb-2">Auto Pilot System</h3>
              <p className="text-[var(--text-secondary)] mb-4">
                One complete <strong>system</strong> that runs your <em>entire</em> small institution end to end — every
                step connected, from first contact to final report.
              </p>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="text-[var(--accent-green)]">✓</span> Turnkey — the whole operation, built & handed over</li>
                <li className="flex gap-2"><span className="text-[var(--accent-green)]">✓</span> Automates the <em>business</em>, not just one task</li>
                <li className="flex gap-2"><span className="text-[var(--accent-green)]">✓</span> Best when you want everything to just run itself</li>
                <li className="flex gap-2"><span className="text-[var(--accent-green)]">✓</span> Front desk → back office, all in one</li>
              </ul>
            </div>
          </div>

          <p className="text-center text-[var(--text-secondary)] mt-8 max-w-2xl mx-auto">
            <strong className="text-[var(--text-primary)]">In short:</strong> AI Automation gives you smart parts.
            Auto Pilot gives you the whole machine — and the parts are built in.
          </p>
        </motion.div>

        {/* The autopilot loop — step by step */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-3 gradient-text">The Autopilot Loop</h2>
          <p className="text-center text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
            Every step below runs on its own, connected end to end — no staff member touches it.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: 1, title: 'Greet & Answer', desc: 'An AI assistant on your website & WhatsApp answers every enquiry instantly, day and night.' },
              { num: 2, title: 'Book & Schedule', desc: 'It collects the details, checks availability, and books the slot into your live calendar.' },
              { num: 3, title: 'Take Payment', desc: 'It requests the deposit or fee and confirms it automatically via Paystack — no invoicing by hand.' },
              { num: 4, title: 'Issue ID & Confirm', desc: 'It issues a digital ID / verification code and sends a branded confirmation to the customer.' },
              { num: 5, title: 'Remind & Follow Up', desc: 'Automatic WhatsApp/SMS reminders cut no-shows and bring customers back.' },
              { num: 6, title: 'Report to You', desc: 'You get a clean admin dashboard — bookings, income, members and trends, updated live.' },
            ].map((item) => (
              <div key={item.num} className="glass-card p-6 hover:border-[var(--accent-blue)] transition-all">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center mb-4">
                  <span className="text-white font-bold font-sora">{item.num}</span>
                </div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live proof — Yoyo Gym */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="glass-card overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-[var(--accent-blue)]/40">
            <div className="relative min-h-[260px] lg:min-h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/yoyo-gym.jpg"
                alt="Yoyo Gym — a live Auto Pilot System built by MuleSoo"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/70 to-transparent" />
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--accent-green)] text-black">
                <span className="w-1.5 h-1.5 rounded-full bg-black/70" /> LIVE SYSTEM
              </span>
            </div>
            <div className="p-8 sm:p-10">
              <p className="text-sm font-bold uppercase tracking-wider text-[var(--accent-blue)] mb-2">See It Live</p>
              <h2 className="text-3xl font-bold font-sora text-[var(--text-primary)] mb-3">
                Yoyo Gym runs on Auto Pilot
              </h2>
              <p className="text-[var(--text-secondary)] mb-5">
                A real gym we built and run on this exact system — from a QR scan to check-in at the door, with no
                manual admin in between. This is the Autopilot Loop, live:
              </p>
              <ul className="space-y-2 mb-6 text-sm text-[var(--text-secondary)]">
                {[
                  'QR → AI join-flow with PAR-Q health screening',
                  'Live membership tiers + e-signed agreement',
                  'Paystack recurring billing + failed-payment recovery',
                  'Digital membership ID + verification code',
                  'Face-recognition & QR check-in at the door',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-[var(--accent-green)] mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://yoyogym.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-lg hover:scale-105 transition-transform"
                >
                  Visit the Live System →
                </a>
                <a
                  href="/portfolio"
                  className="inline-block px-6 py-3 border border-[var(--border)] text-[var(--text-primary)] font-bold rounded-lg hover:border-[var(--accent-blue)] transition-colors"
                >
                  See in Portfolio
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Who it's for */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-4 gradient-text">Built For Small Institutions</h2>
          <p className="text-center text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
            If your day is bookings, members, payments and follow-ups, we can put it on autopilot.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🏋️', title: 'Gyms & Studios', desc: 'Join flow, membership tiers, recurring billing, ID cards & door check-in.' },
              { icon: '🍽️', title: 'Catering & Events', desc: 'Enquiries, quotes, deposit payments and calendar bookings — automated.' },
              { icon: '💇', title: 'Salons & Spas', desc: 'Online booking, deposits, reminders and a loyal-client follow-up loop.' },
              { icon: '🏥', title: 'Clinics & Practices', desc: 'Appointment intake, patient records, reminders and queue management.' },
              { icon: '🎓', title: 'Tutoring & Academies', desc: 'Enrolment, class scheduling, fees and student/parent updates.' },
              { icon: '⛪', title: 'Churches & NGOs', desc: 'Member registration, event check-in, giving and communication.' },
              { icon: '🏠', title: 'Rentals & Services', desc: 'Bookings, deposits, agreements and automated customer updates.' },
              { icon: '⚖️', title: 'Small Firms & Offices', desc: 'Client intake, appointment booking, payments and record-keeping.' },
              { icon: '🛒', title: 'Local Shops & Brands', desc: 'Orders, enquiries, payments and a repeat-customer engine.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-6 hover:border-[var(--accent-blue)] transition-all"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What we can build (Claude Code capabilities) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24 glass-card p-12 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-card)]"
        >
          <h2 className="text-3xl font-bold font-sora mb-3 gradient-text">Everything We Can Build Into It</h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-3xl">
            Your Auto Pilot System is assembled from the same battle-tested building blocks we use every day —
            so it&apos;s proven tech, not experiments:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-[var(--text-secondary)]">
            {[
              ['🌐 Custom Web & Mobile App', 'A fast, branded system built on Next.js — your own platform.'],
              ['🤖 AI Assistant (Claude)', 'Understands customers, collects details and books them in, 24/7.'],
              ['💳 Payments (Paystack)', 'Deposits, fees and recurring billing, confirmed automatically.'],
              ['📅 Live Calendar & Bookings', 'Real-time availability with automatic scheduling.'],
              ['🪪 Digital IDs & QR Check-in', 'Membership/ID cards with scan-to-verify at the door.'],
              ['🧑‍💻 Face Recognition', 'Optional biometric check-in and staff verification.'],
              ['📲 WhatsApp & SMS Automation', 'Confirmations, reminders and follow-ups sent on their own.'],
              ['🗄️ Secure Database (Supabase)', 'All records, members and history in one safe place.'],
              ['📊 Admin Dashboard & Reports', 'Live stats, income and trends — full control in one screen.'],
              ['📄 Auto PDFs & Agreements', 'Contracts, receipts and confirmations generated instantly.'],
            ].map(([title, desc]) => (
              <div key={title} className="flex flex-col">
                <span className="font-bold text-[var(--text-primary)]">{title}</span>
                <span className="text-sm">{desc}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Why choose us */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">Why Choose MuleSoo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '✅', title: 'Proven, Not Theoretical', desc: 'We already run real autopilot systems for gyms, caterers and clinics. You get what works.' },
              { icon: '💸', title: 'No Commission, You Own It', desc: 'It’s your system and your data — no per-booking fees skimming your revenue.' },
              { icon: '⚡', title: 'Fast to Launch', desc: 'Most systems go live within a few weeks, built around how you already work.' },
              { icon: '🧩', title: 'One Connected System', desc: 'No juggling five apps — bookings, payments, IDs and reports live together.' },
              { icon: '📈', title: 'Grows With You', desc: 'From your first customer to thousands, the system scales without breaking.' },
              { icon: '🤝', title: 'Local Support', desc: 'Built and supported from Pretoria — real help, fast responses.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-6 hover:border-[var(--accent-blue)] transition-all"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm">{item.desc}</p>
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
          className="glass-card p-12 text-center border border-[var(--accent-blue)]"
        >
          <h2 className="text-4xl font-bold font-sora mb-6 gradient-text">Put Your Institution on Autopilot</h2>
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            Tell us how your day runs, and we&apos;ll build a system that runs it for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-lg hover:scale-105 transition-transform"
            >
              Get a Free Quote →
            </a>
            <a
              href="https://wa.me/27688529333"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-[#25D366] text-white font-bold rounded-lg hover:scale-105 transition-transform"
            >
              💬 WhatsApp: +27 68 852 9333
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
