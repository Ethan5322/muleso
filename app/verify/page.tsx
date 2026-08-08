'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Search } from 'lucide-react';
import { supabase, Booking } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function VerifyPage() {
  const [verificationCode, setVerificationCode] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode.trim()) {
      setError('Please enter a verification code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSearched(false);

      const { data, error: queryError } = await supabase
        .from('bookings')
        .select('*')
        .eq('verification_code', verificationCode.toUpperCase().trim())
        .single();

      setSearched(true);

      if (queryError || !data) {
        setError('❌ Invalid verification code. Please check and try again.');
        setBooking(null);
        toast.error('Verification code not found');
        return;
      }

      setBooking(data);
      toast.success('✅ Booking found!');
    } catch (err) {
      setError('❌ Invalid verification code. Please check and try again.');
      setBooking(null);
      console.error('Error verifying code:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-sora text-white mb-4">
            Verify Your <span className="gradient-text">Booking</span>
          </h1>
          <p className="text-[#7FB3FF] text-lg">
            Enter your verification code from the booking confirmation PDF
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1a1a1a] border border-[#7FB3FF]/30 rounded-2xl p-8 mb-8 shadow-[0_0_20px_rgba(0,191,255,0.2)]"
        >
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#7FB3FF] mb-3 uppercase">
                Verification Code
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                  placeholder="e.g., ABC1-2345-DEF6"
                  className="flex-1 bg-[#0a0a0a] border border-[#7FB3FF]/30 text-white px-6 py-4 rounded-lg focus:outline-none focus:border-[#7FB3FF] text-lg font-mono"
                  disabled={loading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-[#7FB3FF] to-[#7B2FBE] text-white font-bold px-8 py-4 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Search size={20} />
                  {loading ? 'Verifying...' : 'Verify'}
                </motion.button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/20 border border-red-500 rounded-lg p-4 flex items-start gap-3"
                >
                  <AlertCircle className="text-red-400 flex-shrink-0 mt-1" size={20} />
                  <p className="text-red-300 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Booking Details */}
        <AnimatePresence>
          {searched && booking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6"
            >
              {/* Success Banner */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-[#00FF88]/20 to-[#7FB3FF]/20 border border-[#00FF88] rounded-2xl p-6 flex items-center gap-4"
              >
                <CheckCircle className="text-[#00FF88] flex-shrink-0" size={28} />
                <div>
                  <p className="text-[#00FF88] font-bold text-lg">Booking Verified ✓</p>
                  <p className="text-[#00FF88]/60 text-sm">
                    Verification code matched. Here are your booking details:
                  </p>
                </div>
              </motion.div>

              {/* Booking Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Info */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#1a1a1a] border border-[#7FB3FF]/30 rounded-xl p-6"
                >
                  <h3 className="text-lg font-bold text-[#7FB3FF] mb-4">Client Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-[#7FB3FF]/60">Name</p>
                      <p className="text-white font-semibold">{booking.name}</p>
                    </div>
                    <div>
                      <p className="text-[#7FB3FF]/60">Email</p>
                      <p className="text-white font-semibold break-all">{booking.email}</p>
                    </div>
                    <div>
                      <p className="text-[#7FB3FF]/60">Phone</p>
                      <p className="text-white font-semibold">{booking.phone}</p>
                    </div>
                    <div>
                      <p className="text-[#7FB3FF]/60">Country</p>
                      <p className="text-white font-semibold">{booking.country}</p>
                    </div>
                    {booking.client_id && (
                      <div>
                        <p className="text-[#7FB3FF]/60">
                          {booking.client_id_type === 'passport' ? 'Passport' : 'National ID'}
                        </p>
                        <p className="text-white font-mono font-bold">{booking.client_id}</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Project Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-[#1a1a1a] border border-[#7B2FBE]/30 rounded-xl p-6"
                >
                  <h3 className="text-lg font-bold text-[#7B2FBE] mb-4">Project Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-[#7B2FBE]/60">Service</p>
                      <p className="text-white font-semibold">{booking.service}</p>
                    </div>
                    <div>
                      <p className="text-[#7B2FBE]/60">Budget</p>
                      <p className="text-white font-semibold">{booking.budget}</p>
                    </div>
                    <div>
                      <p className="text-[#7B2FBE]/60">Timeline</p>
                      <p className="text-white font-semibold">{booking.timeline}</p>
                    </div>
                    <div>
                      <p className="text-[#7B2FBE]/60">Status</p>
                      <p className={`font-semibold ${
                        booking.status === 'Pending' ? 'text-yellow-400' :
                        booking.status === 'Confirmed' ? 'text-blue-400' :
                        booking.status === 'Completed' ? 'text-green-400' :
                        'text-red-400'
                      }`}>
                        {booking.status}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Full Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#1a1a1a] border border-[#7FB3FF]/30 rounded-xl p-6"
              >
                <h3 className="text-lg font-bold text-[#7FB3FF] mb-4">Project Description</h3>
                <p className="text-white whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {booking.project_description}
                </p>
              </motion.div>

              {/* Metadata */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#1a1a1a] border border-[#7FB3FF]/30 rounded-xl p-6"
              >
                <h3 className="text-lg font-bold text-[#7FB3FF] mb-4">Booking Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#7FB3FF]/60">Booking ID:</span>
                    <span className="text-white font-mono">{booking.id.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7FB3FF]/60">Verification Code:</span>
                    <span className="text-white font-mono font-bold">{booking.verification_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7FB3FF]/60">Submitted:</span>
                    <span className="text-white">
                      {new Date(booking.created_at).toLocaleString('en-ZA')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7FB3FF]/60">Contact Method:</span>
                    <span className="text-white">{booking.contact_method}</span>
                  </div>
                </div>
              </motion.div>

              {/* Admin Note */}
              {booking.notes && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-[#1a1a1a] border border-[#FFA500]/30 rounded-xl p-6"
                >
                  <h3 className="text-lg font-bold text-[#FFA500] mb-4">Admin Notes</h3>
                  <p className="text-white text-sm whitespace-pre-wrap break-words">
                    {booking.notes}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 bg-[#1a1a1a]/50 border border-[#7FB3FF]/20 rounded-xl p-6 text-center"
        >
          <p className="text-[#7FB3FF]/60 text-sm mb-2">
            💡 Your verification code can be found in your booking confirmation PDF
          </p>
          <p className="text-[#7FB3FF]/40 text-xs">
            The code is used to verify project completion and track client information securely.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
