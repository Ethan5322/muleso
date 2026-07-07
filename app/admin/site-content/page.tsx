'use client';

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Save, Loader2 } from 'lucide-react';
import { SiteSettings, DEFAULT_SETTINGS } from '@/lib/siteSettings';

type Field = { key: keyof SiteSettings; label: string; placeholder: string; hint?: string; group: string };

const FIELDS: Field[] = [
  { key: 'phone', label: 'Phone (display)', placeholder: '+27 68 852 9333', group: 'Business Info' },
  { key: 'whatsapp', label: 'WhatsApp number (digits only)', placeholder: '27688529333', hint: 'Used for wa.me links — no + or spaces', group: 'Business Info' },
  { key: 'email', label: 'Business email', placeholder: 'hello@mulesoo.com', group: 'Business Info' },
  { key: 'address', label: 'Address / Location', placeholder: 'Pretoria, South Africa', group: 'Business Info' },
  { key: 'hours', label: 'Business hours', placeholder: 'Mon–Fri 8am–6pm SAST | Sat 9am–1pm', group: 'Business Info' },
  { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/company/...', group: 'Business Info' },
  { key: 'twitter', label: 'X / Twitter URL', placeholder: 'https://x.com/...', group: 'Business Info' },
  { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...', group: 'Business Info' },
  { key: 'hero_badge', label: 'Hero badge', placeholder: 'AI-Powered Digital Solutions', group: 'Homepage' },
  { key: 'hero_title', label: 'Hero headline', placeholder: 'Digital Excellence', group: 'Homepage' },
  { key: 'hero_subtitle', label: 'Hero subtitle', placeholder: 'Professional websites, AI chatbots…', group: 'Homepage' },
  { key: 'stat1_value', label: 'Stat 1 — value', placeholder: '50+', group: 'Homepage Stats' },
  { key: 'stat1_label', label: 'Stat 1 — label', placeholder: 'Projects Delivered', group: 'Homepage Stats' },
  { key: 'stat2_value', label: 'Stat 2 — value', placeholder: '100%', group: 'Homepage Stats' },
  { key: 'stat2_label', label: 'Stat 2 — label', placeholder: 'Client Satisfaction', group: 'Homepage Stats' },
  { key: 'stat3_value', label: 'Stat 3 — value', placeholder: '3+', group: 'Homepage Stats' },
  { key: 'stat3_label', label: 'Stat 3 — label', placeholder: 'Years Experience', group: 'Homepage Stats' },
  { key: 'stat4_value', label: 'Stat 4 — value', placeholder: '24/7', group: 'Homepage Stats' },
  { key: 'stat4_label', label: 'Stat 4 — label', placeholder: 'Support Available', group: 'Homepage Stats' },
];

const GROUPS = ['Business Info', 'Homepage', 'Homepage Stats'];

const TEAM_PHOTOS: { key: keyof SiteSettings; label: string }[] = [
  { key: 'team_vp_photo', label: 'Vice President' },
  { key: 'team_social_photo', label: 'Social Media Manager' },
  { key: 'team_sales_photo', label: 'Sales Manager' },
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

  const onPhoto = (key: keyof SiteSettings, file?: File) => {
    if (!file) return;
    if (file.size > 2_000_000) {
      toast.error('Please use an image under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, [key]: String(reader.result) }));
    reader.readAsDataURL(file);
  };

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
        <div className="space-y-6">
          {GROUPS.map((group) => (
            <div key={group} className="bg-[#0A0E17] border border-[#1E3A5F] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">{group}</h3>
              <div className={group === 'Homepage Stats' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-4'}>
                {FIELDS.filter((f) => f.group === group).map((f) => (
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
              </div>
            </div>
          ))}

          {/* Team photos */}
          <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-1">Team Photos</h3>
            <p className="text-xs text-[#7A8BA8] mb-4">Shown on the About page. Square photos work best — under 2MB. Save to publish.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {TEAM_PHOTOS.map((t) => (
                <div key={t.key} className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border border-[#1E3A5F] bg-[#1A2332] flex items-center justify-center mb-2">
                    {form[t.key] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form[t.key]} alt={t.label} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#7A8BA8] text-[11px]">No photo</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-[#00C8FF] mb-2">{t.label}</p>
                  <input
                    type="file"
                    accept="image/*"
                    aria-label={`${t.label} photo`}
                    onChange={(e) => onPhoto(t.key, e.target.files?.[0])}
                    className="block w-full text-[11px] text-[#7A8BA8] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#00C8FF]/15 file:text-[#00C8FF] file:text-xs file:font-semibold"
                  />
                  {form[t.key] && (
                    <button type="button" onClick={() => setForm((f) => ({ ...f, [t.key]: '' }))} className="text-[11px] text-red-400 mt-1.5 hover:underline">
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

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
