'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Camera, Loader2, ScanFace, Check } from 'lucide-react';
import { loadFaceApi, getFaceDescriptor } from '@/lib/faceClient';

interface FaceScannerProps {
  /** Login = one capture. Enroll = several guided captures. */
  mode?: 'single' | 'multi';
  /** Prompts shown per step in multi mode. */
  steps?: string[];
  actionLabel?: string;
  busy?: boolean;
  onCapture?: (descriptor: number[]) => Promise<void> | void;
  onComplete?: (descriptors: number[][]) => Promise<void> | void;
}

type Quality = 'none' | 'far' | 'offcenter' | 'good';

const QUALITY_MESSAGE: Record<Quality, string> = {
  none: 'No face detected — look straight at the camera in good light.',
  far: 'Move a little closer to the camera.',
  offcenter: 'Center your face in the oval.',
  good: 'Perfect — hold still and capture.',
};

export default function FaceScanner({
  mode = 'single',
  steps = [],
  actionLabel = 'Scan My Face',
  busy = false,
  onCapture,
  onComplete,
}: FaceScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const capturingRef = useRef(false);

  const [status, setStatus] = useState('Loading face models…');
  const [ready, setReady] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState<Quality>('none');
  const [stepIndex, setStepIndex] = useState(0);
  const [captured, setCaptured] = useState<number[][]>([]);

  // Start camera + load models
  useEffect(() => {
    let cancelled = false;
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
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
        setStatus('Loading face models…');
        await loadFaceApi();
        if (cancelled) return;
        setReady(true);
      } catch (err: any) {
        console.error('Camera/model error:', err);
        setError(
          err?.name === 'NotAllowedError'
            ? 'Camera permission denied. Allow camera access and reload.'
            : 'Could not start the camera or load models. Try another browser.'
        );
      }
    };
    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Live quality feedback loop
  useEffect(() => {
    if (!ready) return;
    let active = true;

    const tick = async () => {
      if (!active || capturingRef.current || !videoRef.current) return;
      try {
        const api: any = await loadFaceApi();
        const v = videoRef.current;
        if (!v || v.videoWidth === 0) return;
        const det = await api.detectSingleFace(
          v,
          new api.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.4 })
        );
        if (!active) return;
        if (!det) {
          setQuality('none');
        } else {
          const areaRatio = (det.box.width * det.box.height) / (v.videoWidth * v.videoHeight);
          const cx = (det.box.x + det.box.width / 2) / v.videoWidth;
          const cy = (det.box.y + det.box.height / 2) / v.videoHeight;
          if (areaRatio < 0.06) setQuality('far');
          else if (cx < 0.3 || cx > 0.7 || cy < 0.25 || cy > 0.8) setQuality('offcenter');
          else setQuality('good');
        }
      } catch {
        /* ignore frame errors */
      }
    };

    const id = setInterval(tick, 700);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [ready]);

  const liveMessage = ready ? QUALITY_MESSAGE[quality] : status;

  const handleCapture = useCallback(async () => {
    if (!videoRef.current || !ready || working || busy || capturingRef.current) return;
    capturingRef.current = true;
    setWorking(true);
    setError(null);
    try {
      const descriptor = await getFaceDescriptor(videoRef.current);
      if (!descriptor) {
        setError('No face detected. Center your face in the oval, get closer, and make sure the area is well-lit — then try again.');
        return;
      }

      if (mode === 'single') {
        await onCapture?.(descriptor);
        return;
      }

      // multi: collect this step, advance or finish
      const next = [...captured, descriptor];
      setCaptured(next);
      if (next.length >= (steps.length || 1)) {
        await onComplete?.(next);
      } else {
        setStepIndex((i) => i + 1);
      }
    } catch (err) {
      console.error('Capture error:', err);
      setError('Capture failed. Please try again.');
    } finally {
      capturingRef.current = false;
      setWorking(false);
    }
  }, [ready, working, busy, quality, mode, captured, steps.length, onCapture, onComplete]);

  const ringColor =
    quality === 'good' ? 'border-[#00FF88]' : quality === 'none' ? 'border-red-400/60' : 'border-[#E8B84B]';

  return (
    <div className="space-y-4">
      {/* Multi-step prompt */}
      {mode === 'multi' && steps.length > 0 && (
        <div className="text-center">
          <p className="text-[#00C8FF] font-semibold">{steps[stepIndex]}</p>
          <div className="flex justify-center gap-1.5 mt-2">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${
                  i < captured.length ? 'bg-[#00FF88]' : i === stepIndex ? 'bg-[#00C8FF]' : 'bg-[#1E3A5F]'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="relative mx-auto w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden border border-[#1E3A5F] bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className={`w-40 h-52 rounded-[50%] border-2 transition-colors ${ringColor}`} />
        </div>
        {(!ready || working || busy) && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#00C8FF]" size={32} />
          </div>
        )}
      </div>

      <p
        className={`text-center text-sm ${
          quality === 'good' && ready ? 'text-[#00FF88]' : 'text-[#7A8BA8]'
        }`}
      >
        {liveMessage}
      </p>
      {error && (
        <p className="text-center text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={handleCapture}
        disabled={!ready || working || busy}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white font-bold rounded-xl transition-all disabled:opacity-50"
      >
        {working || busy ? (
          <Loader2 className="animate-spin" size={18} />
        ) : mode === 'multi' ? (
          <Check size={18} />
        ) : (
          <ScanFace size={18} />
        )}
        {working || busy
          ? 'Working…'
          : mode === 'multi'
            ? `Capture ${captured.length + 1} / ${steps.length || 1}`
            : actionLabel}
      </motion.button>

      <p className="text-center text-xs text-[#7A8BA8] flex items-center justify-center gap-1">
        <Camera size={12} /> Your camera feed stays on your device — only a numeric face signature is sent.
      </p>
    </div>
  );
}
