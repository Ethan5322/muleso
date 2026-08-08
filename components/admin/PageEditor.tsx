'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { CustomPage } from '@/lib/supabase';
import ConfirmationDialog from './ConfirmationDialog';

interface PageEditorProps {
  page: CustomPage | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function PageEditor({ page, onSave, onCancel }: PageEditorProps) {
  const [formData, setFormData] = useState<Partial<CustomPage>>(
    page || {
      title: '',
      slug: '',
      content: '',
      meta_description: '',
      published: false,
      order: 0,
    }
  );
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSaveClick = () => {
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    try {
      setSaving(true);

      const res = await fetch('/api/admin/pages', {
        method: page?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page?.id ? { id: page.id, ...formData } : { ...formData, order: 0 }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Save failed');
      }

      toast.success(page?.id ? '✅ Page updated!' : '✅ Page created!');
      setShowConfirm(false);
      onSave();
    } catch (error: any) {
      toast.error(`Error saving: ${error.message}`);
      setShowConfirm(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">{page ? 'Edit Page' : 'New Page'}</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={onCancel}
          className="p-2 hover:bg-[#7FB3FF]/20 rounded-lg text-[#7FB3FF] transition-all"
        >
          <X size={24} />
        </motion.button>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div className="bg-[#0A0F1E] border border-[#7FB3FF]/30 rounded-xl p-6">
          <label className="block text-[#7FB3FF] font-semibold mb-2">Page Title *</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={e => handleTitleChange(e.target.value)}
            className="w-full bg-[#1a1a2e] border border-[#7FB3FF]/30 rounded-lg px-4 py-2 text-white"
            placeholder="e.g., Privacy Policy"
          />
        </div>

        {/* Slug */}
        <div className="bg-[#0A0F1E] border border-[#7FB3FF]/30 rounded-xl p-6">
          <label className="block text-[#7FB3FF] font-semibold mb-2">URL Slug *</label>
          <input
            type="text"
            value={formData.slug || ''}
            onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            className="w-full bg-[#1a1a2e] border border-[#7FB3FF]/30 rounded-lg px-4 py-2 text-white"
            placeholder="privacy-policy"
          />
          <p className="text-[#7FB3FF]/60 text-sm mt-2">
            Page will be accessible at: /custom/{formData.slug}
          </p>
        </div>

        {/* Meta Description */}
        <div className="bg-[#0A0F1E] border border-[#7FB3FF]/30 rounded-xl p-6">
          <label className="block text-[#7FB3FF] font-semibold mb-2">Meta Description (SEO)</label>
          <textarea
            value={formData.meta_description || ''}
            onChange={e => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
            maxLength={160}
            className="w-full bg-[#1a1a2e] border border-[#7FB3FF]/30 rounded-lg px-4 py-2 text-white h-20 resize-none"
            placeholder="Brief page description for search engines..."
          />
          <p className="text-[#7FB3FF]/60 text-sm mt-2">
            {(formData.meta_description || '').length}/160 characters
          </p>
        </div>

        {/* Content */}
        <div className="bg-[#0A0F1E] border border-[#7FB3FF]/30 rounded-xl p-6">
          <label className="block text-[#7FB3FF] font-semibold mb-2">Page Content * (Markdown supported)</label>
          <textarea
            value={formData.content || ''}
            onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
            className="w-full bg-[#1a1a2e] border border-[#7FB3FF]/30 rounded-lg px-4 py-2 text-white h-80 font-mono resize-none"
            placeholder="# Heading&#10;&#10;Your content here...&#10;&#10;Use markdown for formatting."
          />
        </div>

        {/* Published */}
        <div className="bg-[#0A0F1E] border border-[#7FB3FF]/30 rounded-xl p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published || false}
              onChange={e => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="w-4 h-4"
            />
            <span className="text-[#7FB3FF] font-semibold">📢 Publish this page (Make it visible)</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveClick}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#7FB3FF] to-[#7B2FFF] text-white px-6 py-3 rounded-lg font-bold disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Page'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-[#7FB3FF]/10 hover:bg-[#7FB3FF]/20 text-[#7FB3FF] px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50"
          >
            <X size={20} />
            Cancel
          </motion.button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirm}
        title={page ? 'Update Page?' : 'Create New Page?'}
        message={`Are you sure you want to ${page ? 'update' : 'create'} this page? It will ${formData.published ? 'be published' : 'remain unpublished'} on your website.`}
        confirmText={page ? 'Update Page' : 'Create Page'}
        cancelText="Review Again"
        isLoading={saving}
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
