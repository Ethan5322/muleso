'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, QrCode, TrendingUp } from 'lucide-react';
import { supabase, QRScan } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function QRScansPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [totalScans, setTotalScans] = useState(0);
  const [todayScans, setTodayScans] = useState(0);
  const [weekScans, setWeekScans] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (!session) {
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);
    loadQRScanData();
  }, [router]);

  const loadQRScanData = async () => {
    try {
      setLoading(true);
      const { data: scans, error } = await supabase
        .from('qr_scans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTotalScans(scans?.length || 0);

      // Today's scans
      const today = new Date().toISOString().split('T')[0];
      const todayCount = scans?.filter((s: QRScan) => s.created_at.startsWith(today)).length || 0;
      setTodayScans(todayCount);

      // Week scans
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      const weekStartStr = weekStart.toISOString().split('T')[0];
      const weekCount = scans?.filter((s: QRScan) => s.created_at >= weekStartStr).length || 0;
      setWeekScans(weekCount);

      // Last 7 days chart
      const chartDataMap = getLast7Days().map((date) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        scans: scans?.filter((s: QRScan) => s.created_at.startsWith(date)).length || 0,
      }));
      setChartData(chartDataMap);
    } catch (error) {
      console.error('Error loading QR scan data:', error);
      toast.error('Failed to load QR scan data');
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

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#00BFFF] text-lg">Loading QR scan data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="bg-[#0a0a0a] border-b border-[#00BFFF]/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-4">
          <motion.button
            onClick={() => router.push('/admin')}
            whileHover={{ scale: 1.05 }}
            className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
          >
            <ArrowLeft className="text-[#00BFFF]" size={24} />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold font-sora">QR Code Tracker</h1>
            <p className="text-[#00BFFF] text-sm">{totalScans} total scans</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1a1a] border border-[#7B2FBE]/30 rounded-xl p-6 shadow-[0_0_20px_rgba(123,47,190,0.2)]"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#7B2FBE]/60 text-sm font-semibold">TOTAL SCANS</p>
              <QrCode className="text-[#7B2FBE]" size={24} />
            </div>
            <p className="text-4xl font-bold">{totalScans}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1a1a1a] border border-[#00FF88]/30 rounded-xl p-6 shadow-[0_0_20px_rgba(0,255,136,0.2)]"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#00FF88]/60 text-sm font-semibold">TODAY</p>
              <TrendingUp className="text-[#00FF88]" size={24} />
            </div>
            <p className="text-4xl font-bold">{todayScans}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-6 shadow-[0_0_20px_rgba(0,191,255,0.2)]"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#00BFFF]/60 text-sm font-semibold">THIS WEEK</p>
              <TrendingUp className="text-[#00BFFF]" size={24} />
            </div>
            <p className="text-4xl font-bold">{weekScans}</p>
          </motion.div>
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1a1a1a] border border-[#7B2FBE]/30 rounded-xl p-6 shadow-[0_0_20px_rgba(123,47,190,0.2)]"
        >
          <h3 className="text-lg font-semibold mb-6 text-white">QR Scans (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
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

        {/* Insight Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-gradient-to-r from-[#7B2FBE]/20 to-[#00BFFF]/20 border border-[#7B2FBE]/30 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-2 text-white">📊 Weekly Insights</h3>
          <p className="text-[#00BFFF]/60">
            {weekScans > 0
              ? `You've had ${weekScans} QR code scans this week. That's an average of ${(weekScans / 7).toFixed(1)} scans per day!`
              : 'No QR scans this week yet. Share your QR code to start tracking!'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
