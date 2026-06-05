'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ChatbotWidget from '@/components/ChatbotWidget';
import { supabase } from '@/lib/supabase';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Track visitor on page load
    const trackVisitor = async () => {
      try {
        // Detect device type
        const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

        // Get referrer
        const referrer = document.referrer || null;

        // Don't track admin routes
        if (pathname.startsWith('/admin')) {
          return;
        }

        await supabase.from('visitors').insert({
          page: pathname,
          device: isMobile ? 'mobile' : 'desktop',
          referrer,
        });
      } catch (error) {
        console.error('Error tracking visitor:', error);
      }
    };

    trackVisitor();
  }, [pathname]);

  useEffect(() => {
    // Track QR scans on /qr-code route
    const trackQRScan = async () => {
      try {
        if (pathname === '/qr-code') {
          await supabase.from('qr_scans').insert({
            source: document.referrer || 'direct',
          });
        }
      } catch (error) {
        console.error('Error tracking QR scan:', error);
      }
    };

    trackQRScan();
  }, [pathname]);

  return (
    <>
      {children}
      <ChatbotWidget />
    </>
  );
}
