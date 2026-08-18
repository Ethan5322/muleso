// Single source of truth for the digital-guide store.
// Each purchased copy is generated on demand (per-buyer watermark + password)
// from the book content in lib/guides — no static PDFs are stored or shipped.

export type AccentKey = 'gold' | 'blue' | 'purple' | 'green';

export interface StoreProduct {
  name: string;
  slug: string;
  emoji: string;
  /**
   * What the buyer is charged AND what the storefront displays. Paystack
   * settles in ZAR, so this is both the authoritative checkout amount and the
   * price we advertise — the two used to disagree, which meant a buyer saw
   * "$19" and then met "R299" on the payment page.
   */
  priceZAR: number;
  /** Secondary "≈ $…" courtesy line for overseas buyers. Never shown alone. */
  priceUSD: number;
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
    emoji: '🤖',
    priceZAR: 299,
    priceUSD: 19,
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
    emoji: '🚀',
    priceZAR: 249,
    priceUSD: 15,
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
    emoji: '💻',
    priceZAR: 249,
    priceUSD: 15,
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
    emoji: '🔌',
    priceZAR: 199,
    priceUSD: 12,
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
    emoji: '🐙',
    priceZAR: 149,
    priceUSD: 9,
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
    emoji: '📈',
    priceZAR: 349,
    priceUSD: 21,
    pages: '42',
    difficulty: 'All levels',
    description: 'The full marketing & sales master guide: positioning, offers, lead channels, scripts and a 30-day plan.',
    features: ['Positioning & offers', '7 lead channels', 'Sales scripts', '30-day plan'],
    accent: 'gold',
    available: true,
  },
  {
    name: 'Obsidian + Claude Code Master Guide',
    slug: 'obsidian-claude-code-guide',
    emoji: '🧠',
    priceZAR: 300,
    priceUSD: 18,
    pages: '8',
    difficulty: 'Beginner-Friendly',
    description: 'A click-by-click setup for Obsidian and the exact workflow for connecting it to a project you\'re already building with Claude Code — plan and link ideas visually, then hand them straight to Claude Code to build.',
    features: ['Zero-to-installed setup', 'Connect it to any Claude Code project', 'Notes, linking & search basics', 'The real Obsidian ↔ Claude Code loop'],
    accent: 'purple',
    available: true,
  },
];

export const findProductBySlug = (slug: string) => STORE_PRODUCTS.find((p) => p.slug === slug);
