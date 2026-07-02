'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCorpBrowserClient } from '@/lib/corp/supabaseBrowser';
import FaceCapture, { type FaceCaptureResult } from '@/components/corp/FaceCapture';
import { Building2, Loader2, KeyRound, ScanFace, Hash } from 'lucide-react';

type Method = 'password' | 'face' | 'code';

export default function CorporateLoginPage() {
  const router = useRouter();
  const [method, setMethod] = useState<Method>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const goIn = () => {
    router.replace('/corporate');
    router.refresh();
  };

  const passwordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createCorpBrowserClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        setError(signInError.message || 'Sign-in failed.');
        setLoading(false);
        return;
      }
      const { data: admin } = await supabase
        .from('corp_department_admins')
        .select('status')
        .eq('id', data.user?.id)
        .maybeSingle();
      if (!admin) {
        await supabase.auth.signOut();
        setError('This account is not a corporate admin.');
        setLoading(false);
        return;
      }
      if (admin.status !== 'active') {
        await supabase.auth.signOut();
        setError('Your access has been suspended.');
        setLoading(false);
        return;
      }
      goIn();
    } catch {
      setError('Something went wrong.');
      setLoading(false);
    }
  };

  const codeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/corporate/api/login/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    if (res.ok) goIn();
    else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || 'Invalid code.');
      setLoading(false);
    }
  };

  const faceLogin = async (r: FaceCaptureResult) => {
    setLoading(true);
    setError(null);
    const res = await fetch('/corporate/api/login/face', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descriptors: r.descriptors }),
    });
    if (res.ok) goIn();
    else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || 'Face not recognised.');
      setLoading(false);
    }
  };

  const tabs: { id: Method; label: string; icon: typeof KeyRound }[] = [
    { id: 'password', label: 'Password', icon: KeyRound },
    { id: 'face', label: 'Face', icon: ScanFace },
    { id: 'code', label: 'Code', icon: Hash },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00C8FF] to-[#7B2FFF] flex items-center justify-center mx-auto mb-4">
            <Building2 className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold font-sora">MuleSoo Corporate</h1>
          <p className="text-sm text-[#A8B2D0] mt-1">Department admin sign-in</p>
        </div>

        {/* Method tabs */}
        <div className="flex gap-1 bg-[#0A0F1E] border border-[#1A2640] rounded-lg p-1 mb-4">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => { setMethod(t.id); setError(null); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-colors ${
                  method === t.id ? 'bg-[#00C8FF]/15 text-[#00C8FF]' : 'text-[#A8B2D0] hover:text-white'
                }`}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="bg-[#0A0F1E] border border-[#1A2640] rounded-2xl p-6">
          {method === 'password' && (
            <form onSubmit={passwordLogin} className="space-y-4">
              <input
                type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
                className="w-full px-4 py-2.5 bg-[#0D1528] border border-[#1A2640] rounded-lg text-[#F0F2FA] focus:outline-none focus:border-[#00C8FF]"
              />
              <input
                type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
                className="w-full px-4 py-2.5 bg-[#0D1528] border border-[#1A2640] rounded-lg text-[#F0F2FA] focus:outline-none focus:border-[#00C8FF]"
              />
              <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white font-bold font-sora flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign in'}
              </button>
            </form>
          )}

          {method === 'face' && (
            <div className="space-y-3">
              <p className="text-xs text-[#A8B2D0]">Look at the camera and scan your face to sign in.</p>
              <FaceCapture mode="login" onCapture={faceLogin} />
              {loading && (
                <p className="text-xs text-[#00C8FF] flex items-center gap-1"><Loader2 className="animate-spin" size={12} /> Recognising…</p>
              )}
            </div>
          )}

          {method === 'code' && (
            <form onSubmit={codeLogin} className="space-y-4">
              <p className="text-xs text-[#A8B2D0]">Enter the verification code printed on your ID card.</p>
              <input
                type="text" placeholder="XXXX-XXXX-XXXX" value={code} onChange={(e) => setCode(e.target.value)} required
                className="w-full px-4 py-2.5 bg-[#0D1528] border border-[#1A2640] rounded-lg text-[#F0F2FA] tracking-widest font-mono focus:outline-none focus:border-[#00C8FF]"
              />
              <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white font-bold font-sora flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign in with code'}
              </button>
            </form>
          )}

          {error && (
            <div className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[#6E7A91] mt-6">
          Or scan the QR code on your ID card to log in instantly.
        </p>
      </div>
    </div>
  );
}
