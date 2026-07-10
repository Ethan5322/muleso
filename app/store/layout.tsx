import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'PDF Store',
  description:
    'Battle-tested guides on Claude Code, n8n automation and chatbot businesses. Instant download, secure payment.',
  path: '/store',
  keywords: ['Claude Code guide', 'n8n automation guide', 'chatbot business blueprint'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
