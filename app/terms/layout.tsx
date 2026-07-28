import PageBreadcrumb from '@/components/PageBreadcrumb';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Terms of Service',
  description:
    'The terms governing the use of MuleSoo Digital Services and our website.',
  path: '/terms',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageBreadcrumb name="Terms of Service" path="/terms" />
      {children}
    </>
  );
}
