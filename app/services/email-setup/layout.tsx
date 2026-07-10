import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Custom Business Email Setup',
  description:
    'Professional @yourdomain.com email that builds instant credibility. Full setup, migration and support. From R400.',
  path: '/services/email-setup',
  keywords: ['business email setup South Africa', 'custom domain email', 'professional email address'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
