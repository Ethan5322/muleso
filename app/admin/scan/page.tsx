'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ScanBarcode, Camera, Loader2, CheckCircle2, XCircle, X, Ban, RotateCcw, IdCard, Users } from 'lucide-react';
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser';
import { DecodeHintType, BarcodeFormat } from '@zxing/library';
import toast from 'react-hot-toast';
import { generateIdCard } from '@/lib/corp/generateIdCard';

interface Staff {
  id?: string;
  display_name?: string;
  staff_number?: string;
  department_name?: string;
  role_title?: string;
  status?: string;
  is_visitor?: boolean;
  is_super_admin?: boolean;
  expires_at?: string | null;
  suspended_until?: string | null;
  email?: string;
  photo_data_url?: string | null;
}

const SCAN_HINTS = new Map();
SCAN_HINTS.set(DecodeHintType.POSSIBLE_FORMATS, [
  BarcodeFormat.QR_CODE,
  BarcodeFormat.CODE_128,
  BarcodeFormat.CODE_39,
  BarcodeFormat.EAN_13,
]);
SCAN_HINTS.set(DecodeHintType.TRY_HARDER, true);

export default function ScanPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ found: boolean; staff?: Staff } | null>(null);
  const [camOn, setCamOn] = useState(false);
  const [camMsg, setCamMsg] = useState('');
  const [acting, setActing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const lastCode = useRef('');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const lookup = async (raw: string) => {
    const c = raw.trim();
    if (!c) return;
    lastCode.current = c;
    setLoading(true);
    setResult(null);
    try {
      const r = await fetch(`/api/admin/staff-lookup?code=${encodeURIComponent(c)}`);
      const d = await r.json();
      setResult(d);
    } catch {
      setResult({ found: false });
    } finally {
      setLoading(false);
      setCode('');
    }
  };

  const setStatus = async (id: string, status: 'active' | 'suspended') => {
    setActing(true);
    try {
      const res = await fetch('/corporate/api/admin-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department_admin_id: id, status }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || 'Could not change that status — please try again.');
        return;
      }
      toast.success(status === 'suspended' ? 'Staff member suspended' : 'Staff member reactivated');
      // refresh the shown record
      if (code || result?.staff) {
        const r = await fetch(`/api/admin/staff-lookup?code=${encodeURIComponent(lastCode.current)}`);
        setResult(await r.json());
      }
    } catch {
      toast.error('Network error — the status was not changed.');
    } finally {
      // Always clears, so the action buttons never stay stuck disabled.
      setActing(false);
    }
  };

  const reissueCard = async (id: string) => {
    setActing(true);
    try {
      const r = await fetch(`/corporate/api/admin-card?id=${encodeURIComponent(id)}`);
      if (r.ok) {
        const { card } = await r.json();
        await generateIdCard(card);
        toast.success('ID card re-issued');
      } else {
        // Silence here read as "the button is broken".
        toast.error('Could not load that ID card.');
      }
    } catch {
      toast.error('Could not generate the ID card.');
    } finally {
      setActing(false);
    }
  };

  const stopCam = () => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setCamOn(false);
  };

  const startCam = () => {
    setCamMsg('');
    setCamOn(true);
  };

  // Start the cross-browser barcode reader once the <video> is on screen.
  useEffect(() => {
    if (!camOn) return;
    let cancelled = false;
    let localControls: IScannerControls | null = null;

    (async () => {
      try {
        const reader = new BrowserMultiFormatReader(SCAN_HINTS);
        if (!videoRef.current) return;

        const onResult = (res: { getText: () => string } | undefined) => {
          if (res && !cancelled) {
            localControls?.stop();
            controlsRef.current = null;
            setCamOn(false);
            lookup(res.getText());
          }
        };

        try {
          // Prefer the rear camera — it focuses far better on printed codes.
          localControls = await reader.decodeFromConstraints(
            { video: { facingMode: { ideal: 'environment' } } },
            videoRef.current,
            onResult
          );
        } catch {
          // Fallback: let the browser choose a camera (e.g. laptop webcam).
          localControls = await reader.decodeFromVideoDevice(undefined, videoRef.current, onResult);
        }

        if (cancelled) localControls?.stop();
        else {
          controlsRef.current = localControls;
          setCamMsg('Hold the QR or barcode steady and fill the frame. QR scans easiest.');
        }
      } catch {
        setCamOn(false);
        setCamMsg('Could not open the camera. Allow camera access, or use a hardware scanner / type the code.');
      }
    })();
    return () => {
      cancelled = true;
      localControls?.stop();
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camOn]);

  const s = result?.staff;
  const expired = s?.expires_at && new Date(s.expires_at).getTime() < Date.now();

  return (
    <div className="max-w-lg text-white">
      <div className="flex items-center gap-2 mb-6">
        <ScanBarcode className="text-[#00C8FF]" size={24} />
        <h1 className="text-2xl font-bold font-sora">Scan Staff ID</h1>
      </div>

      {/* Scanner input (works with any USB/Bluetooth barcode scanner) */}
      <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-xl p-5 space-y-3">
        <label className="block text-xs font-semibold text-[#7A8BA8]">
          Scan the barcode <span className="text-[#00C8FF]">or QR</span> on the ID (or type the verification code) and press Enter
        </label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && lookup(code)}
            placeholder="e.g. 7K4M-9QX2-P3RT"
            className="flex-1 bg-[#1A2332] border border-[#1E3A5F] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#00C8FF] font-mono tracking-wider"
          />
          <button
            type="button"
            onClick={() => lookup(code)}
            disabled={loading}
            className="px-4 rounded-lg bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white font-bold disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Look up'}
          </button>
        </div>

        {!camOn ? (
          <button
            type="button"
            onClick={startCam}
            className="inline-flex items-center gap-2 text-sm text-[#00C8FF] hover:underline"
          >
            <Camera size={15} /> Scan with camera
          </button>
        ) : (
          <div className="relative rounded-lg overflow-hidden border border-[#1E3A5F]">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-56 object-cover" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="w-4/5 h-16 border-2 border-[#00C8FF]/70 rounded-lg" />
            </div>
            <button type="button" onClick={stopCam} className="absolute top-2 right-2 bg-black/60 rounded-full p-1">
              <X size={16} />
            </button>
          </div>
        )}
        {camMsg && <p className="text-xs text-[#7A8BA8]">{camMsg}</p>}
      </div>

      {/* Result */}
      {result && (
        <div className="mt-5">
          {!result.found ? (
            <div className="bg-[#0A0E17] border border-red-500/40 rounded-xl p-5 flex items-center gap-3">
              <XCircle className="text-red-400" size={22} />
              <p className="text-sm text-red-300">No staff member found for that code.</p>
            </div>
          ) : (
            <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-xl p-5">
              <div className="flex items-start gap-4">
                {s?.photo_data_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.photo_data_url} alt={s.display_name} className="w-20 h-[104px] object-cover rounded-lg border border-[#1E3A5F]" />
                ) : (
                  <div className="w-20 h-[104px] rounded-lg bg-[#1A2332] flex items-center justify-center text-[#7A8BA8] text-xs">No photo</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold font-sora">{s?.display_name || 'Staff'}</h2>
                    {s?.is_super_admin && <Badge color="#00C8FF">Super Admin</Badge>}
                    {s?.is_visitor && <Badge color="#E8B84B">Visitor</Badge>}
                  </div>
                  <p className="text-sm text-[#00C8FF] font-mono">{s?.staff_number}</p>
                  {s?.role_title && <p className="text-sm text-[#F0F2FA] font-semibold">{s.role_title}</p>}
                  <p className="text-sm text-[#7A8BA8]">{s?.department_name}</p>
                  {s?.email && <p className="text-xs text-[#7A8BA8] mt-1">{s.email}</p>}

                  <div className="mt-3 flex items-center gap-3 text-sm">
                    {s?.status === 'active' && !expired ? (
                      <span className="inline-flex items-center gap-1 text-[#00FF88] font-semibold">
                        <CheckCircle2 size={15} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-400 font-semibold">
                        <XCircle size={15} /> {expired ? 'Expired' : 'Suspended'}
                      </span>
                    )}
                    {s?.expires_at && (
                      <span className="text-xs text-[#7A8BA8]">
                        {expired ? 'Expired' : 'Expires'} {new Date(s.expires_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick actions (corporate staff only, not the super admin) */}
              {s?.id && !s.is_super_admin && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#1E3A5F]">
                  {s.status === 'active' ? (
                    <button
                      type="button"
                      disabled={acting}
                      onClick={() => setStatus(s.id!, 'suspended')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600/15 text-red-400 border border-red-500/40 disabled:opacity-50"
                    >
                      <Ban size={14} /> Suspend
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={acting}
                      onClick={() => setStatus(s.id!, 'active')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/40 disabled:opacity-50"
                    >
                      <RotateCcw size={14} /> Reactivate
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={acting}
                    onClick={() => reissueCard(s.id!)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#00C8FF]/15 text-[#00C8FF] border border-[#00C8FF]/40 disabled:opacity-50"
                  >
                    <IdCard size={14} /> Re-download ID
                  </button>
                  <Link
                    href="/admin/team"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1A2332] text-[#8A9AB8] border border-[#1E3A5F]"
                  >
                    <Users size={14} /> Team Admins
                  </Link>
                  {acting && <Loader2 className="animate-spin text-[#00C8FF]" size={16} />}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide" style={{ color, backgroundColor: `${color}22` }}>
      {children}
    </span>
  );
}
