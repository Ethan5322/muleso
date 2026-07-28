import JsonLd from '@/components/JsonLd';
import { findServiceAeo, serviceJsonLd, serviceBreadcrumbJsonLd } from '@/lib/serviceAeo';

/**
 * Per-page structured data for a /services/* page: what the service is, what it
 * costs, who provides it, and where it sits in the site.
 *
 * Rendered from the page's `layout.tsx` because the page bodies are client
 * components — the schema has to be in the server-rendered HTML to be read at
 * all. Silently renders nothing for an unknown slug rather than throwing: a
 * missing schema block costs some rich-result eligibility, a build failure
 * costs the whole page.
 */
export default function ServiceSchema({ slug }: { slug: string }) {
  const service = findServiceAeo(slug);
  if (!service) return null;

  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />
      <JsonLd data={serviceBreadcrumbJsonLd(service)} />
    </>
  );
}
