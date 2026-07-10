/**
 * Client-side face-api loader + descriptor extractor.
 *
 * Models are served same-origin from /models (copied out of node_modules by
 * scripts/copy-face-models.cjs at install/build time) so they come off the
 * Vercel CDN rather than jsdelivr.
 *
 * Loading is tiered: the 192KB detector arms the camera UI immediately, while
 * the 6.2MB recognition net streams in behind it. Only ever call these in the
 * browser.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
let faceapi: any = null;

const MODEL_URL = '/models';

/** Tiny-detector settings. Shared by enrol and login so descriptors stay comparable. */
export const DETECTOR_INPUT_SIZE = 320;
export const DETECTOR_SCORE_THRESHOLD = 0.3;

/** Larger input finds smaller faces — worth it for a one-off still, too slow per live frame. */
export const STILL_INPUT_SIZE = 512;

/**
 * Height of the working canvas we run inference on.
 *
 * face-api extracts the aligned face chip at this canvas's resolution and
 * resizes it to 150×150 for the recognition net. At 480px tall a well-framed
 * face is ~190px, so the chip is downsampled (sharp) rather than upsampled
 * (soft). Going smaller here would quietly degrade every descriptor.
 */
export const WORKING_FRAME_HEIGHT = 480;

type FaceInput = HTMLCanvasElement | HTMLVideoElement | HTMLImageElement;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

function detectorOptions(fa: any, inputSize: number = DETECTOR_INPUT_SIZE) {
  return new fa.TinyFaceDetectorOptions({
    inputSize,
    scoreThreshold: DETECTOR_SCORE_THRESHOLD,
  });
}

async function importFaceApi(): Promise<any> {
  if (!faceapi) faceapi = await import('@vladmandic/face-api');
  return faceapi;
}

// Memoised so concurrent callers share one in-flight load instead of racing.
let detectorPromise: Promise<any> | null = null;
let fullPromise: Promise<any> | null = null;

/**
 * Pin the TensorFlow backend before any weights are loaded.
 *
 * Left to itself, tfjs can select its `wasm` backend, which fetches its binary
 * relative to the JS bundle — i.e. /_next/static/chunks/tfjs-backend-wasm-simd.wasm,
 * which Next never emits. That 404 rejects loadFromUri and face login dies
 * outright. Any browser without WebGL (iOS Lockdown Mode, some Android WebViews,
 * GPU-blocklisted devices) would land there.
 *
 * So: WebGL when we can have it, plain CPU when we can't. Slow beats broken.
 */
async function initBackend(fa: any): Promise<void> {
  const tf = fa?.tf;
  if (!tf?.setBackend) return;

  const trySetBackend = async (name: string) => {
    try {
      const ok = await tf.setBackend(name);
      if (!ok) return false;
      await tf.ready();
      return tf.getBackend() === name;
    } catch {
      return false;
    }
  };

  if (await trySetBackend('webgl')) return;
  if (await trySetBackend('cpu')) {
    console.warn('[face] WebGL unavailable — falling back to the CPU backend (slower).');
    return;
  }
  console.warn('[face] no usable TensorFlow backend; using whatever tfjs picked.');
  await tf.ready?.().catch(() => {});
}

/**
 * Detector only — enough to find a face and drive the live quality ring.
 * Resolves in well under a second on mobile data.
 */
export function loadDetector(): Promise<any> {
  if (!detectorPromise) {
    detectorPromise = (async () => {
      const fa = await importFaceApi();
      await initBackend(fa);
      await fa.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      warmUpDetector(fa);
      return fa;
    })().catch((e) => {
      detectorPromise = null; // let a later attempt retry
      throw e;
    });
  }
  return detectorPromise;
}

/** Detector + landmarks + recognition. Needed before any descriptor can be computed. */
export function loadFaceApi(): Promise<any> {
  if (!fullPromise) {
    fullPromise = (async () => {
      const fa = await loadDetector();
      await Promise.all([
        fa.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        fa.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      warmUpRecognition(fa);
      return fa;
    })().catch((e) => {
      fullPromise = null;
      throw e;
    });
  }
  return fullPromise;
}

/** True once descriptors can actually be computed (recognition net is resident). */
export function isDescriptorReady(): boolean {
  return Boolean(
    faceapi?.nets?.faceRecognitionNet?.isLoaded && faceapi?.nets?.faceLandmark68Net?.isLoaded
  );
}

function blankCanvas(size: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);
  }
  return c;
}

/**
 * iOS Safari compiles WebGL shaders lazily, so the FIRST inference stalls for
 * seconds — which would otherwise land on the user's first real camera frame.
 * Burn that cost up-front on a blank canvas instead. Fire-and-forget.
 */
function warmUpDetector(fa: any) {
  void (async () => {
    try {
      await fa.detectSingleFace(blankCanvas(DETECTOR_INPUT_SIZE), detectorOptions(fa));
    } catch {
      /* warm-up is best-effort */
    }
  })();
}

