'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, XCircle, CheckCircle2 } from 'lucide-react';

/**
 * Where Paystack sends the browser back to after a client pays their deposit
 * via the link emailed from /api/chatbot-booking. Paystack appends `?reference=`
 * (and `trxref=`, its older alias) to whatever callback_url was set at
 * transaction/initialize time; bookingId/ref are our own query params from
 * that same URL, carried through untouched.
 *
 * Verification itself is not reimplemented here — it POSTs to the existing
 * /api/paystack/verify, the same endpoint the in-chat inline-popup flow has
 * used all along, so a deposit paid via email and one paid inline are checked
 * and recorded identically.
 */
export default function BookingPaySuccessPage() {
  const [state, setState] = useState<'verifying' | 'done' | 'error'>('verifying');
  const [message, setMessage] = useState('Confirming your payment…');
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference') || params.get('trxref') || '';
    const bookingId = params.get('bookingId') || '';
    const bookingReference = params.get('ref') || '';

    if (!reference) {
      setState('error');
      setMessage('No payment reference found. If money left your account, contact us on WhatsApp.');
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/paystack/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference, bookingId, bookingReference }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data.success) {
          setState('done');
          setAmount(typeof data.amount === 'number' ? data.amount : null);
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
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className="flex justify-center mb-8"
            >
              <CheckCircle2 size={72} strokeWidth={1.5} className="text-[var(--accent-green)]" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold gradient-text font-sora mb-6">Deposit received.</h1>
            <p className="text-xl text-[var(--text-secondary)] mb-2">
              {amount ? (
                <>Your deposit of <strong className="text-[var(--text-primary)]">R{amount.toLocaleString('en-ZA')}</strong> is confirmed.</>
              ) : (
                'Your deposit is confirmed.'
              )}
            </p>
            <p className="text-[var(--text-secondary)] mb-8">We&apos;ll be in touch on WhatsApp to get started.</p>
            <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
              <Link href="/" className="inline-block px-8 py-3 border-2 border-[var(--color-action-on-dark)] text-[var(--color-action-on-dark)] font-bold font-sora rounded-lg hover:bg-[var(--glow-action)] hover:shadow-lg hover:shadow-[var(--glow-action)]/50 transition-all">
                Back to MuleSoo
              </Link>
            </motion.div>
          </>
        )}

        {state === 'error' && (
          <>
            <XCircle size={72} className="text-red-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold font-sora mb-3">We couldn&apos;t confirm your payment</h1>
            <p className="text-[var(--text-secondary)] mb-8">{message}</p>
            <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
              <a href="https://wa.me/27688529333" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 bg-[#25D366] text-white font-bold rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-shadow">
                Contact on WhatsApp
              </a>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
