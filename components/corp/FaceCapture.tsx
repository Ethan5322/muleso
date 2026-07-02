'use client';

import { useEffect, useRef, useState } from 'react';
import { loadFaceApi, getFaceCaptureData } from '@/lib/faceClient';
import { Camera, Loader2, CheckCircle2, VideoOff } from 'lucide-react';

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

export interface FaceCaptureResult {
  photo: string | null; // ID-standard (35x45) data URL in register mode
  descriptor: number[]; // averaged descriptor (compat)
  descriptors: number[][]; // multiple samples — enroll template (register) or probe frames (login)
}

export default function FaceCapture({
  onCapture,
  mode = 'register',
  captured = false,
}: {
  onCapture: (r: FaceCaptureResult) => void;
  mode?: 'register' | 'login';
  captured?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [denied, setDenied] = useState(false);
  const [status, setStatus] = useState('Starting camera…');
  const [pct, setPct] = useState(0);
  const [guide, setGuide] = useState('');

  const startCamera = async () => {
    setDenied(false);
    setStatus('Starting camera…');
    try {
      await loadFaceApi();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setReady(true);
      setStatus('Center your face in the oval, then capture.');
    } catch (e) {
      console.error('camera error', e);
      setDenied(true);
      setReady(false);
      setStatus('Camera blocked. Allow camera access for this site, then tap “Enable camera”.');
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live quality % + directional guidance
  useEffect(() => {
    if (!ready) return;
    let active = true;
    const tick = async () => {
      if (!active || busy || !videoRef.current) return;
      try {
        const api = await loadFaceApi();
        const v = videoRef.current;
        if (!v || v.videoWidth === 0) return;
        const det = await api.detectSingleFace(v, new api.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.4 }));
        if (!active) return;
        if (!det) {
          setPct(0);
          setGuide('No face — center it in the oval');
          return;
        }
        const areaRatio = (det.box.width * det.box.height) / (v.videoWidth * v.videoHeight);
        const cx = (det.box.x + det.box.width / 2) / v.videoWidth;
        const cy = (det.box.y + det.box.height / 2) / v.videoHeight;
        const sizeScore = clamp(areaRatio / 0.16, 0, 1);
        const centerScore = clamp(1 - (Math.abs(cx - 0.5) + Math.abs(cy - 0.5)) * 1.6, 0, 1);
        setPct(Math.round(clamp(det.score * 40 + sizeScore * 30 + centerScore * 30, 0, 100)));
        let g = 'Perfect — capture now';
        if (areaRatio < 0.06) g = 'Move a little closer';
        else if (areaRatio > 0.42) g = 'Move back slightly';
        else if (cy < 0.3) g = 'Lower your chin slightly';
        else if (cy > 0.78) g = 'Raise your chin slightly';
        else if (cx < 0.36 || cx > 0.64) g = 'Move to center';
        setGuide(g);
      } catch {
        /* ignore */
      }
    };
    const id = setInterval(tick, 500);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [ready, busy]);

  const capture = async () => {
    if (!videoRef.current) return;
    setBusy(true);
    setStatus('Detecting face…');
    const data = await getFaceCaptureData(videoRef.current);
    if (!data) {
      setStatus('No face detected — center your face in good light and try again.');
      setBusy(false);
      return;
    }

    let photo: string | null = null;
    if (mode === 'register') {
      const v = videoRef.current;
      const vw = v.videoWidth;
      const vh = v.videoHeight;
      const { box } = data;

      // Standard ID photo: 35x45 (ratio 7:9). Position the head so it fills ~70%
      // of the frame with headroom, per ID/passport photo guidance.
      const ratio = 35 / 45;
      let photoH = box.height / 0.55; // detected face box ≈ 55% of photo height
      let photoW = photoH * ratio;
      const faceCx = box.x + box.width / 2;
      let top = box.y - photoH * 0.22; // headroom above the face
      let left = faceCx - photoW / 2;

      // keep within the frame
      if (photoW > vw) { photoW = vw; photoH = photoW / ratio; }
      if (photoH > vh) { photoH = vh; photoW = photoH * ratio; }
      left = Math.max(0, Math.min(left, vw - photoW));
      top = Math.max(0, Math.min(top, vh - photoH));

      const canvas = document.createElement('canvas');
      canvas.width = 420;
      canvas.height = 540; // 35:45
      const cx = canvas.getContext('2d');
      if (cx) {
        cx.fillStyle = '#f2f4f8';
        cx.fillRect(0, 0, 420, 540);
        cx.drawImage(v, left, top, photoW, photoH, 0, 0, 420, 540);
      }
      photo = canvas.toDataURL('image/jpeg', 0.92);
    }

    // Collect several frames — for register these become the multi-sample enrol
    // template; for login they're averaged into a clean probe. Both make
    // recognition far more reliable and harder to false-accept.
    const frames: number[][] = [data.descriptor];
    const N = mode === 'register' ? 5 : 4;
    setStatus(mode === 'register' ? 'Hold still — capturing samples…' : 'Scanning…');
    for (let i = 1; i < N; i++) {
      await new Promise((r) => setTimeout(r, 150));
      const d = await getFaceCaptureData(videoRef.current!);
      if (d) frames.push(d.descriptor);
    }
    const n = frames[0].length;
    const avg = new Array(n).fill(0);
    for (const f of frames) for (let i = 0; i < n; i++) avg[i] += f[i];
    for (let i = 0; i < n; i++) avg[i] /= frames.length;

    onCapture({ photo, descriptor: avg, descriptors: frames });
    setStatus(mode === 'register' ? 'Face & ID photo captured ✓' : 'Face captured ✓');
    setBusy(false);
  };

  return (
    <div className="space-y-3">
      <div className="relative rounded-xl overflow-hidden border border-[#1A2640] bg-black aspect-[4/3] max-w-sm">
        <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />

        {/* Face-position guide (ID framing) */}
        {ready && !captured && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className={`h-[78%] aspect-[7/9] rounded-[50%] border-2 ${pct >= 68 ? 'border-[#00FF88]' : 'border-[#00C8FF]/70'} shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]`} />
          </div>
        )}

        {/* Live quality % */}
        {ready && !captured && !denied && (
          <div className="absolute top-2 left-2 bg-black/55 rounded-lg px-2 py-0.5 text-[11px] font-bold">
            <span className={pct >= 68 ? 'text-[#00FF88]' : 'text-[#E8B84B]'}>{pct}%</span>
            <span className="text-[#8A9AB8] font-normal"> quality</span>
          </div>
        )}

        {denied && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3 p-4 text-center">
            <VideoOff className="text-red-400" size={30} />
            <p className="text-xs text-[#A8B2D0]">Camera access is required to capture the face.</p>
            <button
              type="button"
              onClick={startCamera}
              className="px-4 py-2 rounded-lg bg-[#00C8FF]/15 text-[#00C8FF] border border-[#00C8FF]/40 text-sm font-semibold"
            >
              Enable camera
            </button>
          </div>
        )}

        {captured && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <CheckCircle2 className="text-[#00FF88]" size={40} />
          </div>
        )}
      </div>

      <p className="text-xs text-[#A8B2D0]">{ready && !captured && guide ? guide : status}</p>

      <button
        type="button"
        onClick={capture}
        disabled={!ready || busy}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00C8FF]/10 text-[#00C8FF] border border-[#00C8FF]/40 text-sm font-semibold disabled:opacity-50"
      >
        {busy ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
        {captured ? 'Recapture' : mode === 'register' ? 'Capture face & ID photo' : 'Scan my face'}
      </button>
    </div>
  );
}
