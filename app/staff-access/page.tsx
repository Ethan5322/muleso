'use client';

import { useEffect, useState } from 'react';
import { Globe, ShieldCheck, Loader2, Building2 } from 'lucide-react';

export default function StaffAccessPage() {
  const [loginUrl, setLoginUrl] = useState<string | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) {
      setInvalid(true);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const r = await fetch(`/api/staff-access?token=${encodeURIComponent(token)}`);
        const d = await r.json();
        if (d.kind === 'main' || d.kind === 'corp') setLoginUrl(d.loginUrl);
        else setInvalid(true);
      } catch {
        setInvalid(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#050810] text-[#F0F2FA] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00C8FF] to-[#7B2FFF] flex items-center justify-center mx-auto mb-4">
            <Building2 className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold font-sora">MuleSoo Staff Access</h1>
          <p className="text-sm text-[#A8B2D0] mt-1">Where would you like to go?</p>
        </div>

        <div className="space-y-3">
          {/* Option A */}
          <a
            href="/"
            className="flex items-center gap-4 p-5 rounded-2xl glass-card border border-[var(--border)] hover:border-[var(--accent-blue)] transition-colors"
          >
            <span className="w-11 h-11 rounded-xl bg-[var(--glow-blue)] text-[var(--accent-blue)] flex items-center justify-center">
              <Globe size={22} />
            </span>
            <span>
              <span className="block font-bold font-sora">A · Public website</span>
              <span className="block text-xs text-[#A8B2D0]">Visit mulesoo.com</span>
            </span>
          </a>

          {/* Option B */}
          {loading ? (
            <div className="flex items-center gap-2 p-5 rounded-2xl glass-card border border-[var(--border)] text-[#A8B2D0] text-sm">
              <Loader2 className="animate-spin" size={16} /> Checking your ID…
            </div>
          ) : invalid ? (
            <div className="p-5 rounded-2xl border border-red-500/30 bg-red-500/10 text-sm text-red-400">
              This staff ID is not valid or access has been revoked.
            </div>
          ) : (
            <a
              href={loginUrl!}
              className="flex items-center gap-4 p-5 rounded-2xl border border-[var(--accent-gold)] bg-[var(--glow-gold)] hover:scale-[1.01] transition-transform"
            >
              <span className="w-11 h-11 rounded-xl bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] flex items-center justify-center">
                <ShieldCheck size={22} />
              </span>
              <span>
                <span className="block font-bold font-sora text-[var(--accent-gold)]">B · Admin panel</span>
                <span className="block text-xs text-[#A8B2D0]">Sign in to your dashboard</span>
              </span>
            </a>
          )}
        </div>

        <p className="text-center text-xs text-[#6E7A91] mt-8">Scanned from a MuleSoo staff ID card.</p>
      </div>
    </div>
  );
}
