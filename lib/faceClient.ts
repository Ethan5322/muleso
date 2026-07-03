/**
 * Client-side face-api loader + descriptor extractor.
 * Models load from the package CDN, so no large binaries live in the repo.
 * Only ever call these in the browser.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
let faceapi: any = null;
let modelsLoaded = false;
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

export async function loadFaceApi(): Promise<any> {
  if (!faceapi) {
    faceapi = await import('@vladmandic/face-api');
  }
  if (!modelsLoaded) {
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    modelsLoaded = true;
  }
  return faceapi;
}

export async function getFaceDescriptor(video: HTMLVideoElement): Promise<number[] | null> {
  const data = await getFaceCaptureData(video);
  return data ? data.descriptor : null;
}

export interface FaceCaptureData {
  descriptor: number[];
  box: { x: number; y: number; width: number; height: number };
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
    const fa = await loadFaceApi();
    const res = await fa
      .detectSingleFace(img, new fa.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.3 }))
      .withFaceLandmarks()
      .withFaceDescriptor();
    if (res) {
      const b = res.detection.box;
      box = { x: b.x, y: b.y, width: b.width, height: b.height };
      descriptor = Array.from(res.descriptor as Float32Array);
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

/** Crop a standard 35×45 (7:9) ID photo from the video, centered on the face box. */
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

/** Returns the face descriptor AND the detected face box (for ID-photo cropping). */
export async function getFaceCaptureData(video: HTMLVideoElement): Promise<FaceCaptureData | null> {
  const fa = await loadFaceApi();
  const result = await fa
    .detectSingleFace(video, new fa.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.3 }))
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (!result) return null;
  const b = result.detection.box;
  return {
    descriptor: Array.from(result.descriptor as Float32Array),
    box: { x: b.x, y: b.y, width: b.width, height: b.height },
  };
}
