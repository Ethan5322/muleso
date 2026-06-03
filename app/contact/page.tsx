'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, MapPin } from 'lucide-react';
import PageHero from '@/components/PageHero';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    budget: '',
    details: '',
    source: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', company: '', service: '', budget: '', details: '', source: '' });
      }
    } catch (error) {
      console.error('Form error:', error);
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
          {/* Form */}
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
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-3xl font-bold font-sora text-[var(--text-primary)] mb-4">
                  Thank you, {formData.name}!
                </h2>
                <p className="text-[var(--text-secondary)] mb-2">
                  We&apos;ve received your enquiry and will reply to <strong>{formData.email}</strong> within 2 hours.
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
                      <option value="2k-5k">R2,000 – R5,000</option>
                      <option value="5k-10k">R5,000 – R10,000</option>
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send My Enquiry →'}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
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
                      href="mailto:hello@mulesoo.com"
                      className="text-[var(--accent-blue)] hover:underline"
                    >
                      hello@mulesoo.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="text-[var(--accent-blue)] mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-[var(--text-secondary)] font-bold">WhatsApp</p>
                    <a
                      href="https://wa.me/27123456789"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent-blue)] hover:underline"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-[var(--accent-blue)] mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-[var(--text-secondary)] font-bold">Location</p>
                    <p className="text-[var(--text-secondary)]">Pretoria, South Africa</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-6">
                <p className="text-[var(--accent-green)] text-sm font-bold mb-4">
                  ⚡ Reply within 2 hours
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Mon–Fri 8am–6pm SAST | Sat 9am–1pm
                </p>
              </div>

              <div className="bg-[var(--glow-blue)] p-4 rounded-lg">
                <p className="text-xs text-[var(--text-secondary)]">
                  💡 <strong>Pro tip:</strong> The more details you share about your project, the faster we can give
                  you an accurate quote.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
