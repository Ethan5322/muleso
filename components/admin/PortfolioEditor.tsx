'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, PortfolioItem } from '@/lib/supabase';
import ConfirmationDialog from './ConfirmationDialog';

interface PortfolioEditorProps {
  item: PortfolioItem | null;
  onSave: () => void;
  onCancel: () => void;
}

const categories = ['Website', 'Chatbot', 'Logo', 'QR Code', 'PDF', 'Email', 'Video', 'Other'];

export default function PortfolioEditor({ item, onSave, onCancel }: PortfolioEditorProps) {
  const [formData, setFormData] = useState<Partial<PortfolioItem>>(
    item || {
      title: '',
      description: '',
      category: 'Website',
      client_name: '',
      client_type: '',
      image_url: '',
      video_url: '',
      tech_stack: [],
      challenge: '',
      solution: '',
      result: '',
      link: '',
      featured: false,
      order: 0,
    }
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileName = `portfolio/${Date.now()}_${file.name}`;
      const { error, data } = await supabase.storage.from('portfolio').upload(fileName, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from('portfolio').getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(`Upload error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileName = `portfolio-videos/${Date.now()}_${file.name}`;
      const { error, data } = await supabase.storage.from('videos').upload(fileName, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from('videos').getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, video_url: publicUrl }));
      toast.success('Video uploaded successfully');
    } catch (error: any) {
      toast.error(`Upload error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAddTech = () => {
    if (techInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tech_stack: [...(prev.tech_stack || []), techInput.trim()],
      }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tech_stack: (prev.tech_stack || []).filter((_, i) => i !== index),
    }));
  };

  const handleSaveClick = () => {
    if (!formData.title || !formData.description || !formData.client_name) {
      toast.error('Please fill in all required fields');
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    try {
      setSaving(true);

      const res = await fetch('/api/admin/portfolio', {
        method: item?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item?.id ? { id: item.id, ...formData } : { ...formData, order: 0 }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Save failed');
      }

      toast.success(item?.id ? '✅ Portfolio item updated!' : '✅ Portfolio item created!');
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
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">
          {item ? 'Edit Project' : 'New Project'}
        </h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={onCancel}
          className="p-2 hover:bg-[#00C8FF]/20 rounded-lg text-[#00C8FF] transition-all"
        >
          <X size={24} />
        </motion.button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-[#0A0F1E] border border-[#00C8FF]/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#00C8FF] mb-4">📋 Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[#00C8FF] font-semibold mb-2">Project Title *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-[#1a1a2e] border border-[#00C8FF]/30 rounded-lg px-4 py-2 text-white"
                placeholder="e.g., E-commerce Website"
              />
            </div>

            <div>
              <label className="block text-[#00C8FF] font-semibold mb-2">Description *</label>
              <textarea
                value={formData.description || ''}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-[#1a1a2e] border border-[#00C8FF]/30 rounded-lg px-4 py-2 text-white h-24"
                placeholder="Brief project description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#00C8FF] font-semibold mb-2">Category *</label>
                <select
                  value={formData.category || 'Website'}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full bg-[#1a1a2e] border border-[#00C8FF]/30 rounded-lg px-4 py-2 text-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#00C8FF] font-semibold mb-2">Client Name *</label>
                <input
                  type="text"
                  value={formData.client_name || ''}
                  onChange={e => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                  className="w-full bg-[#1a1a2e] border border-[#00C8FF]/30 rounded-lg px-4 py-2 text-white"
                  placeholder="Client name..."
                />
              </div>
            </div>

            <div>
              <label className="block text-[#00C8FF] font-semibold mb-2">Client Type</label>
              <input
                type="text"
                value={formData.client_type || ''}
                onChange={e => setFormData(prev => ({ ...prev, client_type: e.target.value }))}
                className="w-full bg-[#1a1a2e] border border-[#00C8FF]/30 rounded-lg px-4 py-2 text-white"
                placeholder="e.g., E-commerce Business, Restaurant"
              />
            </div>

            <div>
              <label className="block text-[#00C8FF] font-semibold mb-2">Project Link</label>
              <input
                type="url"
                value={formData.link || ''}
                onChange={e => setFormData(prev => ({ ...prev, link: e.target.value }))}
                className="w-full bg-[#1a1a2e] border border-[#00C8FF]/30 rounded-lg px-4 py-2 text-white"
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-[#0A0F1E] border border-[#00C8FF]/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#00C8FF] mb-4">🖼️ Media</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[#00C8FF] font-semibold mb-2">Project Image</label>
              <div className="flex gap-4 items-center">
                {formData.image_url ? (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-[#1a1a2e] rounded-lg flex items-center justify-center text-[#00C8FF]/40">
                    <ImageIcon size={32} />
                  </div>
                )}
                <button
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 bg-[#7B2FFF]/20 hover:bg-[#7B2FFF]/40 text-[#a78bfa] px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                >
                  <Upload size={18} />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#00C8FF] font-semibold mb-2">Video URL (Optional)</label>
              <div className="flex gap-4 items-center">
                <input
                  type="url"
                  value={formData.video_url || ''}
                  onChange={e => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  className="flex-1 bg-[#1a1a2e] border border-[#00C8FF]/30 rounded-lg px-4 py-2 text-white"
                  placeholder="YouTube or video URL..."
                />
                <button
                  onClick={() => videoInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 bg-[#00C8FF]/20 hover:bg-[#00C8FF]/40 text-[#00C8FF] px-4 py-2 rounded-lg transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  <Upload size={18} />
                  {uploading ? 'Uploading...' : 'Upload Video'}
                </button>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-[#0A0F1E] border border-[#00C8FF]/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#00C8FF] mb-4">📝 Project Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[#00C8FF] font-semibold mb-2">Challenge</label>
              <textarea
                value={formData.challenge || ''}
                onChange={e => setFormData(prev => ({ ...prev, challenge: e.target.value }))}
                className="w-full bg-[#1a1a2e] border border-[#00C8FF]/30 rounded-lg px-4 py-2 text-white h-20"
                placeholder="What was the main challenge?"
              />
            </div>

            <div>
              <label className="block text-[#00C8FF] font-semibold mb-2">Solution</label>
              <textarea
                value={formData.solution || ''}
                onChange={e => setFormData(prev => ({ ...prev, solution: e.target.value }))}
                className="w-full bg-[#1a1a2e] border border-[#00C8FF]/30 rounded-lg px-4 py-2 text-white h-20"
                placeholder="How did you solve it?"
              />
            </div>

            <div>
              <label className="block text-[#00C8FF] font-semibold mb-2">Result</label>
              <textarea
                value={formData.result || ''}
                onChange={e => setFormData(prev => ({ ...prev, result: e.target.value }))}
                className="w-full bg-[#1a1a2e] border border-[#00C8FF]/30 rounded-lg px-4 py-2 text-white h-20"
                placeholder="What was the outcome? e.g., +300% bookings"
              />
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-[#0A0F1E] border border-[#00C8FF]/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#00C8FF] mb-4">⚙️ Tech Stack</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  handleAddTech();
                }
              }}
              className="flex-1 bg-[#1a1a2e] border border-[#00C8FF]/30 rounded-lg px-4 py-2 text-white"
              placeholder="e.g., React, Next.js, Tailwind CSS..."
            />
            <button
              onClick={handleAddTech}
              className="bg-[#00C8FF]/20 hover:bg-[#00C8FF]/40 text-[#00C8FF] px-6 py-2 rounded-lg transition-all font-semibold"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.tech_stack || []).map((tech, index) => (
              <div
                key={index}
                className="bg-[#7B2FFF]/20 text-[#a78bfa] px-3 py-1 rounded-full flex items-center gap-2 text-sm"
              >
                {tech}
                <button
                  onClick={() => handleRemoveTech(index)}
                  className="text-xs hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Featured */}
        <div className="bg-[#0A0F1E] border border-[#00C8FF]/30 rounded-xl p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured || false}
              onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="w-4 h-4"
            />
            <span className="text-[#00C8FF] font-semibold">⭐ Featured Project (Show in portfolio highlights)</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveClick}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white px-6 py-3 rounded-lg font-bold disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Project'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-[#00C8FF]/10 hover:bg-[#00C8FF]/20 text-[#00C8FF] px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50"
          >
            <X size={20} />
            Cancel
          </motion.button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirm}
        title={item ? 'Update Portfolio Project?' : 'Create New Project?'}
        message={`Are you sure you want to ${item ? 'update' : 'create'} this portfolio project? All information will be saved and visible on your website.`}
        confirmText={item ? 'Update Project' : 'Create Project'}
        cancelText="Review Again"
        isLoading={saving}
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
