import ServiceFaqs from '@/components/ServiceFaqs';
import ServiceSchema from '@/components/ServiceSchema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Custom Web App Development',
  description:
    'Bespoke web applications built on Next.js, Supabase and Stripe. Dashboards, portals and internal tools.',
  path: '/services/custom-apps',
  keywords: ['custom web app development', 'Next.js developer South Africa', 'Supabase developer'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceSchema slug="custom-apps" />
      {children}
      <ServiceFaqs slug="custom-apps" />
    </>
  );
}
