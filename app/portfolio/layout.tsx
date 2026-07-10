import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Portfolio',
  description:
    'Real projects: Ethiopian wedding platforms, gym management systems, corporate chatbots and e-commerce builds across Africa.',
  path: '/portfolio',
  keywords: ['web design portfolio South Africa', 'digital agency work', 'chatbot examples'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
