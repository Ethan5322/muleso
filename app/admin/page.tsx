'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Users, QrCode, CheckSquare, TrendingUp } from 'lucide-react';
import { supabase, Visitor, QRScan, Booking } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [totalScans, setTotalScans] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [todayVisitors, setTodayVisitors] = useState(0);
  const [todayScans, setTodayScans] = useState(0);
  const [todayBookings, setTodayBookings] = useState(0);
  const [visitorChartData, setVisitorChartData] = useState<any[]>([]);
  const [scansChartData, setScansChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (!session) {
      router.push('/admin/login');
      return;
    }

    const sessionData = JSON.parse(session);
    if (!sessionData.authenticated) {
      router.push('/admin/login');
      return;
    }

    setIsAuthenticated(true);
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get all visitors
      const { data: visitors, error: visitorsError } = await supabase
        .from('visitors')
        .select('*');

      if (visitorsError) throw visitorsError;

      setTotalVisitors(visitors?.length || 0);

      // Get today's visitors
      const today = new Date().toISOString().split('T')[0];
      const todayVisitorsCount = visitors?.filter((v: Visitor) =>
        v.created_at.startsWith(today)
      ).length || 0;
      setTodayVisitors(todayVisitorsCount);

      // Get 7-day visitor stats
      const visitorData = getLast7Days().map((date) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        visitors: visitors?.filter((v: Visitor) => v.created_at.startsWith(date)).length || 0,
      }));
      setVisitorChartData(visitorData);

      // Get all QR scans
      const { data: scans, error: scansError } = await supabase
        .from('qr_scans')
        .select('*');

      if (scansError) throw scansError;

      setTotalScans(scans?.length || 0);

      // Get today's scans
      const todayScansCount = scans?.filter((s: QRScan) =>
        s.created_at.startsWith(today)
      ).length || 0;
      setTodayScans(todayScansCount);

      // Get 7-day scan stats
      const scanData = getLast7Days().map((date) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        scans: scans?.filter((s: QRScan) => s.created_at.startsWith(date)).length || 0,
      }));
      setScansChartData(scanData);

      // Get all bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*');

      if (bookingsError) throw bookingsError;

      setTotalBookings(bookings?.length || 0);

      // Get pending bookings
      const pending = bookings?.filter((b: Booking) => b.status === 'Pending').length || 0;
      setPendingBookings(pending);

      // Get today's bookings
      const todayBookingsCount = bookings?.filter((b: Booking) =>
        b.created_at.startsWith(today)
      ).length || 0;
      setTodayBookings(todayBookingsCount);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#00BFFF] text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="bg-[#0a0a0a] border-b border-[#00BFFF]/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sora">Admin Dashboard</h1>
            <p className="text-[#00BFFF] text-sm">MuleSoo Digital Services</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500 text-red-400 px-4 py-2 rounded-lg transition-all"
          >
            <LogOut size={18} />
            Logout
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {/* Total Visitors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-6 shadow-[0_0_20px_rgba(0,191,255,0.2)]"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#00BFFF]/60 text-sm font-semibold">TOTAL VISITORS</p>
              <Users className="text-[#00BFFF]" size={24} />
            </div>
            <p className="text-4xl font-bold text-white">{totalVisitors}</p>
            <p className="text-[#00BFFF]/60 text-sm mt-2">Today: {todayVisitors}</p>
          </motion.div>

          {/* QR Scans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1a1a1a] border border-[#7B2FBE]/30 rounded-xl p-6 shadow-[0_0_20px_rgba(123,47,190,0.2)]"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#7B2FBE]/60 text-sm font-semibold">QR SCANS</p>
              <QrCode className="text-[#7B2FBE]" size={24} />
            </div>
            <p className="text-4xl font-bold text-white">{totalScans}</p>
            <p className="text-[#7B2FBE]/60 text-sm mt-2">Today: {todayScans}</p>
          </motion.div>

          {/* Total Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1a1a1a] border border-[#00FF88]/30 rounded-xl p-6 shadow-[0_0_20px_rgba(0,255,136,0.2)]"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#00FF88]/60 text-sm font-semibold">BOOKINGS</p>
              <CheckSquare className="text-[#00FF88]" size={24} />
            </div>
            <p className="text-4xl font-bold text-white">{totalBookings}</p>
            <p className="text-[#00FF88]/60 text-sm mt-2">Today: {todayBookings}</p>
          </motion.div>

          {/* Pending Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1a1a1a] border border-[#FFA500]/30 rounded-xl p-6 shadow-[0_0_20px_rgba(255,165,0,0.2)]"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#FFA500]/60 text-sm font-semibold">PENDING</p>
              <TrendingUp className="text-[#FFA500]" size={24} />
            </div>
            <p className="text-4xl font-bold text-white">{pendingBookings}</p>
            <p className="text-[#FFA500]/60 text-sm mt-2">Action needed</p>
          </motion.div>

          {/* Conversion Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-6 shadow-[0_0_20px_rgba(0,191,255,0.2)]"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#00BFFF]/60 text-sm font-semibold">CONVERSION</p>
              <TrendingUp className="text-[#00BFFF]" size={24} />
            </div>
            <p className="text-4xl font-bold text-white">
              {totalVisitors > 0 ? ((totalBookings / totalVisitors) * 100).toFixed(1) : 0}%
            </p>
            <p className="text-[#00BFFF]/60 text-sm mt-2">Visitors → Bookings</p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Visitors Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-6 shadow-[0_0_20px_rgba(0,191,255,0.2)]"
          >
            <h3 className="text-lg font-semibold mb-6 text-white">Visitors (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitorChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00BFFF20" />
                <XAxis dataKey="date" stroke="#00BFFF" />
                <YAxis stroke="#00BFFF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #00BFFF',
                    borderRadius: '8px',
                  }}
                  cursor={{ fill: 'rgba(0,191,255,0.1)' }}
                />
                <Bar dataKey="visitors" fill="#00BFFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* QR Scans Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[#1a1a1a] border border-[#7B2FBE]/30 rounded-xl p-6 shadow-[0_0_20px_rgba(123,47,190,0.2)]"
          >
            <h3 className="text-lg font-semibold mb-6 text-white">QR Scans (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scansChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#7B2FBE20" />
                <XAxis dataKey="date" stroke="#7B2FBE" />
                <YAxis stroke="#7B2FBE" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #7B2FBE',
                    borderRadius: '8px',
                  }}
                  cursor={{ fill: 'rgba(123,47,190,0.1)' }}
                />
                <Bar dataKey="scans" fill="#7B2FBE" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.a
            href="/admin/bookings"
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-[#00BFFF]/20 to-[#7B2FBE]/20 border border-[#00BFFF]/30 rounded-xl p-6 hover:border-[#00BFFF] transition-all cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-white mb-2">📋 Manage Bookings</h3>
            <p className="text-[#00BFFF]/60 text-sm">View, edit, and manage all booking submissions</p>
          </motion.a>

          <motion.a
            href="/admin/visitors"
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-[#00BFFF]/20 to-[#7B2FBE]/20 border border-[#00BFFF]/30 rounded-xl p-6 hover:border-[#00BFFF] transition-all cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-white mb-2">👥 Visitor Analytics</h3>
            <p className="text-[#00BFFF]/60 text-sm">Detailed visitor statistics and trends</p>
          </motion.a>

          <motion.a
            href="/admin/qr-scans"
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-[#00BFFF]/20 to-[#7B2FBE]/20 border border-[#00BFFF]/30 rounded-xl p-6 hover:border-[#00BFFF] transition-all cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-white mb-2">🔗 QR Code Tracker</h3>
            <p className="text-[#00BFFF]/60 text-sm">Track QR code scans and analytics</p>
          </motion.a>
        </div>
      </div>
    </div>
  );
}
