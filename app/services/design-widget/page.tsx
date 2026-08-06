'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import AnswerBlock from '@/components/AnswerBlock';
import PageHero from '@/components/PageHero';
import WidgetPreview from '@/components/WidgetPreview';
import { useChatbot } from '@/context/ChatbotContext';

export default function DesignWidgetPage() {
  const { openChatbot } = useChatbot();
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          title="Design Widget"
          subtitle="A beautiful support & sales widget for your website — it greets every visitor, answers instantly, captures leads and books customers, 24/7."
        />

        <AnswerBlock slug="design-widget" />

        {/* Cover + hook */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center"
        >
          <div className="space-y-4 text-[var(--text-secondary)]">
            <h2 className="text-3xl font-bold font-sora gradient-text">Never Lose Another Visitor</h2>
            <p className="text-lg">
              Most website visitors leave with a question unanswered — and a question unanswered is a sale lost.
              A <strong>widget</strong> is the small chat button in the corner of your site that changes that: it
              greets visitors, answers instantly, and turns browsers into buyers.
            </p>
            <p>
              We design a stunning, on-brand support widget that lives on every page of your website — powered by AI so
              it works around the clock, even while you sleep.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {['Answers in seconds', 'Captures every lead', 'Books & sells', 'Works 24/7'].map((b) => (
                <span key={b} className="px-3 py-1.5 rounded-full text-sm font-semibold bg-[var(--glow-blue)] border border-[var(--accent-blue)]/40 text-[var(--accent-blue)]">
                  {b}
                </span>
              ))}
            </div>

            {/* Proof — open the real, live MuleSoo widget on this site */}
            <div className="pt-4">
              <p className="text-sm text-[var(--text-primary)] font-semibold mb-2">Want proof it&apos;s real?</p>
              <button
                type="button"
                onClick={() => openChatbot()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform"
              >
                <MessageCircle size={18} /> Try Our Live Widget
              </button>
              <p className="text-xs text-[var(--text-secondary)] mt-2">
                This isn&apos;t a mock-up — it opens the real widget running on this very website. That&apos;s our actual work.
              </p>
            </div>
          </div>
          <div className="pb-6">
            <WidgetPreview />
            <button
              type="button"
              onClick={() => openChatbot()}
              className="block mx-auto text-center text-xs text-[var(--accent-blue)] hover:underline mt-8"
            >
              👆 This is the kind of widget we build — tap to open the live one on this site →
            </button>
          </div>
        </motion.div>

        {/* Why it pays for itself — stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-3 gradient-text">A Widget Pays For Itself</h2>
          <p className="text-center text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
            The numbers on website support widgets are hard to ignore:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { stat: '63%', label: 'of customers are more likely to buy from a site that has a chat widget.' },
              { stat: '2.8×', label: 'more likely to convert — visitors who chat convert nearly three times as often.' },
              { stat: '+60%', label: 'more spent per purchase when buyers get their questions answered in real time.' },
            ].map((s) => (
              <div key={s.stat} className="glass-card p-8 text-center">
                <p className="text-5xl font-bold font-sora gradient-text mb-3">{s.stat}</p>
                <p className="text-sm text-[var(--text-secondary)]">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* What a widget can do */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">What Your Widget Can Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '💬', title: 'Answer Instantly', desc: 'Replies to visitor questions in seconds — about products, prices, hours and policies.' },
              { icon: '🧲', title: 'Capture Leads', desc: 'Collects names, numbers and what they want, so no enquiry is ever lost.' },
              { icon: '📅', title: 'Book Appointments', desc: 'Takes bookings and reservations right inside the chat, day or night.' },
              { icon: '💳', title: 'Take Deposits', desc: 'Requests and confirms deposits or payments to lock in the sale.' },
              { icon: '🤖', title: 'AI-Powered', desc: 'Understands natural questions and answers like a trained team member.' },
              { icon: '📲', title: 'WhatsApp Handoff', desc: 'Passes hot leads straight to your WhatsApp when a human is needed.' },
              { icon: '🔔', title: 'Proactive Greetings', desc: 'Pops up with the right message at the right moment to start the conversation.' },
              { icon: '🎨', title: 'Fully On-Brand', desc: 'Designed in your colours, logo and voice — it feels part of your site.' },
              { icon: '📊', title: 'Logs Everything', desc: 'Saves every conversation so you can follow up and learn what customers want.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-6 border border-[var(--border)] hover:border-[var(--accent-blue)] hover:shadow-lg hover:shadow-[var(--glow-blue)] transition-all duration-300"
                whileHover={{ translateY: -4 }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Who it's for */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24 glass-card p-12 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-card)]"
        >
          <h2 className="text-3xl font-bold font-sora mb-6 gradient-text">Perfect For Any Website</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-[var(--text-secondary)]">
            {[
              ['🛍️ Online Stores', 'Answer product questions and rescue abandoned carts.'],
              ['🏥 Clinics & Salons', 'Book appointments and reduce no-shows automatically.'],
              ['🍽️ Restaurants & Catering', 'Take reservations and quote enquiries instantly.'],
              ['🏋️ Gyms & Studios', 'Sign up members and answer membership questions.'],
              ['🏠 Agencies & Services', 'Qualify leads and book consultations while you work.'],
              ['🎉 Events & Venues', 'Handle enquiries and lock in deposits 24/7.'],
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
              { icon: '✨', title: 'Stunning Design', desc: 'A widget that looks premium and feels part of your brand — not a generic bolt-on.' },
              { icon: '🧠', title: 'Genuinely Smart', desc: 'Powered by modern AI, trained on your business — it answers accurately, not robotically.' },
              { icon: '🔌', title: 'One-Line Install', desc: 'We add it to your site for you. Works on any website — no rebuild needed.' },
              { icon: '💸', title: 'You Own It', desc: 'No per-chat fees eating your margins. It’s yours.' },
              { icon: '⚡', title: 'Fast Setup', desc: 'Live on your site in days, trained on your services and prices.' },
              { icon: '🤝', title: 'Local Support', desc: 'Built and supported from Pretoria — real people, fast replies.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-6 border border-[var(--border)] hover:border-[var(--accent-blue)] hover:shadow-lg hover:shadow-[var(--glow-blue)] transition-all duration-300"
                whileHover={{ translateY: -4 }}
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
          <h2 className="text-4xl font-bold font-sora mb-6 gradient-text">Ready to Build Your Next Project?</h2>
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            Let&apos;s create something amazing together. Start with a free consultation — we&apos;ll design a widget
            that greets, answers and sells for you, 24/7.
          </p>
          <a
            href="/contact?service=Design%20Widget"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform"
          >
            Get Started →
          </a>
        </motion.div>
      </div>
    </div>
  );
}
