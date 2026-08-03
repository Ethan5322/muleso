'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Smartphone, Monitor } from 'lucide-react';
import { supabase, Visitor } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

export default function VisitorsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [mobilePercentage, setMobilePercentage] = useState(0);
  const [desktopPercentage, setDesktopPercentage] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [topPages, setTopPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (!session) {
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);
    loadVisitorData();
  }, [router]);

  const loadVisitorData = async () => {
    try {
      setLoading(true);
      const { data: visitors, error } = await supabase
        .from('visitors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTotalVisitors(visitors?.length || 0);

      // Calculate mobile vs desktop
      const mobile = visitors?.filter((v: Visitor) => v.device === 'mobile').length || 0;
      const desktop = visitors?.filter((v: Visitor) => v.device === 'desktop').length || 0;
      const total = mobile + desktop;

      setMobilePercentage(total > 0 ? (mobile / total) * 100 : 0);
      setDesktopPercentage(total > 0 ? (desktop / total) * 100 : 0);

      // Last 7 days chart
      const chartDataMap = getLast7Days().map((date) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        visitors: visitors?.filter((v: Visitor) => v.created_at.startsWith(date)).length || 0,
      }));
      setChartData(chartDataMap);

      // Top pages
      const pageMap: { [key: string]: number } = {};
      visitors?.forEach((v: Visitor) => {
        pageMap[v.page] = (pageMap[v.page] || 0) + 1;
      });

      const topPagesData = Object.entries(pageMap)
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setTopPages(topPagesData);
    } catch (error) {
      console.error('Error loading visitor data:', error);
      toast.error('Failed to load visitor data');
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
      <div className="flex items-center justify-center py-20">
        <div className="text-[#00C8FF] text-lg">Loading visitor data...</div>
      </div>
    );
  }

  const deviceData = [
    { name: 'Mobile', value: mobilePercentage },
    { name: 'Desktop', value: desktopPercentage },
  ];

  const COLORS = ['#00C8FF', '#7B2FFF'];

  return (
    <div className="text-white">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-sora">Visitor Analytics</h1>
        <p className="text-[#00C8FF] text-sm">{totalVisitors} total visitors</p>
      </div>

      {/* Content */}
      <div>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A2332] border border-[#00C8FF]/30 rounded-xl p-6 shadow-[0_0_20px_rgba(0,191,255,0.2)]"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#00C8FF] text-sm font-semibold">TOTAL VISITORS</p>
              <Users className="text-[#00C8FF]" size={24} />
            </div>
            <p className="text-4xl font-bold">{totalVisitors}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1A2332] border border-[#00C8FF]/30 rounded-xl p-6 shadow-[0_0_20px_rgba(0,191,255,0.2)]"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#00C8FF] text-sm font-semibold">MOBILE</p>
              <Smartphone className="text-[#00C8FF]" size={24} />
            </div>
            <p className="text-4xl font-bold">{mobilePercentage.toFixed(1)}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1A2332] border border-[#00C8FF]/30 rounded-xl p-6 shadow-[0_0_20px_rgba(0,191,255,0.2)]"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#00C8FF] text-sm font-semibold">DESKTOP</p>
              <Monitor className="text-[#00C8FF]" size={24} />
            </div>
            <p className="text-4xl font-bold">{desktopPercentage.toFixed(1)}%</p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visitors Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-[#1A2332] border border-[#00C8FF]/30 rounded-xl p-6 shadow-[0_0_20px_rgba(0,191,255,0.2)]"
          >
            <h3 className="text-lg font-semibold mb-6 text-white">Visitors (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00C8FF20" />
                <XAxis dataKey="date" stroke="#00C8FF" />
                <YAxis stroke="#00C8FF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A2332',
                    border: '1px solid #00C8FF',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="visitors" fill="#00C8FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Device Split */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#1A2332] border border-[#00C8FF]/30 rounded-xl p-6 shadow-[0_0_20px_rgba(0,191,255,0.2)]"
          >
            <h3 className="text-lg font-semibold mb-6 text-white">Device Split</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value.toFixed(0)}%`}
                  outerRadius={100}
                  fill="#00C8FF"
                  dataKey="value"
                >
                  {COLORS.map((color) => (
                    <Cell key={color} fill={color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => `${Number(value).toFixed(1)}%`}
                  contentStyle={{
                    backgroundColor: '#1A2332',
                    border: '1px solid #00C8FF',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-[#1A2332] border border-[#00C8FF]/30 rounded-xl p-6 shadow-[0_0_20px_rgba(0,191,255,0.2)]"
        >
          <h3 className="text-lg font-semibold mb-6 text-white">Top Pages</h3>
          <div className="space-y-2">
            {topPages.map((page, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-[#0A0E17] rounded-lg border border-[#00C8FF]/10">
                <p className="text-white">{page.page}</p>
                <p className="text-[#00C8FF] font-semibold">{page.count} visits</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
