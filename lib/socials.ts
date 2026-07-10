/**
 * Single source of truth for MuleSoo's social presence.
 *
 * ONE handle everywhere: `mulesoo`. Matching the domain across every platform is
 * what makes a brand searchable — people guess handles from the domain, and
 * Google links profiles to the business entity partly by name consistency.
 *
 * `live` gates everything. A profile is only rendered in the footer, and only
 * claimed in the Organization `sameAs` schema, once it actually exists. Linking
 * to a profile you have not created yet gives visitors a 404 and tells Google
 * you own an entity you do not — both worse than showing nothing.
 *
 * WORKFLOW: register the account with the handle below, then flip `live: true`.
 */

export const HANDLE = 'mulesoo';

/** Fallback if `mulesoo` is taken on a platform. Keep the same everywhere. */
export const HANDLE_ALT = 'mulesoodigital';

export interface SocialProfile {
  key: string;
  /** Display name, used for aria-labels. */
  name: string;
  /** What to type when registering. */
  handle: string;
  url: string;
  /** Flip to true only once the account exists. */
  live: boolean;
  /** Shown in the footer once live. Others are for schema + link-in-bio only. */
  inFooter: boolean;
}

export const SOCIAL_PROFILES: SocialProfile[] = [
  // Tier 1 — these move the needle for a B2B agency. Create these first.
  { key: 'linkedin', name: 'LinkedIn', handle: `company/${HANDLE}`, url: `https://www.linkedin.com/company/${HANDLE}`, live: false, inFooter: true },
  { key: 'instagram', name: 'Instagram', handle: `@${HANDLE}`, url: `https://www.instagram.com/${HANDLE}`, live: false, inFooter: true },
  { key: 'facebook', name: 'Facebook', handle: `/${HANDLE}`, url: `https://www.facebook.com/${HANDLE}`, live: false, inFooter: true },
  { key: 'youtube', name: 'YouTube', handle: `@${HANDLE}`, url: `https://www.youtube.com/@${HANDLE}`, live: false, inFooter: true },
  { key: 'tiktok', name: 'TikTok', handle: `@${HANDLE}`, url: `https://www.tiktok.com/@${HANDLE}`, live: false, inFooter: true },
  { key: 'twitter', name: 'X', handle: `@${HANDLE}`, url: `https://x.com/${HANDLE}`, live: false, inFooter: true },

  // Tier 2 — worth owning so nobody else takes the name, lower priority.
  { key: 'threads', name: 'Threads', handle: `@${HANDLE}`, url: `https://www.threads.net/@${HANDLE}`, live: false, inFooter: false },
  { key: 'github', name: 'GitHub', handle: HANDLE, url: `https://github.com/${HANDLE}`, live: false, inFooter: false },
  { key: 'behance', name: 'Behance', handle: HANDLE, url: `https://www.behance.net/${HANDLE}`, live: false, inFooter: false },
  { key: 'pinterest', name: 'Pinterest', handle: HANDLE, url: `https://www.pinterest.com/${HANDLE}`, live: false, inFooter: false },
  { key: 'medium', name: 'Medium', handle: `@${HANDLE}`, url: `https://medium.com/@${HANDLE}`, live: false, inFooter: false },

  // Already real — the WhatsApp number is in service today.
  { key: 'whatsapp', name: 'WhatsApp', handle: '+27 68 852 9333', url: 'https://wa.me/27688529333', live: true, inFooter: true },
];

export const liveProfiles = () => SOCIAL_PROFILES.filter((p) => p.live);

/**
 * `sameAs` for the Organization/LocalBusiness schema. Only live profiles — a
 * sameAs pointing at a 404 is a claim Google can check and disbelieve.
 * Note: wa.me is a contact link, not a social profile, so it is excluded.
 */
export const sameAsUrls = () => liveProfiles().filter((p) => p.key !== 'whatsapp').map((p) => p.url);
