'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';

export default function ContactAdmin() {
  const [formData, setFormData] = useState({
    phone: '+27 68 852 9333',
    email: 'hello@mulesoo.com',
    whatsapp: '27688529333',
    address: 'Pretoria, South Africa',
    hours: 'Mon–Fri 8am–6pm SAST | Sat 9am–1pm',
    linkedin: '',
    twitter: '',
    instagram: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors">
            <ArrowLeft size={24} className="text-[var(--text-primary)]" />
          </Link>
          <h1 className="text-3xl font-bold font-sora gradient-text">Contact Information</h1>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-[var(--glow-green)] border border-[var(--accent-green)] rounded-lg flex items-center gap-3">
            <CheckCircle size={20} className="text-[var(--accent-green)]" />
            <p className="text-white font-semibold">Changes saved successfully!</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Contact */}
          <div className="glass-card p-8 border border-[var(--border)] rounded-xl">
            <h2 className="text-2xl font-bold font-sora mb-6 text-[var(--text-primary)]">Primary Contact</h2>

            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+27 68 852 9333"
                  className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                  WhatsApp Number (digits only)
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="27688529333"
                  className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                />
                <p className="text-xs text-[var(--text-secondary)] mt-1">Enter digits only (no +, spaces, or dashes)</p>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Physical Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Pretoria, South Africa"
                  className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                />
              </div>

              {/* Hours */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Business Hours</label>
                <input
                  type="text"
                  name="hours"
                  value={formData.hours}
                  onChange={handleChange}
                  placeholder="Mon–Fri 8am–6pm SAST | Sat 9am–1pm"
                  className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="glass-card p-8 border border-[var(--border)] rounded-xl">
            <h2 className="text-2xl font-bold font-sora mb-6 text-[var(--text-primary)]">Social Media Links</h2>

            <div className="space-y-6">
              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">LinkedIn URL (full)</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/company/mulesoo"
                  className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                />
              </div>

              {/* Twitter */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Twitter/X URL (full)</label>
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="https://x.com/mulesoo"
                  className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Instagram URL (full)</label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/mulesoo"
                  className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full px-6 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
