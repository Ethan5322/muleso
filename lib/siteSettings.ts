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
  // Team — a JSON array of members, fully editable from the admin panel.
  team_members: string;
}

export type TeamAccent = 'blue' | 'purple' | 'green' | 'gold';
export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo: string; // data URL, empty = initials placeholder
  accent: TeamAccent;
}

export const DEFAULT_TEAM: TeamMember[] = [
  {
    name: 'Daniel Okonkwo',
    role: 'Vice President',
    bio: 'Daniel keeps MuleSoo moving — overseeing delivery, quality and the day-to-day so every project ships on time and to a world-class standard.',
    photo: '',
    accent: 'blue',
  },
  {
    name: 'Amara Dube',
    role: 'Social Media Manager',
    bio: 'Amara runs our social presence and content, telling the MuleSoo story and keeping our community engaged across every platform.',
    photo: '',
    accent: 'purple',
  },
  {
    name: 'Liam Petersen',
    role: 'Sales Manager',
    bio: 'Liam leads sales and client relationships — understanding exactly what each business needs and matching them to the right solution.',
    photo: '',
    accent: 'green',
  },
  {
    name: 'Yonas Tadesse',
    role: 'Operations Lead',
    bio: 'Yonas leads operations and client success, making sure every build runs smoothly from first kickoff call to final handover.',
    photo: '',
    accent: 'gold',
  },
];

/** Safely read the team array from a settings JSON string. */
export function parseTeam(json: string | undefined): TeamMember[] {
  if (!json) return DEFAULT_TEAM;
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) && arr.length ? (arr as TeamMember[]) : DEFAULT_TEAM;
  } catch {
    return DEFAULT_TEAM;
  }
}

export const DEFAULT_SETTINGS: SiteSettings = {
  phone: '+27 68 852 9333',
  email: 'hello@mulesoo.com',
  whatsapp: '27688529333',
  address: 'Pretoria, South Africa',
  hours: 'Mon–Fri 8am–6pm SAST | Sat 9am–1pm',
  linkedin: '',
  twitter: '',
  instagram: '',
  hero_badge: 'Intelligent Digital Solution',
  hero_title: 'Digital Excellence',
  hero_subtitle: 'AI Automation, Auto Pilot System, AI Chatbots, Professional Websites, Logos, and Digital Solutions built for businesses across the world.',
  stat1_value: '50+',
  stat1_label: 'Projects Delivered',
  stat2_value: '100%',
  stat2_label: 'Client Satisfaction',
  stat3_value: '3+',
  stat3_label: 'Years Experience',
  stat4_value: '24/7',
  stat4_label: 'Support Available',
  team_members: '',
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
