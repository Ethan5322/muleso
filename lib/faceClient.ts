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
