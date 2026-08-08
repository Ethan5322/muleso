'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, QrCode } from 'lucide-react';

export default function QrLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Signing you in…');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) {
      setStatus('Missing QR token.');
      setFailed(true);
      return;
    }
    (async () => {
      try {
        const res = await fetch('/corporate/api/login/qr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        if (res.ok) {
          router.replace('/corporate');
          router.refresh();
        } else {
          const d = await res.json().catch(() => ({}));
          setStatus(d.error || 'Login failed.');
          setFailed(true);
        }
      } catch {
        setStatus('Something went wrong.');
        setFailed(true);
      }
    })();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-action-primary)] to-[#7B2FFF] flex items-center justify-center mx-auto mb-4">
          {failed ? <QrCode className="text-white" size={26} /> : <Loader2 className="text-white animate-spin" size={26} />}
        </div>
        <p className="text-[#F0F2FA] font-semibold">{status}</p>
        {failed && (
          <a href="/corporate/login" className="text-[var(--color-action-on-dark)] text-sm hover:underline mt-3 inline-block">
            Go to sign-in →
          </a>
        )}
      </div>
    </div>
  );
}
