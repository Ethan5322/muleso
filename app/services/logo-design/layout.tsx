import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Logo & Brand Identity Design',
  description:
    'Professional logo design and brand identity for South African businesses. Print-ready files, full ownership. From R800.',
  path: '/services/logo-design',
  keywords: ['logo design South Africa', 'brand identity Pretoria', 'logo designer'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
