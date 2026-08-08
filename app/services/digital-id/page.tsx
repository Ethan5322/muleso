'use client';

import { motion } from 'framer-motion';
import AnswerBlock from '@/components/AnswerBlock';
import PageHero from '@/components/PageHero';
import DigitalIdCardPreview from '@/components/DigitalIdCardPreview';

export default function DigitalIdPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          title="Digital ID Service"
          subtitle="Professional, verifiable digital ID cards for any institution — each with a unique QR code and verification number linked to the holder's details. Scan it, and their record appears instantly."
        />

        <AnswerBlock slug="digital-id" />

        {/* Cover card + intro */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <DigitalIdCardPreview />
            <p className="text-center text-xs text-[var(--text-secondary)] mt-4">
              Sample card — every field, the QR code and the verification number are unique to each holder.
            </p>
          </div>
          <div className="space-y-4 text-[var(--text-secondary)]">
            <h2 className="text-3xl font-bold font-sora gradient-text">One Scan. Full Identity.</h2>
            <p className="text-lg">
              A <strong>Digital ID</strong> is a corporate-grade identity card we design and build for your organisation.
              Every card carries a <strong>unique verification number</strong> and a <strong>QR code</strong> that are
              permanently linked to that person&apos;s details in your secure system.
            </p>
            <p>
              When a staff member, member, patient, student or visitor is scanned at your gate, desk or event,
              their verified record — name, role, department, status, validity — appears instantly on your device.
              No guesswork, no fakes, no manual registers.
            </p>
            <ul className="space-y-2">
              {[
                'Unique verification number + QR per person',
                'Scan to instantly reveal the holder’s details',
                'Barcode for hardware/USB scanners',
                'Works on any phone or laptop camera',
                'Fully branded with your logo & colours',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-[var(--accent-green)]">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-12 gradient-text">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: 1, title: 'Enrol the Person', desc: 'You capture the holder’s details once. The system issues a unique ID number, verification code and QR.' },
              { num: 2, title: 'Issue the Card', desc: 'A professional digital ID card is generated — download, print, or send it straight to their phone.' },
              { num: 3, title: 'Scan to Verify', desc: 'Scan the QR or barcode with any phone/laptop camera or a hardware scanner at your entry point.' },
              { num: 4, title: 'Details Appear', desc: 'Their verified record shows instantly — name, role, status, validity — so you know exactly who they are.' },
            ].map((item) => (
              <div key={item.num} className="glass-card p-6">
                <div className="w-12 h-12 rounded-full bg-[var(--color-action-primary)] flex items-center justify-center mb-4">
                  <span className="text-white font-bold font-sora">{item.num}</span>
                </div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Built for any institution */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-4xl font-bold font-sora text-center mb-4 gradient-text">Built For Any Institution</h2>
          <p className="text-center text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
            If you need to know who someone is and whether they belong, a Digital ID fits.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🏢', title: 'Companies & Offices', desc: 'Staff ID cards with access verification and department records.' },
              { icon: '🎓', title: 'Schools & Colleges', desc: 'Student & staff IDs — verify enrolment, class and status at a scan.' },
              { icon: '🏥', title: 'Hospitals & Clinics', desc: 'Patient and staff IDs linked to records, wards and permissions.' },
              { icon: '⛪', title: 'Churches & NGOs', desc: 'Member cards for check-in, events and community programmes.' },
              { icon: '🏋️', title: 'Gyms & Clubs', desc: 'Membership cards that verify active status and tier at the door.' },
              { icon: '🎫', title: 'Events & Conferences', desc: 'Attendee & VIP passes — scan to admit, no printed lists needed.' },
              { icon: '🛡️', title: 'Security & Estates', desc: 'Contractor, visitor and resident IDs for controlled access.' },
              { icon: '🏛️', title: 'Government & Associations', desc: 'Official membership and credential cards with verifiable identity.' },
              { icon: '🚚', title: 'Logistics & Field Teams', desc: 'Driver and field-agent IDs verified on delivery or on site.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-6 border border-[var(--border)] hover:border-[var(--color-action-primary)] hover:shadow-lg hover:shadow-[var(--glow-action)] transition-all duration-300"
                whileHover={{ translateY: -4 }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Extra security add-ons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24 glass-card p-12 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-card)]"
        >
          <h2 className="text-3xl font-bold font-sora mb-3 gradient-text">Connect It For Even More Security</h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-3xl">
            A Digital ID is a foundation you can layer additional protection onto. We can connect your IDs to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-[var(--text-secondary)]">
            {[
              ['🧑‍💻 Face Recognition', 'Match the holder’s face to their record for two-factor entry.'],
              ['🔢 PIN / Verification Code', 'A private code the holder enters to confirm it’s really them.'],
              ['📲 WhatsApp / SMS OTP', 'One-time codes sent to the holder’s phone at sensitive checkpoints.'],
              ['⏳ Expiry & Auto-Suspend', 'Cards that expire, or can be suspended/revoked instantly.'],
              ['📊 Access & Scan Logs', 'A full audit trail of who was scanned, where and when.'],
              ['🚪 Door & Gate Integration', 'Trigger turnstiles, gates or attendance systems on a valid scan.'],
              ['🗂️ Role & Permission Tiers', 'Different access levels per role, department or membership tier.'],
              ['🔐 Encrypted Records', 'Details stored securely and served only to authorised scanners.'],
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
              { icon: '🏆', title: 'We Already Run This', desc: 'Our own admin ID system uses exactly this technology — QR, barcode, verification codes and a live scanner. You get proven tech, not a prototype.' },
              { icon: '🎨', title: 'Corporate-Grade Design', desc: 'Premium, branded cards that make your institution look serious and professional.' },
              { icon: '⚡', title: 'Instant Verification', desc: 'Scan-to-details in under a second — on any phone, laptop or hardware scanner.' },
              { icon: '🔒', title: 'Secure & Ownable', desc: 'Your data stays in your system. No middlemen, no per-scan fees — you own it.' },
              { icon: '🧩', title: 'Fully Custom', desc: 'Cards, fields, scanner and rules are all tailored to how your institution works.' },
              { icon: '🤝', title: 'Local Support', desc: 'Built and supported from Pretoria — real people who answer fast.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-6 border border-[var(--border)] hover:border-[var(--color-action-primary)] hover:shadow-lg hover:shadow-[var(--glow-action)] transition-all duration-300"
                whileHover={{ translateY: -4 }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold font-sora text-center mb-12 gradient-text">FAQ</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              { q: 'What is scanned — the QR or the barcode?', a: 'Both work. The QR scans with any phone or laptop camera; the barcode works with hardware/USB scanners. Either one pulls up the holder’s verified record.' },
              { q: 'Can someone fake or copy a card?', a: 'The verification number and QR are validated against your live system on every scan — a copied image with no valid record simply fails. You can also add face or PIN verification.' },
              { q: 'Do the cards need to be printed?', a: 'No. They work fully digital on a phone, and can also be printed as physical cards if you prefer both.' },
              { q: 'Can I suspend or revoke a card?', a: 'Yes — instantly. A suspended or expired card is rejected the moment it is scanned.' },
              { q: 'How many IDs can I issue?', a: 'As many as you need. The system is built to scale from a handful to thousands.' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 hover:border-[var(--color-action-primary)] transition-all">
                <h3 className="font-bold text-[var(--text-primary)] mb-2">{item.q}</h3>
                <p className="text-[var(--text-secondary)] text-sm">{item.a}</p>
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
          className="glass-card p-12 text-center border border-[var(--color-action-primary)]"
        >
          <h2 className="text-4xl font-bold font-sora mb-6 gradient-text">Ready to Build Your Next Project?</h2>
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            Let&apos;s create something amazing together. Start with a free consultation — tell us who you need to
            identify and how, and we&apos;ll build a branded ID + verification system around it.
          </p>
          <a
            href="/contact?service=Digital%20ID%20Service"
            className="inline-block px-10 py-4 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-hover)] text-[var(--color-action-ink)] font-bold font-sora rounded-lg hover:scale-105 transition-transform"
          >
            Get Started →
          </a>
        </motion.div>
      </div>
    </div>
  );
}
