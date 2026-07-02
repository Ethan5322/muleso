/**
 * Server-side face matching helpers.
 * The browser computes 128-float face descriptors (via face-api); the server
 * compares an incoming descriptor to the enrolled references and decides the
 * match server-side, so a client cannot fake a pass.
 *
 * References come from two places:
 *  - the Supabase `admin_face_descriptors` table (preferred — multiple samples)
 *  - the ADMIN_FACE_DESCRIPTOR env var (optional single fallback)
 */
import { supabaseAdmin } from './supabaseAdmin';

export const FACE_DESCRIPTOR_LENGTH = 128;

export function getThreshold(): number {
  // Stricter default (0.46) to cut false accepts. Same-person distances are
  // typically < 0.4; different people > 0.6.
  const t = parseFloat(process.env.ADMIN_FACE_THRESHOLD || '0.46');
  return Number.isFinite(t) ? t : 0.46;
}

export function getEnvReference(): number[] | null {
  const raw = process.env.ADMIN_FACE_DESCRIPTOR;
  if (!raw) return null;
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) && arr.length === FACE_DESCRIPTOR_LENGTH ? arr.map(Number) : null;
  } catch {
    return null;
  }
}

export async function getStoredReferences(): Promise<number[][]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_face_descriptors')
      .select('descriptor');
    if (error || !data) return [];
    return data
      .map((r: { descriptor: unknown }) =>
        Array.isArray(r.descriptor) ? (r.descriptor as number[]).map(Number) : []
      )
      .filter((d) => d.length === FACE_DESCRIPTOR_LENGTH);
  } catch {
    return [];
  }
}

export async function getAllReferences(): Promise<number[][]> {
  const refs = await getStoredReferences();
  const env = getEnvReference();
  if (env) refs.push(env);
  return refs;
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

/** Smallest distance between an input descriptor and any reference sample. */
export function bestDistance(input: number[], refs: number[][]): number {
  let best = Infinity;
  for (const r of refs) {
    const d = euclideanDistance(input, r);
    if (d < best) best = d;
  }
  return best;
}

/** Average of all reference descriptors (the person's template centroid). */
export function meanDescriptor(refs: number[][]): number[] | null {
  if (!refs.length) return null;
  const n = refs[0].length;
  const out = new Array(n).fill(0);
  for (const r of refs) for (let i = 0; i < n; i++) out[i] += r[i];
  for (let i = 0; i < n; i++) out[i] /= refs.length;
  return out;
}

/**
 * Robust match distance: the MEAN of the k closest reference samples. This is
 * far less prone to false accepts than the single-closest sample (which, with
 * several enrolled samples, lets many faces sneak under the threshold).
 */
export function robustDistance(input: number[], refs: number[][], k = 3): number {
  if (!refs.length) return Infinity;
  const dists = refs.map((r) => euclideanDistance(input, r)).sort((a, b) => a - b);
  const take = Math.min(k, dists.length);
  let sum = 0;
  for (let i = 0; i < take; i++) sum += dists[i];
  const meanClosest = sum / take;
  // Also require closeness to the centroid, so a random face far from the
  // person's average is rejected even if it happens to be near one sample.
  const centroid = meanDescriptor(refs)!;
  const cd = euclideanDistance(input, centroid);
  return Math.max(meanClosest, cd * 0.9);
}
