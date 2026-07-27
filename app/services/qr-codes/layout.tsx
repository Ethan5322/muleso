import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Custom QR Code Services in South Africa',
  description:
    'Custom branded QR code products for menus, packaging & campaigns — your logo, live scan tracking. Made in Pretoria from R300. Get yours today.',
  path: '/services/qr-codes',
  keywords: [
    'custom qr code services',
    'qr code products south africa',
    'QR code design South Africa',
    'branded QR code Pretoria',
    'QR code with analytics',
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
