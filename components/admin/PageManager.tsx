'use client';

import { Trash2, Edit2, Plus, Eye } from 'lucide-react';

const pages = [
  { id: 1, title: 'Home Page', slug: '/', status: 'Published', updated: '2026-06-01' },
  { id: 2, title: 'Services', slug: '/services', status: 'Published', updated: '2026-05-28' },
  { id: 3, title: 'Portfolio', slug: '/portfolio', status: 'Published', updated: '2026-05-25' },
  { id: 4, title: 'About Us', slug: '/about', status: 'Published', updated: '2026-05-20' },
];

export default function PageManager() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Pages Manager</h2>
          <p className="text-gray-400">Edit your website pages</p>
        </div>
        <button className="bg-[#00C8FF] hover:bg-[#00B3E6] text-black font-bold py-2 px-6 rounded-lg flex items-center gap-2">
          <Plus size={20} /> New Page
        </button>
      </div>

      <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1A2332]">
            <tr>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold">Page Title</th>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold">URL Slug</th>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold">Status</th>
              <th className="text-left px-6 py-4 text-gray-400 font-semibold">Updated</th>
              <th className="text-center px-6 py-4 text-gray-400 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="border-t border-[#1E3A5F] hover:bg-[#1A2332] transition">
                <td className="px-6 py-4 text-white font-semibold">{page.title}</td>
                <td className="px-6 py-4 text-gray-400">{page.slug}</td>
                <td className="px-6 py-4">
                  <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm">{page.status}</span>
                </td>
                <td className="px-6 py-4 text-gray-400">{page.updated}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <button className="bg-[#00C8FF] hover:bg-[#00B3E6] text-black px-3 py-1 rounded-lg flex items-center gap-1">
                      <Eye size={16} /> View
                    </button>
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
        <h3 className="text-xl font-bold text-white mb-4">Edit Page Content</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Page Title</label>
            <input type="text" placeholder="Page title" className="w-full bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2 rounded-lg focus:border-[#00C8FF]" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">URL Slug</label>
            <input type="text" placeholder="/page-name" className="w-full bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2 rounded-lg focus:border-[#00C8FF]" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Page Content</label>
            <textarea rows={6} placeholder="Write your page content here..." className="w-full bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2 rounded-lg focus:border-[#00C8FF]"></textarea>
          </div>
          <button type="submit" className="w-full bg-[#00C8FF] hover:bg-[#00B3E6] text-black font-bold py-2 px-4 rounded-lg">
            Save Page
          </button>
        </form>
      </div>
    </div>
  );
}
