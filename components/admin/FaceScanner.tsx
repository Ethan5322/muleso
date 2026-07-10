'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2, ScanFace, Camera } from 'lucide-react';
import {
  loadDetector,
  loadFaceApi,
  drawVisibleFrame,
  detectFaceOnly,
  getFaceCaptureData,
  analyzeFaceRegion,
  cropIdPhoto,
  type FaceDetection,
} from '@/lib/faceClient';

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

/** Preview aspect. The video is object-cover'd into this, and we score the same crop. */
const BOX_ASPECT = 4 / 3;

/** Quality floor to capture a frame. Also the ring's "green" point. */
const CAPTURE_QUALITY = 65;
/** Below these the descriptor is not trustworthy — never enrol or match on it. */
const MIN_SHARPNESS = 0.28;
const MIN_BRIGHTNESS = 0.35;

export default function FaceScanner({
  mode = 'single',
  steps = ['Look straight ahead', 'Turn your head slightly LEFT', 'Turn your head slightly RIGHT', 'Tilt your head slightly UP'],
  busy = false,
  onCapture,
  onComplete,
}: FaceScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const workingRef = useRef(false);
  const cooldownRef = useRef(0);
  const samplesRef = useRef<number[][]>([]);
  /** Last good face box in RAW VIDEO coords — lets finish() crop the ID photo
   *  without paying for another detection. */
  const lastVideoBoxRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  // Mirrored into a ref so the capture loop reads the live value without
  // resubscribing. Assigned in an effect — writing a ref during render is a
  // React violation and trips react-hooks/refs.
  const busyRef = useRef(busy);
  useEffect(() => {
    busyRef.current = busy;
  }, [busy]);

  // Login needs just a few good frames to decide fast; enrol captures more.
  const TARGET = mode === 'multi' ? Math.max(6, steps.length) : 3;

  const [camReady, setCamReady] = useState(false);
  const [detectorReady, setDetectorReady] = useState(false);
  const [descriptorReady, setDescriptorReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pct, setPct] = useState(0); // live face-quality %
  const [guide, setGuide] = useState('Starting camera…');
  const [progress, setProgress] = useState(0); // enrolment progress %
  const [done, setDone] = useState(false);

  // Start camera and load models CONCURRENTLY — the camera permission prompt and
  // the model download no longer queue behind one another.
  useEffect(() => {
    let cancelled = false;

    const startCamera = async () => {
      if (!window.isSecureContext) throw Object.assign(new Error(), { name: 'InsecureContext' });
      if (!navigator.mediaDevices?.getUserMedia) throw Object.assign(new Error(), { name: 'Unsupported' });

      // Modest resolution: we downscale to 384px for inference anyway, and a
      // 1280×720 grab costs real time to decode on a mid-range phone.
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 960 }, height: { ideal: 720 } },
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
      if (!cancelled) setCamReady(true);
    };

    const camera = startCamera().catch((err: unknown) => {
      if (cancelled) return;
      const name = (err as { name?: string })?.name || '';
      if (name === 'InsecureContext') setError('Camera needs a secure (HTTPS) connection.');
      else if (name === 'Unsupported') setError('This browser cannot access the camera. Try Chrome, Edge, or Safari.');
      else if (name === 'NotAllowedError' || name === 'SecurityError')
        setError('Camera is blocked. Allow camera access for this site, then reload.');
      else if (name === 'NotFoundError') setError('No camera found on this device.');
      else if (name === 'NotReadableError') setError('The camera is in use by another app.');
      else setError('Could not start the camera. Reload and allow camera access.');
    });

    // Detector (192KB) arms the guidance ring almost immediately…
    const detector = loadDetector()
      .then(() => !cancelled && setDetectorReady(true))
      .catch(() => !cancelled && setError('Could not load the face models. Check your connection and reload.'));

    // …while the 6.2MB recognition net streams in behind it.
    loadFaceApi()
      .then(() => !cancelled && setDescriptorReady(true))
      .catch(() => {
        /* surfaced by the detector catch above */
      });

    void Promise.all([camera, detector]);

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
        // Reuse the last good face box (raw-video coords) captured by the loop —
        // no extra detection pass just to crop the ID photo.
        let photo: string | null = null;
        try {
          const box = lastVideoBoxRef.current;
          if (box && videoRef.current) photo = cropIdPhoto(videoRef.current, box);
        } catch {
          /* photo optional */
        }
        await onComplete?.(samplesRef.current, photo);
      }
    } finally {
      workingRef.current = false;
    }
  }, [mode, onCapture, onComplete]);

  // Live quality + guidance + auto capture loop.
  useEffect(() => {
    if (!camReady || !detectorReady) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    let inFlight = false; // a slow phone must never stack overlapping inferences

    const tick = async () => {
      if (!active || inFlight || workingRef.current || busyRef.current || done || !videoRef.current) return;
      inFlight = true;
      try {
        const v = videoRef.current;
        if (!v || v.videoWidth === 0) return;

        // Score the pixels the user can actually SEE. On phones the front camera
        // is a tall stream and object-cover shows a centre slice; measuring the
        // raw frame made a well-centred face read as tiny and off-centre, so the
        // capture gate never opened.
        if (!frameCanvasRef.current) frameCanvasRef.current = document.createElement('canvas');
        const frame = drawVisibleFrame(v, BOX_ASPECT, undefined, frameCanvasRef.current);
        if (!frame) return;
        const { canvas, toVideo } = frame;

        const wantDescriptor = descriptorReady && Date.now() > cooldownRef.current;

        // One inference per tick. When we're ready to capture, that single pass
        // also yields the descriptor — never detect twice for the same frame.
        const capture = wantDescriptor ? await getFaceCaptureData(canvas) : null;
        const det: FaceDetection | null = capture ?? (wantDescriptor ? null : await detectFaceOnly(canvas));
        if (!active) return;

        if (!det) {
          setPct(0);
          setGuide('No face detected — center it in the circle');
          return;
        }

        const cw = canvas.width;
        const ch = canvas.height;
        const areaRatio = (det.box.width * det.box.height) / (cw * ch);
        const cx = (det.box.x + det.box.width / 2) / cw;
        const cy = (det.box.y + det.box.height / 2) / ch;

        const { sharpness, brightness } = analyzeFaceRegion(canvas, det.box);

        const sizeScore = clamp(areaRatio / 0.16, 0, 1);
        const centerScore = clamp(1 - (Math.abs(cx - 0.5) + Math.abs(cy - 0.5)) * 1.6, 0, 1);
        const quality = Math.round(
          clamp(det.score * 30 + sizeScore * 25 + centerScore * 25 + sharpness * 12 + brightness * 8, 0, 100)
        );
        setPct(quality);

        let g = 'Perfect — hold still';
        if (areaRatio < 0.06) g = 'Move a little closer';
        else if (areaRatio > 0.42) g = 'Move back slightly';
        else if (brightness < MIN_BRIGHTNESS) g = 'Find better lighting';
        else if (sharpness < MIN_SHARPNESS) g = 'Hold steady — image is blurry';
        else if (cy < 0.3) g = 'Lower your chin slightly';
        else if (cy > 0.78) g = 'Raise your chin slightly';
        else if (cx < 0.36 || cx > 0.64) g = 'Move slightly to center';

        // A frame is only usable if it is well-framed AND optically clean. A blurry
        // or dark frame yields a bad descriptor that would poison the adaptive template.
        const usable = quality >= CAPTURE_QUALITY && sharpness >= MIN_SHARPNESS && brightness >= MIN_BRIGHTNESS;

        if (usable && mode === 'multi') g = steps[Math.min(samplesRef.current.length, steps.length - 1)];

        if (!descriptorReady) setGuide(usable ? 'Almost ready…' : g);
        else setGuide(usable ? (mode === 'multi' ? `${g} — scanning…` : 'Recognising…') : g);

        if (usable && capture) {
          cooldownRef.current = Date.now() + (mode === 'single' ? 120 : 600);
          const tl = toVideo(det.box.x, det.box.y);
          const br = toVideo(det.box.x + det.box.width, det.box.y + det.box.height);
          lastVideoBoxRef.current = { x: tl.x, y: tl.y, width: br.x - tl.x, height: br.y - tl.y };

          samplesRef.current = [...samplesRef.current, capture.descriptor];
          setProgress(Math.round((samplesRef.current.length / TARGET) * 100));
          if (samplesRef.current.length >= TARGET) {
            setDone(true);
            await finish();
          }
        }
      } catch {
        /* ignore frame errors */
      } finally {
        inFlight = false;
        // Self-scheduling: the next tick starts only after this one lands, so a
        // slow device degrades to a lower frame rate instead of thrashing WebGL.
        if (active) timer = setTimeout(tick, 90);
      }
    };

    void tick();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [camReady, detectorReady, descriptorReady, mode, steps, TARGET, done, finish]);

  const ready = camReady && detectorReady;
  const ring = pct >= CAPTURE_QUALITY ? 'border-[#00FF88]' : pct >= 35 ? 'border-[#E8B84B]' : 'border-red-400/60';

  const statusLine = !camReady ? 'Starting camera…' : !detectorReady ? 'Loading face models…' : guide;

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
            <span className={pct >= CAPTURE_QUALITY ? 'text-[#00FF88]' : 'text-[#E8B84B]'}>{pct}%</span>
            <span className="text-[#7A8BA8] font-normal"> quality</span>
          </div>
        )}
        {/* The ring is live off the small detector; tell the user the big net is still coming. */}
        {ready && !descriptorReady && !error && (
          <div className="absolute top-2 right-2 bg-black/55 rounded-lg px-2.5 py-1 text-xs text-[#00C8FF] flex items-center gap-1.5">
            <Loader2 className="animate-spin" size={12} /> Preparing
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

      <p className={`text-center text-sm font-semibold ${pct >= CAPTURE_QUALITY && ready ? 'text-[#00FF88]' : 'text-[#7A8BA8]'}`}>
        {statusLine}
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
