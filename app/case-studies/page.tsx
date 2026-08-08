import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import CaseStudiesClient from './case-studies-client';

export const metadata: Metadata = pageMetadata({
  title: 'Case Studies & Client Success Stories | MuleSoo',
  description: 'Real results from real clients. See how MuleSoo transformed businesses with AI automation, custom software, and digital solutions.',
  path: '/case-studies',
  keywords: ['case studies', 'client success', 'project results', 'business transformation', 'AI implementation'],
});

export default function CaseStudiesPage() {
  return <CaseStudiesClient />;
}
