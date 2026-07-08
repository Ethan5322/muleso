import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://mulesoo.vercel.app';

const DISALLOW = ['/api/', '/admin/', '/corporate/', '/staff-access', '/verify', '/qr-download', '/.next/', '/static/'];

// Explicitly welcome the AI answer-engine crawlers so MuleSoo can be cited in
// ChatGPT / Gemini / Perplexity / Claude answers — as well as Google.
const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'anthropic-ai', 'Claude-Web', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      ...AI_BOTS.map((ua) => ({ userAgent: ua, allow: '/', disallow: DISALLOW })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
