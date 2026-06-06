'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, FileText, Image } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    portfolioItems: 0,
    pages: 0,
    todayBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);

      const [bookingsRes, portfolioRes, pagesRes] = await Promise.all([
        supabase.from('bookings').select('*'),
        supabase.from('portfolio').select('*'),
        supabase.from('pages').select('*'),
      ]);

      const bookings = bookingsRes.data || [];
      const today = new Date().toISOString().split('T')[0];
      const todayCount = bookings.filter(b => b.created_at.startsWith(today)).length;

      setStats({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'Pending').length,
        portfolioItems: (portfolioRes.data || []).length,
        pages: (pagesRes.data || []).length,
        todayBookings: todayCount,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Pending', value: stats.pendingBookings, icon: TrendingUp, color: 'from-yellow-500 to-orange-500' },
    { label: 'Portfolio Items', value: stats.portfolioItems, icon: Image, color: 'from-purple-500 to-pink-500' },
    { label: 'Custom Pages', value: stats.pages, icon: FileText, color: 'from-green-500 to-teal-500' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">Welcome Back, Admin! 👋</h2>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${card.color} rounded-xl p-6 text-white shadow-lg`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/80 text-sm font-semibold mb-2">{card.label}</p>
                  <p className="text-4xl font-bold">{loading ? '...' : card.value}</p>
                </div>
                <Icon size={32} className="opacity-60" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Access */}
      <div className="bg-[#0A0F1E] border border-[#00C8FF]/30 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">🚀 Quick Start</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '🖼️', title: 'Add Portfolio Project', desc: 'Showcase your latest work' },
            { icon: '📄', title: 'Create Custom Page', desc: 'Add new pages to your website' },
            { icon: '📊', title: 'View All Bookings', desc: 'Manage client inquiries' },
            { icon: '⚙️', title: 'Website Settings', desc: 'Configure your site' },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 bg-[#1a1a2e] border border-[#00C8FF]/20 rounded-lg hover:border-[#00C8FF]/60 transition-all cursor-pointer group"
            >
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="text-white font-bold group-hover:text-[#00C8FF] transition-colors">{item.title}</p>
                <p className="text-[#00C8FF]/60 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Overview */}
      <div className="mt-12 bg-[#0A0F1E] border border-[#7B2FFF]/30 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">✨ Your Admin Panel Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: '🎨 Portfolio Management', items: ['Upload images & videos', 'Add project details', 'Feature showcase projects', 'Track tech stack'] },
            { title: '📄 Page Creation', items: ['Create custom pages', 'Full markdown support', 'SEO meta descriptions', 'Publish/unpublish pages'] },
            { title: '📋 Booking Management', items: ['View all inquiries', 'Update booking status', 'Track client details', 'Manage bookings'] },
            { title: '🔐 Security', items: ['Password-protected admin', 'Persistent login sessions', 'No auto-logout', 'Secure data storage'] },
          ].map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-[#1a1a2e] border border-[#7B2FFF]/20 rounded-lg"
            >
              <h4 className="text-[#7B2FFF] font-bold mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.items.map(item => (
                  <li key={item} className="text-[#00C8FF]/60 text-sm flex items-center gap-2">
                    <span className="text-[#00FF88]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="mt-12 bg-gradient-to-r from-[#00C8FF]/20 to-[#7B2FFF]/20 border border-[#00C8FF]/30 rounded-xl p-6">
        <p className="text-[#00C8FF] font-semibold mb-2">💡 Pro Tip</p>
        <p className="text-[#00C8FF]/80">
          You're logged in securely. Your session will remain active until you click the "Exit Admin" button. You can safely work on your website without worrying about being logged out!
        </p>
      </div>
    </div>
  );
}
