import type { Metadata } from 'next';
import { AUTOMATIONS, findAutomation, getDetail } from '@/lib/aiAutomations';
import { pageMetadata, SITE_URL } from '@/lib/seo';

/**
 * The 200 automation pages are the long-tail play. Each needs its own title,
 * description and canonical or they collapse into one duplicate cluster.
 * The page body is a client component, so metadata lives in this layout.
 */

// Pre-render all 200 automation pages at build time. Static HTML crawls fast
// and never re-renders per request, which lifts them out of Google's
// "Discovered – currently not indexed" (low crawl priority) bucket.
export function generateStaticParams() {
  return AUTOMATIONS.map((a) => ({ slug: a.slug }));
}

// Any slug NOT in generateStaticParams() returns a real HTTP 404 instead of a
// soft-404 (200 response with "not found" text), which Google flags as broken.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const automation = findAutomation(slug);

  if (!automation) {
    return pageMetadata({
      title: 'Automation Not Found',
      description: 'This AI automation system could not be found.',
      path: `/ai-automation/${slug}`,
      noIndex: true,
    });
  }

  // Descriptions are capped near 155 chars so Google shows them whole.
  const desc = `${automation.desc} An AI automation system for ${automation.category.toLowerCase()}, built by MuleSoo in Pretoria, South Africa.`;

  return pageMetadata({
    title: automation.name,
    description: desc.length > 158 ? `${desc.slice(0, 155).trimEnd()}…` : desc,
    path: `/ai-automation/${automation.slug}`,
    keywords: [
      automation.name,
      `${automation.category} automation`,
      'AI automation South Africa',
      'business automation Pretoria',
    ],
  });
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const automation = findAutomation(slug);

  // Per-page structured data: a Service offered by MuleSoo, plus a breadcrumb
  // trail. This gives Google unique, machine-readable meaning for each of the
  // 200 pages so it can index and rank them individually.
  const jsonLd = automation
    ? {
        service: {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: automation.name,
          description: getDetail(automation.name).problem,
          serviceType: `${automation.category} AI automation`,
          areaServed: { '@type': 'Country', name: 'South Africa' },
          provider: {
            '@type': 'Organization',
            name: 'MuleSoo Digital Services',
            url: SITE_URL,
          },
          url: `${SITE_URL}/ai-automation/${automation.slug}`,
        },
        breadcrumb: {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'AI Automation',
              item: `${SITE_URL}/ai-automation`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: automation.name,
              item: `${SITE_URL}/ai-automation/${automation.slug}`,
            },
          ],
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.service) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.breadcrumb) }}
          />
        </>
      )}
      {children}
    </>
  );
}
