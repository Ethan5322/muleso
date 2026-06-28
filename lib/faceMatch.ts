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
  const t = parseFloat(process.env.ADMIN_FACE_THRESHOLD || '0.5');
  return Number.isFinite(t) ? t : 0.5;
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
