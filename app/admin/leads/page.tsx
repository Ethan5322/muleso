'use client';

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, X, Mail, MessageCircle, Trash2, Save } from 'lucide-react';

interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company?: string;
  service: string;
  budget: string;
  details: string;
  source?: string;
  status: string;
  notes?: string;
}

const STATUSES = ['New', 'Contacted', 'Won', 'Lost'] as const;

const statusColor = (s: string) =>
  s === 'New' ? 'bg-blue-500/20 text-blue-400'
  : s === 'Contacted' ? 'bg-yellow-500/20 text-yellow-400'
  : s === 'Won' ? 'bg-green-500/20 text-green-400'
  : 'bg-red-500/20 text-red-400';

export default function LeadsInbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | (typeof STATUSES)[number]>('All');
  const [selected, setSelected] = useState<Lead | null>(null);
  const [editStatus, setEditStatus] = useState('New');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/leads');
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const open = (l: Lead) => {
    setSelected(l);
    setEditStatus(l.status || 'New');
    setEditNotes(l.notes || '');
  };

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected.id, status: editStatus, notes: editNotes }),
      });
      if (!res.ok) throw new Error('Save failed');
      toast.success('Updated');
      setSelected(null);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Deleted');
      setSelected(null);
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const counts = {
    All: leads.length,
    New: leads.filter((l) => l.status === 'New').length,
    Contacted: leads.filter((l) => l.status === 'Contacted').length,
    Won: leads.filter((l) => l.status === 'Won').length,
    Lost: leads.filter((l) => l.status === 'Lost').length,
  };
  const visible = filter === 'All' ? leads : leads.filter((l) => l.status === filter);

  return (
    <div className="text-white">
      <Toaster position="top-center" />
      <div className="mb-6">
        <h2 className="text-3xl font-bold font-sora">Leads Inbox</h2>
        <p className="text-[#7A8BA8]">Contact-form enquiries — {leads.length} total</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(['All', ...STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
              filter === s
                ? 'bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white border-transparent'
                : 'bg-[#1A2332] text-[#7A8BA8] border-[#1E3A5F] hover:text-[#00C8FF]'
            }`}
          >
            {s} <span className="opacity-70">({counts[s]})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-[#7A8BA8]"><Loader2 className="animate-spin" size={18} /> Loading…</div>
      ) : visible.length === 0 ? (
        <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-xl p-8 text-center text-[#7A8BA8]">No leads here yet.</div>
      ) : (
        <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1A2332]">
                <tr>
                  <th className="text-left px-6 py-3 text-[#7A8BA8] font-semibold text-sm">Date</th>
                  <th className="text-left px-6 py-3 text-[#7A8BA8] font-semibold text-sm">Name</th>
                  <th className="text-left px-6 py-3 text-[#7A8BA8] font-semibold text-sm">Service</th>
                  <th className="text-left px-6 py-3 text-[#7A8BA8] font-semibold text-sm">Budget</th>
                  <th className="text-left px-6 py-3 text-[#7A8BA8] font-semibold text-sm">Status</th>
                  <th className="text-center px-6 py-3 text-[#7A8BA8] font-semibold text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((l) => (
                  <tr key={l.id} className="border-t border-[#1E3A5F] hover:bg-[#1A2332] transition">
                    <td className="px-6 py-3 text-sm text-[#7A8BA8] whitespace-nowrap">{new Date(l.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-sm">
                      <p className="text-white font-semibold">{l.name}</p>
                      <p className="text-[#7A8BA8] text-xs">{l.email}</p>
                    </td>
                    <td className="px-6 py-3 text-sm text-[#7A8BA8]">{l.service}</td>
                    <td className="px-6 py-3 text-sm text-[#7A8BA8]">{l.budget}</td>
                    <td className="px-6 py-3 text-sm"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(l.status)}`}>{l.status}</span></td>
                    <td className="px-6 py-3 text-center">
                      <button type="button" onClick={() => open(l)} className="text-[#00C8FF] hover:underline font-semibold text-sm">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{selected.name}</h3>
              <button type="button" onClick={() => setSelected(null)} className="text-[#7A8BA8] hover:text-white"><X size={22} /></button>
            </div>

            <div className="space-y-3 text-sm mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-[#7A8BA8] text-xs">Email</p><p className="break-all">{selected.email}</p></div>
                <div><p className="text-[#7A8BA8] text-xs">Company</p><p>{selected.company || '—'}</p></div>
                <div><p className="text-[#7A8BA8] text-xs">Service</p><p>{selected.service}</p></div>
                <div><p className="text-[#7A8BA8] text-xs">Budget</p><p>{selected.budget}</p></div>
                <div><p className="text-[#7A8BA8] text-xs">Source</p><p>{selected.source || '—'}</p></div>
                <div><p className="text-[#7A8BA8] text-xs">Received</p><p>{new Date(selected.created_at).toLocaleString()}</p></div>
              </div>
              <div><p className="text-[#7A8BA8] text-xs mb-1">Details</p><p className="bg-[#1A2332] rounded-lg p-3 whitespace-pre-wrap">{selected.details}</p></div>
            </div>

            <div className="flex gap-2 mb-4">
              <a href={`mailto:${selected.email}`} className="flex-1 flex items-center justify-center gap-2 bg-[#1A2332] border border-[#1E3A5F] text-[#00C8FF] py-2 rounded-lg text-sm font-semibold hover:bg-[#253345]"><Mail size={15} /> Email</a>
              <a href={`https://wa.me/?text=${encodeURIComponent(`Hi ${selected.name}, thanks for your enquiry to MuleSoo about ${selected.service}.`)}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/15 border border-[#25D366]/50 text-[#25D366] py-2 rounded-lg text-sm font-semibold hover:bg-[#25D366]/25"><MessageCircle size={15} /> WhatsApp</a>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-[#7A8BA8] mb-1.5">Status</label>
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} aria-label="Status" className="w-full bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#00C8FF]">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#7A8BA8] mb-1.5">Notes</label>
                <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={3} placeholder="Internal notes…" className="w-full bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#00C8FF] resize-none" />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={save} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white font-bold rounded-xl disabled:opacity-60">
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save
                </button>
                <button type="button" onClick={() => remove(selected.id)} className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-600/30"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
