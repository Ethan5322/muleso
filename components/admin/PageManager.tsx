'use client';

import { useEffect, useState } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { CustomPage } from '@/lib/supabase';
import PageEditor from './PageEditor';
import ConfirmationDialog from './ConfirmationDialog';

export default function PageManager() {
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CustomPage | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CustomPage | null>(null);

  // Read through the admin API, not the anon browser client. The `pages` RLS
  // policy only exposes published rows, so reading directly here made every
  // draft invisible to the person who wrote it. The API route runs on the
  // service-role key and is admin-guarded, so it returns drafts too — which
  // is the whole point of this screen. Delete already went through it.
  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/pages');
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Could not load pages (HTTP ${res.status})`);
      }
      const data = await res.json();
      setPages(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(`Failed to load pages: ${error.message}`);
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
      const res = await fetch('/api/admin/pages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Delete failed');
      }
      toast.success('Page deleted');
      setDeleteTarget(null);
      load();
    } catch (error: any) {
      toast.error(`Delete failed: ${error.message}`);
      setDeleteTarget(null);
    }
  };

  if (creating || editing) {
    return (
      <PageEditor
        page={editing}
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
          <h2 className="text-3xl font-bold text-white font-sora">Pages Manager</h2>
          <p className="text-[#7A8BA8]">Create and manage custom website pages</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="bg-[#7FB3FF] hover:bg-[#7FB3FF] text-black font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition transform hover:scale-105"
        >
          <Plus size={20} /> New Page
        </button>
      </div>

      <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1A2332]">
              <tr>
                <th className="text-left px-6 py-4 text-[#7A8BA8] font-semibold">Page Title</th>
                <th className="text-left px-6 py-4 text-[#7A8BA8] font-semibold">URL Slug</th>
                <th className="text-left px-6 py-4 text-[#7A8BA8] font-semibold">Status</th>
                <th className="text-center px-6 py-4 text-[#7A8BA8] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center px-6 py-8 text-[#7A8BA8]">Loading…</td></tr>
              ) : pages.length === 0 ? (
                <tr><td colSpan={4} className="text-center px-6 py-8 text-[#7A8BA8]">No custom pages yet. Click &quot;New Page&quot; to create one.</td></tr>
              ) : (
                pages.map((page) => (
                  <tr key={page.id} className="border-t border-[#1E3A5F] hover:bg-[#1A2332] transition">
                    <td className="px-6 py-4 text-white font-semibold">{page.title}</td>
                    <td className="px-6 py-4 text-[#7A8BA8]">/{page.slug}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${page.published ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'}`}>
                        {page.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => setEditing(page)}
                          className="bg-[#7B2FFF] hover:bg-[#6B1FEF] text-white px-3 py-1 rounded-lg flex items-center gap-1 transition"
                        >
                          <Edit2 size={16} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(page)}
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

      <ConfirmationDialog
        isOpen={!!deleteTarget}
        isDangerous
        title="Delete page?"
        message={`This will permanently delete "${deleteTarget?.title ?? ''}". This cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
