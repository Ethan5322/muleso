import PageBreadcrumb from '@/components/PageBreadcrumb';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact Us',
  description:
    'Tell us what you need and we reply within 2 hours on business days. Based in Pretoria, serving all of South Africa and Africa.',
  path: '/contact',
  keywords: ['contact digital agency Pretoria', 'web design quote South Africa'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageBreadcrumb name="Contact" path="/contact" />
      {children}
    </>
  );
}
