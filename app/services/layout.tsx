import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Our Services',
  description:
    'Websites, AI chatbots, logo design, QR codes, custom email and AI automation — built in Pretoria for businesses across South Africa.',
  path: '/services',
  keywords: ['web design services South Africa', 'AI chatbot development', 'digital agency services Pretoria'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
