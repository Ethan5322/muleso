'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, Booking } from '@/lib/supabase';

type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export default function BookingsDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'all'>('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      toast.error(`Error loading bookings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Status updated to ${newStatus}`);
      loadBookings();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this booking?')) return;

    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
      toast.success('Booking deleted');
      loadBookings();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const filteredBookings = selectedStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status === selectedStatus);

  const stats = {
    pending: bookings.filter(b => b.status === 'Pending').length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    completed: bookings.filter(b => b.status === 'Completed').length,
    cancelled: bookings.filter(b => b.status === 'Cancelled').length,
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'Pending': return <Clock size={18} />;
      case 'Confirmed': return <CheckCircle size={18} />;
      case 'Completed': return <CheckCircle size={18} />;
      case 'Cancelled': return <AlertCircle size={18} />;
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'Pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'Confirmed': return 'text-blue-400 bg-blue-400/20';
      case 'Completed': return 'text-green-400 bg-green-400/20';
      case 'Cancelled': return 'text-red-400 bg-red-400/20';
    }
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pending', value: stats.pending, color: 'yellow' },
          { label: 'Confirmed', value: stats.confirmed, color: 'blue' },
          { label: 'Completed', value: stats.completed, color: 'green' },
          { label: 'Cancelled', value: stats.cancelled, color: 'red' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#0A0F1E] border border-[#00C8FF]/30 rounded-xl p-4">
            <p className={`text-2xl font-bold ${stat.color === 'yellow' ? 'text-yellow-400' : stat.color === 'blue' ? 'text-blue-400' : stat.color === 'green' ? 'text-green-400' : 'text-red-400'}`}>
              {stat.value}
            </p>
            <p className="text-[#00C8FF]/60 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {['all', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status as any)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
              selectedStatus === status
                ? 'bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white'
                : 'bg-[#0A0F1E] border border-[#00C8FF]/30 text-[#00C8FF] hover:border-[#00C8FF]'
            }`}
          >
            {status === 'all' ? 'All Bookings' : status}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-[#00C8FF]">Loading bookings...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-[#0A0F1E] border border-[#00C8FF]/30 rounded-xl p-12 text-center">
          <p className="text-[#00C8FF]/60">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#0A0F1E] border border-[#00C8FF]/30 rounded-xl p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div>
                  <p className="text-[#00C8FF]/60 text-sm">Client</p>
                  <p className="text-white font-bold">{booking.name}</p>
                  <p className="text-[#00C8FF] text-sm">{booking.email}</p>
                </div>
                <div>
                  <p className="text-[#00C8FF]/60 text-sm">Service & Budget</p>
                  <p className="text-white font-bold">{booking.service}</p>
                  <p className="text-[#00C8FF] text-sm">{booking.budget}</p>
                </div>
                <div>
                  <p className="text-[#00C8FF]/60 text-sm">Details</p>
                  <p className="text-white font-bold">{booking.country}</p>
                  <p className="text-[#00C8FF] text-sm">{booking.timeline}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#00C8FF]/20">
                <div className="flex items-center gap-2">
                  <select
                    value={booking.status}
                    onChange={e => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                    className={`px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-2 ${getStatusColor(booking.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleDelete(booking.id)}
                  className="flex items-center gap-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-all text-sm"
                >
                  <Trash2 size={16} />
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
