'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { ShieldCheck } from 'lucide-react';
import FaceScanner from '@/components/admin/FaceScanner';

export default function FaceLoginPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleCapture = async (descriptors: number[][]) => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/face-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descriptors }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem(
          'admin_session',
          JSON.stringify({ authenticated: true, timestamp: Date.now() })
        );
        toast.success('✅ Face recognized! Signing you in…');
        setTimeout(() => router.push('/admin'), 800);
      } else {
        toast.error(data.error || 'Face not recognized.');
      }
    } catch (error) {
      console.error('Face login error:', error);
      toast.error('Could not reach the server. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1624] text-white flex items-center justify-center px-4 py-12">
      <Toaster position="top-center" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00C8FF] to-[#7B2FFF] flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold font-sora">Face Login</h1>
          <p className="text-[#7A8BA8] text-sm mt-1">MuleSoo Admin — look at the camera to sign in</p>
        </div>

        <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-2xl p-6">
          <FaceScanner actionLabel="Scan My Face" busy={busy} onCapture={handleCapture} />
        </div>

        <p className="text-center text-sm text-[#7A8BA8] mt-6">
          Prefer a password?{' '}
          <Link href="/admin/login" className="text-[#00C8FF] hover:underline">
            Use password + 2FA
          </Link>
        </p>
      </div>
    </div>
  );
}
