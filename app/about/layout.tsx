import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'About MuleSoo',
  description:
    'Meet the team behind MuleSoo Digital Services — a Pretoria-based studio building websites, AI chatbots and automation for African businesses.',
  path: '/about',
  keywords: ['about MuleSoo', 'digital agency Pretoria', 'web developer South Africa'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
