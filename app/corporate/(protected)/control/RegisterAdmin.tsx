'use client';

import { useState } from 'react';
import FaceCapture, { type FaceCaptureResult } from '@/components/corp/FaceCapture';
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
  const [face, setFace] = useState<FaceCaptureResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RegisteredResult | null>(null);

  const genPassword = () =>
    setPassword(Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6).toUpperCase() + '!7');

  const toggleCap = (k: string) =>
    setCaps((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  const reset = () => {
    setName(''); setEmail(''); setPassword(''); setDeptId(''); setDeptName('');
    setCaps(CAPABILITIES.map((c) => c.key)); setFace(null); setResult(null); setError(null);
  };

  const submit = async () => {
    setError(null);
    if (!name || !email || !password) {
      setError('Name, email and password are required.');
      return;
    }
    if (!face) {
      setError('Please capture the admin’s face & photo first.');
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
        capabilities: caps,
        photo_data_url: face.photo,
        face_descriptor: face.descriptor,
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
      photo_data_url: face?.photo ?? null,
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
          </div>

          {/* Right: face capture */}
          <div>
            <label className="block text-xs font-semibold text-[#A8B2D0] mb-1.5">
              Face & ID photo (biometric login)
            </label>
            <FaceCapture mode="register" captured={!!face} onCapture={setFace} />
            {face?.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={face.photo} alt="captured" className="mt-3 w-24 rounded-lg border border-[#1A2640]" />
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
