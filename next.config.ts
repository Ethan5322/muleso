import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable automatic image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Old standalone QR pages now live under Contact
  async redirects() {
    return [
      { source: '/qr-code', destination: '/contact/qr-code', permanent: true },
      { source: '/qr-download', destination: '/contact/qr-code', permanent: true },
    ];
  },
  // Optimize headers for SEO and performance
  async headers() {
    return [
      // Never cache authenticated surfaces or API responses.
      {
        source: '/admin/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
        ],
      },
      // Face-api model weights (6.7MB, content never changes for a given
      // face-api version). These MUST be cacheable — a site-wide no-store meant
      // re-downloading the 6.2MB recognition net on every page load.
      {
        source: '/models/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      // Security headers for everything. Cache-Control is deliberately absent so
      // Next.js' own per-route caching applies to public pages.
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
    ];
  },
  // Redirect trailing slashes for consistency
  trailingSlash: false,
  // Compress output
  compress: true,
  // Generate ETags for better caching
  generateEtags: true,
  // Power headers for SEO
  poweredByHeader: false,
};

export default nextConfig;
