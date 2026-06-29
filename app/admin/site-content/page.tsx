'use client';

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Save, Loader2 } from 'lucide-react';
import { SiteSettings, DEFAULT_SETTINGS } from '@/lib/siteSettings';

const FIELDS: { key: keyof SiteSettings; label: string; placeholder: string; hint?: string }[] = [
  { key: 'phone', label: 'Phone (display)', placeholder: '+27 68 852 9333' },
  { key: 'whatsapp', label: 'WhatsApp number (digits only)', placeholder: '27688529333', hint: 'Used for wa.me links — no + or spaces' },
  { key: 'email', label: 'Business email', placeholder: 'hello@mulesoo.com' },
  { key: 'address', label: 'Address / Location', placeholder: 'Pretoria, South Africa' },
  { key: 'hours', label: 'Business hours', placeholder: 'Mon–Fri 8am–6pm SAST | Sat 9am–1pm' },
  { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/company/...' },
  { key: 'twitter', label: 'X / Twitter URL', placeholder: 'https://x.com/...' },
  { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
];

export default function SiteContentPage() {
  const [form, setForm] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((d) => setForm({ ...DEFAULT_SETTINGS, ...(d || {}) }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Save failed');
      }
      toast.success('✅ Saved — your live site is updated.');
    } catch (e: any) {
      toast.error(e.message || 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl text-white">
      <Toaster position="top-center" />
      <h2 className="text-3xl font-bold font-sora mb-2">Site Content — Business Info</h2>
      <p className="text-[#7A8BA8] mb-6">
        Edit the contact details and social links shown across the public site (footer, contact page).
      </p>

      {loading ? (
        <div className="flex items-center gap-2 text-[#7A8BA8]"><Loader2 className="animate-spin" size={18} /> Loading…</div>
      ) : (
        <div className="space-y-5 bg-[#0A0E17] border border-[#1E3A5F] rounded-2xl p-6">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-semibold text-[#00C8FF] mb-1.5">{f.label}</label>
              <input
                type="text"
                value={form[f.key]}
                placeholder={f.placeholder}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#00C8FF]"
              />
              {f.hint && <p className="text-xs text-[#7A8BA8] mt-1">{f.hint}</p>}
            </div>
          ))}

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}
