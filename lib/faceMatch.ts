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
  // Tolerant-but-safe default (0.5). Same-person distances are typically < 0.4;
  // different people > 0.6. 0.5 leaves head-room for appearance changes (beard,
  // haircut, lighting) while still rejecting other people — and face is only one
  // factor (password + 2FA remain). Tune with ADMIN_FACE_THRESHOLD.
  const t = parseFloat(process.env.ADMIN_FACE_THRESHOLD || '0.5');
  return Number.isFinite(t) ? t : 0.5;
}

// How many reference samples to keep. Adaptive login samples are added over
// time so the template tracks the person's CURRENT appearance.
export const ADAPTIVE_CAP = 40;

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
  // Keep a light centroid guard so a random face far from the person's average
  // is still rejected — but weight it lower so a genuine appearance change
  // (which drifts from the old-look centroid) isn't over-penalised.
  const centroid = meanDescriptor(refs)!;
  const cd = euclideanDistance(input, centroid);
  return Math.max(meanClosest, cd * 0.62);
}

/**
 * Adaptive learning: after a confident login, remember the new face sample so
 * the template keeps up with the person's current look. Keeps only the newest
 * ADAPTIVE_CAP samples so it tracks recent appearance and stays bounded.
 */
export async function addAdaptiveSample(descriptor: number[]): Promise<void> {
  if (!Array.isArray(descriptor) || descriptor.length !== FACE_DESCRIPTOR_LENGTH) return;
  try {
    await supabaseAdmin.from('admin_face_descriptors').insert({
      label: 'adaptive',
      descriptor: descriptor.map((n) => Number(Number(n).toFixed(5))),
    });
    // Prune oldest beyond the cap (best-effort; needs a created_at column).
    const { data } = await supabaseAdmin
      .from('admin_face_descriptors')
      .select('id, created_at')
      .order('created_at', { ascending: false });
    if (data && data.length > ADAPTIVE_CAP) {
      const stale = data.slice(ADAPTIVE_CAP).map((r: { id: unknown }) => r.id);
      if (stale.length) await supabaseAdmin.from('admin_face_descriptors').delete().in('id', stale);
    }
  } catch (e) {
    console.error('adaptive face sample failed (non-fatal):', e);
  }
}
