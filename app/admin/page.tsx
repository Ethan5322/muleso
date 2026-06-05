'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Users, QrCode, CheckSquare, TrendingUp, Mail, Phone, Download, Search, Plus, Eye, Trash2, Edit2, X, Save, Calendar, MapPin, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase, Booking } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

type TabType = 'overview' | 'bookings' | 'clients' | 'revenue' | 'analytics';
type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days');
  const [notes, setNotes] = useState('');

  // Stats
  const [totalBookings, setTotalBookings] = useState(0);
  const [todayBookings, setTodayBookings] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [confirmedBookings, setConfirmedBookings] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // STRONG AUTH CHECK
  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (!session) {
      router.push('/admin/login');
      return;
    }

    try {
      const sessionData = JSON.parse(session);

      if (!sessionData || !sessionData.authenticated) {
        localStorage.removeItem('admin_session');
        router.push('/admin/login');
        return;
      }

      const sessionAge = Date.now() - sessionData.timestamp;
      const MAX_SESSION_AGE = 24 * 60 * 60 * 1000;

      if (sessionAge > MAX_SESSION_AGE) {
        localStorage.removeItem('admin_session');
        toast.error('🔒 Session expired. Please login again.');
        router.push('/admin/login');
        return;
      }

      if (typeof sessionData.authenticated !== 'boolean' || !sessionData.timestamp) {
        localStorage.removeItem('admin_session');
        router.push('/admin/login');
        return;
      }

      setIsAuthenticated(true);
      loadAllData();
    } catch (error) {
      console.error('Session validation failed:', error);
      localStorage.removeItem('admin_session');
      router.push('/admin/login');
    }
  }, [router]);

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

      const confirmed = allBookings.filter(b => b.status === 'Confirmed').length;
      setConfirmedBookings(confirmed);

      const completed = allBookings.filter(b => b.status === 'Completed').length;
      setCompletedBookings(completed);

      // Calculate revenue
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
      b.service.toLowerCase().includes(term.toLowerCase()) ||
      b.verification_code.includes(term)
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
      toast.success(`✅ Status changed to ${newStatus}`);
      loadAllData();
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleSaveNotes = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ notes })
        .eq('id', bookingId);

      if (error) throw error;
      toast.success('✅ Notes saved');
      loadAllData();
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, notes });
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_attempts');
    localStorage.removeItem('admin_lockout');
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

  const getCountryStats = () => {
    const countries: { [key: string]: number } = {};
    bookings.forEach(b => {
      countries[b.country] = (countries[b.country] || 0) + 1;
    });
    return Object.entries(countries).map(([name, value]) => ({ name, value }));
  };

  const COLORS = ['#00C8FF', '#7B2FFF', '#E8B84B', '#00FF88', '#FF6B6B'];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#00BFFF] text-xl">🔒 Verifying access...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#00BFFF] text-xl">📊 Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] border-b border-[#00BFFF]/30">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white font-sora">🎯 MuleSoo Admin Dashboard</h1>
            <p className="text-[#00BFFF] text-sm mt-1">Total Bookings: {totalBookings} | Today: {todayBookings}</p>
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
      <div className="bg-[#1a1a1a] border-b border-[#00BFFF]/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex gap-2 py-4 overflow-x-auto">
          {[
            { id: 'overview' as TabType, label: '📊 Overview' },
            { id: 'bookings' as TabType, label: '📋 Bookings (Kanban)' },
            { id: 'clients' as TabType, label: '👥 Clients' },
            { id: 'revenue' as TabType, label: '💰 Revenue' },
            { id: 'analytics' as TabType, label: '📈 Analytics' },
          ].map(tab => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
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
            {/* Real-time Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#00BFFF]/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[#00BFFF]/60 text-sm font-semibold">TOTAL BOOKINGS</p>
                  <CheckSquare size={20} className="text-[#00BFFF]" />
                </div>
                <p className="text-4xl font-bold text-white">{totalBookings}</p>
                <p className="text-[#00BFFF]/60 text-xs mt-3">Today: <span className="text-[#00FF88]">{todayBookings}</span></p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#FFA500]/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[#FFA500]/60 text-sm font-semibold">PENDING</p>
                  <Clock size={20} className="text-[#FFA500]" />
                </div>
                <p className="text-4xl font-bold text-white">{pendingBookings}</p>
                <p className="text-[#FFA500]/60 text-xs mt-3">Need action</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#7B2FBE]/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[#7B2FBE]/60 text-sm font-semibold">CONFIRMED</p>
                  <AlertCircle size={20} className="text-[#7B2FBE]" />
                </div>
                <p className="text-4xl font-bold text-white">{confirmedBookings}</p>
                <p className="text-[#7B2FBE]/60 text-xs mt-3">In progress</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#00FF88]/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[#00FF88]/60 text-sm font-semibold">COMPLETED</p>
                  <CheckCircle size={20} className="text-[#00FF88]" />
                </div>
                <p className="text-4xl font-bold text-white">{completedBookings}</p>
                <p className="text-[#00FF88]/60 text-xs mt-3">Success: {totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(0) : 0}%</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#E8B84B]/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[#E8B84B]/60 text-sm font-semibold">REVENUE</p>
                  <TrendingUp size={20} className="text-[#E8B84B]" />
                </div>
                <p className="text-3xl font-bold text-white">R{totalRevenue.toLocaleString()}</p>
                <p className="text-[#E8B84B]/60 text-xs mt-3">Avg: R{totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(0) : 0}</p>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Services Distribution */}
              <motion.div whileHover={{ scale: 1.02 }} className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">📦 Services Booked</h3>
                {getServiceStats().length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={getServiceStats()} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                        {getServiceStats().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #00BFFF', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-[#00BFFF]/60 text-center py-12">No data yet</p>
                )}
              </motion.div>

              {/* Countries Distribution */}
              <motion.div whileHover={{ scale: 1.02 }} className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">🌍 Clients by Country</h3>
                <div className="space-y-3">
                  {getCountryStats().map(country => (
                    <div key={country.name} className="flex items-center justify-between">
                      <span className="text-[#00BFFF]/80">{country.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-[#0a0a0a] rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#00BFFF] to-[#7B2FBE] h-2 rounded-full"
                            style={{ width: `${(country.value / Math.max(...getCountryStats().map(c => c.value))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-bold w-8">{country.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">📝 Recent Bookings</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {bookings.slice(0, 10).map((b, idx) => (
                  <motion.div
                    key={b.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedBooking(b)}
                    className="bg-[#0a0a0a] p-4 rounded-lg border border-[#00BFFF]/20 hover:border-[#00BFFF]/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{idx + 1}. {b.name}</p>
                        <p className="text-[#00BFFF]/60 text-sm">{b.service} • {b.country}</p>
                        <p className="text-[#00BFFF]/40 text-xs mt-1">{b.budget} • {new Date(b.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        b.status === 'Completed' ? 'bg-[#00FF88]/20 text-[#00FF88]' :
                        b.status === 'Confirmed' ? 'bg-[#00BFFF]/20 text-[#00BFFF]' :
                        b.status === 'Pending' ? 'bg-[#FFA500]/20 text-[#FFA500]' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* BOOKINGS TAB - KANBAN BOARD */}
        {activeTab === 'bookings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by name, email, service, or verification code..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1 bg-[#1a1a1a] border border-[#00BFFF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00BFFF] transition-all"
              />
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(['Pending', 'Confirmed', 'Completed'] as BookingStatus[]).map(status => (
                <div key={status} className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-4 min-h-96">
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#00BFFF]/20">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'Pending' ? 'bg-[#FFA500]' :
                      status === 'Confirmed' ? 'bg-[#00BFFF]' :
                      'bg-[#00FF88]'
                    }`}></div>
                    <h3 className="font-bold text-white">{status}</h3>
                    <span className="text-[#00BFFF]/60 text-sm ml-auto bg-[#0a0a0a] px-2 py-1 rounded-full">{getBookingsByStatus(status).length}</span>
                  </div>

                  <div className="space-y-3">
                    {getBookingsByStatus(status).map(booking => (
                      <motion.div
                        key={booking.id}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => {
                          setSelectedBooking(booking);
                          setNotes(booking.notes || '');
                        }}
                        className="bg-[#0a0a0a] p-4 rounded-lg border border-[#00BFFF]/20 hover:border-[#00BFFF]/70 cursor-pointer transition-all hover:shadow-lg hover:shadow-[#00BFFF]/20"
                      >
                        <p className="font-semibold text-white text-sm mb-1">{booking.name}</p>
                        <p className="text-[#00BFFF]/60 text-xs mb-2">{booking.service}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-[#E8B84B] text-xs font-semibold">{booking.budget}</p>
                          <span className="text-[#00FF88] text-xs font-mono">{booking.verification_code}</span>
                        </div>
                        <p className="text-[#00BFFF]/40 text-xs mt-2">{new Date(booking.created_at).toLocaleDateString()}</p>
                        {status !== 'Completed' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
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
                            className="w-full mt-3 text-xs bg-gradient-to-r from-[#00BFFF]/30 to-[#7B2FBE]/30 text-[#00BFFF] py-2 rounded hover:from-[#00BFFF]/50 hover:to-[#7B2FBE]/50 transition-all font-semibold"
                          >
                            → Move Next
                          </motion.button>
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
                className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedBooking(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#1a1a1a] border border-[#00BFFF]/40 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex justify-between items-start mb-6 pb-6 border-b border-[#00BFFF]/20">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedBooking.name}</h2>
                      <p className="text-[#00BFFF] text-sm mt-1">Verification Code: <span className="font-mono text-[#00FF88] font-bold">{selectedBooking.verification_code}</span></p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      onClick={() => setSelectedBooking(null)}
                      className="text-[#00BFFF]/60 hover:text-[#00BFFF]"
                    >
                      <X size={24} />
                    </motion.button>
                  </div>

                  {/* Client Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-[#00BFFF]/20">
                    <div>
                      <p className="text-[#00BFFF]/60 text-sm font-semibold mb-2">EMAIL</p>
                      <p className="font-bold text-white break-all">{selectedBooking.email}</p>
                    </div>
                    <div>
                      <p className="text-[#00BFFF]/60 text-sm font-semibold mb-2">PHONE</p>
                      <p className="font-bold text-white">{selectedBooking.phone}</p>
                    </div>
                    <div>
                      <p className="text-[#00BFFF]/60 text-sm font-semibold mb-2">COUNTRY</p>
                      <p className="font-bold text-white">{selectedBooking.country}</p>
                    </div>
                    <div>
                      <p className="text-[#00BFFF]/60 text-sm font-semibold mb-2">COMPANY</p>
                      <p className="font-bold text-white">{selectedBooking.company || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-[#00BFFF]/20">
                    <div>
                      <p className="text-[#00BFFF]/60 text-sm font-semibold mb-2">SERVICE</p>
                      <p className="font-bold text-white text-lg">{selectedBooking.service}</p>
                    </div>
                    <div>
                      <p className="text-[#00BFFF]/60 text-sm font-semibold mb-2">BUDGET</p>
                      <p className="font-bold text-[#E8B84B] text-lg">{selectedBooking.budget}</p>
                    </div>
                    <div>
                      <p className="text-[#00BFFF]/60 text-sm font-semibold mb-2">TIMELINE</p>
                      <p className="font-bold text-white">{selectedBooking.timeline || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[#00BFFF]/60 text-sm font-semibold mb-2">CONTACT METHOD</p>
                      <p className="font-bold text-white">{selectedBooking.contact_method || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Client ID Information */}
                  {selectedBooking.client_id && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-[#00BFFF]/20">
                      <div>
                        <p className="text-[#00BFFF]/60 text-sm font-semibold mb-2">ID TYPE</p>
                        <p className="font-bold text-white capitalize">{selectedBooking.client_id_type || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[#00BFFF]/60 text-sm font-semibold mb-2">ID NUMBER</p>
                        <p className="font-mono text-white">{selectedBooking.client_id}</p>
                      </div>
                    </div>
                  )}

                  {/* Project Description */}
                  <div className="mb-6 pb-6 border-b border-[#00BFFF]/20">
                    <p className="text-[#00BFFF]/60 text-sm font-semibold mb-3">PROJECT DETAILS</p>
                    <p className="text-white text-sm bg-[#0a0a0a] p-4 rounded-lg border border-[#00BFFF]/10 leading-relaxed">{selectedBooking.project_description}</p>
                  </div>

                  {/* Status & Notes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-[#00BFFF]/60 text-sm font-semibold mb-3">STATUS</p>
                      <select
                        value={selectedBooking.status}
                        onChange={(e) => handleStatusChange(selectedBooking.id, e.target.value as BookingStatus)}
                        className="w-full bg-[#0a0a0a] border border-[#00BFFF]/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#00BFFF]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-[#00BFFF]/60 text-sm font-semibold mb-3">BOOKED ON</p>
                      <p className="text-white font-bold text-lg">{new Date(selectedBooking.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="mb-6">
                    <p className="text-[#00BFFF]/60 text-sm font-semibold mb-3">ADMIN NOTES</p>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add internal notes about this booking..."
                      className="w-full bg-[#0a0a0a] border border-[#00BFFF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00BFFF] resize-none h-24"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-wrap">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleSaveNotes(selectedBooking.id)}
                      className="flex-1 min-w-32 bg-[#00BFFF]/20 text-[#00BFFF] py-3 rounded-lg hover:bg-[#00BFFF]/30 transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      Save Notes
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        navigator.clipboard.writeText(`${selectedBooking.name}\n${selectedBooking.email}\n${selectedBooking.phone}`);
                        toast.success('Contact info copied');
                      }}
                      className="flex-1 min-w-32 bg-[#7B2FBE]/20 text-[#7B2FBE] py-3 rounded-lg hover:bg-[#7B2FBE]/30 transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      <Mail size={18} />
                      Copy Contact
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => window.open(`https://wa.me/${selectedBooking.phone.replace(/\D/g, '')}`)}
                      className="flex-1 min-w-32 bg-[#00FF88]/20 text-[#00FF88] py-3 rounded-lg hover:bg-[#00FF88]/30 transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      <Phone size={18} />
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
              <p className="text-[#00BFFF]/60 mb-6">Total Unique Clients: <span className="text-[#00BFFF] font-bold text-lg">{new Set(bookings.map(b => b.email)).size}</span></p>
              {Array.from(new Map(bookings.map(b => [b.email, b])).values()).map(b => {
                const clientBookings = bookings.filter(booking => booking.email === b.email);
                const totalSpent = clientBookings.reduce((sum, booking) => sum + parseInt(booking.budget?.replace(/[^0-9]/g, '') || '0'), 0);

                return (
                  <motion.div
                    key={b.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedBooking(b);
                      setNotes(b.notes || '');
                    }}
                    className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-6 hover:border-[#00BFFF]/60 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg mb-2">{b.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-[#00BFFF]/60 text-sm">Email</p>
                            <p className="text-white break-all">{b.email}</p>
                          </div>
                          <div>
                            <p className="text-[#00BFFF]/60 text-sm">Phone</p>
                            <p className="text-white">{b.phone}</p>
                          </div>
                          <div>
                            <p className="text-[#00BFFF]/60 text-sm">Country</p>
                            <p className="text-white">{b.country}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-[#0a0a0a] p-3 rounded-lg">
                            <p className="text-[#00BFFF]/60 text-xs">Total Bookings</p>
                            <p className="text-white font-bold text-lg">{clientBookings.length}</p>
                          </div>
                          <div className="bg-[#0a0a0a] p-3 rounded-lg">
                            <p className="text-[#E8B84B]/60 text-xs">Total Spent</p>
                            <p className="text-[#E8B84B] font-bold text-lg">R{totalSpent.toLocaleString()}</p>
                          </div>
                          <div className="bg-[#0a0a0a] p-3 rounded-lg">
                            <p className="text-[#00FF88]/60 text-xs">Last Booking</p>
                            <p className="text-white font-bold text-sm">{new Date(Math.max(...clientBookings.map(b => new Date(b.created_at).getTime()))).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`mailto:${b.email}`);
                          }}
                          className="p-3 bg-[#00BFFF]/20 rounded-lg text-[#00BFFF] hover:bg-[#00BFFF]/40 transition-all"
                        >
                          <Mail size={20} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://wa.me/${b.phone.replace(/\D/g, '')}`);
                          }}
                          className="p-3 bg-[#00FF88]/20 rounded-lg text-[#00FF88] hover:bg-[#00FF88]/40 transition-all"
                        >
                          <Phone size={20} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* REVENUE TAB */}
        {activeTab === 'revenue' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#E8B84B]/40 rounded-xl p-6">
                <p className="text-[#E8B84B]/60 text-sm font-semibold mb-3">TOTAL REVENUE (ALL TIME)</p>
                <p className="text-4xl font-bold text-[#E8B84B]">R{totalRevenue.toLocaleString()}</p>
                <p className="text-[#E8B84B]/60 text-xs mt-3">From {totalBookings} bookings</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#00BFFF]/40 rounded-xl p-6">
                <p className="text-[#00BFFF]/60 text-sm font-semibold mb-3">AVERAGE BOOKING VALUE</p>
                <p className="text-4xl font-bold text-[#00BFFF]">R{totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(0) : 0}</p>
                <p className="text-[#00BFFF]/60 text-xs mt-3">Per booking</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#7B2FBE]/40 rounded-xl p-6">
                <p className="text-[#7B2FBE]/60 text-sm font-semibold mb-3">COMPLETED REVENUE</p>
                <p className="text-4xl font-bold text-[#7B2FBE]">R{bookings.filter(b => b.status === 'Completed').reduce((sum, b) => sum + parseInt(b.budget?.replace(/[^0-9]/g, '') || '0'), 0).toLocaleString()}</p>
                <p className="text-[#7B2FBE]/60 text-xs mt-3">From {completedBookings} completed</p>
              </motion.div>
            </div>

            {/* Revenue by Service */}
            <motion.div className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">💰 Revenue Breakdown by Service</h3>
              <div className="space-y-4">
                {getServiceStats().map(service => {
                  const serviceRevenue = bookings
                    .filter(b => b.service === service.name)
                    .reduce((sum, b) => sum + parseInt(b.budget?.replace(/[^0-9]/g, '') || '0'), 0);
                  const servicePercentage = ((serviceRevenue / totalRevenue) * 100) || 0;
                  return (
                    <motion.div key={service.name} className="p-4 bg-[#0a0a0a] rounded-lg border border-[#00BFFF]/20">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-white text-lg">{service.name}</p>
                          <p className="text-[#00BFFF]/60 text-sm">{service.value} bookings</p>
                        </div>
                        <p className="font-bold text-[#E8B84B] text-2xl">R{serviceRevenue.toLocaleString()}</p>
                      </div>
                      <div className="w-full bg-[#1a1a1a] rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${servicePercentage}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="bg-gradient-to-r from-[#E8B84B] to-[#F5C871] h-3 rounded-full"
                        ></motion.div>
                      </div>
                      <p className="text-[#E8B84B]/60 text-xs mt-2">{servicePercentage.toFixed(1)}% of total revenue</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Booking Status Distribution */}
              <motion.div className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">📊 Booking Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { status: 'Pending', count: pendingBookings, fill: '#FFA500' },
                    { status: 'Confirmed', count: confirmedBookings, fill: '#00BFFF' },
                    { status: 'Completed', count: completedBookings, fill: '#00FF88' }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#00BFFF/20" />
                    <XAxis dataKey="status" stroke="#00BFFF/60" />
                    <YAxis stroke="#00BFFF/60" />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #00BFFF', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="#00C8FF" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Completion Rate */}
              <motion.div className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">✅ Completion Rate Over Time</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[#00BFFF]/80">Total Completed</p>
                    <p className="text-3xl font-bold text-[#00FF88]">{completedBookings}/{totalBookings}</p>
                  </div>
                  <div className="w-full bg-[#0a0a0a] rounded-full h-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedBookings / totalBookings) * 100}%` }}
                      transition={{ duration: 0.8 }}
                      className="bg-gradient-to-r from-[#00FF88] to-[#00C8FF] h-4 rounded-full"
                    ></motion.div>
                  </div>
                  <p className="text-[#00FF88] font-bold text-lg">{((completedBookings / totalBookings) * 100).toFixed(1)}% Success Rate</p>
                </div>
              </motion.div>
            </div>

            {/* Daily Bookings */}
            <motion.div className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">📈 Recent Activity Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0a0a0a] p-4 rounded-lg border border-[#00BFFF]/20">
                  <p className="text-[#00BFFF]/60 text-sm mb-2">Today</p>
                  <p className="text-3xl font-bold text-white">{todayBookings}</p>
                  <p className="text-[#00BFFF]/40 text-xs mt-1">new bookings</p>
                </div>
                <div className="bg-[#0a0a0a] p-4 rounded-lg border border-[#FFA500]/20">
                  <p className="text-[#FFA500]/60 text-sm mb-2">This Week</p>
                  <p className="text-3xl font-bold text-white">{bookings.filter(b => {
                    const bookingDate = new Date(b.created_at);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return bookingDate >= weekAgo;
                  }).length}</p>
                  <p className="text-[#FFA500]/40 text-xs mt-1">bookings</p>
                </div>
                <div className="bg-[#0a0a0a] p-4 rounded-lg border border-[#7B2FBE]/20">
                  <p className="text-[#7B2FBE]/60 text-sm mb-2">This Month</p>
                  <p className="text-3xl font-bold text-white">{bookings.filter(b => {
                    const bookingDate = new Date(b.created_at);
                    const monthAgo = new Date();
                    monthAgo.setDate(monthAgo.getDate() - 30);
                    return bookingDate >= monthAgo;
                  }).length}</p>
                  <p className="text-[#7B2FBE]/40 text-xs mt-1">bookings</p>
                </div>
                <div className="bg-[#0a0a0a] p-4 rounded-lg border border-[#E8B84B]/20">
                  <p className="text-[#E8B84B]/60 text-sm mb-2">Avg per Booking</p>
                  <p className="text-3xl font-bold text-[#E8B84B]">R{totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(0) : 0}</p>
                  <p className="text-[#E8B84B]/40 text-xs mt-1">revenue</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
