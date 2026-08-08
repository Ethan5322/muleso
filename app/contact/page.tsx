'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, MapPin, QrCode, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { getRecaptchaToken } from '@/lib/captcha';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { analytics } from '@/lib/analytics';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

// Validation helpers
const validators = {
  name: (v: string) => {
    if (!v.trim()) return 'Full name is required';
    if (v.trim().length < 2) return 'Name must be at least 2 characters';
    if (v.length > 100) return 'Name must not exceed 100 characters';
    return '';
  },
  email: (v: string) => {
    if (!v.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(v)) return 'Please enter a valid email address';
    return '';
  },
  company: (v: string) => {
    if (v && v.length > 100) return 'Company name must not exceed 100 characters';
    return '';
  },
  service: (v: string) => {
    if (!v) return 'Please select a service';
    return '';
  },
  budget: (v: string) => {
    if (!v) return 'Please select a budget range';
    return '';
  },
  details: (v: string) => {
    if (!v.trim()) return 'Project details are required';
    if (v.trim().length < 10) return 'Please provide at least 10 characters of detail';
    if (v.length > 2000) return 'Project details must not exceed 2000 characters';
    return '';
  },
};

type FieldErrors = Record<string, string>;

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill the enquiry when arriving from a service page (?service=Name).
  useEffect(() => {
    const svc = new URLSearchParams(window.location.search).get('service');
    if (svc) {
      setFormData((p) => ({
        ...p,
        service: p.service || 'other',
        details: p.details || `Hi MuleSoo, I'd like to book a free consultation about ${svc}.\n\nHere's what I have in mind:\n`,
      }));
    }
  }, []);

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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation for field
    if (name in validators) {
      const error = validators[name as keyof typeof validators](value);
      setFieldErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    (Object.keys(validators) as Array<keyof typeof validators>).forEach((field) => {
      const value = formData[field as keyof typeof formData] as string;
      const error = validators[field](value);
      if (error) errors[field] = error;
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all fields before submission
    if (!validateForm()) {
      setError('Please fix the errors above before submitting.');
      return;
    }

    setIsSubmitting(true);

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
        setFieldErrors({});
        // Track successful form submission
        analytics.contactFormSubmit(formData.service || 'general');
        analytics.leadSource(formData.source || 'direct', 'contact_form');
      } else if (response.status === 429) {
        setError('Too many requests. Please wait a few minutes before trying again.');
        analytics.contactFormError('rate_limited');
      } else if (response.status >= 500) {
        setError('Our server is experiencing issues. Please try again in a moment or contact us via WhatsApp.');
        analytics.contactFormError('server_error');
      } else {
        setError(data.error || 'Something went wrong. Please try again or WhatsApp us.');
        analytics.contactFormError('submission_failed');
      }
    } catch (err) {
      console.error('Form error:', err);
      analytics.contactFormError('request_error');
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request took too long. Please check your connection and try again.');
      } else {
        setError('Could not reach the server. Please check your connection or contact us via WhatsApp.');
      }
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
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
                <div className="flex justify-center mb-4">
                  <CheckCircle size={64} className="text-[var(--accent-green)]" />
                </div>
                <h2 className="text-3xl font-bold font-sora text-[var(--text-primary)] mb-4">
                  Message Received!
                </h2>
                <p className="text-[var(--text-secondary)] mb-2">
                  Thanks for reaching out. Our team will contact you within <strong className="text-[var(--accent-green)]">2 hours</strong>.
                </p>
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                  In the meantime, explore our services or check out our portfolio.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-[var(--color-action-primary)] hover:underline font-semibold text-sm"
                >
                  Send another enquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                      Full Name <span className="text-red-400/70">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      maxLength={100}
                      required
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                      className={`w-full px-4 py-3 sm:py-3 bg-[var(--bg-card)] border rounded-lg focus:outline-none transition-colors min-h-[48px] ${
                        fieldErrors.name
                          ? 'border-red-500/50 focus:border-red-400 bg-red-500/5'
                          : 'border-[var(--border)] focus:border-[var(--color-action-primary)]'
                      } text-[var(--text-primary)]`}
                      placeholder="Your full name"
                    />
                    {fieldErrors.name && (
                      <motion.div
                        id="name-error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mt-2 text-sm text-red-400"
                      >
                        <AlertCircle size={14} className="flex-shrink-0" />
                        {fieldErrors.name}
                      </motion.div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                      Email Address <span className="text-red-400/70">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      maxLength={254}
                      required
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                      className={`w-full px-4 py-3 bg-[var(--bg-card)] border rounded-lg focus:outline-none transition-colors min-h-[48px] ${
                        fieldErrors.email
                          ? 'border-red-500/50 focus:border-red-400 bg-red-500/5'
                          : 'border-[var(--border)] focus:border-[var(--color-action-primary)]'
                      } text-[var(--text-primary)]`}
                      placeholder="you@example.com"
                    />
                    {fieldErrors.email && (
                      <motion.div
                        id="email-error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mt-2 text-sm text-red-400"
                      >
                        <AlertCircle size={14} className="flex-shrink-0" />
                        {fieldErrors.email}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                    Company/Business Name
                  </label>
                  <input
                    id="company"
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    maxLength={100}
                    aria-invalid={!!fieldErrors.company}
                    aria-describedby={fieldErrors.company ? 'company-error' : 'company-hint'}
                    className={`w-full px-4 py-3 bg-[var(--bg-card)] border rounded-lg focus:outline-none transition-colors min-h-[48px] ${
                      fieldErrors.company
                        ? 'border-red-500/50 focus:border-red-400 bg-red-500/5'
                        : 'border-[var(--border)] focus:border-[var(--color-action-primary)]'
                    } text-[var(--text-primary)]`}
                    placeholder="Your business name (optional)"
                  />
                  {fieldErrors.company && (
                    <motion.div
                      id="company-error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 mt-2 text-sm text-red-400"
                    >
                      <AlertCircle size={14} className="flex-shrink-0" />
                      {fieldErrors.company}
                    </motion.div>
                  )}
                  {!fieldErrors.company && (
                    <p id="company-hint" className="text-xs text-[var(--text-secondary)] mt-1">Optional</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="service" className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                      Service Needed <span className="text-red-400/70">*</span>
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      aria-invalid={!!fieldErrors.service}
                      aria-describedby={fieldErrors.service ? 'service-error' : undefined}
                      className={`w-full px-4 py-3 bg-[var(--bg-card)] border rounded-lg focus:outline-none transition-colors cursor-pointer min-h-[48px] ${
                        fieldErrors.service
                          ? 'border-red-500/50 focus:border-red-400 bg-red-500/5'
                          : 'border-[var(--border)] focus:border-[var(--color-action-primary)]'
                      } text-[var(--text-primary)]`}
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
                    {fieldErrors.service && (
                      <motion.div
                        id="service-error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mt-2 text-sm text-red-400"
                      >
                        <AlertCircle size={14} className="flex-shrink-0" />
                        {fieldErrors.service}
                      </motion.div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                      Budget Range <span className="text-red-400/70">*</span>
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      required
                      aria-invalid={!!fieldErrors.budget}
                      aria-describedby={fieldErrors.budget ? 'budget-error' : undefined}
                      className={`w-full px-4 py-3 bg-[var(--bg-card)] border rounded-lg focus:outline-none transition-colors cursor-pointer min-h-[48px] ${
                        fieldErrors.budget
                          ? 'border-red-500/50 focus:border-red-400 bg-red-500/5'
                          : 'border-[var(--border)] focus:border-[var(--color-action-primary)]'
                      } text-[var(--text-primary)]`}
                    >
                      <option value="">Select budget</option>
                      <option value="under-100">Under $100</option>
                      <option value="100-300">$100 to $300</option>
                      <option value="300-600">$300 to $600</option>
                      <option value="600-plus">$600+</option>
                      <option value="unsure">Not sure yet</option>
                    </select>
                    {fieldErrors.budget && (
                      <motion.div
                        id="budget-error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mt-2 text-sm text-red-400"
                      >
                        <AlertCircle size={14} className="flex-shrink-0" />
                        {fieldErrors.budget}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="details" className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                    Project Details <span className="text-red-400/70">*</span>
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    maxLength={2000}
                    required
                    rows={6}
                    aria-invalid={!!fieldErrors.details}
                    aria-describedby={fieldErrors.details ? 'details-error' : 'details-hint'}
                    placeholder="Tell us about your project, goals, and timeline..."
                    className={`w-full px-4 py-3 bg-[var(--bg-card)] border rounded-lg focus:outline-none transition-colors resize-none ${
                      fieldErrors.details
                        ? 'border-red-500/50 focus:border-red-400 bg-red-500/5'
                        : 'border-[var(--border)] focus:border-[var(--color-action-primary)]'
                    } text-[var(--text-primary)]`}
                  />
                  <div className="flex items-start justify-between mt-2">
                    <div className="flex-1">
                      {fieldErrors.details && (
                        <motion.div
                          id="details-error"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-sm text-red-400"
                        >
                          <AlertCircle size={14} className="flex-shrink-0" />
                          {fieldErrors.details}
                        </motion.div>
                      )}
                      {!fieldErrors.details && (
                        <p id="details-hint" className="text-xs text-[var(--text-secondary)]">
                          More details help us give you a better quote. The more you share, the faster we can respond.
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-[var(--text-secondary)] ml-4 flex-shrink-0">
                      {formData.details.length}/2000
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="source" className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                    How did you hear about us?
                  </label>
                  <select
                    id="source"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:border-[var(--color-action-primary)] cursor-pointer transition-colors min-h-[48px]"
                  >
                    <option value="">Select source (optional)</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="youtube">YouTube</option>
                    <option value="google">Google</option>
                    <option value="referral">Referral</option>
                    <option value="other">Other</option>
                  </select>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">This helps us understand what's working.</p>
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
                  aria-label="Leave this field empty"
                />

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-start gap-3"
                  >
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-hover)] text-[var(--color-action-ink)] font-bold font-sora rounded-lg hover:shadow-lg hover:shadow-[var(--glow-action)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] flex items-center justify-center gap-2"
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Enquiry'
                  )}
                </button>

                <p className="text-xs text-[var(--text-secondary)] text-center">
                  Prefer to chat?{' '}
                  <a
                    href={`https://wa.me/${settings.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent-green)] hover:underline"
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
            <div className="glass-card p-6 sm:p-8 space-y-6 lg:sticky lg:top-24">
              <h3 className="text-2xl font-bold font-sora text-[var(--text-primary)]">Contact Info</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="text-[var(--color-action-primary)] mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-[var(--text-secondary)] font-bold">Email</p>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-[var(--color-action-primary)] hover:underline font-semibold break-all"
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
                  <MapPin className="text-[var(--color-action-primary)] mt-1 flex-shrink-0" size={20} />
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

              <div className="bg-[var(--glow-action)] p-4 rounded-lg">
                <p className="text-xs text-[var(--text-secondary)]">
                  <strong>Pro tip:</strong> The more details you share about your project, the faster we can give you an accurate quote.
                </p>
              </div>
            </div>

            {/* QR code sub-page link */}
            <Link
              href="/contact/qr-code"
              className="mt-6 glass-card p-5 rounded-2xl border border-[var(--border)] hover:border-[var(--color-action-primary)] transition-colors flex items-center gap-4 group"
            >
              <div className="w-11 h-11 rounded-lg bg-[var(--glow-action)] flex items-center justify-center flex-shrink-0">
                <QrCode className="text-[var(--color-action-primary)]" size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--text-primary)]">Our QR Code</p>
                <p className="text-xs text-[var(--text-secondary)]">Scan or download to visit MuleSoo anywhere</p>
              </div>
              <ArrowRight className="text-[var(--text-secondary)] group-hover:text-[var(--color-action-primary)] transition-colors flex-shrink-0" size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
