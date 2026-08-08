'use client';

import { useEffect, useState } from 'react';
import FaceCapture, { type FaceCaptureResult } from '@/components/corp/FaceCapture';
import { imageToIdData } from '@/lib/faceClient';
import { generateIdCard } from '@/lib/corp/generateIdCard';
import { ScanFace, CheckCircle2, Loader2, IdCard } from 'lucide-react';

export default function CorporateSettings() {
  const [enrolled, setEnrolled] = useState<boolean | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [mode, setMode] = useState<'capture' | 'upload'>('capture');
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

  const enrol = async (descriptors: number[][], photo: string | null) => {
    setSaving(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch('/corporate/api/my-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descriptors, photo }),
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

  const onCapture = (r: FaceCaptureResult) => enrol(r.descriptors, r.photo);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    setErr(null);
    const reader = new FileReader();
    reader.onload = async () => {
      setSaving(true);
      try {
        const { photo, descriptor } = await imageToIdData(reader.result as string);
        if (!descriptor) {
          setSaving(false);
          setErr('No face detected in that photo. Use a clear, front-facing photo or use the live camera.');
          return;
        }
        await enrol([descriptor], photo);
      } catch {
        // Image decoding / face-model load can throw. Without this the spinner
        // never stops and the enrol controls stay disabled.
        setSaving(false);
        setErr('That photo could not be processed. Try a different one, or use the live camera.');
      }
    };
    reader.readAsDataURL(file);
  };

  const downloadMyCard = async () => {
    try {
      const r = await fetch('/corporate/api/my-id-card');
      if (!r.ok) return;
      const { card } = await r.json();
      await generateIdCard(card);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-sora">My Settings</h1>
        <p className="text-[#A8B2D0] text-sm mt-1">Manage your biometric sign-in and ID card.</p>
      </div>

      {/* Biometric */}
      <div className="bg-[#0A0F1E] border border-[#1A2640] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-10 rounded-lg bg-[var(--color-action-primary)]/10 text-[var(--color-action-primary)] flex items-center justify-center">
            <ScanFace size={20} />
          </span>
          <div>
            <h2 className="font-semibold font-sora text-sm">Face sign-in</h2>
            <p className="text-xs text-[#8FA0BE]">
              {enrolled === null ? 'Checking…' : enrolled ? 'Enrolled — you can log in with Face.' : 'Not set up — log in by password, code, or QR until you enrol.'}
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
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[var(--color-action-primary)] to-[#7B2FFF] text-white font-bold font-sora text-sm"
          >
            <ScanFace size={16} /> {enrolled ? 'Re-enrol my face' : 'Enrol my face'}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode('capture')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold border ${mode === 'capture' ? 'bg-[var(--color-action-primary)]/15 text-[var(--color-action-primary)] border-[var(--color-action-primary)]/50' : 'border-[#1A2640] text-[#8A9AB8]'}`}
              >
                Live camera
              </button>
              <button
                type="button"
                onClick={() => setMode('upload')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold border ${mode === 'upload' ? 'bg-[var(--color-action-primary)]/15 text-[var(--color-action-primary)] border-[var(--color-action-primary)]/50' : 'border-[#1A2640] text-[#8A9AB8]'}`}
              >
                From gallery
              </button>
            </div>

            {mode === 'capture' ? (
              <>
                <p className="text-xs text-[#A8B2D0]">Center your face in the oval; it captures automatically.</p>
                <FaceCapture mode="register" onCapture={onCapture} />
              </>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onFile(e.target.files?.[0])}
                title="Upload a clear front-facing photo"
                className="block w-full text-xs text-[#A8B2D0] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[var(--color-action-primary)]/15 file:text-[var(--color-action-primary)] file:font-semibold"
              />
            )}

            {saving && (
              <p className="text-xs text-[var(--color-action-primary)] flex items-center gap-1"><Loader2 className="animate-spin" size={12} /> Saving…</p>
            )}
            <button type="button" onClick={() => setEnrolling(false)} className="text-xs text-[#8FA0BE] hover:text-white">
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* ID card */}
      <div className="bg-[#0A0F1E] border border-[#1A2640] rounded-xl p-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold font-sora text-sm">My staff ID card</h2>
          <p className="text-xs text-[#8FA0BE]">Download your badge (photo, staff no., verification code, QR).</p>
        </div>
        <button
          type="button"
          onClick={downloadMyCard}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#E8B84B] to-[#FFC107] text-black font-bold font-sora text-sm"
        >
          <IdCard size={16} /> Download
        </button>
      </div>
    </div>
  );
}
