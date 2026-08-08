'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Save, Loader2, Plus, Trash2, User } from 'lucide-react';
import { SiteSettings, DEFAULT_SETTINGS, DEFAULT_TEAM, parseTeam, type TeamMember, type TeamAccent } from '@/lib/siteSettings';

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
const ACCENTS: TeamAccent[] = ['blue', 'purple', 'green', 'gold'];

export default function SiteContentPage() {
  const [form, setForm] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [team, setTeam] = useState<TeamMember[]>(DEFAULT_TEAM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((d) => {
        setForm({ ...DEFAULT_SETTINGS, ...(d || {}) });
        setTeam(parseTeam(d?.team_members));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Keep the team array and its JSON in the settings form in sync.
  const commitTeam = (next: TeamMember[]) => {
    setTeam(next);
    setForm((f) => ({ ...f, team_members: JSON.stringify(next) }));
  };
  const updateMember = (i: number, patch: Partial<TeamMember>) =>
    commitTeam(team.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  const addMember = () =>
    commitTeam([...team, { name: '', role: '', bio: '', photo: '', accent: ACCENTS[team.length % ACCENTS.length] }]);
  const removeMember = (i: number) => commitTeam(team.filter((_, idx) => idx !== i));

  // Accept any gallery photo: auto center-crop to a square, resize + compress.
  const onMemberPhoto = (i: number, file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const SIZE = 512;
        const canvas = document.createElement('canvas');
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, SIZE, SIZE);
        updateMember(i, { photo: canvas.toDataURL('image/jpeg', 0.85) });
        toast.success('Photo ready — click Save to publish.');
      };
      img.onerror = () => toast.error('Could not read that image. Try another.');
      img.src = String(reader.result);
    };
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
                    <label className="block text-sm font-semibold text-[var(--color-action-primary)] mb-1.5">{f.label}</label>
                    <input
                      type="text"
                      value={form[f.key]}
                      placeholder={f.placeholder}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[var(--color-action-primary)]"
                    />
                    {f.hint && <p className="text-xs text-[#7A8BA8] mt-1">{f.hint}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Team members (About page) */}
          <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold text-white">Team (About page)</h3>
              <button type="button" onClick={addMember} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-action-primary)] hover:underline">
                <Plus size={14} /> Add member
              </button>
            </div>
            <p className="text-xs text-[#7A8BA8] mb-4">Edit each person&apos;s name, role, bio and photo. Photos auto-crop to a square. Save to publish.</p>

            <div className="space-y-4">
              {team.map((m, i) => (
                <div key={i} className="bg-[#1A2332] border border-[#1E3A5F] rounded-xl p-4 flex flex-col sm:flex-row gap-4">
                  {/* Photo */}
                  <div className="sm:w-28 shrink-0 text-center">
                    <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border border-[#1E3A5F] bg-[#0A0E17] flex items-center justify-center mb-2">
                      {m.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.photo} alt={m.name || 'member'} className="w-full h-full object-cover" />
                      ) : (
                        <User size={20} className="text-[#8296B8]" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      aria-label={`Photo for ${m.name || 'team member'}`}
                      onChange={(e) => onMemberPhoto(i, e.target.files?.[0])}
                      className="block w-full text-[10px] text-[#7A8BA8] file:mr-1 file:py-1 file:px-2 file:rounded file:border-0 file:bg-[var(--color-action-primary)]/15 file:text-[var(--color-action-primary)] file:text-[10px] file:font-semibold"
                    />
                    {m.photo && (
                      <button type="button" onClick={() => updateMember(i, { photo: '' })} className="text-[10px] text-red-400 mt-1 hover:underline">
                        Remove photo
                      </button>
                    )}
                  </div>

                  {/* Fields */}
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        value={m.name}
                        onChange={(e) => updateMember(i, { name: e.target.value })}
                        placeholder="Full name"
                        aria-label="Name"
                        className="w-full bg-[#0A0E17] border border-[#1E3A5F] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[var(--color-action-primary)]"
                      />
                      <input
                        value={m.role}
                        onChange={(e) => updateMember(i, { role: e.target.value })}
                        placeholder="Role / responsibility"
                        aria-label="Role"
                        className="w-full bg-[#0A0E17] border border-[#1E3A5F] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[var(--color-action-primary)]"
                      />
                    </div>
                    <textarea
                      value={m.bio}
                      onChange={(e) => updateMember(i, { bio: e.target.value })}
                      placeholder="Short bio / details about this person…"
                      rows={2}
                      aria-label="Bio"
                      className="w-full bg-[#0A0E17] border border-[#1E3A5F] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[var(--color-action-primary)] resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <select
                        value={m.accent}
                        onChange={(e) => updateMember(i, { accent: e.target.value as TeamAccent })}
                        aria-label="Accent colour"
                        className="bg-[#0A0E17] border border-[#1E3A5F] text-[#A8B2D0] px-2 py-1.5 rounded-lg text-xs focus:outline-none focus:border-[var(--color-action-primary)]"
                      >
                        {ACCENTS.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => removeMember(i)} className="inline-flex items-center gap-1 text-xs text-red-400 hover:underline">
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[var(--color-action-primary)] to-[#7B2FFF] text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}
