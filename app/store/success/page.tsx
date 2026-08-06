'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, Download, XCircle } from 'lucide-react';
import { buyerPassword, HIDE_PASSWORD_FROM_BUYER } from '@/lib/maskSecret';

export default function SuccessPage() {
  const [state, setState] = useState<'verifying' | 'done' | 'error'>('verifying');
  const [message, setMessage] = useState('Confirming your payment…');
  const [productName, setProductName] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference') || params.get('trxref') || '';
    const product = params.get('product') || '';

    if (!reference) {
      setState('error');
      setMessage('No payment reference found. If money left your account, contact us on WhatsApp.');
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/store/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference, product }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data.success) {
          setState('done');
          setProductName(data.product?.name || 'your guide');
          if (data.password) setPassword(data.password);
          const slug = data.product?.slug || product;
          if (slug) {
            setDownloadUrl(`/api/store/download?reference=${encodeURIComponent(reference)}&product=${encodeURIComponent(slug)}`);
          }
        } else {
          setState('error');
          setMessage(data.error || 'We could not verify your payment. Please contact us on WhatsApp.');
        }
      } catch {
        if (!cancelled) {
          setState('error');
          setMessage('Payment verification failed. If money left your account, contact us on WhatsApp.');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center max-w-2xl mx-auto">
        {state === 'verifying' && (
          <>
            <Loader2 size={72} className="text-[var(--accent-gold)] animate-spin mx-auto mb-8" />
            <h1 className="text-3xl font-bold font-sora mb-2">{message}</h1>
            <p className="text-[var(--text-secondary)]">This only takes a moment.</p>
          </>
        )}

        {state === 'done' && (
          <>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.6, delay: 0.2 }} className="text-7xl mb-8">
              ✅
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold gradient-text font-sora mb-6">Payment Confirmed! 🎉</h1>
            <p className="text-xl text-[var(--text-secondary)] mb-2">
              Thank you for buying <strong className="text-[var(--text-primary)]">{productName}</strong>.
            </p>
            <p className="text-[var(--text-secondary)] mb-6">Download it below — a copy is also on its way to your email.</p>

            {password && (
              <div className="max-w-md mx-auto mb-8 rounded-xl border border-[var(--accent-gold)]/50 bg-[var(--bg-card)] p-4">
                <p className="text-xs text-[var(--text-secondary)] mb-1">🔒 Your PDF opens with this password:</p>
                {/* Both this and the buyer's email read HIDE_PASSWORD_FROM_BUYER,
                    so they always agree. See lib/maskSecret.ts. */}
                <p className="text-2xl font-bold font-sora gold-text tracking-widest">{buyerPassword(password)}</p>
                {HIDE_PASSWORD_FROM_BUYER ? (
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                    Message us on{' '}
                    <a
                      href="https://wa.me/27688529333"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent-green)] underline"
                    >
                      WhatsApp
                    </a>{' '}
                    with your reference and we&apos;ll send the rest of the password straight away.
                  </p>
                ) : (
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                    It&apos;s also in your email. Your copy is watermarked to you — please don&apos;t share it.
                  </p>
                )}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {downloadUrl && (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <a
                    href={downloadUrl}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[var(--accent-gold)] to-[#FFD777] text-black font-bold font-sora rounded-lg shadow-lg hover:shadow-[0_0_25px_rgba(232,184,75,0.5)] transition-shadow"
                  >
                    <Download size={18} /> Download Your Guide
                  </a>
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/store" className="inline-block px-8 py-3 border-2 border-[var(--accent-blue)] text-[var(--accent-blue)] font-bold font-sora rounded-lg hover:bg-[var(--glow-blue)] hover:shadow-lg hover:shadow-[var(--glow-blue)]/50 transition-all">
                  Explore More Guides
                </Link>
              </motion.div>
            </div>
          </>
        )}

        {state === 'error' && (
          <>
            <XCircle size={72} className="text-red-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold font-sora mb-3">We couldn&apos;t confirm your payment</h1>
            <p className="text-[var(--text-secondary)] mb-8">{message}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }}>
                <a href="https://wa.me/27688529333" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 bg-[#25D366] text-white font-bold rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-shadow">
                  Contact on WhatsApp
                </a>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/store" className="inline-block px-8 py-3 border-2 border-[var(--accent-blue)] text-[var(--accent-blue)] font-bold rounded-lg hover:bg-[var(--glow-blue)] hover:shadow-lg hover:shadow-[var(--glow-blue)]/50 transition-all">
                  Back to Store
                </Link>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
