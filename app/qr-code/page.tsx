'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const ProfessionalQRCode = dynamic(() => import('@/components/ProfessionalQRCode'), {
  ssr: false,
});

export default function QRCodePage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold font-sora text-[var(--text-primary)]">
            Scan to Visit <span className="gradient-text">MuleSoo</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Professional QR code ready to print, frame, and display in your office
          </p>
        </motion.div>

        {/* Main Content - Phone Mockup + QR Code */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24" data-qr-section>
          {/* Left: Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            {/* Phone Frame */}
            <div className="relative w-80 h-[650px]">
              {/* Phone Body */}
              <div className="absolute inset-0 bg-black rounded-[50px] shadow-2xl border-8 border-gray-900 overflow-hidden">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-8 bg-black rounded-b-3xl z-50" />

                {/* Screen Content */}
                <div className="absolute inset-0 pt-10 bg-white flex flex-col items-center justify-center px-4 overflow-hidden">
                  {/* Status Bar */}
                  <div className="absolute top-2 w-full flex justify-between items-center px-6 text-black text-xs font-semibold">
                    <span>9:41</span>
                    <span>●●●●●</span>
                  </div>

                  {/* App Header */}
                  <div className="absolute top-10 w-full text-center">
                    <p className="text-2xl font-bold font-sora bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] bg-clip-text text-transparent">
                      MULESOO
                    </p>
                    <p className="text-xs text-gray-600 font-medium">Digital Services</p>
                  </div>

                  {/* QR Code Display */}
                  <div className="mt-16 flex flex-col items-center gap-3">
                    {/* QR Code Background */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                      <svg viewBox="0 0 200 200" className="w-40 h-40" fill="none">
                        <rect width="200" height="200" fill="white" />
                        {/* QR Pattern Mockup */}
                        <g fill="#00C8FF">
                          <rect x="10" y="10" width="50" height="50" />
                          <rect x="20" y="20" width="30" height="30" fill="white" />
                          <rect x="25" y="25" width="20" height="20" />

                          <rect x="140" y="10" width="50" height="50" />
                          <rect x="150" y="20" width="30" height="30" fill="white" />
                          <rect x="155" y="25" width="20" height="20" />

                          <rect x="10" y="140" width="50" height="50" />
                          <rect x="20" y="150" width="30" height="30" fill="white" />
                          <rect x="25" y="155" width="20" height="20" />

                          {[0, 1, 0, 1, 1, 0, 1, 0].map((bit, i) =>
                            bit ? <rect key={i} x={70 + i * 10} y={70} width="8" height="8" /> : null
                          )}
                        </g>
                      </svg>
                    </div>

                    {/* Scan Me Text */}
                    <div className="text-center">
                      <p className="text-2xl font-bold font-sora text-[#00C8FF]">📱 Scan Me</p>
                      <p className="text-xs text-gray-500 mt-1">Point camera to scan</p>
                    </div>
                  </div>

                  {/* Website URL */}
                  <div className="absolute bottom-8 text-center">
                    <p className="text-xs font-semibold text-gray-600">mulesoo.com</p>
                  </div>
                </div>
              </div>

              {/* Phone Reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-[50px] pointer-events-none" />
            </div>
          </motion.div>

          {/* Right: QR Code Download */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="space-y-8">
              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold font-sora text-[var(--text-primary)]">
                  Download Your QR Code
                </h2>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                  Professional-grade QR code ready to print, frame, and display.
                  High resolution (300 DPI) for crystal-clear scanning.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🎯', title: 'High Resolution', desc: '1200×1200px' },
                  { icon: '📱', title: 'Mobile Ready', desc: 'Any smartphone' },
                  { icon: '🖼️', title: 'Frame Ready', desc: 'Professional design' },
                  { icon: '🌐', title: 'Direct Link', desc: 'To mulesoo.com' },
                ].map((feature, idx) => (
                  <div key={idx} className="glass-card p-4 rounded-lg border border-[var(--border)]">
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {feature.title}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">{feature.desc}</p>
                  </div>
                ))}
              </div>

              {/* Download Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ProfessionalQRCode
                  url="https://mulesoo.com"
                  title="🎯 MuleSoo - Digital Services"
                  description="Professional QR code for printing and framing"
                  size={300}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Why Display QR Code */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: '📈',
              title: 'Drive Traffic',
              desc: 'Instant access to your website from any physical location',
            },
            {
              icon: '✨',
              title: 'Premium Look',
              desc: 'Shows clients you\'re modern, tech-savvy, and professional',
            },
            {
              icon: '💎',
              title: 'Cost Effective',
              desc: 'One-time print costs nothing, generates endless visits',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-2xl border border-[var(--border)] text-center hover:border-[var(--accent-blue)] transition-colors"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Display Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-card p-12 rounded-2xl border border-[var(--border)] mb-20"
        >
          <h2 className="text-3xl font-bold font-sora text-[var(--text-primary)] mb-8 text-center">
            Where to Display
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { icon: '🖼️', name: 'Office Wall', desc: 'Main reception or desk' },
              { icon: '💼', name: 'Business Cards', desc: 'Back of card design' },
              { icon: '📄', name: 'Invoices', desc: 'On all documents' },
              { icon: '🏪', name: 'Storefront', desc: 'Window or entrance' },
              { icon: '📱', name: 'Social Media', desc: 'All platforms' },
            ].map((location, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-3">{location.icon}</div>
                <h4 className="font-semibold text-[var(--text-primary)] mb-1">
                  {location.name}
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">{location.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pro Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[var(--glow-gold)] to-[var(--glow-purple)] rounded-2xl p-8 border border-[var(--accent-gold)]"
        >
          <h3 className="text-2xl font-bold text-[var(--accent-gold)] mb-6 font-sora">
            💡 Pro Tips for Maximum Impact
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              '✓ Print at 8"×8" or larger for easy scanning',
              '✓ Use 300 DPI for professional print quality',
              '✓ Frame with clear glass to protect from wear',
              '✓ Place at eye level in high-traffic areas',
              '✓ Test scan with your phone before displaying',
              '✓ Include on all business documents',
            ].map((tip, idx) => (
              <div key={idx} className="text-[var(--text-primary)] font-medium">
                {tip}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-16 text-[var(--text-secondary)]">
          <p className="text-lg font-semibold text-[var(--accent-blue)] mb-2">
            Links directly to: https://mulesoo.com
          </p>
          <p className="text-sm">
            Professional • Print-Ready • 300 DPI • 1200×1200px
          </p>
        </div>
      </div>
    </main>
  );
}
