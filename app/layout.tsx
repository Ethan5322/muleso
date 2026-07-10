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
    'MuleSoo builds professional websites, AI chatbots, logos, QR codes, and digital solutions for businesses across South Africa. Based in Pretoria. Fast delivery. Premium quality. Free consultation.',
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
              description: "Professional web design, AI chatbots, logos, and digital solutions for South African businesses.",
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
              areaServed: {
                "@type": "Country",
                name: "South Africa",
              },
              priceRange: "R300 - R15000",
              serviceType: ["Web Design", "AI Chatbots", "Logo Design", "QR Code Design", "Email Setup", "PDF Guides"],
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
              description: "Award-winning digital agency providing web design, AI chatbots, and custom digital solutions.",
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

        {/* BreadcrumbList Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://mulesoo.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Services",
                  item: "https://mulesoo.com/services",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Portfolio",
                  item: "https://mulesoo.com/portfolio",
                },
              ],
            }),
          }}
        />

        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: "https://mulesoo.com",
              name: "MuleSoo Digital Services",
              description: "Professional web design and digital solutions",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://mulesoo.com/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap"
          as="style"
        />

        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
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

