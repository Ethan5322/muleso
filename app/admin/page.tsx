'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, CheckSquare, TrendingUp, Mail, Phone, X, Save, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase, Booking } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

type TabType = 'overview' | 'bookings' | 'clients' | 'revenue' | 'analytics';
type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

const ADMIN_PASSWORD = 'MuleSoo2024!';

export default function AdminDashboard() {
  const router = useRouter();

  // AUTHENTICATION STATE - CHECK FIRST
  const [authState, setAuthState] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  const [sessionValid, setSessionValid] = useState(false);

  // Check authentication BEFORE rendering anything
  useEffect(() => {
    const validateSession = async () => {
      try {
        const session = localStorage.getItem('admin_session');

        // NO session = redirect to login
        if (!session) {
          setAuthState('unauthenticated');
          await new Promise(resolve => setTimeout(resolve, 100));
          router.push('/admin/login');
          return;
        }

        // Parse and validate session
        let sessionData;
        try {
          sessionData = JSON.parse(session);
        } catch (e) {
          // Invalid JSON = delete and redirect
          localStorage.removeItem('admin_session');
          setAuthState('unauthenticated');
          await new Promise(resolve => setTimeout(resolve, 100));
          router.push('/admin/login');
          return;
        }

        // Validate session structure - MUST have authenticated flag
        if (!sessionData || typeof sessionData.authenticated !== 'boolean') {
          localStorage.removeItem('admin_session');
          setAuthState('unauthenticated');
          await new Promise(resolve => setTimeout(resolve, 100));
          router.push('/admin/login');
          return;
        }

        // Session must have timestamp
        if (!sessionData.timestamp || typeof sessionData.timestamp !== 'number') {
          localStorage.removeItem('admin_session');
          setAuthState('unauthenticated');
          await new Promise(resolve => setTimeout(resolve, 100));
          router.push('/admin/login');
          return;
        }

        // authenticated flag MUST be true
        if (sessionData.authenticated !== true) {
          localStorage.removeItem('admin_session');
          setAuthState('unauthenticated');
          await new Promise(resolve => setTimeout(resolve, 100));
          router.push('/admin/login');
          return;
        }

        // Check session age (24 hours max)
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

        // ALL CHECKS PASSED - session is valid
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

  // If not authenticated, show nothing (redirect will handle it)
  if (authState !== 'authenticated' || !sessionValid) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#00BFFF] text-lg">🔒 Verifying access...</div>
      </div>
    );
  }

  // ONLY RENDER ADMIN DASHBOARD IF AUTHENTICATED
  return <AdminDashboardContent />;
}

// Separate component for admin dashboard content
function AdminDashboardContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // Stats
  const [totalBookings, setTotalBookings] = useState(0);
  const [todayBookings, setTodayBookings] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [confirmedBookings, setConfirmedBookings] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    loadAllData();
  }, []);

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
    setCurrentPage(1);
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

  const getBookingsByStatus = (status: BookingStatus) => {
    const filtered = filteredBookings.filter(b => b.status === status);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filtered.slice(startIndex, endIndex);
  };

  const getTotalPages = () => Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);

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

      {/* Content - Show placeholder for now */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl p-12 text-center">
            <p className="text-[#00BFFF] text-xl font-semibold">✅ Admin Dashboard Loaded</p>
            <p className="text-[#00BFFF]/60 text-sm mt-2">Full dashboard content rendering...</p>
            <p className="text-[#00FF88] text-sm mt-4">🔒 Password-protected access verified</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
