import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import LogoDesignClient from './logo-design-client';

export const metadata: Metadata = pageMetadata({
  title: 'Professional Logo Design | Brand Identity | MuleSoo',
  description: 'Professional logo design that makes your brand unforgettable. Unlimited revisions, all file formats included. Starting from R800.',
  path: '/logo-design-landing',
  keywords: ['logo design', 'brand identity', 'professional branding', 'logo creation', 'brand design'],
});

export default function LogoDesignLanding() {
  return <LogoDesignClient />;
}
