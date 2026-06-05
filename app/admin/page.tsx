'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Users, QrCode, CheckSquare, TrendingUp, Mail, Phone, Download, Search, Plus, Eye, Trash2, Edit2 } from 'lucide-react';
import { supabase, Booking } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

type TabType = 'overview' | 'bookings' | 'clients' | 'revenue' | 'analytics';
type BookingStatus = 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days');

  // Stats
  const [totalBookings, setTotalBookings] = useState(0);
  const [todayBookings, setTodayBookings] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Auth check
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
    loadAllData();
  }, [router, dateRange]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const allBookings = data || [];
      setBookings(allBookings);
      setFilteredBookings(allBookings);

      // Calculate stats
      const total = allBookings.length;
      setTotalBookings(total);

      const today = new Date().toISOString().split('T')[0];
      const todayCount = allBookings.filter(b => b.created_at.startsWith(today)).length;
      setTodayBookings(todayCount);

      const pending = allBookings.filter(b => b.status === 'Pending').length;
      setPendingBookings(pending);

      const completed = allBookings.filter(b => b.status === 'Completed').length;
      setCompletedBookings(completed);

      // Calculate revenue (assuming budget field has numeric value)
      const revenue = allBookings.reduce((sum, b) => {
        const budgetNum = parseInt(b.budget?.replace(/[^0-9]/g, '') || '0');
        return sum + budgetNum;
      }, 0);
      setTotalRevenue(revenue);

      console.log(`✅ Loaded ${total} bookings`);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = bookings.filter(b =>
      b.name.toLowerCase().includes(term.toLowerCase()) ||
      b.email.toLowerCase().includes(term.toLowerCase()) ||
      b.service.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredBookings(filtered);
  };

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;
      toast.success('Booking updated');
      loadAllData();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    toast.success('Logged out');
    router.push('/admin/login');
  };

  const getBookingsByStatus = (status: BookingStatus) => filteredBookings.filter(b => b.status === status);

  const getServiceStats = () => {
    const services: { [key: string]: number } = {};
    bookings.forEach(b => {
      services[b.service] = (services[b.service] || 0) + 1;
    });
    return Object.entries(services).map(([name, value]) => ({ name, value }));
  };

  const COLORS = ['#00C8FF', '#7B2FFF', '#E8B84B', '#00FF88'];

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#00BFFF] text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-[#00BFFF]/30">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white font-sora">🎯 MuleSoo Admin</h1>
            <p className="text-[#00BFFF] text-sm">Professional Dashboard</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500 text-red-400 px-6 py-3 rounded-lg"
          >
            <LogOut size={20} />
            Logout
          </motion.button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-[#1a1a1a] border-b border-[#00BFFF]/30">
        <div className="max-w-7xl mx-auto px-6 flex gap-2 py-4">
          {[
            { id: 'overview' as TabType, label: '📊 Overview', icon: TrendingUp },
            { id: 'bookings' as TabType, label: '📋 Bookings (Kanban)', icon: CheckSquare },
            { id: 'clients' as TabType, label: '👥 Clients', icon: Users },
            { id: 'revenue' as TabType, label: '💰 Revenue', icon: TrendingUp },
            { id: 'analytics' as TabType, label: '📈 Analytics', icon: BarChart },
          ].map(tab => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#00BFFF]/30 border border-[#00BFFF] text-[#00BFFF]'
                  : 'text-[#00BFFF]/60 hover:text-[#00BFFF]'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-6">
                <p className="text-[#00BFFF]/60 text-sm font-semibold mb-2">TOTAL BOOKINGS</p>
                <p className="text-4xl font-bold text-white">{totalBookings}</p>
                <p className="text-[#00BFFF]/60 text-xs mt-2">Today: {todayBookings}</p>
              </div>

              <div className="bg-[#1a1a1a] border border-[#7B2FBE]/30 rounded-xl p-6">
                <p className="text-[#7B2FBE]/60 text-sm font-semibold mb-2">PENDING</p>
                <p className="text-4xl font-bold text-white">{pendingBookings}</p>
                <p className="text-[#7B2FBE]/60 text-xs mt-2">Need action</p>
              </div>

              <div className="bg-[#1a1a1a] border border-[#00FF88]/30 rounded-xl p-6">
                <p className="text-[#00FF88]/60 text-sm font-semibold mb-2">COMPLETED</p>
                <p className="text-4xl font-bold text-white">{completedBookings}</p>
                <p className="text-[#00FF88]/60 text-xs mt-2">Success rate: {totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(1) : 0}%</p>
              </div>

              <div className="bg-[#1a1a1a] border border-[#E8B84B]/30 rounded-xl p-6">
                <p className="text-[#E8B84B]/60 text-sm font-semibold mb-2">TOTAL REVENUE</p>
                <p className="text-4xl font-bold text-white">R{totalRevenue.toLocaleString()}</p>
                <p className="text-[#E8B84B]/60 text-xs mt-2">Avg: R{totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(0) : 0}</p>
              </div>

              <div className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-6">
                <p className="text-[#00BFFF]/60 text-sm font-semibold mb-2">CONVERSION</p>
                <p className="text-4xl font-bold text-white">{totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(1) : 0}%</p>
                <p className="text-[#00BFFF]/60 text-xs mt-2">Completion rate</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Service Distribution */}
              <div className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Services Booked</h3>
                {getServiceStats().length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={getServiceStats()} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#8884d8" dataKey="value">
                        {getServiceStats().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-[#00BFFF]/60">No data yet</p>
                )}
              </div>

              {/* Recent Bookings */}
              <div className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Recent Bookings</h3>
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {bookings.slice(0, 5).map(b => (
                    <div key={b.id} className="bg-[#0a0a0a] p-3 rounded-lg border border-[#00BFFF]/10">
                      <p className="font-semibold text-white">{b.name}</p>
                      <p className="text-[#00BFFF]/60 text-sm">{b.service}</p>
                      <p className={`text-xs mt-1 ${b.status === 'Completed' ? 'text-[#00FF88]' : b.status === 'Pending' ? 'text-[#FFA500]' : 'text-[#00BFFF]'}`}>
                        {b.status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* BOOKINGS TAB - KANBAN BOARD */}
        {activeTab === 'bookings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1 bg-[#1a1a1a] border border-[#00BFFF]/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#00BFFF]"
              />
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(['Pending', 'Confirmed', 'Completed'] as BookingStatus[]).map(status => (
                <div key={status} className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${status === 'Pending' ? 'bg-[#FFA500]' : status === 'Confirmed' ? 'bg-[#00BFFF]' : status === 'In Progress' ? 'bg-[#7B2FBE]' : 'bg-[#00FF88]'}`}></div>
                    <h3 className="font-bold text-white">{status}</h3>
                    <span className="text-[#00BFFF]/60 text-sm ml-auto">{getBookingsByStatus(status).length}</span>
                  </div>

                  <div className="space-y-3">
                    {getBookingsByStatus(status).map(booking => (
                      <motion.div
                        key={booking.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedBooking(booking)}
                        className="bg-[#0a0a0a] p-3 rounded-lg border border-[#00BFFF]/20 hover:border-[#00BFFF]/50 cursor-pointer transition-all"
                      >
                        <p className="font-semibold text-white text-sm">{booking.name}</p>
                        <p className="text-[#00BFFF]/60 text-xs">{booking.service}</p>
                        <p className="text-[#00BFFF]/40 text-xs mt-1">{booking.budget}</p>
                        {status !== 'Completed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextStatus: { [key in BookingStatus]: BookingStatus } = {
                                'Pending': 'Confirmed',
                                'Confirmed': 'Completed',
                                'Completed': 'Completed',
                                'Cancelled': 'Cancelled'
                              };
                              handleStatusChange(booking.id, nextStatus[status]);
                            }}
                            className="w-full mt-2 text-xs bg-[#00BFFF]/20 text-[#00BFFF] py-1 rounded hover:bg-[#00BFFF]/40 transition-all"
                          >
                            → Move Next
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Booking Details Modal */}
            {selectedBooking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedBooking(null)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedBooking.name}</h2>
                      <p className="text-[#00BFFF] text-sm">{selectedBooking.email}</p>
                    </div>
                    <button onClick={() => setSelectedBooking(null)} className="text-[#00BFFF]/60 hover:text-[#00BFFF]">✕</button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                      <p className="text-[#00BFFF]/60">Service</p>
                      <p className="font-bold text-white">{selectedBooking.service}</p>
                    </div>
                    <div>
                      <p className="text-[#00BFFF]/60">Budget</p>
                      <p className="font-bold text-white">{selectedBooking.budget}</p>
                    </div>
                    <div>
                      <p className="text-[#00BFFF]/60">Status</p>
                      <p className="font-bold text-white">{selectedBooking.status}</p>
                    </div>
                    <div>
                      <p className="text-[#00BFFF]/60">Verification Code</p>
                      <p className="font-mono text-[#00FF88] font-bold">{selectedBooking.verification_code}</p>
                    </div>
                    {selectedBooking.client_id && (
                      <div>
                        <p className="text-[#00BFFF]/60">Client ID</p>
                        <p className="font-mono text-white">{selectedBooking.client_id}</p>
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <p className="text-[#00BFFF]/60 text-sm mb-2">Project Description</p>
                    <p className="text-white text-sm bg-[#0a0a0a] p-3 rounded-lg">{selectedBooking.project_description}</p>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        navigator.clipboard.writeText(`Email: ${selectedBooking.email}\nPhone: ${selectedBooking.phone}`);
                        toast.success('Contact copied');
                      }}
                      className="flex-1 bg-[#00BFFF]/20 text-[#00BFFF] py-2 rounded-lg hover:bg-[#00BFFF]/30"
                    >
                      <Mail size={16} className="mx-auto" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => window.open(`https://wa.me/${selectedBooking.phone.replace(/\D/g, '')}`)}
                      className="flex-1 bg-[#00FF88]/20 text-[#00FF88] py-2 rounded-lg hover:bg-[#00FF88]/30"
                    >
                      WhatsApp
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* CLIENTS TAB */}
        {activeTab === 'clients' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="space-y-4">
              {bookings.map(b => (
                <div key={b.id} className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-6 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-lg">{b.name}</h3>
                    <p className="text-[#00BFFF]/60 text-sm">{b.email}</p>
                    <p className="text-[#00BFFF]/60 text-sm">{b.phone}</p>
                    <p className="text-white text-sm mt-2 font-semibold">Bookings: {bookings.filter(booking => booking.email === b.email).length}</p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => window.open(`mailto:${b.email}`)} className="p-2 bg-[#00BFFF]/20 rounded-lg text-[#00BFFF] hover:bg-[#00BFFF]/40">
                      <Mail size={18} />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => window.open(`https://wa.me/${b.phone.replace(/\D/g, '')}`)} className="p-2 bg-[#00FF88]/20 rounded-lg text-[#00FF88] hover:bg-[#00FF88]/40">
                      <Phone size={18} />
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* REVENUE TAB */}
        {activeTab === 'revenue' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1a1a1a] border border-[#E8B84B]/30 rounded-xl p-6">
                <p className="text-[#E8B84B]/60 text-sm font-semibold mb-2">TOTAL REVENUE</p>
                <p className="text-4xl font-bold text-white">R{totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-6">
                <p className="text-[#00BFFF]/60 text-sm font-semibold mb-2">AVERAGE BOOKING VALUE</p>
                <p className="text-4xl font-bold text-white">R{totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(0) : 0}</p>
              </div>
              <div className="bg-[#1a1a1a] border border-[#7B2FBE]/30 rounded-xl p-6">
                <p className="text-[#7B2FBE]/60 text-sm font-semibold mb-2">COMPLETED REVENUE</p>
                <p className="text-4xl font-bold text-white">R{bookings.filter(b => b.status === 'Completed').reduce((sum, b) => sum + parseInt(b.budget?.replace(/[^0-9]/g, '') || '0'), 0).toLocaleString()}</p>
              </div>
            </div>

            {/* Revenue by Service */}
            <div className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Revenue by Service</h3>
              <div className="space-y-3">
                {getServiceStats().map(service => {
                  const serviceRevenue = bookings
                    .filter(b => b.service === service.name)
                    .reduce((sum, b) => sum + parseInt(b.budget?.replace(/[^0-9]/g, '') || '0'), 0);
                  return (
                    <div key={service.name} className="flex justify-between items-center p-3 bg-[#0a0a0a] rounded-lg">
                      <div>
                        <p className="font-semibold text-white">{service.name}</p>
                        <p className="text-[#00BFFF]/60 text-sm">{service.value} bookings</p>
                      </div>
                      <p className="font-bold text-[#E8B84B]">R{serviceRevenue.toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Booking Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { status: 'Pending', count: pendingBookings },
                  { status: 'Confirmed', count: bookings.filter(b => b.status === 'Confirmed').length },
                  { status: 'Completed', count: completedBookings }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00BFFF/20" />
                  <XAxis dataKey="status" stroke="#00BFFF/60" />
                  <YAxis stroke="#00BFFF/60" />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #00BFFF' }} />
                  <Bar dataKey="count" fill="#00C8FF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
