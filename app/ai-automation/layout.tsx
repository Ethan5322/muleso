import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'AI Automation Systems in Pretoria, South Africa',
  description:
    'Looking for AI automation near you? 200 ready-to-build AI systems for sales, bookings, finance & support. Built in Pretoria, South Africa. Explore now.',
  path: '/ai-automation',
  keywords: [
    'AI automation South Africa',
    'AI automation near me',
    'AI automation Pretoria',
    'business process automation Gauteng',
    'AI systems Pretoria',
  ],
});

const SITE = 'https://mulesoo.com';

/* Server-rendered so crawlers and answer engines read it in the initial HTML —
   the page body is a client component. The FAQPage schema for this route is not
   here on purpose: FaqSection emits it from the visible Q&A, which keeps the
   markup and the rendered text from drifting apart. */
const serviceLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'AI Automation Systems',
  serviceType:
    'AI automation systems, AI chatbot development, booking systems, automated collections',
  description:
    '200 ready-to-build AI systems across 9 industries — bookings, payments, reminders, support, lead handling and reporting — built for businesses in South Africa and across Africa.',
  provider: {
    '@type': 'Organization',
    '@id': SITE,
    name: 'MuleSoo Digital Services',
    url: SITE,
  },
  areaServed: [
    { '@type': 'Country', name: 'South Africa' },
    { '@type': 'Place', name: 'Africa' },
  ],
  url: `${SITE}/ai-automation`,
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
    { '@type': 'ListItem', position: 2, name: 'AI Automation', item: `${SITE}/ai-automation` },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {children}
    </>
  );
}
