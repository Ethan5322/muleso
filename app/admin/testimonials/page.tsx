'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Star, Loader2, X } from 'lucide-react';

interface Testimonial {
  id?: string;
  author: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  order: number;
}

const EMPTY: Testimonial = { author: '', role: '', company: '', quote: '', rating: 5, order: 0 };

export default function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.author || !editing.quote) {
      toast.error('Author and quote are required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: editing.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || 'Save failed');
      }
      toast.success('Saved');
      setEditing(null);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id?: string) => {
    if (!id || !confirm('Delete this testimonial?')) return;
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Deleted');
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="text-white">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold font-sora">Testimonials</h2>
          <p className="text-[#7A8BA8]">Real client reviews shown on the home page</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing({ ...EMPTY, order: items.length })}
          className="bg-[var(--color-action-primary)] hover:bg-[#00B3E6] text-black font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-[#7A8BA8]"><Loader2 className="animate-spin" size={18} /> Loading…</div>
      ) : items.length === 0 ? (
        <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-xl p-8 text-center text-[#7A8BA8]">
          No testimonials yet. Add real client reviews — they replace the placeholders on the home page.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((t) => (
            <div key={t.id} className="bg-[#0A0E17] border border-[#1E3A5F] rounded-xl p-5">
              <div className="flex items-center gap-1 mb-2 text-[#E8B84B]">
                {Array.from({ length: t.rating || 5 }).map((_, i) => <Star key={i} size={14} className="fill-[#E8B84B]" />)}
              </div>
              <p className="text-sm text-[#A8B2D0] italic mb-3">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-white font-semibold text-sm">{t.author}</p>
              <p className="text-[#7A8BA8] text-xs">{[t.role, t.company].filter(Boolean).join(', ')}</p>
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => setEditing(t)} className="bg-[#7B2FFF] hover:bg-[#6B1FEF] text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm">
                  <Edit2 size={14} /> Edit
                </button>
                <button type="button" onClick={() => remove(t.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold">{editing.id ? 'Edit' : 'Add'} Testimonial</h3>
              <button type="button" onClick={() => setEditing(null)} className="text-[#7A8BA8] hover:text-white"><X size={22} /></button>
            </div>
            <div className="space-y-4">
              <textarea
                value={editing.quote}
                onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
                placeholder="The review / quote *"
                rows={3}
                className="w-full bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[var(--color-action-primary)] resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} placeholder="Author name *" className="bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[var(--color-action-primary)]" />
                <input value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} placeholder="Role (e.g. CEO)" className="bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[var(--color-action-primary)]" />
                <input value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} placeholder="Company" className="bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[var(--color-action-primary)]" />
                <select value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} aria-label="Rating" className="bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[var(--color-action-primary)]">
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
                </select>
              </div>
              <button type="button" onClick={save} disabled={saving} className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[var(--color-action-primary)] to-[#7B2FFF] text-white font-bold rounded-xl disabled:opacity-60">
                {saving ? <Loader2 className="animate-spin" size={18} /> : null}
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
