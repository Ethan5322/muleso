'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, PortfolioItem } from '@/lib/supabase';
import PortfolioEditor from './PortfolioEditor';

export default function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast.error(`Error loading portfolio: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;

    try {
      const { error } = await supabase.from('portfolio').delete().eq('id', id);
      if (error) throw error;
      toast.success('Portfolio item deleted');
      loadPortfolio();
    } catch (error: any) {
      toast.error(`Error deleting: ${error.message}`);
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('portfolio')
        .update({ featured: !currentFeatured })
        .eq('id', id);

      if (error) throw error;
      toast.success('Portfolio item updated');
      loadPortfolio();
    } catch (error: any) {
      toast.error(`Error updating: ${error.message}`);
    }
  };

  if (showEditor) {
    return (
      <PortfolioEditor
        item={editingItem}
        onSave={() => {
          setShowEditor(false);
          setEditingItem(null);
          loadPortfolio();
        }}
        onCancel={() => {
          setShowEditor(false);
          setEditingItem(null);
        }}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Portfolio Projects</h2>
          <p className="text-[#00C8FF]/60">Manage your project showcase</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingItem(null);
            setShowEditor(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white px-6 py-3 rounded-lg font-semibold"
        >
          <Plus size={20} />
          New Project
        </motion.button>
      </div>

      {loading ? (
        <div className="text-[#00C8FF]">Loading portfolio...</div>
      ) : items.length === 0 ? (
        <div className="bg-[#0A0F1E] border-2 border-dashed border-[#00C8FF]/30 rounded-xl p-12 text-center">
          <p className="text-[#00C8FF]/60 mb-4">No portfolio items yet</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setEditingItem(null);
              setShowEditor(true);
            }}
            className="inline-flex items-center gap-2 bg-[#00C8FF]/20 hover:bg-[#00C8FF]/30 text-[#00C8FF] px-6 py-2 rounded-lg"
          >
            <Plus size={18} />
            Create Your First Project
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0A0F1E] border border-[#00C8FF]/30 rounded-xl overflow-hidden hover:border-[#00C8FF]/60 transition-all"
            >
              {/* Image */}
              <div className="relative h-40 bg-[#1a1a2e] overflow-hidden">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#00C8FF]/40">
                    <Upload size={32} />
                  </div>
                )}
                {item.featured && (
                  <div className="absolute top-2 right-2 bg-[#E8B84B] text-black px-3 py-1 rounded-full text-xs font-bold">
                    Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                <p className="text-[#00C8FF] text-xs mb-3">{item.category}</p>
                <p className="text-[#00C8FF]/60 text-sm line-clamp-2 mb-4">{item.description}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setEditingItem(item);
                      setShowEditor(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#7B2FFF]/20 hover:bg-[#7B2FFF]/40 text-[#7B2FFF] py-2 rounded-lg transition-all text-sm font-semibold"
                  >
                    <Edit2 size={16} />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleToggleFeatured(item.id, item.featured)}
                    className={`flex items-center justify-center px-3 py-2 rounded-lg transition-all ${
                      item.featured
                        ? 'bg-[#E8B84B]/20 text-[#E8B84B]'
                        : 'bg-[#00C8FF]/20 text-[#00C8FF]/60 hover:text-[#00C8FF]'
                    }`}
                  >
                    {item.featured ? <Eye size={16} /> : <EyeOff size={16} />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleDeleteItem(item.id)}
                    className="flex items-center justify-center px-3 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
