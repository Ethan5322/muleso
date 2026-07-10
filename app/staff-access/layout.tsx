import { pageMetadata } from '@/lib/seo';

// Utility page — useful to visitors, worthless in search results.
export const metadata = pageMetadata({
  title: 'Staff Access',
  description: 'MuleSoo Digital Services.',
  path: '/staff-access',
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
