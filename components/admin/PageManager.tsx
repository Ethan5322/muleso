'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, CustomPage } from '@/lib/supabase';
import PageEditor from './PageEditor';

export default function PageManager() {
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setPages(data || []);
    } catch (error: any) {
      toast.error(`Error loading pages: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const { error } = await supabase.from('pages').delete().eq('id', id);
      if (error) throw error;
      toast.success('Page deleted');
      loadPages();
    } catch (error: any) {
      toast.error(`Error deleting: ${error.message}`);
    }
  };

  const handleTogglePublished = async (id: string, currentPublished: boolean) => {
    try {
      const { error } = await supabase
        .from('pages')
        .update({ published: !currentPublished })
        .eq('id', id);

      if (error) throw error;
      toast.success('Page status updated');
      loadPages();
    } catch (error: any) {
      toast.error(`Error updating: ${error.message}`);
    }
  };

  if (showEditor) {
    return (
      <PageEditor
        page={editingPage}
        onSave={() => {
          setShowEditor(false);
          setEditingPage(null);
          loadPages();
        }}
        onCancel={() => {
          setShowEditor(false);
          setEditingPage(null);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Custom Pages</h2>
          <p className="text-[#00C8FF]/60">Create and manage custom website pages</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingPage(null);
            setShowEditor(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white px-6 py-3 rounded-lg font-semibold"
        >
          <Plus size={20} />
          New Page
        </motion.button>
      </div>

      {loading ? (
        <div className="text-[#00C8FF]">Loading pages...</div>
      ) : pages.length === 0 ? (
        <div className="bg-[#0A0F1E] border-2 border-dashed border-[#00C8FF]/30 rounded-xl p-12 text-center">
          <p className="text-[#00C8FF]/60 mb-4">No custom pages yet</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setEditingPage(null);
              setShowEditor(true);
            }}
            className="inline-flex items-center gap-2 bg-[#00C8FF]/20 hover:bg-[#00C8FF]/30 text-[#00C8FF] px-6 py-2 rounded-lg"
          >
            <Plus size={18} />
            Create Your First Page
          </motion.button>
        </div>
      ) : (
        <div className="grid gap-4">
          {pages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0A0F1E] border border-[#00C8FF]/30 rounded-xl p-6 flex items-center justify-between hover:border-[#00C8FF]/60 transition-all"
            >
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">{page.title}</h3>
                <p className="text-[#00C8FF] text-sm">/{page.slug}</p>
                <p className="text-[#00C8FF]/60 text-sm mt-2 line-clamp-2">{page.meta_description}</p>
              </div>

              <div className="flex gap-2 ml-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setEditingPage(page);
                    setShowEditor(true);
                  }}
                  className="flex items-center justify-center gap-2 bg-[#7B2FFF]/20 hover:bg-[#7B2FFF]/40 text-[#7B2FFF] px-4 py-2 rounded-lg transition-all"
                >
                  <Edit2 size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleTogglePublished(page.id, page.published)}
                  className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all ${
                    page.published
                      ? 'bg-[#00FF88]/20 text-[#00FF88]'
                      : 'bg-[#00C8FF]/20 text-[#00C8FF]/60 hover:text-[#00C8FF]'
                  }`}
                >
                  {page.published ? <Eye size={18} /> : <EyeOff size={18} />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleDeletePage(page.id)}
                  className="flex items-center justify-center px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
