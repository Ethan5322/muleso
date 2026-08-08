import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import ChatbotLandingClient from './chatbot-landing-client';

export const metadata: Metadata = pageMetadata({
  title: 'AI Chatbots That Work 24/7 | MuleSoo',
  description: 'Intelligent AI chatbots that handle customer inquiries, book appointments, capture leads, and qualify prospects automatically. Starting from R2,500.',
  path: '/chatbot-landing',
  keywords: ['AI chatbot', 'chatbot development', 'automated customer service', 'WhatsApp chatbot', 'lead capture'],
});

export default function Page() {
  return <ChatbotLandingClient />;
}
