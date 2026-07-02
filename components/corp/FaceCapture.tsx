'use client';

import { useEffect, useRef, useState } from 'react';
import { loadFaceApi, getFaceDescriptor } from '@/lib/faceClient';
import { Camera, Loader2, CheckCircle2 } from 'lucide-react';

export interface FaceCaptureResult {
  photo: string | null; // 3:4 data URL (register mode)
  descriptor: number[];
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
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('Starting camera…');

  useEffect(() => {
    let stream: MediaStream | null = null;
    (async () => {
      try {
        await loadFaceApi();
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 640, height: 480 },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setReady(true);
        setStatus('Position your face in the frame, then capture.');
      } catch {
        setStatus('Camera unavailable — allow camera access and reload.');
      }
    })();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = async () => {
    if (!videoRef.current) return;
    setBusy(true);
    setStatus('Detecting face…');
    const descriptor = await getFaceDescriptor(videoRef.current);
    if (!descriptor) {
      setStatus('No face detected — face the camera in good light and try again.');
      setBusy(false);
      return;
    }

    let photo: string | null = null;
    if (mode === 'register') {
      const v = videoRef.current;
      const vw = v.videoWidth;
      const vh = v.videoHeight;
      const ratio = 3 / 4; // width/height of a 3x4 ID photo
      let cw = vw;
      let ch = vw / ratio;
      if (ch > vh) {
        ch = vh;
        cw = vh * ratio;
      }
      const sx = (vw - cw) / 2;
      const sy = (vh - ch) / 2;
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 400;
      const cx = canvas.getContext('2d');
      cx?.drawImage(v, sx, sy, cw, ch, 0, 0, 300, 400);
      photo = canvas.toDataURL('image/jpeg', 0.82);
    }

    onCapture({ photo, descriptor });
    setStatus(mode === 'register' ? 'Face & photo captured ✓' : 'Face captured ✓');
    setBusy(false);
  };

  return (
    <div className="space-y-3">
      <div className="relative rounded-xl overflow-hidden border border-[#1A2640] bg-black aspect-[4/3] max-w-sm">
        <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
        {captured && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <CheckCircle2 className="text-[#00FF88]" size={40} />
          </div>
        )}
      </div>
      <p className="text-xs text-[#A8B2D0]">{status}</p>
      <button
        type="button"
        onClick={capture}
        disabled={!ready || busy}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00C8FF]/10 text-[#00C8FF] border border-[#00C8FF]/40 text-sm font-semibold disabled:opacity-50"
      >
        {busy ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
        {captured ? 'Recapture' : mode === 'register' ? 'Capture face & photo' : 'Scan my face'}
      </button>
    </div>
  );
}
