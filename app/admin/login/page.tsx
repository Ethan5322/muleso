'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAdmin } from '@/context/AdminContext';
// No 2FA helpers here on purpose. The code is generated, stored and verified
// entirely on the server — see app/api/admin/send-2fa and app/api/admin/login.
import QRCode from 'qrcode';
import Link from 'next/link';
import Image from 'next/image';

// Display only — "check your email (x)" on the 2FA step. Login no longer
// depends on this value: the server issues and verifies the code against its
// own ADMIN_EMAIL, so the two drifting apart can no longer reject a valid code.
// Setting NEXT_PUBLIC_ADMIN_EMAIL to match ADMIN_EMAIL only keeps the hint text
// accurate.
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'mulukenendashaw68@gmail.com';
const MAX_ATTEMPTS = 5;
const MAX_2FA_ATTEMPTS = 3;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

export default function AdminLogin() {
  const router = useRouter();
  const { setIsAdmin } = useAdmin();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [twoFactorAttempts, setTwoFactorAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [step, setStep] = useState<'password' | 'confirm' | 'twofa' | 'success'>('password');
  const [faceQr, setFaceQr] = useState('');

  // Generate a QR that opens the face-login page (scan with your phone)
  useEffect(() => {
    QRCode.toDataURL(`${window.location.origin}/admin/face-login`, { width: 300, margin: 1 })
      .then(setFaceQr)
      .catch(() => {});
  }, []);

  // Disable form autocomplete and cache
  useEffect(() => {
    // Clear any cached admin sessions on page load
    localStorage.removeItem('admin_session');

    // Disable autocomplete on inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('autocorrect', 'off');
      input.setAttribute('autocapitalize', 'off');
      input.setAttribute('spellcheck', 'false');
    });
  }, []);

  // Check localStorage for existing session and clear it
  useEffect(() => {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_attempts');
    localStorage.removeItem('admin_lockout');

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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lockedUntil && Date.now() < lockedUntil) {
      toast.error(`🔒 Account locked. Try again in ${countdown} seconds`);
      return;
    }

    if (!password || password.trim() === '') {
      toast.error('❌ Password cannot be empty');
      return;
    }

    if (password.length < 8) {
      toast.error('❌ Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    let valid = false;
    try {
      const res = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      // Server has no password configured — don't burn an attempt, explain it.
      if (data.configured === false) {
        toast.error('⚙️ Admin password is not set on the server. Add ADMIN_PASSWORD in Vercel and redeploy.');
        setLoading(false);
        return;
      }

      valid = data.valid === true;
    } catch (error) {
      console.error('Password verification error:', error);
      toast.error('❌ Could not reach the server. Please try again.');
      setLoading(false);
      return;
    }

    if (valid) {
      toast.success('✅ Password verified. Please confirm password.');
      setStep('confirm');
      setConfirmPassword('');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem('admin_attempts', newAttempts.toString());

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockUntilTime = Date.now() + LOCKOUT_TIME;
        setLockedUntil(lockUntilTime);
        localStorage.setItem('admin_lockout', lockUntilTime.toString());
        toast.error('🔒 Too many failed attempts. Account locked for 15 minutes');
        setPassword('');
      } else {
        const remaining = MAX_ATTEMPTS - newAttempts;
        toast.error(`❌ Incorrect password. ${remaining} attempts remaining`);
        setPassword('');
      }
    }

    setLoading(false);
  };

  const handleConfirmPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!confirmPassword || confirmPassword.trim() === '') {
      toast.error('❌ Please confirm your password');
      return;
    }

    if (confirmPassword !== password) {
      toast.error('❌ Passwords do not match. Please try again.');
      setConfirmPassword('');
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // Ask the server for a code. It generates it, stores it and emails it
      // against its own ADMIN_EMAIL — the browser never sees or chooses it.
      const sendResponse = await fetch('/api/admin/send-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const sendResult = await sendResponse.json();

      if (sendResponse.ok && sendResult.success) {
        toast.success('📧 2FA code sent to your email!');
        setStep('twofa');
        setTwoFactorCode('');
        setTwoFactorAttempts(0);
      } else {
        toast.error('❌ Failed to send 2FA code. Please try again.');
      }
    } catch (error) {
      console.error('Error sending 2FA code:', error);
      toast.error('❌ Error sending 2FA code');
    }

    setLoading(false);
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!twoFactorCode || twoFactorCode.trim() === '') {
      toast.error('❌ Please enter the 2FA code');
      return;
    }

    if (twoFactorCode.length !== 6) {
      toast.error('❌ Code must be 6 digits');
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // One round trip, one authority. The browser used to verify the code
      // itself first and only then call the server — so a client-side clock or
      // timezone difference could reject a code the server would have accepted,
      // and it always reported the failure as "Invalid code" whatever the real
      // reason was. The server is now the only thing that decides.
      const loginResponse = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: password,
          twoFactorCode: twoFactorCode.trim(),
        }),
      });

      const loginData = await loginResponse.json();

      if (loginData.success) {
        // Clear lockout/attempt counters
        localStorage.removeItem('admin_attempts');
        localStorage.removeItem('admin_lockout');

        // Set a client-side session marker so admin pages can render.
        // Real protection is the HTTP-only cookie validated by middleware.
        localStorage.setItem(
          'admin_session',
          JSON.stringify({ authenticated: true, timestamp: Date.now() })
        );

        setStep('success');
        toast.success('✅ Logged in successfully!');

        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push('/admin');
        return;
      }

      // A wrong password is not a wrong code — send the user back a step
      // instead of burning a 2FA attempt on it.
      if (loginResponse.status === 401 && /password/i.test(loginData.error || '')) {
        toast.error(`❌ ${loginData.error}`);
        setStep('password');
        setPassword('');
        setConfirmPassword('');
        setTwoFactorCode('');
        return;
      }

      const newAttempts = twoFactorAttempts + 1;
      setTwoFactorAttempts(newAttempts);

      if (newAttempts >= MAX_2FA_ATTEMPTS) {
        toast.error('❌ Too many failed attempts. Please try again later.');
        setStep('password');
        setPassword('');
        setConfirmPassword('');
        setTwoFactorCode('');
      } else {
        const remaining = MAX_2FA_ATTEMPTS - newAttempts;
        // Show what actually went wrong. "Invalid code" for an expired code
        // sent people hunting for a typo that was never there.
        toast.error(
          `❌ ${loginData.error || 'Invalid code'} — ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining`
        );
        setTwoFactorCode('');
      }
    } catch (error) {
      console.error('Error verifying 2FA code:', error);
      toast.error('❌ Error verifying code');
    }

    setLoading(false);
  };

  const isLocked = !!(lockedUntil && Date.now() < lockedUntil);

  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center px-4">
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#7FB3FF] rounded-full mix-blend-screen filter blur-3xl opacity-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#7B2FBE] rounded-full mix-blend-screen filter blur-3xl opacity-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-[#0a0a0a] border border-[#7FB3FF]/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(0,191,255,0.2)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-r from-[#7FB3FF] to-[#7B2FBE] rounded-lg mb-4">
              <Lock size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold font-sora text-white mb-2">
              Admin Panel
            </h1>
            <p className="text-[#7FB3FF] text-sm">MuleSoo Digital Services</p>
          </div>

          {/* Lockout Message */}
          {isLocked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/20 border border-red-500 rounded-lg p-6 text-center mb-8"
            >
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <p className="text-red-400 font-bold text-lg mb-2">🔒 Account Locked</p>
              <p className="text-red-300 text-sm">
                Too many failed attempts. Try again in {countdown} seconds
              </p>
            </motion.div>
          )}

          {/* Step 1: Password Entry */}
          {step === 'password' && !isLocked && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handlePasswordSubmit}
              className="space-y-6"
            >
              <div className="relative">
                <label className="block text-sm font-bold text-[var(--color-action-on-dark)] mb-2">
                  Step 1: Enter Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    placeholder="Enter your admin password"
                    autoComplete="off"
                    className="w-full bg-[#1a1a2e] border border-[#7FB3FF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#7FB3FF] focus:ring-2 focus:ring-[#7FB3FF]/50 transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-10 text-[#7FB3FF] hover:text-[#7B2FBE]"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-[#7FB3FF]/60 text-xs mt-2">
                  Must be exactly correct. Case-sensitive.
                </p>
              </div>

              {/* Attempts Warning */}
              {attempts > 0 && attempts < MAX_ATTEMPTS && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4"
                >
                  <p className="text-yellow-400 text-sm font-semibold">
                    ⚠️ {MAX_ATTEMPTS - attempts} attempt{MAX_ATTEMPTS - attempts !== 1 ? 's' : ''} remaining
                  </p>
                </motion.div>
              )}

              {/* Login Button */}
              <motion.button
                whileHover={{ scale: !loading ? 1.02 : 1 }}
                whileTap={{ scale: !loading ? 0.98 : 1 }}
                type="submit"
                disabled={loading || !password}
                className="w-full bg-gradient-to-r from-[#7FB3FF] to-[#7B2FBE] text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-[#7FB3FF]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Continue to Confirmation'}
              </motion.button>
            </motion.form>
          )}

          {/* Step 2: Confirm Password */}
          {step === 'confirm' && !isLocked && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleConfirmPassword}
              className="space-y-6"
            >
              <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
                <p className="text-blue-300 text-sm font-semibold">
                  ✓ Password Step 1 Verified
                </p>
              </div>

              <div className="relative">
                <label className="block text-sm font-bold text-[#7FB3FF] mb-2">
                  Step 2: Confirm Password (Re-enter)
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    placeholder="Re-enter your password to confirm"
                    autoComplete="off"
                    className="w-full bg-[#1a1a2e] border border-[#7FB3FF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#7FB3FF] focus:ring-2 focus:ring-[#7FB3FF]/50 transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-10 text-[#7FB3FF] hover:text-[var(--color-action-on-dark)]"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-[#7FB3FF]/60 text-xs mt-2">
                  Must match exactly. This is a security verification step.
                </p>
              </div>

              {confirmPassword && confirmPassword === password && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-500/20 border border-green-500 rounded-lg p-4 flex items-center gap-2"
                >
                  <CheckCircle size={20} className="text-green-400" />
                  <p className="text-green-400 text-sm font-semibold">
                    Passwords match! Ready to login.
                  </p>
                </motion.div>
              )}

              {confirmPassword && confirmPassword !== password && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-500/20 border border-red-500 rounded-lg p-4 flex items-center gap-2"
                >
                  <AlertCircle size={20} className="text-red-400" />
                  <p className="text-red-400 text-sm font-semibold">
                    Passwords do not match
                  </p>
                </motion.div>
              )}

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: !loading ? 1.02 : 1 }}
                  whileTap={{ scale: !loading ? 0.98 : 1 }}
                  type="button"
                  onClick={() => {
                    setStep('password');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  disabled={loading}
                  className="flex-1 bg-[#7FB3FF]/20 hover:bg-[#7FB3FF]/30 text-[#7FB3FF] font-bold py-3 rounded-lg transition-all disabled:opacity-50"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: !loading && confirmPassword === password ? 1.02 : 1 }}
                  whileTap={{ scale: !loading && confirmPassword === password ? 0.98 : 1 }}
                  type="submit"
                  disabled={loading || confirmPassword !== password}
                  className="flex-1 bg-gradient-to-r from-[#1D4ED8] to-[#7FB3FF] text-black font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-[#7FB3FF]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </motion.button>
              </div>
            </motion.form>
          )}

          {/* Step 3: Two-Factor Authentication */}
          {step === 'twofa' && !isLocked && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleTwoFactorSubmit}
              className="space-y-6"
            >
              <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-blue-300" />
                  <p className="text-blue-300 text-sm font-semibold">
                    ✓ Password Verified. Check your email for 2FA code.
                  </p>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-bold text-[var(--color-action-on-dark)] mb-2">
                  Step 3: Enter 6-Digit 2FA Code
                </label>
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  disabled={loading}
                  placeholder="000000"
                  maxLength={6}
                  autoComplete="off"
                  inputMode="numeric"
                  className="w-full bg-[#1a1a2e] border border-[var(--color-action-on-dark)]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[var(--color-action-on-dark)] focus:ring-2 focus:ring-[var(--color-action-on-dark)]/50 transition-all text-center text-2xl tracking-widest disabled:opacity-50 font-mono"
                />
                <p className="text-[var(--color-action-on-dark)]/60 text-xs mt-2">
                  Check your email ({ADMIN_EMAIL}) for the code. It expires in 10 minutes.
                </p>
              </div>

              {twoFactorAttempts > 0 && twoFactorAttempts < MAX_2FA_ATTEMPTS && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4"
                >
                  <p className="text-yellow-400 text-sm font-semibold">
                    ⚠️ {MAX_2FA_ATTEMPTS - twoFactorAttempts} attempt{MAX_2FA_ATTEMPTS - twoFactorAttempts !== 1 ? 's' : ''} remaining
                  </p>
                </motion.div>
              )}

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: !loading ? 1.02 : 1 }}
                  whileTap={{ scale: !loading ? 0.98 : 1 }}
                  type="button"
                  onClick={() => {
                    setStep('confirm');
                    setTwoFactorCode('');
                    setTwoFactorAttempts(0);
                  }}
                  disabled={loading}
                  className="flex-1 bg-[#7FB3FF]/20 hover:bg-[#7FB3FF]/30 text-[#7FB3FF] font-bold py-3 rounded-lg transition-all disabled:opacity-50"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: !loading && twoFactorCode.length === 6 ? 1.02 : 1 }}
                  whileTap={{ scale: !loading && twoFactorCode.length === 6 ? 0.98 : 1 }}
                  type="submit"
                  disabled={loading || twoFactorCode.length !== 6}
                  className="flex-1 bg-gradient-to-r from-[#7FB3FF] to-[#7B2FBE] text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-[#7FB3FF]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </motion.button>
              </div>
            </motion.form>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle size={32} className="text-green-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
              <p className="text-[#7FB3FF]/60">Admin panel is loading...</p>
            </motion.div>
          )}

          {/* Face login */}
          {step === 'password' && (
            <div className="mt-8 pt-6 border-t border-[#7FB3FF]/20 text-center">
              <p className="text-[#7FB3FF]/80 text-sm font-semibold mb-3">Or sign in with Face</p>
              {faceQr && (
                <div className="flex flex-col items-center">
                  <div className="inline-block bg-white p-2 rounded-xl mb-3">
                    <Image src={faceQr} alt="Scan to open Face Login on your phone" width={140} height={140} />
                  </div>
                  <p className="text-[var(--color-action-on-dark)]/50 text-xs mb-3">📱 Scan with your phone to capture your face</p>
                  <a
                    href={faceQr}
                    download="mulesoo-admin-face-login-qr.png"
                    className="inline-flex items-center gap-2 mb-3 px-4 py-2 rounded-lg bg-[var(--color-action-primary)]/15 border border-[var(--color-action-on-dark)]/40 text-[var(--color-action-on-dark)] hover:bg-[var(--color-action-primary)]/25 text-sm font-semibold transition-all"
                  >
                    ⬇ Download QR Code
                  </a>
                </div>
              )}
              <Link
                href="/admin/face-login"
                className="inline-block text-[var(--color-action-on-dark)] hover:underline text-sm font-semibold"
              >
                Use Face Login on this device →
              </Link>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-[#7FB3FF]/20">
            <p className="text-center text-[#7FB3FF]/60 text-xs">
              🔐 Enterprise-Grade Security • Two-Step Verification
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
