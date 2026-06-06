'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, LayoutDashboard, ImageIcon, FileText, BookOpen, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import PortfolioManager from '@/components/admin/PortfolioManager';
import PageManager from '@/components/admin/PageManager';
import BookingsDashboard from '@/components/admin/BookingsDashboard';
import AdminOverview from '@/components/admin/AdminOverview';

type TabType = 'overview' | 'portfolio' | 'pages' | 'bookings' | 'settings';

export default function AdminDashboard() {
  const [authState, setAuthState] = useState<'checking' | 'authenticated'>('checking');
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    // Middleware handles authentication, so if we're here, user is authenticated
    setAuthState('authenticated');
  }, []);

  if (authState !== 'authenticated') {
    return (
      <div className="min-h-screen bg-[#0F1624] flex items-center justify-center">
        <div className="text-[#00C8FF] text-lg">Loading admin panel...</div>
      </div>
    );
  }

  return <AdminDashboardContent activeTab={activeTab} setActiveTab={setActiveTab} />;
}

function AdminDashboardContent({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}) {
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      toast.success('Signed out successfully');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'portfolio' as TabType, label: 'Portfolio', icon: ImageIcon },
    { id: 'pages' as TabType, label: 'Pages', icon: FileText },
    { id: 'bookings' as TabType, label: 'Bookings', icon: BookOpen },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0F1624]">
      {/* Header - Professional Admin Style */}
      <div className="bg-[#0A0E17] border-b border-[#1E3A5F] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00C8FF] to-[#7B2FFF] flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white font-sora">MuleSoo Admin</h1>
              <p className="text-[#7A8BA8] text-xs">Control Center</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 px-5 py-2 rounded-lg font-semibold text-sm transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </motion.button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex min-h-[calc(100vh-70px)]">
        {/* Left Sidebar */}
        <div className="w-64 bg-[#0A0E17] border-r border-[#1E3A5F] overflow-y-auto">
          <nav className="p-6 space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white shadow-lg'
                      : 'text-[#7A8BA8] hover:text-[#00C8FF] hover:bg-[#1A2332]'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 w-64 border-t border-[#1E3A5F] p-4 bg-[#0A0E17]">
            <div className="text-xs text-[#7A8BA8] space-y-1">
              <p>🔐 Secured Session</p>
              <p>Last login: Now</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && <AdminOverview />}
              {activeTab === 'portfolio' && <PortfolioManager />}
              {activeTab === 'pages' && <PageManager />}
              {activeTab === 'bookings' && <BookingsDashboard />}
              {activeTab === 'settings' && (
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold text-white mb-6 font-sora">Settings</h2>

                  <div className="space-y-4">
                    {/* Security Section */}
                    <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-lg p-6">
                      <h3 className="text-lg font-bold text-white mb-4">🔐 Security</h3>
                      <div className="space-y-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="w-full bg-[#1A2332] hover:bg-[#253345] border border-[#1E3A5F] text-[#00C8FF] py-2 px-4 rounded-lg font-semibold transition-all"
                        >
                          Change Password
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="w-full bg-[#1A2332] hover:bg-[#253345] border border-[#1E3A5F] text-[#00C8FF] py-2 px-4 rounded-lg font-semibold transition-all"
                        >
                          Manage 2FA
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="w-full bg-[#1A2332] hover:bg-[#253345] border border-[#1E3A5F] text-[#00C8FF] py-2 px-4 rounded-lg font-semibold transition-all"
                        >
                          View Login History
                        </motion.button>
                      </div>
                    </div>

                    {/* Website Settings Section */}
                    <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-lg p-6">
                      <h3 className="text-lg font-bold text-white mb-4">⚙️ Website Settings</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[#7A8BA8] text-sm mb-2">Admin Email</label>
                          <input
                            type="email"
                            disabled
                            value="mulukenendashaw68@gmail.com"
                            className="w-full bg-[#1A2332] border border-[#1E3A5F] text-[#00C8FF] py-2 px-4 rounded-lg text-sm"
                          />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="w-full bg-[#1A2332] hover:bg-[#253345] border border-[#1E3A5F] text-[#00C8FF] py-2 px-4 rounded-lg font-semibold transition-all"
                        >
                          Export Data
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="w-full bg-[#1A2332] hover:bg-[#253345] border border-[#1E3A5F] text-[#00C8FF] py-2 px-4 rounded-lg font-semibold transition-all"
                        >
                          View Audit Log
                        </motion.button>
                      </div>
                    </div>

                    {/* System Info */}
                    <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-lg p-6">
                      <h3 className="text-lg font-bold text-white mb-4">ℹ️ System Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-[#7A8BA8]">
                          <span>Version</span>
                          <span className="text-[#00C8FF]">1.0.0</span>
                        </div>
                        <div className="flex justify-between text-[#7A8BA8]">
                          <span>Security Status</span>
                          <span className="text-green-400">✓ Secure</span>
                        </div>
                        <div className="flex justify-between text-[#7A8BA8]">
                          <span>2FA Status</span>
                          <span className="text-green-400">✓ Enabled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
