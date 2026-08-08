'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllAuditLogs, downloadAuditLogsCSV, AuditLogEntry } from '@/lib/auditLog';

// Mirrors the server's ADMIN_EMAIL env var (see app/admin/login/page.tsx).
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'mulukenendashaw68@gmail.com';

export default function AdminSettingsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [changing, setChanging] = useState(false);

  const changePassword = async () => {
    if (newPw.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (newPw !== confirmPw) {
      toast.error('New passwords do not match');
      return;
    }
    setChanging(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password');
      toast.success('✅ Password changed. Use it next time you log in.');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setChanging(false);
    }
  };

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await getAllAuditLogs(100);
      setLogs(data);
    } catch {
      toast.error('Failed to load activity log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const statusColor = (s?: string) => (s === 'SUCCESS' ? 'text-emerald-400' : 'text-red-400');

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 font-sora">Settings</h2>
        <p className="text-[#7A8BA8]">Account, security, and activity</p>
      </div>

      {/* Account */}
      <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">⚙️ Account</h3>
        <label className="block text-[#7A8BA8] text-sm mb-2">Admin Email</label>
        <input
          type="email"
          disabled
          aria-label="Admin email"
          value={ADMIN_EMAIL}
          className="w-full bg-[#1A2332] border border-[#1E3A5F] text-[var(--color-action-on-dark)] py-2 px-4 rounded-lg text-sm"
        />
        <p className="text-xs text-[#7A8BA8] mt-3">
          🔐 Protected by email 2FA. Change your password below — it&apos;s stored securely (hashed) and
          takes effect immediately, no redeploy needed.
        </p>
      </div>

      {/* Change Password */}
      <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">🔑 Change Password</h3>
        <div className="space-y-3 max-w-md">
          <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="Current password" autoComplete="current-password" className="w-full bg-[#1A2332] border border-[#1E3A5F] text-white py-2.5 px-4 rounded-lg text-sm focus:outline-none focus:border-[var(--color-action-on-dark)]" />
          <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="New password (min 8 chars)" autoComplete="new-password" className="w-full bg-[#1A2332] border border-[#1E3A5F] text-white py-2.5 px-4 rounded-lg text-sm focus:outline-none focus:border-[var(--color-action-on-dark)]" />
          <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Confirm new password" autoComplete="new-password" className="w-full bg-[#1A2332] border border-[#1E3A5F] text-white py-2.5 px-4 rounded-lg text-sm focus:outline-none focus:border-[var(--color-action-on-dark)]" />
          <button
            type="button"
            onClick={changePassword}
            disabled={changing || !currentPw || !newPw}
            className="bg-gradient-to-r from-[var(--color-action-primary)] to-[#7B2FFF] text-white font-bold py-2.5 px-6 rounded-lg text-sm disabled:opacity-50"
          >
            {changing ? 'Changing…' : 'Change Password'}
          </button>
        </div>
      </div>

      {/* Face Login */}
      <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-2">🙂 Face Login</h3>
        <p className="text-[#7A8BA8] text-sm mb-4">
          Register your face to sign in by camera from your phone. Scan the QR on the login page to use it.
        </p>
        <a
          href="/admin/face-enroll"
          className="inline-block bg-[#1A2332] hover:bg-[#253345] border border-[#1E3A5F] text-[var(--color-action-on-dark)] py-2 px-4 rounded-lg font-semibold transition-all"
        >
          Set up / Re-enroll Face
        </a>
      </div>

      {/* Activity Log */}
      <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#00FF88]" /> Activity & Login History
          </h3>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              onClick={loadLogs}
              className="flex items-center gap-2 bg-[#1A2332] hover:bg-[#253345] border border-[#1E3A5F] text-[var(--color-action-on-dark)] py-2 px-3 rounded-lg text-sm font-semibold"
            >
              <RefreshCw size={15} /> Refresh
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              onClick={() => (logs.length ? downloadAuditLogsCSV(logs) : toast.error('No logs to export'))}
              className="flex items-center gap-2 bg-[#00FF88]/20 hover:bg-[#00FF88]/30 border border-[#00FF88] text-[#00FF88] py-2 px-3 rounded-lg text-sm font-semibold"
            >
              <Download size={15} /> Export CSV
            </motion.button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[420px] overflow-y-auto rounded-lg border border-[#1E3A5F]">
          <table className="w-full text-sm">
            <thead className="bg-[#1A2332] sticky top-0">
              <tr>
                <th className="text-left px-4 py-3 text-[#7A8BA8] font-semibold">Time</th>
                <th className="text-left px-4 py-3 text-[#7A8BA8] font-semibold">Action</th>
                <th className="text-left px-4 py-3 text-[#7A8BA8] font-semibold">Status</th>
                <th className="text-left px-4 py-3 text-[#7A8BA8] font-semibold">IP</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-[#7A8BA8]">Loading…</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-[#7A8BA8]">No activity recorded yet.</td></tr>
              ) : (
                logs.map((log, i) => (
                  <tr key={i} className="border-t border-[#1E3A5F]">
                    <td className="px-4 py-2.5 text-[#7A8BA8] whitespace-nowrap">
                      {log.created_at ? new Date(log.created_at).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-white">{log.action_type}</td>
                    <td className={`px-4 py-2.5 font-semibold ${statusColor(log.status)}`}>{log.status}</td>
                    <td className="px-4 py-2.5 text-[#7A8BA8]">{log.ip_address || 'unknown'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">ℹ️ System Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-[#7A8BA8]"><span>Version</span><span className="text-[var(--color-action-on-dark)]">1.0.0</span></div>
          <div className="flex justify-between text-[#7A8BA8]"><span>Two-Factor Auth</span><span className="text-emerald-400">✓ Enabled</span></div>
          <div className="flex justify-between text-[#7A8BA8]"><span>Admin Writes</span><span className="text-emerald-400">✓ Server-guarded</span></div>
        </div>
      </div>
    </div>
  );
}
