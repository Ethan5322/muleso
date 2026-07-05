'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, MapPin, QrCode, ArrowRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { getRecaptchaToken } from '@/lib/captcha';
import { useSiteSettings } from '@/lib/useSiteSettings';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function ContactPage() {
  const settings = useSiteSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    budget: '',
    details: '',
    source: '',
    website: '', // honeypot — must stay empty
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load reCAPTCHA v3 script once (only if configured)
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;
    if (document.querySelector('script[data-recaptcha]')) return;
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.setAttribute('data-recaptcha', 'true');
    document.body.appendChild(script);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // reCAPTCHA is optional protection — never let it hang the submit.
      let recaptchaToken = '';
      if (RECAPTCHA_SITE_KEY) {
        recaptchaToken = await Promise.race([
          getRecaptchaToken('contact').catch(() => ''),
          new Promise<string>((resolve) => setTimeout(() => resolve(''), 3500)),
        ]);
      }

      // Abort the request if the server takes too long, so the button can
      // never spin forever.
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, recaptchaToken }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', company: '', service: '', budget: '', details: '', source: '', website: '' });
      } else {
        setError(data.error || 'Something went wrong. Please try again or WhatsApp us.');
      }
    } catch (err) {
      console.error('Form error:', err);
      setError('Could not reach the server. Please check your connection or WhatsApp us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          title="Let's Start Building"
          subtitle="Tell us what you need. We respond within 2 hours on business days."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-8 text-center border border-[var(--accent-green)]"
              >
                <div className="text-6xl mb-4 text-[var(--accent-green)]">🎉</div>
                <h2 className="text-3xl font-bold font-sora text-[var(--text-primary)] mb-4">
                  Congratulations!
                </h2>
                <p className="text-[var(--text-secondary)] mb-2">
                  You&apos;ve successfully sent your request to our team.
                  We&apos;ll contact you within <strong className="text-[var(--accent-green)]">2 hours</strong>.
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  In the meantime, feel free to explore our services or check out our portfolio.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:border-[var(--accent-blue)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:border-[var(--accent-blue)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                    Company/Business Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:border-[var(--accent-blue)]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                      Service Needed *
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:border-[var(--accent-blue)]"
                    >
                      <option value="">Select a service</option>
                      <option value="website">Website Design</option>
                      <option value="chatbot">AI Chatbot</option>
                      <option value="logo">Logo Design</option>
                      <option value="qr">QR Code</option>
                      <option value="email">Custom Email</option>
                      <option value="pdf">PDF Guide</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                      Budget Range *
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:border-[var(--accent-blue)]"
                    >
                      <option value="">Select budget</option>
                      <option value="under-2k">Under R2,000</option>
                      <option value="2k-5k">R2,000 to R5,000</option>
                      <option value="5k-10k">R5,000 to R10,000</option>
                      <option value="10k-plus">R10,000+</option>
                      <option value="unsure">Not sure yet</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                    Project Details *
                  </label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us about your project, goals, and timeline..."
                    className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:border-[var(--accent-blue)] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                    How did you hear about us?
                  </label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:border-[var(--accent-blue)]"
                  >
                    <option value="">Select source</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="youtube">YouTube</option>
                    <option value="google">Google</option>
                    <option value="referral">Referral</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Honeypot (hidden from users) */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />

                {error && (
                  <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                </button>

                <p className="text-xs text-[var(--text-secondary)] text-center">
                  Prefer to chat?{' '}
                  <a
                    href={`https://wa.me/${settings.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] hover:underline"
                  >
                    Message us on WhatsApp
                  </a>
                </p>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-card p-8 space-y-6 sticky top-24">
              <h3 className="text-2xl font-bold font-sora text-[var(--text-primary)]">Contact Info</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="text-[var(--accent-blue)] mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-[var(--text-secondary)] font-bold">Email</p>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-[var(--accent-blue)] hover:underline font-semibold break-all"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="text-[#25D366] mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-[var(--text-secondary)] font-bold">WhatsApp</p>
                    <a
                      href={`https://wa.me/${settings.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] hover:underline font-semibold"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-[var(--accent-blue)] mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-[var(--text-secondary)] font-bold">Location</p>
                    <p className="text-[var(--text-secondary)]">{settings.address}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-6">
                <p className="text-[var(--accent-green)] text-sm font-bold mb-4">
                  Fast Response - Within 2 Hours
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {settings.hours}
                </p>
              </div>

              <div className="bg-[var(--glow-blue)] p-4 rounded-lg">
                <p className="text-xs text-[var(--text-secondary)]">
                  <strong>Pro tip:</strong> The more details you share about your project, the faster we can give you an accurate quote.
                </p>
              </div>
            </div>

            {/* QR code sub-page link */}
            <Link
              href="/contact/qr-code"
              className="mt-6 glass-card p-5 rounded-2xl border border-[var(--border)] hover:border-[var(--accent-blue)] transition-colors flex items-center gap-4 group"
            >
              <div className="w-11 h-11 rounded-lg bg-[var(--glow-blue)] flex items-center justify-center flex-shrink-0">
                <QrCode className="text-[var(--accent-blue)]" size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--text-primary)]">Our QR Code</p>
                <p className="text-xs text-[var(--text-secondary)]">Scan or download to visit MuleSoo anywhere</p>
              </div>
              <ArrowRight className="text-[var(--text-secondary)] group-hover:text-[var(--accent-blue)] transition-colors flex-shrink-0" size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
