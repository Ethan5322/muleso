// Single source of truth for the digital-guide store.
// Each purchased copy is generated on demand (per-buyer watermark + password)
// from the book content in lib/guides — no static PDFs are stored or shipped.

export type AccentKey = 'gold' | 'blue' | 'purple' | 'green';

export interface StoreProduct {
  name: string;
  slug: string;
  price: number; // ZAR
  pages: string;
  difficulty: string;
  description: string;
  features: string[];
  accent: AccentKey;
  /** Only buyable once the book content exists in lib/guides/registry. */
  available: boolean;
}

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    name: 'Make Money With AI Chatbots',
    slug: 'make-money-ai-chatbots',
    price: 299,
    pages: '30+',
    difficulty: 'Beginner-Friendly',
    description: 'Start a chatbot business and land R5,000+ clients — even if you can’t code. The exact playbook we use.',
    features: ['Pick a profitable niche', 'Build without coding', 'Pricing & retainers', 'Find & close clients', '90-day plan'],
    accent: 'purple',
    available: true,
  },
  {
    name: 'Beginner to Pro: Websites That Sell',
    slug: 'beginner-to-pro-website',
    price: 249,
    pages: '40+',
    difficulty: 'Beginner-Friendly',
    description: 'Go from zero to launching professional, high-converting websites clients happily pay for.',
    features: ['Design that converts', 'Modern tools', 'Client-ready builds', 'Launch checklist'],
    accent: 'blue',
    available: true,
  },
  {
    name: 'Build a Pro Website With Claude Code',
    slug: 'build-pro-website-claude-code',
    price: 249,
    pages: '35+',
    difficulty: 'Beginner-Friendly',
    description: 'Use AI to build stunning, professional websites in days, not weeks — step by step.',
    features: ['Project setup', 'Master prompts', 'Animations', 'Deploy & SEO'],
    accent: 'gold',
    available: true,
  },
  {
    name: 'Claude Code MCP Master Guide',
    slug: 'claude-code-mcp-master',
    price: 199,
    pages: '28+',
    difficulty: 'Intermediate',
    description: 'Supercharge Claude Code with MCP — connect tools, data and automations like a pro.',
    features: ['What MCP is', 'Setup & servers', 'Real workflows', 'Advanced tips'],
    accent: 'green',
    available: true,
  },
  {
    name: 'Publish Your Website on GitHub',
    slug: 'github-website-publishing',
    price: 149,
    pages: '24+',
    difficulty: 'Beginner-Friendly',
    description: 'Get your website online, properly, in under 30 minutes — the clean, professional way.',
    features: ['Git basics', 'Repos & pages', 'Custom domain', 'Go live'],
    accent: 'blue',
    available: true,
  },
  {
    name: 'The MuleSoo Growth Playbook',
    slug: 'mulesoo-growth-playbook',
    price: 349,
    pages: '42',
    difficulty: 'All levels',
    description: 'The full marketing & sales master guide: positioning, offers, lead channels, scripts and a 30-day plan.',
    features: ['Positioning & offers', '7 lead channels', 'Sales scripts', '30-day plan'],
    accent: 'gold',
    available: true,
  },
];

export const findProductBySlug = (slug: string) => STORE_PRODUCTS.find((p) => p.slug === slug);
