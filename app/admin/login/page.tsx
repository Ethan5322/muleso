'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const ADMIN_PASSWORD = 'MuleSoo2024!';
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 10 * 60 * 1000; // 10 minutes

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Check localStorage for existing session
  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (session) {
      const sessionData = JSON.parse(session);
      if (sessionData.timestamp && Date.now() - sessionData.timestamp < 24 * 60 * 60 * 1000) {
        router.push('/admin');
      }
    }

    // Check for lockout
    const lockoutTime = localStorage.getItem('admin_lockout');
    if (lockoutTime) {
      const lockUntil = parseInt(lockoutTime);
      if (Date.now() < lockUntil) {
        setLockedUntil(lockUntil);
      } else {
        localStorage.removeItem('admin_lockout');
        localStorage.removeItem('admin_attempts');
      }
    }

    // Load attempts
    const savedAttempts = localStorage.getItem('admin_attempts');
    if (savedAttempts) {
      setAttempts(parseInt(savedAttempts));
    }
  }, [router]);

  // Countdown timer
  useEffect(() => {
    if (!lockedUntil) return;

    const timer = setInterval(() => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining > 0) {
        setCountdown(remaining);
      } else {
        setLockedUntil(null);
        setCountdown(0);
        setAttempts(0);
        localStorage.removeItem('admin_lockout');
        localStorage.removeItem('admin_attempts');
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lockedUntil]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lockedUntil && Date.now() < lockedUntil) {
      toast.error(`Account locked. Try again in ${countdown} seconds`);
      return;
    }

    if (!password) {
      toast.error('Please enter a password');
      return;
    }

    setLoading(true);

    // Simulate delay for security
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (password === ADMIN_PASSWORD) {
      // Correct password
      const session = {
        authenticated: true,
        timestamp: Date.now(),
      };
      localStorage.setItem('admin_session', JSON.stringify(session));
      localStorage.removeItem('admin_attempts');
      localStorage.removeItem('admin_lockout');
      toast.success('✅ Login successful!');
      router.push('/admin');
    } else {
      // Wrong password
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem('admin_attempts', newAttempts.toString());

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockUntilTime = Date.now() + LOCKOUT_TIME;
        setLockedUntil(lockUntilTime);
        localStorage.setItem('admin_lockout', lockUntilTime.toString());
        toast.error('🔒 Account locked for 10 minutes due to too many failed attempts');
      } else {
        const remaining = MAX_ATTEMPTS - newAttempts;
        toast.error(`❌ Incorrect password. ${remaining} attempts remaining`);
      }
    }

    setPassword('');
    setLoading(false);
  };

  const isLocked = lockedUntil && Date.now() < lockedUntil;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00BFFF] rounded-full mix-blend-screen filter blur-3xl opacity-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#7B2FBE] rounded-full mix-blend-screen filter blur-3xl opacity-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-[#0a0a0a] border border-[#00BFFF]/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(0,191,255,0.2)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-r from-[#00BFFF] to-[#7B2FBE] rounded-lg mb-4">
              <Lock size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold font-sora text-white mb-2">
              Admin Panel
            </h1>
            <p className="text-[#00BFFF] text-sm">MuleSoo Digital Services</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Password Input */}
            <div className="relative">
              <label className="block text-sm font-semibold text-white mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLocked}
                  placeholder="Enter password"
                  className="w-full bg-[#1a1a1a] border border-[#00BFFF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00BFFF] transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-[#00BFFF] hover:text-[#7B2FBE]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Lockout Warning */}
            {isLocked && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-center">
                <p className="text-red-400 font-semibold">
                  🔒 Account Locked
                </p>
                <p className="text-red-300 text-sm mt-1">
                  Try again in {countdown} seconds
                </p>
              </div>
            )}

            {/* Attempts Warning */}
            {!isLocked && attempts > 0 && attempts < MAX_ATTEMPTS && (
              <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 text-center">
                <p className="text-yellow-400 text-sm">
                  {MAX_ATTEMPTS - attempts} attempts remaining
                </p>
              </div>
            )}

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: !isLocked && !loading ? 1.02 : 1 }}
              whileTap={{ scale: !isLocked && !loading ? 0.98 : 1 }}
              type="submit"
              disabled={isLocked || loading}
              className="w-full bg-gradient-to-r from-[#00BFFF] to-[#7B2FBE] text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-[#00BFFF]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : isLocked ? 'Account Locked' : 'Login'}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-[#00BFFF]/20">
            <p className="text-center text-[#00BFFF]/60 text-xs">
              🔐 Secure Admin Access Only
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
