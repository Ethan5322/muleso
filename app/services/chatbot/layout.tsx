import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'AI Chatbots & Booking Systems in South Africa',
  description:
    'AI chatbots & restaurant booking systems that answer questions, take reservations and qualify leads 24/7. Built in Pretoria from R2,500. Book a demo.',
  path: '/services/chatbot',
  keywords: [
    'AI chatbot South Africa',
    'restaurant booking system',
    'chatbot development Pretoria',
    'WhatsApp chatbot South Africa',
    'booking system South Africa',
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
