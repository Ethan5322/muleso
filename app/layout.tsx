import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientWrapper from "@/components/ClientWrapper";
import AdminHeader from "@/components/AdminHeader";
import { ChatbotProvider } from "@/context/ChatbotContext";
import { AdminProvider } from "@/context/AdminContext";

export const metadata: Metadata = {
  title: {
    template: "%s | MuleSoo Digital Services",
    default: "MuleSoo | World-Class Websites & AI Solutions â€” Pretoria, South Africa",
  },
  description:
    "MuleSoo builds professional websites, AI chatbots, logos, QR codes, and digital solutions for businesses across South Africa. Based in Pretoria. Fast delivery. Premium quality. Free consultation.",
  keywords: [
    "web design Pretoria",
    "website design South Africa",
    "AI chatbot South Africa",
    "digital agency Pretoria",
    "logo design South Africa",
    "Next.js developer South Africa",
    "professional website builder",
    "AI automation South Africa",
    "chatbot development",
    "digital solutions Pretoria",
    "South African web developer",
    "affordable website design",
  ],
  alternates: {
    canonical: 'https://mulesoo.vercel.app',
  },
  openGraph: {
    title: "MuleSoo Digital Services | Professional Websites & AI Solutions",
    description: "World-class websites, AI chatbots, and digital solutions for South African businesses. Fast delivery. Premium quality.",
    url: "https://mulesoo.vercel.app",
    siteName: "MuleSoo",
    locale: "en_ZA",
    type: "website",
    images: [
      {
        url: "https://mulesoo.vercel.app/og-image.jpg",
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
    google: 'google-site-verification-code',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />

        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://mulesoo.vercel.app",
              name: "MuleSoo Digital Services",
              url: "https://mulesoo.vercel.app",
              logo: "https://mulesoo.vercel.app/logo.png",
              description: "Professional web design, AI chatbots, logos, and digital solutions for South African businesses.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Pretoria",
                addressLocality: "Pretoria",
                addressRegion: "Gauteng",
                postalCode: "0001",
                addressCountry: "ZA",
              },
              telephone: "+27759440377",
              email: "mulukenendashaw68@gmail.com",
              areaServed: {
                "@type": "Country",
                name: "South Africa",
              },
              priceRange: "R300 - R15000",
              serviceType: ["Web Design", "AI Chatbots", "Logo Design", "QR Code Design", "Email Setup", "PDF Guides"],
              sameAs: [
                "https://www.linkedin.com/company/mulesoo",
                "https://twitter.com/mulesoodigital",
                "https://www.instagram.com/mulesoodigital",
                "https://www.youtube.com/c/mulesoodigital",
              ],
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
              url: "https://mulesoo.vercel.app",
              logo: "https://mulesoo.vercel.app/logo.png",
              description: "Award-winning digital agency providing web design, AI chatbots, and custom digital solutions.",
              foundingDate: "2022",
              founders: [
                {
                  "@type": "Person",
                  name: "Ethan",
                }
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                telephone: "+27759440377",
                email: "mulukenendashaw68@gmail.com",
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
                  item: "https://mulesoo.vercel.app",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Services",
                  item: "https://mulesoo.vercel.app/services",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Portfolio",
                  item: "https://mulesoo.vercel.app/portfolio",
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
              url: "https://mulesoo.vercel.app",
              name: "MuleSoo Digital Services",
              description: "Professional web design and digital solutions",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://mulesoo.vercel.app/search?q={search_term_string}",
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
            <AdminHeader />
            <ClientWrapper>
              <Navbar />
              <main className="min-h-screen flex flex-col pt-20">{children}</main>
              <Footer />
            </ClientWrapper>
          </ChatbotProvider>
        </AdminProvider>
      </body>
    </html>
  );
}

