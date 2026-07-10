import { pageMetadata } from '@/lib/seo';

// Utility page — useful to visitors, worthless in search results.
export const metadata = pageMetadata({
  title: 'Payment Confirmed',
  description: 'MuleSoo Digital Services.',
  path: '/store/success',
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
