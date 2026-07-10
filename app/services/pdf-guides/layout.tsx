import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'PDF Guides & Digital Products',
  description:
    'Expert knowledge packaged as downloadable guides you can sell forever. We write, design and set up delivery.',
  path: '/services/pdf-guides',
  keywords: ['PDF guide design', 'digital product South Africa', 'sell ebooks online'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
