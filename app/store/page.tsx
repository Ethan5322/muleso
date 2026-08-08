import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import StoreClient from './store-client';

export const metadata: Metadata = pageMetadata({
  title: 'PDF Guides & Automation Systems | MuleSoo Store',
  description: 'Expert digital products: PDF guides, AI automation systems, and complete business platforms. Buy once, use forever.',
  path: '/store',
  keywords: ['pdf guides', 'digital products', 'AI automation', 'business systems'],
});

export default function StorePage() {
  return <StoreClient />;
}
