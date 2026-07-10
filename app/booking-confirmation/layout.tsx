import { pageMetadata } from '@/lib/seo';

// Utility page — useful to visitors, worthless in search results.
export const metadata = pageMetadata({
  title: 'Booking Confirmed',
  description: 'MuleSoo Digital Services.',
  path: '/booking-confirmation',
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
