'use client';

import { useState } from 'react';
import FaceCapture, { type FaceCaptureResult } from '@/components/corp/FaceCapture';
import { imageToIdData } from '@/lib/faceClient';
import { generateIdCard } from '@/lib/corp/generateIdCard';
import { CAPABILITIES } from '@/lib/corp/constants';
import { Loader2, UserPlus, IdCard, X } from 'lucide-react';

interface RegisteredResult {
  staff_number: string;
  verification_code: string;
  qr_token: string;
}

export default function RegisterAdmin({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deptId, setDeptId] = useState('');
  const [deptName, setDeptName] = useState('');
  const [caps, setCaps] = useState<string[]>(CAPABILITIES.map((c) => c.key));
  const [isVisitor, setIsVisitor] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');
  const [face, setFace] = useState<FaceCaptureResult | null>(null);
  const [photoMode, setPhotoMode] = useState<'capture' | 'upload'>('capture');
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RegisteredResult | null>(null);

  // The photo actually used on the ID (from live capture or gallery upload).
  const idPhoto = photoMode === 'capture' ? face?.photo ?? null : uploadedPhoto;

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      // Auto-crop to the standard 35×45 ID photo, centred on the detected face.
      const { photo } = await imageToIdData(reader.result as string);
      setUploadedPhoto(photo);
    };
    reader.readAsDataURL(file);
  };

  const genPassword = () =>
    setPassword(Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6).toUpperCase() + '!7');

  const toggleCap = (k: string) =>
    setCaps((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  const reset = () => {
    setName(''); setEmail(''); setPassword(''); setDeptId(''); setDeptName('');
    setCaps(CAPABILITIES.map((c) => c.key)); setIsVisitor(false); setExpiresAt('');
    setFace(null); setPhotoMode('capture'); setUploadedPhoto(null); setResult(null); setError(null);
  };

  const submit = async () => {
    setError(null);
    if (!name || !email || !password) {
      setError('Name, email and password are required.');
      return;
    }
    if (!idPhoto) {
      setError(
        photoMode === 'capture'
          ? 'Please capture the admin’s face & photo first.'
          : 'Please upload a photo for the ID.'
      );
      return;
    }
    setBusy(true);
    const res = await fetch('/corporate/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        display_name: name,
        email,
        password,
        department_id: deptId ? Number(deptId) : null,
        department_name: deptName || null,
        capabilities: isVisitor ? [] : caps,
        is_visitor: isVisitor,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
        photo_data_url: idPhoto,
        // Biometric only when captured live. Uploaded-photo registrations have
        // no face template — the sub-admin enrols it themselves later.
        face_descriptor: photoMode === 'capture' ? face?.descriptors ?? null : null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error || 'Registration failed.');
      return;
    }
    setResult({
      staff_number: data.staff_number,
      verification_code: data.verification_code,
      qr_token: data.qr_token,
    });
    onDone();
  };

  const downloadCard = () => {
    if (!result) return;
    generateIdCard({
      display_name: name,
      staff_number: result.staff_number,
      department_name: deptName,
      verification_code: result.verification_code,
      qr_token: result.qr_token,
      photo_data_url: idPhoto,
      email,
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white font-bold font-sora text-sm"
      >
        <UserPlus size={16} /> Register new admin
      </button>
    );
  }

  return (
    <div className="bg-[#0A0F1E] border border-[#1A2640] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold font-sora flex items-center gap-2">
          <UserPlus size={18} className="text-[#00C8FF]" /> Register department admin
        </h2>
        <button onClick={() => { setOpen(false); reset(); }} className="text-[#6E7A91] hover:text-white">
          <X size={18} />
        </button>
      </div>

      {result ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-[#00FF88]/40 bg-[#00FF88]/10 p-4 text-sm">
            <p className="text-[#00FF88] font-semibold mb-2">✓ Admin registered — {result.staff_number}</p>
            <p className="text-[#A8B2D0]">Share these credentials with them once (they can also log in by face or QR):</p>
            <div className="mt-2 font-mono text-xs text-[#F0F2FA] space-y-1">
              <div>Email: {email}</div>
              <div>Password: {password}</div>
              <div>Verification code: {result.verification_code}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={downloadCard}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#E8B84B] to-[#FFC107] text-black font-bold text-sm"
            >
              <IdCard size={16} /> Download ID card
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 rounded-lg border border-[#1A2640] text-[#A8B2D0] text-sm"
            >
              Register another
            </button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {/* Left: form */}
          <div className="space-y-3">
            <Field label="Full name" value={name} onChange={setName} />
            <Field label="Email" value={email} onChange={setEmail} type="email" />
            <div>
              <label className="block text-xs font-semibold text-[#A8B2D0] mb-1">Password</label>
              <div className="flex gap-2">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#0D1528] border border-[#1A2640] rounded-lg text-sm text-[#F0F2FA] focus:outline-none focus:border-[#00C8FF]"
                />
                <button type="button" onClick={genPassword} className="px-3 rounded-lg border border-[#1A2640] text-xs text-[#00C8FF]">
                  Generate
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Dept #" value={deptId} onChange={setDeptId} />
              <Field label="Department name" value={deptName} onChange={setDeptName} />
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-[#A8B2D0] mb-1.5">Access level</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsVisitor(false)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                    !isVisitor ? 'bg-[#00C8FF]/15 text-[#00C8FF] border-[#00C8FF]/50' : 'border-[#1A2640] text-[#8A9AB8]'
                  }`}
                >
                  Department admin
                </button>
                <button
                  type="button"
                  onClick={() => setIsVisitor(true)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                    isVisitor ? 'bg-[#E8B84B]/15 text-[#E8B84B] border-[#E8B84B]/50' : 'border-[#1A2640] text-[#8A9AB8]'
                  }`}
                >
                  Read-only visitor
                </button>
              </div>
              {isVisitor && (
                <p className="text-[11px] text-[#8A9AB8] mt-1.5">Can view only — cannot edit, send, or delete anything.</p>
              )}
            </div>

            {/* Temporary access expiry */}
            <div>
              <label className="block text-xs font-semibold text-[#A8B2D0] mb-1">
                Access expires {isVisitor ? '(recommended)' : '(optional)'}
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                title="Access expiry date"
                className="w-full px-3 py-2 bg-[#0D1528] border border-[#1A2640] rounded-lg text-sm text-[#F0F2FA] focus:outline-none focus:border-[#00C8FF]"
              />
              <p className="text-[11px] text-[#8A9AB8] mt-1">Leave blank for permanent access. You can revoke anytime.</p>
            </div>

            {!isVisitor && (
              <div>
                <label className="block text-xs font-semibold text-[#A8B2D0] mb-1.5">Capabilities</label>
                <div className="space-y-1.5">
                  {CAPABILITIES.map((c) => (
                    <label key={c.key} className="flex items-center gap-2 text-sm text-[#D4DAEA]">
                      <input type="checkbox" checked={caps.includes(c.key)} onChange={() => toggleCap(c.key)} />
                      {c.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: face capture OR gallery photo */}
          <div>
            <label className="block text-xs font-semibold text-[#A8B2D0] mb-1.5">ID photo &amp; biometric</label>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setPhotoMode('capture')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                  photoMode === 'capture' ? 'bg-[#00C8FF]/15 text-[#00C8FF] border-[#00C8FF]/50' : 'border-[#1A2640] text-[#8A9AB8]'
                }`}
              >
                Live face capture
              </button>
              <button
                type="button"
                onClick={() => setPhotoMode('upload')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                  photoMode === 'upload' ? 'bg-[#00C8FF]/15 text-[#00C8FF] border-[#00C8FF]/50' : 'border-[#1A2640] text-[#8A9AB8]'
                }`}
              >
                Upload photo
              </button>
            </div>

            {photoMode === 'capture' ? (
              <>
                <FaceCapture mode="register" captured={!!face} onCapture={setFace} />
                {face?.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={face.photo} alt="captured" className="mt-3 w-24 rounded-lg border border-[#1A2640]" />
                )}
              </>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                  title="Upload ID photo"
                  className="block w-full text-xs text-[#A8B2D0] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#00C8FF]/15 file:text-[#00C8FF] file:font-semibold"
                />
                <p className="text-[11px] text-[#8A9AB8] mt-2">
                  For remote staff. No biometric is set — they enrol their own face later in Settings; until then they log in by password, code, or QR.
                </p>
                {uploadedPhoto && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={uploadedPhoto} alt="uploaded" className="mt-3 w-24 rounded-lg border border-[#1A2640]" />
                )}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
            <button
              onClick={submit}
              disabled={busy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white font-bold font-sora text-sm disabled:opacity-60"
            >
              {busy ? <Loader2 className="animate-spin" size={16} /> : <UserPlus size={16} />}
              Register & issue ID
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label, value, onChange, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#A8B2D0] mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-[#0D1528] border border-[#1A2640] rounded-lg text-sm text-[#F0F2FA] focus:outline-none focus:border-[#00C8FF]"
      />
    </div>
  );
}
