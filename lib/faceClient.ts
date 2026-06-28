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
  const fa = await loadFaceApi();
  const result = await fa
    .detectSingleFace(video, new fa.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 }))
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (!result) return null;
  return Array.from(result.descriptor as Float32Array);
}
