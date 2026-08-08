import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import CustomAppsLandingClient from './custom-apps-landing-client';

export const metadata: Metadata = pageMetadata({
  title: 'Custom Software Development | Enterprise Apps | MuleSoo',
  description: 'Custom web and mobile applications built for your exact business workflow. Scalable, secure, and tailored to your needs. Starting from R20,000.',
  path: '/custom-apps-landing',
  keywords: ['custom software', 'enterprise apps', 'web application development', 'mobile app development', 'business automation'],
});

export default function Page() {
  return <CustomAppsLandingClient />;
}
