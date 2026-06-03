'use client';

import ThreeBackground from '@/components/ThreeBackground';
import ChatbotWidget from '@/components/ChatbotWidget';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThreeBackground />
      {children}
      <ChatbotWidget />
    </>
  );
}
