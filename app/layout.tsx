import type { Metadata } from "next";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";
import { sameAsUrls } from "@/lib/socials";
import { ChatbotProvider } from "@/context/ChatbotContext";
import { AdminProvider } from "@/context/AdminContext";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://mulesoo.com";

export const metadata: Metadata = {
  title: {
    template: '%s | MuleSoo Digital Services',
    default: 'MuleSoo | World-Class Websites & AI Solutions - Pretoria, South Africa',
  },
  description:
    'Websites, AI chatbots, QR codes & automation for South African businesses — built in Pretoria. Fast delivery, premium quality. Get a free consultation today.',
  keywords: [
    'web design Pretoria',
    'website design South Africa',
    'AI chatbot South Africa',
    'digital agency Pretoria',
    'logo design South Africa',
    'Next.js developer South Africa',
    'professional website builder',
    'AI automation South Africa',
    'chatbot development',
    'digital solutions Pretoria',
    'South African web developer',
    'affordable website design',
  ],
  metadataBase: new URL(SITE_URL),
  // NO `alternates.canonical` here. Next.js inherits layout metadata into every
  // child page, so a canonical set at the root made all 220 sitemap URLs claim
  // to be the homepage and Google dropped them from the index. Each page now
  // declares its own via lib/seo.ts → pageMetadata().
  openGraph: {
    title: "MuleSoo Digital Services | Professional Websites & AI Solutions",
    description: "World-class websites, AI chatbots, and digital solutions for South African businesses. Fast delivery. Premium quality.",
    url: SITE_URL,
    siteName: "MuleSoo",
    locale: "en_ZA",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/mulesoo-website.jpg`,
        width: 1200,
        height: 630,
        alt: "MuleSoo Digital Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MuleSoo Digital Services",
    description: "Professional websites and AI solutions for South African businesses",
    creator: "@MuleSooDigital",
    images: [`${SITE_URL}/mulesoo-website.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Performance: Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Google Analytics (only when configured) */}
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `,
              }}
            />
          </>
        )}

        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://mulesoo.com",
              name: "MuleSoo Digital Services",
              url: "https://mulesoo.com",
              logo: "https://mulesoo.com/mulesoo-logo.png",
              description:
                "MuleSoo builds AI chatbots and AI automation systems — 200 systems across 9 industries — plus QR code design, digital ID and verification, complete Auto Pilot business systems and websites, for businesses in South Africa and across Africa.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Pretoria",
                addressLocality: "Pretoria",
                addressRegion: "Gauteng",
                postalCode: "0001",
                addressCountry: "ZA",
              },
              telephone: "+27688529333",
              email: "hello@mulesoo.com",
              // Pretoria city centre — a geo point lets Google place the business
              // on the map for "near me" / local-intent searches.
              geo: {
                "@type": "GeoCoordinates",
                latitude: -25.7479,
                longitude: 28.2293,
              },
              areaServed: [
                { "@type": "Country", name: "South Africa" },
                { "@type": "City", name: "Pretoria" },
                { "@type": "City", name: "Johannesburg" },
                { "@type": "AdministrativeArea", name: "Gauteng" },
              ],
              priceRange: "$19 - $899",
              serviceType: ["Web Design", "AI Chatbots", "Logo Design", "QR Code Design", "Email Setup", "PDF Guides", "AI Automation"],
              // Only profiles that actually exist. This previously claimed four
              // accounts that 404, under two different handles.
              ...(sameAsUrls().length ? { sameAs: sameAsUrls() } : {}),
            }),
          }}
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "MuleSoo Digital Services",
              url: "https://mulesoo.com",
              logo: "https://mulesoo.com/mulesoo-logo.png",
              // Kept factual: an unverifiable superlative in structured data is a
              // Google policy risk, and the visible site makes no such claim.
              description:
                "Digital agency in Pretoria providing websites, AI chatbots, AI automation systems, QR code design, digital ID verification and Auto Pilot business systems across South Africa and Africa.",
              foundingDate: "2022",
              founders: [
                {
                  "@type": "Person",
                  name: "Ena Muluken",
                }
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                telephone: "+27688529333",
                email: "hello@mulesoo.com",
              },
            }),
          }}
        />

        {/* No BreadcrumbList here.

            A breadcrumb states where THIS page sits. The one that used to live
            in this layout listed Home › Services › Portfolio and, because the
            root layout renders on every route, told Google that /about,
            /contact, /store, every service page and all 200 automation pages
            each sat at that same third position under Portfolio — a claim that
            was wrong everywhere except nowhere.

            Trails now come from the page that owns them: PageBreadcrumb on the
            section layouts, and the deeper Home › Services › X and
            Home › AI Automation › X in the service and automation layouts. */}

        {/* WebSite Schema.
            No SearchAction: the site has no /search results page, so claiming a
            sitelinks searchbox was a false signal Google would reject on test. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: "https://mulesoo.com",
              name: "MuleSoo Digital Services",
              description: "Professional web design, AI chatbots, QR codes and automation for South African businesses",
            }),
          }}
        />

        {/* Fonts load via @import in globals.css (render-blocking). Until that
            moves to next/font, preconnect to BOTH the stylesheet host and the
            font-file host (gstatic) so the .woff2 fetch starts as early as
            possible — the cheapest LCP win on mobile. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-x-hidden">
        <AdminProvider>
          <ChatbotProvider>
            <ClientWrapper>{children}</ClientWrapper>
          </ChatbotProvider>
        </AdminProvider>
      </body>
    </html>
  );
}

