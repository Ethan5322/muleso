import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'How MuleSoo Digital Services collects, uses and protects your personal information, in line with South Africa’s POPIA.',
  path: '/privacy',
});

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold font-sora gradient-text mb-4">Privacy Policy</h1>
        <p className="text-[var(--text-secondary)] mb-12">Last updated: June 2026</p>

        <div className="space-y-8 text-[var(--text-secondary)]">
          <section>
            <h2 className="text-2xl font-bold font-sora text-[var(--text-primary)] mb-4">1. Introduction</h2>
            <p>
              MuleSoo Digital Services ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-sora text-[var(--text-primary)] mb-4">2. Information We Collect</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">Contact Information</h3>
                <p>When you use our chat widget or contact form, we collect your name, email address, phone number, and WhatsApp number.</p>
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">Automatically Collected Information</h3>
                <p>We collect information about your device, browser type, IP address, and pages visited using cookies and similar tracking technologies.</p>
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">Payment Information</h3>
                <p>When purchasing PDF guides, payment is processed by Stripe. We do not store credit card information.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-sora text-[var(--text-primary)] mb-4">3. How We Use Your Information</h2>
            <ul className="space-y-2 ml-6">
              <li>✓ To respond to your inquiries and provide services</li>
              <li>✓ To send you service updates and promotional materials</li>
              <li>✓ To improve our website and services</li>
              <li>✓ To comply with legal obligations</li>
              <li>✓ To prevent fraud and enhance security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-sora text-[var(--text-primary)] mb-4">4. Sharing Your Information</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist us in operating our website and conducting business, subject to confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-sora text-[var(--text-primary)] mb-4">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-sora text-[var(--text-primary)] mb-4">6. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information at any time by contacting us. You may also opt out of promotional communications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-sora text-[var(--text-primary)] mb-4">7. Contact Us</h2>
            <p>
              For questions about this Privacy Policy, please contact us at:<br/>
              📧 Email: hello@mulesoo.com<br/>
              💬 WhatsApp: +27 68 852 9333<br/>
              📍 Pretoria, South Africa
            </p>
          </section>

          <section className="border-t border-[var(--border)] pt-8">
            <p className="text-sm text-[var(--text-secondary)]">
              This Privacy Policy is subject to change without notice. Your continued use of our website indicates your acceptance of our policies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
