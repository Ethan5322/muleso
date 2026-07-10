import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'AI Chatbot Development',
  description:
    'AI chatbots that answer questions, qualify leads and book appointments 24/7. Trained on your business. From R2,500.',
  path: '/services/chatbot',
  keywords: ['AI chatbot South Africa', 'chatbot development Pretoria', 'WhatsApp chatbot'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
