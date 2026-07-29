import type { AccentKey } from './storeProducts';

// "Done-for-you" systems adapted from real MuleSoo builds. These are custom
// projects, not files — clicking books them through the chatbot widget (deposit
// via Paystack), rather than delivering a download. Each has an affordable
// monthly care plan (hosting, support & updates) to lower the barrier.

export interface SystemProduct {
  slug: string;
  emoji: string;
  brand: string; // elegant product name
  tagline: string; // what it is
  category: string;
  fromPrice: number; // USD — "From $…" setup
  monthly: number; // USD — monthly care plan
  accent: AccentKey;
  description: string;
  features: string[];
  enterprise?: boolean;
}

export const SYSTEM_PRODUCTS: SystemProduct[] = [
  {
    slug: 'apex-gym-platform',
    emoji: '🏋️',
    brand: 'Apex',
    tagline: 'AI Gym & Membership Platform',
    category: 'Gym Platform',
    fromPrice: 2199,
    monthly: 89,
    accent: 'purple',
    description: 'A complete gym on autopilot — AI join-flow, live membership tiers, recurring billing and face/QR check-in.',
    features: ['AI join-flow + screening', 'Memberships & recurring billing', 'Face & QR check-in', 'Full admin dashboard'],
  },
  {
    slug: 'feast-catering-suite',
    emoji: '🍽️',
    brand: 'Feast',
    tagline: 'Catering & Events Booking Suite',
    category: 'Catering',
    fromPrice: 549,
    monthly: 39,
    accent: 'gold',
    description: 'Turn enquiries into paid bookings automatically — AI quotes, deposit payments and calendar sync.',
    features: ['AI enquiry & quotes', 'Deposit payments', 'Calendar sync', 'WhatsApp confirmations'],
  },
  {
    slug: 'lumiere-events-platform',
    emoji: '🎉',
    brand: 'Lumière',
    tagline: 'Events Booking & Deposit Platform',
    category: 'Events',
    fromPrice: 599,
    monthly: 39,
    accent: 'purple',
    description: 'A polished events platform that books clients and takes deposits while you sleep.',
    features: ['AI bookings', 'Online deposits', 'Package selection', 'Instant owner alerts'],
  },
  {
    slug: 'aperture-studio-site',
    emoji: '📸',
    brand: 'Aperture',
    tagline: 'Studio & Booking Website',
    category: 'Photography',
    fromPrice: 449,
    monthly: 29,
    accent: 'blue',
    description: 'A stunning portfolio site that lets clients view your work and book a shoot with a deposit.',
    features: ['Portfolio gallery', 'Online booking', 'Deposit payments', 'Mobile-first design'],
  },
  {
    slug: 'celebra-events-website',
    emoji: '💐',
    brand: 'Celebra',
    tagline: 'Event Planning Website',
    category: 'Website',
    fromPrice: 499,
    monthly: 29,
    accent: 'gold',
    description: 'An elegant, high-converting website for event planners — beautiful, fast and enquiry-ready.',
    features: ['Elegant design', 'Enquiry bookings', 'Gallery', 'Fast & SEO-ready'],
  },
  {
    slug: 'concierge-ai-assistant',
    emoji: '💬',
    brand: 'Concierge',
    tagline: '24/7 AI Booking Assistant',
    category: 'AI Chatbot',
    fromPrice: 319,
    monthly: 29,
    accent: 'green',
    description: 'An AI assistant that answers, qualifies and books your customers around the clock — on web and WhatsApp.',
    features: ['Natural conversation', 'Lead capture', 'Books appointments', 'WhatsApp integration'],
  },
  {
    slug: 'vitalis-clinic-system',
    emoji: '🏥',
    brand: 'Vitalis',
    tagline: 'AI Clinic & Patient System',
    category: 'Healthcare · Enterprise',
    fromPrice: 3699,
    monthly: 199,
    accent: 'blue',
    description: 'An enterprise clinic system: patient intake, AI triage support, live queue and secure records.',
    features: ['QR patient intake', 'AI triage support', 'Queue & records', 'Secure & POPIA-ready'],
    enterprise: true,
  },
];

export const systemDisplayName = (s: SystemProduct) => `${s.brand} — ${s.tagline}`;
