'use client';

import { ShapeLandingHero } from '@/components/ui/shape-landing-hero';
import ChatbotWidget from '@/components/ChatbotWidget';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ShapeLandingHero />
      {children}
      <ChatbotWidget />
    </>
  );
}
