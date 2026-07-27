import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'AI Automation Systems in Pretoria, South Africa',
  description:
    'Looking for AI automation near you? 200 ready-to-build AI systems for sales, bookings, finance & support. Built in Pretoria, South Africa. Explore now.',
  path: '/ai-automation',
  keywords: [
    'AI automation South Africa',
    'AI automation near me',
    'AI automation Pretoria',
    'business process automation Gauteng',
    'AI systems Pretoria',
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
