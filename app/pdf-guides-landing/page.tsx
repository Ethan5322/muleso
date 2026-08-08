import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import PdfGuidesLandingClient from './pdf-guides-landing-client';

export const metadata: Metadata = pageMetadata({
  title: 'Expert PDF Guides & Digital Products | MuleSoo',
  description: 'Battle-tested guides built from real projects. Learn, build, and monetize. Resale rights included on all products. Starting from R149.',
  path: '/pdf-guides-landing',
  keywords: ['PDF guides', 'digital products', 'expert knowledge', 'online courses', 'resale rights'],
});

export default function Page() {
  return <PdfGuidesLandingClient />;
}
