import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Auto Pilot Business Systems',
  description:
    'Complete systems that run your business while you sleep — bookings, payments, reminders and reporting. Live proof: Yoyo GYM.',
  path: '/services/autopilot',
  keywords: ['business automation South Africa', 'gym management system', 'booking system Pretoria'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
