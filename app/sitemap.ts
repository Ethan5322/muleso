import { MetadataRoute } from 'next';
import { AUTOMATIONS } from '@/lib/aiAutomations';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://mulesoo.vercel.app';
  const now = new Date();

  // Core marketing pages
  const core: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/services`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/ai-automation`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/portfolio`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/store`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact/qr-code`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Individual service pages
  const serviceSlugs = [
    'website-design',
    'chatbot',
    'design-widget',
    'logo-design',
    'pdf-guides',
    'qr-codes',
    'email-setup',
    'custom-apps',
    'digital-id',
    'autopilot',
  ];
  const services: MetadataRoute.Sitemap = serviceSlugs.map((s) => ({
    url: `${baseUrl}/services/${s}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Every AI automation system — 200 long-tail landing pages
  const automations: MetadataRoute.Sitemap = AUTOMATIONS.map((a) => ({
    url: `${baseUrl}/ai-automation/${a.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...core, ...services, ...automations].map((entry) => ({
    ...entry,
    lastModified: now,
  }));
}
