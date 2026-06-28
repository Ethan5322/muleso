'use client';

import { useEffect, useState } from 'react';
import { Trash2, Edit2, Plus, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, PortfolioItem } from '@/lib/supabase';
import PortfolioEditor from './PortfolioEditor';
import ConfirmationDialog from './ConfirmationDialog';

export default function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioItem | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('order', { ascending: true });
      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast.error(`Failed to load portfolio: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaved = () => {
    setEditing(null);
    setCreating(false);
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Delete failed');
      }
      toast.success('Portfolio item deleted');
      setDeleteTarget(null);
      load();
    } catch (error: any) {
      toast.error(`Delete failed: ${error.message}`);
      setDeleteTarget(null);
    }
  };

  // Editor view (add / edit)
  if (creating || editing) {
    return (
      <PortfolioEditor
        item={editing}
        onSave={handleSaved}
        onCancel={() => {
          setEditing(null);
          setCreating(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white font-sora">Portfolio Projects</h2>
          <p className="text-[#7A8BA8]">Add, edit, or delete your live portfolio</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="bg-[#00C8FF] hover:bg-[#00B3E6] text-black font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition transform hover:scale-105"
        >
          <Plus size={20} /> Add New Project
        </button>
      </div>

      <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1A2332]">
              <tr>
                <th className="text-left px-6 py-4 text-[#7A8BA8] font-semibold">Project</th>
                <th className="text-left px-6 py-4 text-[#7A8BA8] font-semibold">Category</th>
                <th className="text-left px-6 py-4 text-[#7A8BA8] font-semibold">Client</th>
                <th className="text-center px-6 py-4 text-[#7A8BA8] font-semibold">Featured</th>
                <th className="text-center px-6 py-4 text-[#7A8BA8] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center px-6 py-8 text-[#7A8BA8]">Loading…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="text-center px-6 py-8 text-[#7A8BA8]">No portfolio items yet. Click &quot;Add New Project&quot; to get started.</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-t border-[#1E3A5F] hover:bg-[#1A2332] transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image_url} alt={item.title} className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-[#1A2332] flex items-center justify-center text-[#7A8BA8]">🖼️</div>
                        )}
                        <span className="text-white font-semibold">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#7A8BA8]">{item.category}</td>
                    <td className="px-6 py-4 text-[#7A8BA8]">{item.client_name}</td>
                    <td className="px-6 py-4 text-center">
                      {item.featured ? <Star size={16} className="inline text-[#E8B84B] fill-[#E8B84B]" /> : <span className="text-[#7A8BA8]">—</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => setEditing(item)}
                          className="bg-[#7B2FFF] hover:bg-[#6B1FEF] text-white px-3 py-1 rounded-lg flex items-center gap-1 transition"
                        >
                          <Edit2 size={16} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 transition"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#0A0E17] to-[#0F1624] border border-[#1E3A5F] rounded-lg p-6">
        <p className="text-[#7A8BA8] text-sm">Total Portfolio Items: <span className="text-white font-bold text-lg">{items.length}</span></p>
      </div>

      <ConfirmationDialog
        isOpen={!!deleteTarget}
        isDangerous
        title="Delete portfolio item?"
        message={`This will permanently delete "${deleteTarget?.title ?? ''}". This cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
