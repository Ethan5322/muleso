import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import WebsiteDesignLandingClient from './website-design-landing-client';

export const metadata: Metadata = pageMetadata({
  title: 'Website Design That Converts | MuleSoo',
  description: 'Professional website design that converts visitors into paying customers. Fast loading, SEO optimized, fully responsive. Starting from R3,500.',
  path: '/website-design-landing',
  keywords: ['website design', 'professional websites', 'conversion-focused design', 'responsive web design', 'SEO websites'],
});

export default function Page() {
  return <WebsiteDesignLandingClient />;
}
