import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const ProfessionalQRCode = dynamic(() => import('@/components/ProfessionalQRCode'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Download QR Code | MuleSoo',
  description: 'Download your professional MuleSoo QR code for printing and framing',
};

export default function QRCodePage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold font-sora text-[var(--text-primary)]">
            Your <span className="gradient-text">Professional QR Code</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Download, print, and frame your MuleSoo QR code
          </p>
        </div>

        {/* QR Code Component */}
        <div className="mb-16">
          <ProfessionalQRCode
            url="https://mulesoo.com"
            title="🎯 MuleSoo - Digital Services"
            description="Scan to visit our website and explore our services"
            size={300}
          />
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-20">
          {/* Left Column - Why Use QR Code */}
          <div className="glass-card p-8 rounded-2xl border border-[var(--border)]">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-sora">
              Why Display This QR Code?
            </h2>
            <ul className="space-y-3 text-[var(--text-secondary)]">
              <li className="flex gap-3">
                <span className="text-[var(--accent-blue)]">✓</span>
                <span>
                  <strong>Drive Traffic:</strong> Instant access to your website
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--accent-blue)]">✓</span>
                <span>
                  <strong>Professional Look:</strong> Branded frame with your logo
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--accent-blue)]">✓</span>
                <span>
                  <strong>Mobile Friendly:</strong> Works with any smartphone camera
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--accent-blue)]">✓</span>
                <span>
                  <strong>Cost Effective:</strong> One-time print, lifetime use
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--accent-blue)]">✓</span>
                <span>
                  <strong>Social Proof:</strong> Shows clients you're modern & tech-savvy
                </span>
              </li>
            </ul>
          </div>

          {/* Right Column - Where to Display */}
          <div className="glass-card p-8 rounded-2xl border border-[var(--border)]">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 font-sora">
              Where to Display
            </h2>
            <ul className="space-y-3 text-[var(--text-secondary)]">
              <li className="flex gap-3">
                <span className="text-[var(--accent-gold)]">📍</span>
                <span>
                  <strong>Office Wall:</strong> Frame above your desk or reception
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--accent-gold)]">📍</span>
                <span>
                  <strong>Business Card:</strong> Print on back of business cards
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--accent-gold)]">📍</span>
                <span>
                  <strong>Invoice/Receipt:</strong> Add to all client documents
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--accent-gold)]">📍</span>
                <span>
                  <strong>Storefront:</strong> Display in window or shop front
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--accent-gold)]">📍</span>
                <span>
                  <strong>Social Media:</strong> Share on LinkedIn, Instagram, etc.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="mt-20 glass-card p-8 rounded-2xl border border-[var(--border)]">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 font-sora">
            📋 How to Use Your QR Code
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              {
                step: '1',
                title: 'Download',
                desc: 'Click the download button above',
              },
              {
                step: '2',
                title: 'Print',
                desc: 'Print at 300 DPI for best quality',
              },
              {
                step: '3',
                title: 'Frame',
                desc: 'Frame in your office or space',
              },
              {
                step: '4',
                title: 'Display',
                desc: 'Place in visible location',
              },
              {
                step: '5',
                title: 'Share',
                desc: 'Clients scan & visit instantly',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center text-white font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tips */}
        <div className="mt-12 bg-[var(--glow-gold)] border border-[var(--accent-gold)] rounded-2xl p-8">
          <h3 className="text-xl font-bold text-[var(--accent-gold)] mb-4 font-sora">
            💡 Pro Tips
          </h3>
          <ul className="space-y-2 text-sm text-[var(--accent-gold)]">
            <li>
              • <strong>Print Size:</strong> 8"×8" or larger for easy scanning
            </li>
            <li>
              • <strong>Resolution:</strong> Download version is 1200×1200px (300 DPI)
            </li>
            <li>
              • <strong>Placement:</strong> Eye level in high-traffic areas works best
            </li>
            <li>
              • <strong>Frame it:</strong> Use a clear frame to protect from damage
            </li>
            <li>
              • <strong>Test it:</strong> Scan with your phone before displaying
            </li>
          </ul>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-16 text-[var(--text-secondary)]">
          <p className="mb-4">
            🌍 This QR code links to:{' '}
            <span className="text-[var(--accent-blue)] font-semibold">
              https://mulesoo.com
            </span>
          </p>
          <p className="text-sm">
            Professional grade • Print & frame ready • 100% brand compliant
          </p>
        </div>
      </div>
    </main>
  );
}
