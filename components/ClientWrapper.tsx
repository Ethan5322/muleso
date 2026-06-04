'use client';

import ChatbotWidget from '@/components/ChatbotWidget';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ChatbotWidget />
    </>
  );
}
