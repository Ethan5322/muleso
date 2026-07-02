'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCorpBrowserClient } from '@/lib/corp/supabaseBrowser';
import { Building2, Loader2 } from 'lucide-react';

export default function CorporateLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
      // Verify this user is a registered, active corporate admin.
      const { data: admin } = await supabase
        .from('corp_department_admins')
        .select('status')
        .eq('id', data.user?.id)
        .maybeSingle();

      if (!admin) {
        await supabase.auth.signOut();
        setError('This account is not registered as a corporate admin.');
        setLoading(false);
        return;
      }
      if (admin.status !== 'active') {
        await supabase.auth.signOut();
        setError('Your access has been suspended. Contact the Super Admin.');
        setLoading(false);
        return;
      }

      router.replace('/corporate');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00C8FF] to-[#7B2FFF] flex items-center justify-center mx-auto mb-4">
            <Building2 className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold font-sora">MuleSoo Corporate</h1>
          <p className="text-sm text-[#A8B2D0] mt-1">Department admin sign-in</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-[#0A0F1E] border border-[#1A2640] rounded-2xl p-6">
          <div>
            <label className="block text-xs font-semibold text-[#A8B2D0] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-2.5 bg-[#0D1528] border border-[#1A2640] rounded-lg text-[#F0F2FA] focus:outline-none focus:border-[#00C8FF]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#A8B2D0] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-2.5 bg-[#0D1528] border border-[#1A2640] rounded-lg text-[#F0F2FA] focus:outline-none focus:border-[#00C8FF]"
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white font-bold font-sora flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-xs text-[#6E7A91] mt-6">
          Separate from the main site admin. Access is managed by the Super Admin.
        </p>
      </div>
    </div>
  );
}
