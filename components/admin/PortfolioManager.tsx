'use client';

import { Trash2, Edit2, Plus } from 'lucide-react';

const projects = [
  { id: 1, name: 'Habesha Events Website', client: 'Events Business', date: '2026-05-15' },
  { id: 2, name: 'Restaurant Booking Chatbot', client: 'Restaurant', date: '2026-05-10' },
  { id: 3, name: 'Law Firm Website', client: 'Legal Services', date: '2026-05-05' },
];

export default function PortfolioManager() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Portfolio Projects</h2>
          <p className="text-gray-400">Manage your project portfolio</p>
        </div>
        <button className="bg-[#00C8FF] hover:bg-[#00B3E6] text-black font-bold py-2 px-6 rounded-lg flex items-center gap-2">
          <Plus size={20} /> Add Project
        </button>
      </div>

      <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1A2332]">
            <tr>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold">Project Name</th>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold">Client</th>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold">Date</th>
              <th className="text-center px-6 py-4 text-gray-400 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-[#1E3A5F] hover:bg-[#1A2332] transition">
                <td className="px-6 py-4 text-white">{project.name}</td>
                <td className="px-6 py-4 text-gray-400">{project.client}</td>
                <td className="px-6 py-4 text-gray-400">{project.date}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <button className="bg-[#7B2FFF] hover:bg-[#6B1FEF] text-white px-3 py-1 rounded-lg flex items-center gap-1">
                      <Edit2 size={16} /> Edit
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg flex items-center gap-1">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
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
