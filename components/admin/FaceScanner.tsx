'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2, ScanFace, Camera } from 'lucide-react';
import { loadFaceApi, getFaceDescriptor, getFaceCaptureData, cropIdPhoto } from '@/lib/faceClient';

interface FaceScannerProps {
  /** single = live login recognition. multi = guided auto-enroll (progress %). */
  mode?: 'single' | 'multi';
  /** Rotating angle prompts for enroll mode. */
  steps?: string[];
  actionLabel?: string;
  busy?: boolean;
  onCapture?: (descriptors: number[][]) => Promise<void> | void;
  onComplete?: (descriptors: number[][], photo?: string | null) => Promise<void> | void;
}

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

export default function FaceScanner({
  mode = 'single',
  steps = ['Look straight ahead', 'Turn your head slightly LEFT', 'Turn your head slightly RIGHT', 'Tilt your head slightly UP'],
  busy = false,
  onCapture,
  onComplete,
}: FaceScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const workingRef = useRef(false);
  const cooldownRef = useRef(0);
  const samplesRef = useRef<number[][]>([]);
  const busyRef = useRef(busy);
  busyRef.current = busy;

  // Login needs just a few good frames to decide fast; enrol captures more.
  const TARGET = mode === 'multi' ? Math.max(6, steps.length) : 3;

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pct, setPct] = useState(0); // live face-quality %
  const [guide, setGuide] = useState('Loading camera…');
  const [progress, setProgress] = useState(0); // enrolment progress %
  const [done, setDone] = useState(false);

  // Start camera + models
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!window.isSecureContext) {
          setError('Camera needs a secure (HTTPS) connection.');
          return;
        }
        if (!navigator.mediaDevices?.getUserMedia) {
          setError('This browser cannot access the camera. Try Chrome, Edge, or Safari.');
          return;
        }
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        await loadFaceApi();
        if (cancelled) return;
        setReady(true);
        setGuide('Center your face in the circle');
      } catch (err: unknown) {
        const name = (err as { name?: string })?.name || '';
        if (name === 'NotAllowedError' || name === 'SecurityError')
          setError('Camera is blocked. Allow camera access for this site, then reload.');
        else if (name === 'NotFoundError') setError('No camera found on this device.');
        else if (name === 'NotReadableError') setError('The camera is in use by another app.');
        else setError('Could not start the camera. Reload and allow camera access.');
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const finish = useCallback(async () => {
    workingRef.current = true;
    try {
      if (mode === 'single') {
        await onCapture?.(samplesRef.current);
      } else {
        // Capture an ID photo (35×45) from the same live scan so enrolling a
        // face also updates the staff ID picture.
        let photo: string | null = null;
        try {
          const cap = await getFaceCaptureData(videoRef.current!);
          if (cap) photo = cropIdPhoto(videoRef.current!, cap.box);
        } catch {
          /* photo optional */
        }
        await onComplete?.(samplesRef.current, photo);
      }
    } finally {
      workingRef.current = false;
    }
  }, [mode, onCapture, onComplete]);

  // Live quality + guidance + auto capture/collect loop
  useEffect(() => {
    if (!ready) return;
    let active = true;

    const tick = async () => {
      if (!active || workingRef.current || busyRef.current || done || !videoRef.current) return;
      try {
        const api = await loadFaceApi();
        const v = videoRef.current;
        if (!v || v.videoWidth === 0) return;
        const det = await api.detectSingleFace(v, new api.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.4 }));
        if (!active) return;

        if (!det) {
          setPct(0);
          setGuide('No face detected — center it in the circle');
          return;
        }
        const areaRatio = (det.box.width * det.box.height) / (v.videoWidth * v.videoHeight);
        const cx = (det.box.x + det.box.width / 2) / v.videoWidth;
        const cy = (det.box.y + det.box.height / 2) / v.videoHeight;

        const sizeScore = clamp(areaRatio / 0.16, 0, 1);
        const centerScore = clamp(1 - (Math.abs(cx - 0.5) + Math.abs(cy - 0.5)) * 1.6, 0, 1);
        const quality = Math.round(clamp(det.score * 40 + sizeScore * 30 + centerScore * 30, 0, 100));
        setPct(quality);

        let g = 'Perfect — hold still';
        if (areaRatio < 0.06) g = 'Move a little closer';
        else if (areaRatio > 0.42) g = 'Move back slightly';
        else if (cy < 0.3) g = 'Lower your chin slightly';
        else if (cy > 0.78) g = 'Raise your chin slightly';
        else if (cx < 0.36) g = 'Move slightly to center';
        else if (cx > 0.64) g = 'Move slightly to center';

        const good = quality >= 68;
        if (good && mode === 'multi') {
          g = steps[Math.min(samplesRef.current.length, steps.length - 1)];
        }
        setGuide(good ? (mode === 'multi' ? `${g} — scanning…` : 'Recognising…') : g);

        if (good && Date.now() > cooldownRef.current) {
          cooldownRef.current = Date.now() + (mode === 'single' ? 220 : 650);
          const d = await getFaceDescriptor(v);
          if (d) {
            samplesRef.current = [...samplesRef.current, d];
            setProgress(Math.round((samplesRef.current.length / TARGET) * 100));
            if (samplesRef.current.length >= TARGET) {
              setDone(true);
              await finish();
            }
          }
        }
      } catch {
        /* ignore frame errors */
      }
    };

    const id = setInterval(tick, 500);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [ready, mode, steps, TARGET, done, finish]);

  const ring = pct >= 68 ? 'border-[#00FF88]' : pct >= 35 ? 'border-[#E8B84B]' : 'border-red-400/60';

  return (
    <div className="space-y-4">
      <div className="relative mx-auto w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden border border-[#1E3A5F] bg-black">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className={`w-40 h-52 rounded-[50%] border-2 transition-colors ${ring}`} />
        </div>
        {/* live quality % */}
        {ready && !error && (
          <div className="absolute top-2 left-2 bg-black/55 rounded-lg px-2.5 py-1 text-xs font-bold">
            <span className={pct >= 68 ? 'text-[#00FF88]' : 'text-[#E8B84B]'}>{pct}%</span>
            <span className="text-[#7A8BA8] font-normal"> quality</span>
          </div>
        )}
        {(!ready || busy || done) && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#00C8FF]" size={32} />
          </div>
        )}
      </div>

      {/* Enrolment progress */}
      {mode === 'multi' && (
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#7A8BA8]">Enrolling biometric</span>
            <span className="text-[#00C8FF] font-bold">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-[#1A2332] overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <p className={`text-center text-sm font-semibold ${pct >= 68 && ready ? 'text-[#00FF88]' : 'text-[#7A8BA8]'}`}>
        {ready ? guide : 'Loading camera…'}
      </p>

      {error && (
        <p className="text-center text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex items-center justify-center gap-2 text-xs text-[#7A8BA8]">
        {mode === 'single' ? <ScanFace size={14} className="text-[#00C8FF]" /> : <Camera size={14} className="text-[#00C8FF]" />}
        {mode === 'single'
          ? 'Look at the camera — recognition is automatic. No photo is taken; only a numeric face signature is used.'
          : 'Move slowly through the prompts — samples are captured automatically as a numeric signature (no photo stored).'}
      </div>
    </div>
  );
}
