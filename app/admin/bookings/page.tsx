'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Search, X, Save } from 'lucide-react';
import { supabase, Booking } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function BookingsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [editingStatus, setEditingStatus] = useState<Booking['status']>('Pending');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Check authentication
  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (!session) {
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);
    loadBookings();
  }, [router]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      console.log('Loading bookings from Supabase...');

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        toast.error(`Error: ${error.message}`);
        return;
      }

      console.log('Bookings loaded:', data);
      setBookings(data || []);
      setFilteredBookings(data || []);
    } catch (error: any) {
      console.error('Error loading bookings:', error);
      toast.error(`Failed to load bookings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = bookings.filter(
      (b) =>
        b.name.toLowerCase().includes(term.toLowerCase()) ||
        b.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredBookings(filtered);
  };

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditingStatus(booking.status);
    setEditingNotes(booking.notes || '');
  };

  const handleSaveBooking = async () => {
    if (!selectedBooking) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('bookings')
        .update({
          status: editingStatus,
          notes: editingNotes,
        })
        .eq('id', selectedBooking.id);

      if (error) throw error;

      toast.success('Booking updated successfully');
      setSelectedBooking(null);
      loadBookings();
    } catch (error) {
      console.error('Error saving booking:', error);
      toast.error('Failed to save booking');
    } finally {
      setSaving(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Date',
      'Name',
      'Email',
      'Phone',
      'Country',
      'Company',
      'Service',
      'Budget',
      'Timeline',
      'Contact Method',
      'Status',
    ];

    const rows = bookings.map((b) => [
      b.id,
      new Date(b.created_at).toLocaleDateString(),
      b.name,
      b.email,
      b.phone,
      b.country,
      b.company || '',
      b.service,
      b.budget,
      b.timeline,
      b.contact_method,
      b.status,
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Bookings exported as CSV');
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#00BFFF] text-lg">Loading bookings...</div>
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
            <h1 className="text-3xl font-bold font-sora">Bookings Management</h1>
            <p className="text-[#00BFFF] text-sm">{filteredBookings.length} bookings</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-[#00BFFF]" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#00BFFF]/30 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-[#00BFFF]"
            />
          </div>

          {/* Export */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-[#00FF88]/20 hover:bg-[#00FF88]/30 border border-[#00FF88] text-[#00FF88] px-4 py-2 rounded-lg transition-all"
          >
            <Download size={18} />
            Export CSV
          </motion.button>
        </div>

        {/* Table */}
        <div className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,191,255,0.2)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#00BFFF]/20">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00BFFF]">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00BFFF]">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00BFFF]">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00BFFF]">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00BFFF]">Service</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00BFFF]">Budget</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00BFFF]">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00BFFF]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking, idx) => (
                    <tr
                      key={booking.id}
                      className={`border-b border-[#00BFFF]/10 hover:bg-[#0a0a0a] transition-colors ${
                        idx % 2 === 0 ? 'bg-transparent' : 'bg-[#0a0a0a]/50'
                      }`}
                    >
                      <td className="px-6 py-4 text-sm">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">{booking.name}</td>
                      <td className="px-6 py-4 text-sm text-[#00BFFF]/60">{booking.email}</td>
                      <td className="px-6 py-4 text-sm">{booking.phone}</td>
                      <td className="px-6 py-4 text-sm">{booking.service}</td>
                      <td className="px-6 py-4 text-sm">{booking.budget}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'Pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : booking.status === 'Confirmed'
                                ? 'bg-blue-500/20 text-blue-400'
                                : booking.status === 'Completed'
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => handleSelectBooking(booking)}
                          className="text-[#00BFFF] hover:text-[#7B2FBE] transition-colors font-semibold"
                        >
                          View
                        </motion.button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-[#00BFFF]/60">
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#0a0a0a] border border-[#00BFFF]/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-6 right-6 text-[#00BFFF]/60 hover:text-white"
            >
              <X size={28} />
            </button>

            {/* Content */}
            <h2 className="text-2xl font-bold mb-6">Booking Details</h2>

            <div className="space-y-6">
              {/* Client Info */}
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#00BFFF]/20">
                <h3 className="text-lg font-semibold mb-4 text-[#00BFFF]">Client Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[#00BFFF]/60">Name</p>
                    <p className="font-semibold">{selectedBooking.name}</p>
                  </div>
                  <div>
                    <p className="text-[#00BFFF]/60">Email</p>
                    <p className="font-semibold">{selectedBooking.email}</p>
                  </div>
                  <div>
                    <p className="text-[#00BFFF]/60">Phone</p>
                    <p className="font-semibold">{selectedBooking.phone}</p>
                  </div>
                  <div>
                    <p className="text-[#00BFFF]/60">Country</p>
                    <p className="font-semibold">{selectedBooking.country}</p>
                  </div>
                  {selectedBooking.company && (
                    <div>
                      <p className="text-[#00BFFF]/60">Company</p>
                      <p className="font-semibold">{selectedBooking.company}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Info */}
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#00BFFF]/20">
                <h3 className="text-lg font-semibold mb-4 text-[#00BFFF]">Project Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-[#00BFFF]/60">Service</p>
                    <p className="font-semibold">{selectedBooking.service}</p>
                  </div>
                  <div>
                    <p className="text-[#00BFFF]/60">Budget</p>
                    <p className="font-semibold">{selectedBooking.budget}</p>
                  </div>
                  <div>
                    <p className="text-[#00BFFF]/60">Timeline</p>
                    <p className="font-semibold">{selectedBooking.timeline}</p>
                  </div>
                  <div>
                    <p className="text-[#00BFFF]/60">Description</p>
                    <p className="font-semibold">{selectedBooking.project_description}</p>
                  </div>
                </div>
              </div>

              {/* Status & Notes */}
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#00BFFF]/20 space-y-4">
                <h3 className="text-lg font-semibold text-[#00BFFF]">Status & Notes</h3>
                <div>
                  <label className="text-sm text-[#00BFFF]/60 font-semibold block mb-2">Status</label>
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value as Booking['status'])}
                    className="w-full bg-[#0a0a0a] border border-[#00BFFF]/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#00BFFF]"
                  >
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[#00BFFF]/60 font-semibold block mb-2">Admin Notes</label>
                  <textarea
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#00BFFF]/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#00BFFF] h-24 resize-none"
                    placeholder="Add notes about this booking..."
                  />
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#00BFFF]/20">
                <h3 className="text-lg font-semibold mb-4 text-[#00BFFF]">Metadata</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#00BFFF]/60">ID</span>
                    <span className="font-mono">{selectedBooking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#00BFFF]/60">Verification Code</span>
                    <span className="font-mono text-[#00FF88]">{selectedBooking.verification_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#00BFFF]/60">Submitted</span>
                    <span>{new Date(selectedBooking.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveBooking}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00BFFF] to-[#7B2FBE] text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
