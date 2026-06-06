'use client';

import { Trash2, Edit2, Plus, Image as ImageIcon, X } from 'lucide-react';
import { useState } from 'react';

export default function PortfolioManager() {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Habesha Events Website', client: 'Events Business', description: 'Professional event planning platform', price: 'R7,500', image: '🖼️', date: '2026-05-15' },
    { id: 2, name: 'Restaurant Chatbot', client: 'Restaurant', description: 'AI-powered booking chatbot', price: 'R4,500', image: '🤖', date: '2026-05-10' },
    { id: 3, name: 'Law Firm Website', client: 'Legal Services', description: 'Professional legal services portal', price: 'R8,000', image: '⚖️', date: '2026-05-05' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    description: '',
    price: '',
    image: '🖼️',
  });

  // Add New Project
  const handleAdd = () => {
    setEditingId(null);
    setFormData({ name: '', client: '', description: '', price: '', image: '🖼️' });
    setShowForm(true);
  };

  // Edit Project
  const handleEdit = (project) => {
    setEditingId(project.id);
    setFormData({
      name: project.name,
      client: project.client,
      description: project.description,
      price: project.price,
      image: project.image,
    });
    setShowForm(true);
  };

  // Delete Project
  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
      setProjects(projects.filter(p => p.id !== id));
      alert('✓ Portfolio item deleted successfully!');
    }
  };

  // Save (Add or Update)
  const handleSave = () => {
    if (!formData.name || !formData.client || !formData.description || !formData.price) {
      alert('❌ Please fill in all fields!');
      return;
    }

    if (editingId) {
      // Update existing
      setProjects(projects.map(p =>
        p.id === editingId
          ? { ...p, ...formData, date: new Date().toISOString().split('T')[0] }
          : p
      ));
      alert('✓ Portfolio item updated successfully!');
    } else {
      // Add new
      const newProject = {
        id: Date.now(),
        ...formData,
        date: new Date().toISOString().split('T')[0],
      };
      setProjects([newProject, ...projects]);
      alert('✓ Portfolio item added successfully!');
    }

    setShowForm(false);
    setFormData({ name: '', client: '', description: '', price: '', image: '🖼️' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Portfolio Projects</h2>
          <p className="text-gray-400">Manage your project portfolio - Add, Edit, or Delete</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-[#00C8FF] hover:bg-[#00B3E6] text-black font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition transform hover:scale-105"
        >
          <Plus size={20} /> Add New Project
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">{editingId ? '✏️ Edit Portfolio Item' : '➕ Add New Portfolio Item'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-2xl">
                <X size={24} />
              </button>
            </div>

            {/* Image/Video Upload */}
            <div className="mb-6 p-6 border-2 border-dashed border-[#1E3A5F] rounded-lg hover:border-[#00C8FF] transition cursor-pointer">
              <div className="text-center">
                <div className="text-5xl mb-2">{formData.image}</div>
                <p className="text-white font-semibold">Click to change picture/video icon</p>
                <p className="text-gray-400 text-sm">Select emoji or upload image</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-white font-bold mb-2">Project Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter project name"
                  className="w-full bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-3 rounded-lg focus:border-[#00C8FF] outline-none transition"
                />
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Client Name *</label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                  placeholder="Enter client name"
                  className="w-full bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-3 rounded-lg focus:border-[#00C8FF] outline-none transition"
                />
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Project Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your project in detail..."
                  rows={4}
                  className="w-full bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-3 rounded-lg focus:border-[#00C8FF] outline-none transition resize-none"
                />
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Project Price *</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="e.g., R7,500"
                  className="w-full bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-3 rounded-lg focus:border-[#00C8FF] outline-none transition"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSave}
                className="flex-1 bg-[#00C8FF] hover:bg-[#00B3E6] text-black font-bold py-3 rounded-lg transition transform hover:scale-105"
              >
                {editingId ? '💾 Update Project' : '➕ Add Project'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-[#1A2332] hover:bg-[#253345] text-gray-400 font-bold py-3 rounded-lg border border-[#1E3A5F] transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1A2332]">
            <tr>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold">Image</th>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold">Project Name</th>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold">Client</th>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold">Price</th>
              <th className="text-center px-6 py-4 text-gray-400 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr><td colSpan="5" className="text-center px-6 py-8 text-gray-400">No portfolio items yet. Click "Add New Project" to get started!</td></tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="border-t border-[#1E3A5F] hover:bg-[#1A2332] transition">
                  <td className="px-6 py-4 text-2xl">{project.image}</td>
                  <td className="px-6 py-4 text-white font-semibold">{project.name}</td>
                  <td className="px-6 py-4 text-gray-400">{project.client}</td>
                  <td className="px-6 py-4 text-[#00C8FF] font-bold">{project.price}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(project)}
                        className="bg-[#7B2FFF] hover:bg-[#6B1FEF] text-white px-3 py-1 rounded-lg flex items-center gap-1 transition"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
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

      {/* Stats */}
      <div className="bg-gradient-to-br from-[#0A0E17] to-[#0F1624] border border-[#1E3A5F] rounded-lg p-6">
        <p className="text-gray-400 text-sm">Total Portfolio Items: <span className="text-white font-bold text-lg">{projects.length}</span></p>
      </div>
    </div>
  );
}
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Add New Project</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Project Name</label>
            <input type="text" placeholder="Enter project name" className="w-full bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2 rounded-lg focus:border-[#00C8FF]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Client Name</label>
              <input type="text" placeholder="Client name" className="w-full bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2 rounded-lg focus:border-[#00C8FF]" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Date</label>
              <input type="date" className="w-full bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2 rounded-lg focus:border-[#00C8FF]" />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#00C8FF] hover:bg-[#00B3E6] text-black font-bold py-2 px-4 rounded-lg">
            Save Project
          </button>
        </form>
      </div>
    </div>
  );
}
