import ServiceFaqs from '@/components/ServiceFaqs';
import ServiceSchema from '@/components/ServiceSchema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Logo & Brand Identity Design',
  description:
    'Professional logo design and brand identity for South African businesses. Print-ready files, full ownership. From $49.',
  path: '/services/logo-design',
  keywords: ['logo design South Africa', 'brand identity Pretoria', 'logo designer'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceSchema slug="logo-design" />
      {children}
      <ServiceFaqs slug="logo-design" />
    </>
  );
}