function warmUpRecognition(fa: any) {
  void (async () => {
    try {
      // These nets accept any image; we only care about compiling their shaders.
      const c = blankCanvas(150);
      await fa.nets.faceLandmark68Net.detectLandmarks(c);
      await fa.nets.faceRecognitionNet.computeFaceDescriptor(c);
    } catch {
      /* warm-up is best-effort */
    }
  })();
}

export interface FaceCaptureData {
  descriptor: number[];
  box: { x: number; y: number; width: number; height: number };
  score: number;
}

export interface FaceDetection {
  box: { x: number; y: number; width: number; height: number };
  score: number;
}

/**
 * Where the CSS `object-fit: cover` crop of `video` into a box of aspect
 * `boxAspect` actually lands in the raw video frame.
 */
function coverSourceRect(vw: number, vh: number, boxAspect: number) {
  const videoAspect = vw / vh;
  let sw: number, sh: number;
  if (videoAspect > boxAspect) {
    sh = vh;
    sw = vh * boxAspect; // too wide — crop the sides
  } else {
    sw = vw;
    sh = vw / boxAspect; // too tall — crop top and bottom
  }
  return { sx: (vw - sw) / 2, sy: (vh - sh) / 2, sw, sh };
}

export interface VisibleFrame {
  canvas: HTMLCanvasElement;
  /** Maps a point in canvas space back into raw-video space. */
  toVideo: (x: number, y: number) => { x: number; y: number };
  /** canvas pixels per video pixel */
  scale: number;
}

/**
 * Draw ONLY the part of the video the user can see (the object-cover crop) into
 * an offscreen canvas.
 *
 * This is the whole ballgame on phones: front cameras hand back a tall portrait
 * stream, so the 4:3 preview shows a centre slice. Scoring the raw frame meant a
 * face the user had perfectly centred read as small and off-centre, and never
 * cleared the capture gate. Detecting on the visible crop puts the guidance, the
 * gate, and the user's eyes in the same coordinate space — and shrinks the
 * inference input at the same time.
 */
export function drawVisibleFrame(
  video: HTMLVideoElement,
  boxAspect: number,
  target = WORKING_FRAME_HEIGHT,
  reuse?: HTMLCanvasElement
): VisibleFrame | null {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh) return null;

  const { sx, sy, sw, sh } = coverSourceRect(vw, vh, boxAspect);
  const canvas = reuse ?? document.createElement('canvas');
  canvas.width = Math.round(target * boxAspect);
  canvas.height = target;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  const scale = canvas.width / sw;
  return {
    canvas,
    scale,
    toVideo: (x: number, y: number) => ({ x: sx + x / scale, y: sy + y / scale }),
  };
}

/** Cheap pass: face box + score only. No landmarks, no descriptor. */
export async function detectFaceOnly(input: FaceInput): Promise<FaceDetection | null> {
  const fa = await loadDetector();
  const det = await fa.detectSingleFace(input, detectorOptions(fa));
  if (!det) return null;
  const b = det.box;
  return { box: { x: b.x, y: b.y, width: b.width, height: b.height }, score: det.score };
}

/**
 * Full pass: box + descriptor in ONE chained call. Previously the caller ran a
 * detection for the quality ring and then this re-detected at inputSize 512,
 * paying for the slowest tiny-detector setting twice per captured frame.
 */
export async function getFaceCaptureData(
  input: FaceInput,
  inputSize: number = DETECTOR_INPUT_SIZE
): Promise<FaceCaptureData | null> {
  const fa = await loadFaceApi();
  const result = await fa
    .detectSingleFace(input, detectorOptions(fa, inputSize))
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (!result) return null;
  const b = result.detection.box;
  return {
    descriptor: Array.from(result.descriptor as Float32Array),
    box: { x: b.x, y: b.y, width: b.width, height: b.height },
    score: result.detection.score,
  };
}

export async function getFaceDescriptor(input: FaceInput): Promise<number[] | null> {
  const data = await getFaceCaptureData(input);
  return data ? data.descriptor : null;
}

export interface FaceRegionStats {
  /** 0–1. Variance-of-Laplacian, normalised. Low = motion blur or out of focus. */
  sharpness: number;
  /** 0–1. Mean luma. Very low or very high both wreck the descriptor. */
  brightness: number;
}

/**
 * Corporate-grade capture gating: a blurry or badly-lit frame still yields a
 * *descriptor*, just a bad one. Those frames are why login "sometimes" fails —
 * and, because successful logins feed the adaptive template, a bad frame that
 * squeaks through permanently degrades future matching. Measure the face region
 * and refuse to enrol or authenticate on a frame we know is poor.
 */
