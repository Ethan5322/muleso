import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Website Widgets & Live Chat',
  description:
    'Embeddable chat widgets, booking tools and interactive components for any website. One script tag.',
  path: '/services/design-widget',
  keywords: ['website widget', 'live chat widget South Africa', 'embeddable chatbot'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
