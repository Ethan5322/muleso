// Single source of truth for the digital-guide store.
// The `file` is looked up under the private `guides/` folder (repo root, NOT
// public) and only served after a payment is verified.

export type AccentKey = 'gold' | 'blue' | 'purple' | 'green';

export interface StoreProduct {
  name: string;
  slug: string;
  price: number; // ZAR
  file: string; // filename in /guides
  pages: string;
  difficulty: string;
  description: string;
  features: string[];
  accent: AccentKey;
}

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    name: 'Claude Code Master Guide',
    slug: 'claude-code-master-guide',
    price: 299,
    file: 'claude-code-master-guide.pdf',
    pages: '52',
    difficulty: 'Beginner-Friendly',
    description: 'Build any professional website using AI in days, not weeks.',
    features: ['Project setup', '7 master prompts', '3D animations', 'Deployment', 'SEO'],
    accent: 'gold',
  },
  {
    name: 'n8n Automation Bible',
    slug: 'n8n-automation-bible',
    price: 249,
    file: 'n8n-automation-bible.pdf',
    pages: '44',
    difficulty: 'Intermediate',
    description: 'Automate your entire business with zero code.',
    features: ['Email automation', 'Lead capture', 'Payment workflows', 'AI integrations'],
    accent: 'blue',
  },
  {
    name: 'Chatbot Business Blueprint',
    slug: 'chatbot-business-blueprint',
    price: 199,
    file: 'chatbot-business-blueprint.pdf',
    pages: '38',
    difficulty: 'Beginner-Friendly',
    description: 'How to start a chatbot agency and land R5,000+ clients.',
    features: ['Niche selection', 'Client scripts', 'Pricing', 'Claude API setup'],
    accent: 'purple',
  },
  {
    name: 'Netlify Deployment Guide',
    slug: 'netlify-deployment-guide',
    price: 149,
    file: 'netlify-deployment-guide.pdf',
    pages: '28',
    difficulty: 'Beginner-Friendly',
    description: 'Deploy any website professionally in under 30 minutes.',
    features: ['Project setup', 'Environment vars', 'Custom domain', 'CI/CD'],
    accent: 'green',
  },
];

export const findProductBySlug = (slug: string) => STORE_PRODUCTS.find((p) => p.slug === slug);
