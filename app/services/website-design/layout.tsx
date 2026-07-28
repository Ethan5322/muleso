import ServiceFaqs from '@/components/ServiceFaqs';
import ServiceSchema from '@/components/ServiceSchema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Website Design in Pretoria',
  description:
    'Fast, SEO-ready websites built with Next.js. Starting from R3,500 with a 2-week delivery. Mobile responsive, you own the source code.',
  path: '/services/website-design',
  keywords: ['website design Pretoria', 'web design South Africa', 'Next.js developer South Africa'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceSchema slug="website-design" />
      {children}
      <ServiceFaqs slug="website-design" />
    </>
  );
}
