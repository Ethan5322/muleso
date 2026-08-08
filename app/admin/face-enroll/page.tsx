'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle, Trash2 } from 'lucide-react';
import FaceScanner from '@/components/admin/FaceScanner';

const STEPS = [
  'Look straight at the camera',
  'Turn your head slightly LEFT',
  'Turn your head slightly RIGHT',
  'Tilt your head slightly UP',
];

export default function FaceEnrollPage() {
  const [busy, setBusy] = useState(false);
  const [enrolledCount, setEnrolledCount] = useState<number | null>(null);
  const [key, setKey] = useState(0); // remount scanner to restart

  const handleComplete = async (descriptors: number[][], photo?: string | null) => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/face-enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descriptors, photo }),
      });
      const data = await res.json();
      if (data.success) {
        setEnrolledCount(data.count);
        toast.success(`✅ Face enrolled (${data.count} samples). You can now log in by face.`);
      } else {
        toast.error(data.error || 'Enrollment failed');
        setKey((k) => k + 1);
      }
    } catch (error) {
      console.error('Enroll error:', error);
      toast.error('Could not save. Please try again.');
      setKey((k) => k + 1);
    } finally {
      setBusy(false);
    }
  };

  const clearEnrollment = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/face-enroll', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Enrollment cleared');
        setEnrolledCount(null);
        setKey((k) => k + 1);
      } else {
        toast.error(data.error || 'Could not clear');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl text-white">
      <Toaster position="top-center" />
      <h2 className="text-3xl font-bold font-sora mb-2">Enroll Your Face</h2>
      <p className="text-[#7A8BA8] mb-6">
        We capture a few angles so recognition stays reliable even with different lighting, makeup, or
        glasses. Follow the on-screen prompts.
      </p>

      {enrolledCount !== null ? (
        <div className="bg-[#0A0E17] border border-[#00FF88]/40 rounded-2xl p-8 text-center space-y-4">
          <CheckCircle className="text-[#00FF88] mx-auto" size={56} />
          <h3 className="text-xl font-bold">Face Enrolled</h3>
          <p className="text-[#7A8BA8]">
            {enrolledCount} samples saved. You can now sign in from{' '}
            <span className="text-[var(--color-action-on-dark)]">/admin/face-login</span> (or scan the QR on the login page).
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={() => {
                setEnrolledCount(null);
                setKey((k) => k + 1);
              }}
              className="bg-[#1A2332] hover:bg-[#253345] border border-[#1E3A5F] text-[var(--color-action-on-dark)] py-2 px-5 rounded-lg font-semibold"
            >
              Re-enroll
            </button>
            <button
              type="button"
              onClick={clearEnrollment}
              disabled={busy}
              className="flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 py-2 px-5 rounded-lg font-semibold disabled:opacity-50"
            >
              <Trash2 size={16} /> Clear Enrollment
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-2xl p-6">
          <FaceScanner
            key={key}
            mode="multi"
            steps={STEPS}
            busy={busy}
            onComplete={handleComplete}
          />
        </div>
      )}
    </div>
  );
}
