'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';

export default function HomepageAdmin() {
  const [formData, setFormData] = useState({
    hero_badge: 'Intelligent Digital Solution',
    hero_title: 'Digital Excellence',
    hero_subtitle: 'AI Automation, Auto Pilot System, AI Chatbots, Professional Websites, Logos, and Digital Solutions built for businesses across the world.',
    stat1_value: '50+',
    stat1_label: 'Projects Delivered',
    stat2_value: '100%',
    stat2_label: 'Client Satisfaction',
    stat3_value: '3+',
    stat3_label: 'Years Experience',
    stat4_value: '24/7',
    stat4_label: 'Support Available',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          <h1 className="text-3xl font-bold font-sora gradient-text">Homepage Settings</h1>
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
          {/* Hero Section */}
          <div className="glass-card p-8 border border-[var(--border)] rounded-xl">
            <h2 className="text-2xl font-bold font-sora mb-6 text-[var(--text-primary)]">Hero Section</h2>

            <div className="space-y-6">
              {/* Badge */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                  Badge Text (the small pill above headline)
                </label>
                <input
                  type="text"
                  name="hero_badge"
                  value={formData.hero_badge}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-action-on-dark)] transition-colors"
                />
                <p className="text-xs text-[var(--text-secondary)] mt-1">This badge is clickable and links to /ai-automation</p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                  Main Headline (Large title text)
                </label>
                <input
                  type="text"
                  name="hero_title"
                  value={formData.hero_title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-action-on-dark)] transition-colors"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                  Subtitle (Supporting text below headline)
                </label>
                <textarea
                  name="hero_subtitle"
                  value={formData.hero_subtitle}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-action-on-dark)] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="glass-card p-8 border border-[var(--border)] rounded-xl">
            <h2 className="text-2xl font-bold font-sora mb-6 text-[var(--text-primary)]">Stats Bar</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stat 1 */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Stat 1 - Value</label>
                <input
                  type="text"
                  name="stat1_value"
                  value={formData.stat1_value}
                  onChange={handleChange}
                  placeholder="e.g. 50+"
                  className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-action-on-dark)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Stat 1 - Label</label>
                <input
                  type="text"
                  name="stat1_label"
                  value={formData.stat1_label}
                  onChange={handleChange}
                  placeholder="e.g. Projects Delivered"
                  className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-action-on-dark)] transition-colors"
                />
              </div>

              {/* Stat 2 */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Stat 2 - Value</label>
                <input
                  type="text"
                  name="stat2_value"
                  value={formData.stat2_value}
                  onChange={handleChange}
                  placeholder="e.g. 100%"
                  className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-action-on-dark)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Stat 2 - Label</label>
                <input
                  type="text"
                  name="stat2_label"
                  value={formData.stat2_label}
                  onChange={handleChange}
                  placeholder="e.g. Client Satisfaction"
                  className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-action-on-dark)] transition-colors"
                />
              </div>

              {/* Stat 3 */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Stat 3 - Value</label>
                <input
                  type="text"
                  name="stat3_value"
                  value={formData.stat3_value}
                  onChange={handleChange}
                  placeholder="e.g. 3+"
                  className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-action-on-dark)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Stat 3 - Label</label>
                <input
                  type="text"
                  name="stat3_label"
                  value={formData.stat3_label}
                  onChange={handleChange}
                  placeholder="e.g. Years Experience"
                  className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-action-on-dark)] transition-colors"
                />
              </div>

              {/* Stat 4 */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Stat 4 - Value</label>
                <input
                  type="text"
                  name="stat4_value"
                  value={formData.stat4_value}
                  onChange={handleChange}
                  placeholder="e.g. 24/7"
                  className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-action-on-dark)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Stat 4 - Label</label>
                <input
                  type="text"
                  name="stat4_label"
                  value={formData.stat4_label}
                  onChange={handleChange}
                  placeholder="e.g. Support Available"
                  className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-action-on-dark)] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full px-6 py-4 bg-gradient-to-r from-[var(--color-action-primary)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
