'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Loader2, ScanFace } from 'lucide-react';
import { loadFaceApi, getFaceDescriptor } from '@/lib/faceClient';

interface FaceScannerProps {
  actionLabel: string;
  busy?: boolean;
  onCapture: (descriptor: number[]) => Promise<void> | void;
}

export default function FaceScanner({ actionLabel, busy = false, onCapture }: FaceScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState('Loading face models…');
  const [ready, setReady] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      try {
        // 1) High-quality front camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }

        // 2) Load recognition models
        setStatus('Loading face models…');
        await loadFaceApi();
        if (cancelled) return;
        setReady(true);
        setStatus('Position your face in the frame, then capture.');
      } catch (err: any) {
        console.error('Camera/model error:', err);
        setError(
          err?.name === 'NotAllowedError'
            ? 'Camera permission denied. Please allow camera access and reload.'
            : 'Could not start the camera or load models. Try a different browser.'
        );
      }
    };

    start();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleScan = async () => {
    if (!videoRef.current || !ready || scanning || busy) return;
    setScanning(true);
    setError(null);
    setStatus('Scanning…');
    try {
      const descriptor = await getFaceDescriptor(videoRef.current);
      if (!descriptor) {
        setError('No face detected. Make sure your face is well-lit and centered.');
        setStatus('Try again.');
        return;
      }
      await onCapture(descriptor);
    } catch (err) {
      console.error('Scan error:', err);
      setError('Scan failed. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative mx-auto w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden border border-[#1E3A5F] bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />
        {/* Framing guide */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-52 rounded-[50%] border-2 border-[#00C8FF]/60" />
        </div>
        {(!ready || scanning || busy) && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#00C8FF]" size={32} />
          </div>
        )}
      </div>

      <p className="text-center text-sm text-[#7A8BA8]">{status}</p>
      {error && (
        <p className="text-center text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={handleScan}
        disabled={!ready || scanning || busy}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white font-bold rounded-xl transition-all disabled:opacity-50"
      >
        {scanning || busy ? <Loader2 className="animate-spin" size={18} /> : <ScanFace size={18} />}
        {scanning || busy ? 'Working…' : actionLabel}
      </motion.button>

      <p className="text-center text-xs text-[#7A8BA8] flex items-center justify-center gap-1">
        <Camera size={12} /> Your camera feed never leaves your device — only a numeric face signature is sent.
      </p>
    </div>
  );
}
