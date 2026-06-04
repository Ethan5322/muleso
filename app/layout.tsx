import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientWrapper from "@/components/ClientWrapper";
import { ChatbotProvider } from "@/context/ChatbotContext";

export const metadata: Metadata = {
  title: {
    template: "%s | MuleSoo Digital Services",
    default: "MuleSoo | World-Class Websites & AI Solutions — Pretoria, SA",
  },
  description:
    "MuleSoo builds professional websites, AI chatbots, logos, and digital solutions for businesses across South Africa. Based in Pretoria. Fast delivery. Premium quality.",
  keywords: [
    "web design Pretoria",
    "AI chatbot South Africa",
    "website design South Africa",
    "digital agency Pretoria",
    "Next.js developer South Africa",
  ],
  openGraph: {
    title: "MuleSoo Digital Services",
    description: "World-class websites and AI solutions for South African businesses.",
    url: "https://mulesoo.com",
    siteName: "MuleSoo",
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MuleSoo Digital Services",
  },
  robots: {
    index: true,
    follow: true,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "MuleSoo Digital Services",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Pretoria",
                addressCountry: "ZA",
              },
              priceRange: "R500 - R15000",
              serviceArea: "South Africa",
            }),
          }}
        />
      </head>
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-x-hidden">
        <ChatbotProvider>
          <ClientWrapper>
            <Navbar />
            <main className="min-h-screen flex flex-col pt-20">{children}</main>
            <Footer />
          </ClientWrapper>
        </ChatbotProvider>
      </body>
    </html>
  );
}
