'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Plus, Edit2, Trash2, Image, FileText, BarChart3, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, PortfolioItem, CustomPage, Booking } from '@/lib/supabase';
import PortfolioManager from '@/components/admin/PortfolioManager';
import PageManager from '@/components/admin/PageManager';
import BookingsDashboard from '@/components/admin/BookingsDashboard';
import AdminOverview from '@/components/admin/AdminOverview';

type TabType = 'overview' | 'portfolio' | 'pages' | 'bookings' | 'analytics';

export default function AdminDashboard() {
  const router = useRouter();
  const [authState, setAuthState] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  const [sessionValid, setSessionValid] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    const validateSession = async () => {
      try {
        const session = localStorage.getItem('admin_session');

        if (!session) {
          setAuthState('unauthenticated');
          await new Promise(resolve => setTimeout(resolve, 100));
          router.push('/admin/login');
          return;
        }

        let sessionData;
        try {
          sessionData = JSON.parse(session);
        } catch (e) {
          localStorage.removeItem('admin_session');
          setAuthState('unauthenticated');
          await new Promise(resolve => setTimeout(resolve, 100));
          router.push('/admin/login');
          return;
        }

        if (!sessionData || typeof sessionData.authenticated !== 'boolean') {
          localStorage.removeItem('admin_session');
          setAuthState('unauthenticated');
          await new Promise(resolve => setTimeout(resolve, 100));
          router.push('/admin/login');
          return;
        }

        if (!sessionData.timestamp || typeof sessionData.timestamp !== 'number') {
          localStorage.removeItem('admin_session');
          setAuthState('unauthenticated');
          await new Promise(resolve => setTimeout(resolve, 100));
          router.push('/admin/login');
          return;
        }

        if (sessionData.authenticated !== true) {
          localStorage.removeItem('admin_session');
          setAuthState('unauthenticated');
          await new Promise(resolve => setTimeout(resolve, 100));
          router.push('/admin/login');
          return;
        }

        const sessionAge = Date.now() - sessionData.timestamp;
        const MAX_SESSION_AGE = 24 * 60 * 60 * 1000;

        if (sessionAge > MAX_SESSION_AGE) {
          localStorage.removeItem('admin_session');
          setAuthState('unauthenticated');
          toast.error('🔒 Session expired. Please login again.');
          await new Promise(resolve => setTimeout(resolve, 100));
          router.push('/admin/login');
          return;
        }

        setSessionValid(true);
        setAuthState('authenticated');
      } catch (error) {
        console.error('Auth validation error:', error);
        localStorage.removeItem('admin_session');
        setAuthState('unauthenticated');
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push('/admin/login');
      }
    };

    validateSession();
  }, [router]);

  if (authState !== 'authenticated' || !sessionValid) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="text-[#00C8FF] text-lg">🔒 Verifying access...</div>
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
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    toast.success('Logged out');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#050810]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A0F1E] to-[#050810] border-b border-[#00C8FF]/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white font-sora">
              <span className="text-[#00C8FF]">MULE</span>
              <span className="text-white">SOO</span>
              <span className="text-[#E8B84B]"> Admin</span>
            </h1>
            <p className="text-[#00C8FF] text-sm mt-1">Control everything on your website</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500 text-red-400 px-6 py-3 rounded-lg font-semibold"
          >
            <LogOut size={20} />
            Sign Out
          </motion.button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#0A0F1E] border-b border-[#00C8FF]/20 sticky top-[88px] z-40">
        <div className="max-w-7xl mx-auto px-6 flex gap-2 py-4 overflow-x-auto">
          {[
            { id: 'overview' as TabType, label: '📊 Overview', icon: '📊' },
            { id: 'portfolio' as TabType, label: '🖼️ Portfolio', icon: '🖼️' },
            { id: 'pages' as TabType, label: '📄 Pages', icon: '📄' },
            { id: 'bookings' as TabType, label: '📋 Bookings', icon: '📋' },
            { id: 'analytics' as TabType, label: '📈 Analytics', icon: '📈' },
          ].map(tab => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white'
                  : 'text-[#00C8FF]/60 hover:text-[#00C8FF] border border-[#00C8FF]/30'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {activeTab === 'overview' && <AdminOverview />}
          {activeTab === 'portfolio' && <PortfolioManager />}
          {activeTab === 'pages' && <PageManager />}
          {activeTab === 'bookings' && <BookingsDashboard />}
          {activeTab === 'analytics' && (
            <div className="bg-[#0A0F1E] border border-[#00C8FF]/30 rounded-2xl p-8 text-center">
              <p className="text-[#00C8FF] text-lg">📈 Analytics coming soon...</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
