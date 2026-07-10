import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'AI Automation Systems',
  description:
    'Two hundred AI automation systems across every department — sales, finance, HR, operations and support. Built for African businesses.',
  path: '/ai-automation',
  keywords: ['AI automation South Africa', 'business process automation', 'AI systems Pretoria'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
