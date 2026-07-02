'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ChatbotWidget from '@/components/ChatbotWidget';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShapeLandingHero } from '@/components/ui/shape-landing-hero';
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

        // Don't track admin / corporate routes
        if (pathname.startsWith('/admin') || pathname.startsWith('/corporate')) {
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

  // Admin & corporate routes provide their own shell — no public chrome.
  if (pathname.startsWith('/admin') || pathname.startsWith('/corporate')) {
    return <>{children}</>;
  }

  return (
    <>
      <ShapeLandingHero />
      <Navbar />
      <main className="min-h-screen flex flex-col pt-20">{children}</main>
      <Footer />
      <ChatbotWidget />
    </>
  );
}
