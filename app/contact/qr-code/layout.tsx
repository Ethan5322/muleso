import { pageMetadata } from '@/lib/seo';

// Utility page — useful to visitors, worthless in search results.
export const metadata = pageMetadata({
  title: 'QR Code',
  description: 'MuleSoo Digital Services.',
  path: '/contact/qr-code',
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
