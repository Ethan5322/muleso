import ServiceFaqs from '@/components/ServiceFaqs';
import ServiceSchema from '@/components/ServiceSchema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Digital Staff ID Cards',
  description:
    'Corporate digital ID cards with scannable verification codes, face enrolment and an admin scanner. Built for teams.',
  path: '/services/digital-id',
  keywords: ['digital ID card', 'staff ID system South Africa', 'employee verification'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceSchema slug="digital-id" />
      {children}
      <ServiceFaqs slug="digital-id" />
    </>
  );
}