export function analyzeFaceRegion(
  canvas: HTMLCanvasElement,
  box: { x: number; y: number; width: number; height: number }
): FaceRegionStats {
  const N = 64;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { sharpness: 0, brightness: 0 };

  const sx = Math.max(0, Math.floor(box.x));
  const sy = Math.max(0, Math.floor(box.y));
  const sw = Math.max(1, Math.min(Math.floor(box.width), canvas.width - sx));
  const sh = Math.max(1, Math.min(Math.floor(box.height), canvas.height - sy));

  const tmp = document.createElement('canvas');
  tmp.width = N;
  tmp.height = N;
  const tctx = tmp.getContext('2d', { willReadFrequently: true });
  if (!tctx) return { sharpness: 0, brightness: 0 };
  tctx.drawImage(canvas, sx, sy, sw, sh, 0, 0, N, N);

  const { data } = tctx.getImageData(0, 0, N, N);
  const gray = new Float32Array(N * N);
  let lumaSum = 0;
  for (let i = 0; i < N * N; i++) {
    const o = i * 4;
    const g = 0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2];
    gray[i] = g;
    lumaSum += g;
  }

  // Variance of the Laplacian over interior pixels.
  let sum = 0;
  let sumSq = 0;
  let n = 0;
  for (let y = 1; y < N - 1; y++) {
    for (let x = 1; x < N - 1; x++) {
      const i = y * N + x;
      const lap = 4 * gray[i] - gray[i - 1] - gray[i + 1] - gray[i - N] - gray[i + N];
      sum += lap;
      sumSq += lap * lap;
      n++;
    }
  }
  const variance = n ? sumSq / n - (sum / n) ** 2 : 0;

  // ~120 is a comfortably sharp face crop at this scale; clamp to 0–1.
  const sharpness = clamp01(variance / 120);

  // Peak at mid-grey (~128), fall off toward crushed blacks / blown highlights.
  const meanLuma = lumaSum / (N * N);
  const brightness = clamp01(1 - Math.abs(meanLuma - 128) / 110);

  return { sharpness, brightness };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Turn an uploaded/captured image (data URL) into a standard 35×45 ID photo,
 * auto-cropped around the detected face (falls back to a centre crop), and
 * return the face descriptor if a face was found (for optional biometric).
 */
export async function imageToIdData(
  dataUrl: string
): Promise<{ photo: string; descriptor: number[] | null }> {
  const img = await loadImage(dataUrl);
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  let box: { x: number; y: number; width: number; height: number } | null = null;
  let descriptor: number[] | null = null;
  try {
    // A still can have a small face anywhere in frame — pay for the larger input.
    const cap = await getFaceCaptureData(img, STILL_INPUT_SIZE);
    if (cap) {
      box = cap.box;
      descriptor = cap.descriptor;
    }
  } catch {
    /* detection optional */
  }

  const ratio = 35 / 45;
  let cw: number, ch: number, left: number, top: number;
  if (box) {
    let ph = box.height / 0.55;
    let pw = ph * ratio;
    const fcx = box.x + box.width / 2;
    top = box.y - ph * 0.22;
    left = fcx - pw / 2;
    if (pw > iw) { pw = iw; ph = pw / ratio; }
    if (ph > ih) { ph = ih; pw = ph * ratio; }
    left = Math.max(0, Math.min(left, iw - pw));
    top = Math.max(0, Math.min(top, ih - ph));
    cw = pw; ch = ph;
  } else {
    cw = iw; ch = iw / ratio;
    if (ch > ih) { ch = ih; cw = ih * ratio; }
    left = (iw - cw) / 2; top = (ih - ch) / 2;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 420;
  canvas.height = 540;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f2f4f8';
    ctx.fillRect(0, 0, 420, 540);
    ctx.drawImage(img, left, top, cw, ch, 0, 0, 420, 540);
  }
  return { photo: canvas.toDataURL('image/jpeg', 0.9), descriptor };
}

/**
 * Crop a standard 35×45 (7:9) ID photo from the video, centered on the face box.
 * `box` must be in raw-video coordinates (see VisibleFrame.toVideo).
 */
export function cropIdPhoto(
  video: HTMLVideoElement,
  box: { x: number; y: number; width: number; height: number }
): string {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const ratio = 35 / 45;
  let photoH = box.height / 0.55; // face box ≈ 55% of photo height
  let photoW = photoH * ratio;
  const faceCx = box.x + box.width / 2;
  let top = box.y - photoH * 0.22; // headroom
  let left = faceCx - photoW / 2;
  if (photoW > vw) { photoW = vw; photoH = photoW / ratio; }
  if (photoH > vh) { photoH = vh; photoW = photoH * ratio; }
  left = Math.max(0, Math.min(left, vw - photoW));
  top = Math.max(0, Math.min(top, vh - photoH));
  const canvas = document.createElement('canvas');
  canvas.width = 420;
  canvas.height = 540;
  const cx = canvas.getContext('2d');
  if (cx) {
    cx.fillStyle = '#f2f4f8';
    cx.fillRect(0, 0, 420, 540);
    cx.drawImage(video, left, top, photoW, photoH, 0, 0, 420, 540);
  }
  return canvas.toDataURL('image/jpeg', 0.9);
}
