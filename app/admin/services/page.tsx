'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Loader2, X } from 'lucide-react';

interface Service {
  id?: string;
  title: string;
  description: string;
  price: string;
  icon: string;
  href: string;
  features: string[];
  order: number;
}

const EMPTY: Service = { title: '', description: '', price: '', icon: '🌐', href: '', features: [], order: 0 };

export default function ServicesManager() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [featuresText, setFeaturesText] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openEditor = (s: Service) => {
    setEditing(s);
    setFeaturesText((s.features || []).join(', '));
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.title) {
      toast.error('Title is required');
      return;
    }
    setSaving(true);
    const payload = {
      ...editing,
      features: featuresText.split(',').map((f) => f.trim()).filter(Boolean),
    };
    try {
      const res = await fetch('/api/admin/services', {
        method: editing.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
    if (!id || !confirm('Delete this service?')) return;
    try {
      const res = await fetch('/api/admin/services', {
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
          <h2 className="text-3xl font-bold font-sora">Services & Pricing</h2>
          <p className="text-[#7A8BA8]">Manage the services shown on the Services page</p>
        </div>
        <button
          type="button"
          onClick={() => openEditor({ ...EMPTY, order: items.length })}
          className="bg-[#00C8FF] hover:bg-[#00B3E6] text-black font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={18} /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-[#7A8BA8]"><Loader2 className="animate-spin" size={18} /> Loading…</div>
      ) : items.length === 0 ? (
        <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-xl p-8 text-center text-[#7A8BA8]">
          No services yet — the public page shows the built-in defaults. Add services to override them.
        </div>
      ) : (
        <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1A2332]">
                <tr>
                  <th className="text-left px-6 py-4 text-[#7A8BA8] font-semibold">Service</th>
                  <th className="text-left px-6 py-4 text-[#7A8BA8] font-semibold">Price</th>
                  <th className="text-center px-6 py-4 text-[#7A8BA8] font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id} className="border-t border-[#1E3A5F] hover:bg-[#1A2332] transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{s.icon}</span>
                        <span className="text-white font-semibold">{s.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#E8B84B] font-semibold">{s.price || '—'}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button type="button" onClick={() => openEditor(s)} className="bg-[#7B2FFF] hover:bg-[#6B1FEF] text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm">
                          <Edit2 size={14} /> Edit
                        </button>
                        <button type="button" onClick={() => remove(s.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm">
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold">{editing.id ? 'Edit' : 'Add'} Service</h3>
              <button type="button" onClick={() => setEditing(null)} className="text-[#7A8BA8] hover:text-white"><X size={22} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <input value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} placeholder="🌐" aria-label="Icon emoji" className="col-span-1 bg-[#1A2332] border border-[#1E3A5F] text-white px-3 py-2.5 rounded-lg text-center focus:outline-none focus:border-[#00C8FF]" />
                <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Service title *" className="col-span-3 bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#00C8FF]" />
              </div>
              <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Description" rows={2} className="w-full bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#00C8FF] resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <input value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} placeholder="Price (e.g. From $199)" className="bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#00C8FF]" />
                <input value={editing.href} onChange={(e) => setEditing({ ...editing, href: e.target.value })} placeholder="Link (e.g. /services/chatbot)" className="bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#00C8FF]" />
              </div>
              <div>
                <label className="block text-sm text-[#7A8BA8] mb-1.5">Features (comma-separated)</label>
                <input value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder="Responsive, SEO, Fast Loading" className="w-full bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#00C8FF]" />
              </div>
              <button type="button" onClick={save} disabled={saving} className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white font-bold rounded-xl disabled:opacity-60">
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
