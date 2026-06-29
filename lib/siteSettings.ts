/**
 * Site-wide business info, editable from the admin and read by public pages.
 * Defaults are used as a fallback if the DB row is empty/unavailable, so the
 * site never renders blank.
 */
export interface SiteSettings {
  phone: string;
  email: string;
  whatsapp: string; // digits only, for wa.me links
  address: string;
  hours: string;
  linkedin: string;
  twitter: string;
  instagram: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  phone: '+27 68 852 9333',
  email: 'mulukenendashaw68@gmail.com',
  whatsapp: '27688529333',
  address: 'Pretoria, South Africa',
  hours: 'Mon–Fri 8am–6pm SAST | Sat 9am–1pm',
  linkedin: '',
  twitter: '',
  instagram: '',
};

export function mergeSettings(partial: Partial<SiteSettings> | null | undefined): SiteSettings {
  return { ...DEFAULT_SETTINGS, ...(partial || {}) };
}
