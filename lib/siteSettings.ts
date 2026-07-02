/**
 * Site-wide content, editable from the admin and read by public pages.
 * Defaults are used as a fallback if the DB value is empty, so the site
 * never renders blank.
 */
export interface SiteSettings {
  // Business info
  phone: string;
  email: string;
  whatsapp: string; // digits only, for wa.me links
  address: string;
  hours: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  // Homepage content
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  stat1_value: string;
  stat1_label: string;
  stat2_value: string;
  stat2_label: string;
  stat3_value: string;
  stat3_label: string;
  stat4_value: string;
  stat4_label: string;
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
  hero_badge: 'AI-Powered Digital Solutions',
  hero_title: 'Digital Excellence',
  hero_subtitle: 'Professional websites, AI chatbots, logos, and digital solutions built for businesses across the world.',
  stat1_value: '50+',
  stat1_label: 'Projects Delivered',
  stat2_value: '100%',
  stat2_label: 'Client Satisfaction',
  stat3_value: '3+',
  stat3_label: 'Years Experience',
  stat4_value: '24/7',
  stat4_label: 'Support Available',
};

export const SETTINGS_FIELDS = Object.keys(DEFAULT_SETTINGS) as (keyof SiteSettings)[];

export function mergeSettings(partial: Partial<SiteSettings> | null | undefined): SiteSettings {
  const out: SiteSettings = { ...DEFAULT_SETTINGS };
  if (partial) {
    SETTINGS_FIELDS.forEach((k) => {
      const v = partial[k];
      // Only override the default when a real, non-empty value is provided
      if (typeof v === 'string' && v.trim() !== '') out[k] = v;
    });
  }
  return out;
}
