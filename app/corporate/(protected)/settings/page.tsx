'use client';

import { useEffect, useState } from 'react';
import FaceCapture, { type FaceCaptureResult } from '@/components/corp/FaceCapture';
import { ScanFace, CheckCircle2, Loader2 } from 'lucide-react';

export default function CorporateSettings() {
  const [enrolled, setEnrolled] = useState<boolean | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    try {
      const r = await fetch('/corporate/api/my-face');
      if (r.ok) setEnrolled((await r.json()).enrolled);
    } catch {
      setEnrolled(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCapture = async (r: FaceCaptureResult) => {
    setSaving(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch('/corporate/api/my-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descriptors: r.descriptors, photo: r.photo }),
      });
      if (res.ok) {
        setMsg('✓ Face enrolled. You can now sign in with Face on the login screen.');
        setEnrolling(false);
        setEnrolled(true);
      } else {
        const d = await res.json().catch(() => ({}));
        setErr(d.error || 'Could not enrol your face.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-sora">My Settings</h1>
        <p className="text-[#A8B2D0] text-sm mt-1">Manage your biometric sign-in.</p>
      </div>

      <div className="bg-[#0A0F1E] border border-[#1A2640] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-10 rounded-lg bg-[#00C8FF]/10 text-[#00C8FF] flex items-center justify-center">
            <ScanFace size={20} />
          </span>
          <div>
            <h2 className="font-semibold font-sora text-sm">Face sign-in</h2>
            <p className="text-xs text-[#6E7A91]">
              {enrolled === null ? 'Checking…' : enrolled ? 'Enrolled — you can log in with Face.' : 'Not set up yet — log in by password, code, or QR until you enrol.'}
            </p>
          </div>
          {enrolled && (
            <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[#00FF88]">
              <CheckCircle2 size={14} /> Active
            </span>
          )}
        </div>

        {msg && <p className="text-sm text-[#00FF88] mb-3">{msg}</p>}
        {err && <p className="text-sm text-red-400 mb-3">{err}</p>}

        {!enrolling ? (
          <button
            type="button"
            onClick={() => { setEnrolling(true); setMsg(null); setErr(null); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white font-bold font-sora text-sm"
          >
            <ScanFace size={16} /> {enrolled ? 'Re-enrol my face' : 'Enrol my face'}
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-[#A8B2D0]">Center your face in the oval; it captures automatically.</p>
            <FaceCapture mode="register" onCapture={onCapture} />
            {saving && (
              <p className="text-xs text-[#00C8FF] flex items-center gap-1">
                <Loader2 className="animate-spin" size={12} /> Saving…
              </p>
            )}
            <button type="button" onClick={() => setEnrolling(false)} className="text-xs text-[#6E7A91] hover:text-white">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
