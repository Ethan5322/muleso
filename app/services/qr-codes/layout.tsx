import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Custom Branded QR Codes',
  description:
    'Branded QR codes with analytics tracking for menus, business cards and campaigns. From R300.',
  path: '/services/qr-codes',
  keywords: ['QR code design South Africa', 'branded QR code', 'QR code with analytics'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
