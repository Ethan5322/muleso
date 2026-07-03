'use client';

import { useEffect, useRef, useState } from 'react';
import { ScanBarcode, Camera, Loader2, CheckCircle2, XCircle, X } from 'lucide-react';

interface Staff {
  display_name?: string;
  staff_number?: string;
  department_name?: string;
  status?: string;
  is_visitor?: boolean;
  is_super_admin?: boolean;
  expires_at?: string | null;
  email?: string;
  photo_data_url?: string | null;
}

export default function ScanPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ found: boolean; staff?: Staff } | null>(null);
  const [camOn, setCamOn] = useState(false);
  const [camMsg, setCamMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const lookup = async (raw: string) => {
    const c = raw.trim();
    if (!c) return;
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

  const stopCam = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCamOn(false);
  };

  const startCam = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const BD = (window as any).BarcodeDetector;
    if (!BD) {
      setCamMsg('Camera scanning not supported on this browser — use a barcode scanner or type the code.');
      return;
    }
    try {
      setCamMsg('Point the camera at the barcode…');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamOn(true);
      const detector = new BD({ formats: ['code_128'] });
      const tick = async () => {
        if (!videoRef.current || !streamRef.current) return;
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes && codes.length) {
            const val = codes[0].rawValue as string;
            stopCam();
            lookup(val);
            return;
          }
        } catch {
          /* keep trying */
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setCamMsg('Could not open the camera. Allow camera access or use a barcode scanner.');
    }
  };

  useEffect(() => () => stopCam(), []);

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
          Scan the barcode on the ID (or type the verification code) and press Enter
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
            <video ref={videoRef} playsInline muted className="w-full h-48 object-cover" />
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
                  <div className="w-20 h-[104px] rounded-lg bg-[#1A2332] flex items-center justify-center text-[#3d475e] text-xs">No photo</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold font-sora">{s?.display_name || 'Staff'}</h2>
                    {s?.is_super_admin && <Badge color="#00C8FF">Super Admin</Badge>}
                    {s?.is_visitor && <Badge color="#E8B84B">Visitor</Badge>}
                  </div>
                  <p className="text-sm text-[#00C8FF] font-mono">{s?.staff_number}</p>
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
