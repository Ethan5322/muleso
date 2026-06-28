/**
 * Server-side face matching helpers.
 * The browser computes a 128-float face descriptor (via face-api); the
 * server compares it to the enrolled reference stored in ADMIN_FACE_DESCRIPTOR.
 * Keeping the match decision server-side means a client cannot simply fake a pass.
 */

export const FACE_DESCRIPTOR_LENGTH = 128;

export function getReferenceDescriptor(): number[] | null {
  const raw = process.env.ADMIN_FACE_DESCRIPTOR;
  if (!raw) return null;
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) && arr.length === FACE_DESCRIPTOR_LENGTH ? arr.map(Number) : null;
  } catch {
    return null;
  }
}

export function getThreshold(): number {
  const t = parseFloat(process.env.ADMIN_FACE_THRESHOLD || '0.5');
  return Number.isFinite(t) ? t : 0.5;
}

export function euclideanDistance(a: number[], b: number[]): number {
  if (a.length !== b.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
}
