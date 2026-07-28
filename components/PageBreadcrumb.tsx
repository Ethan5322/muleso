import JsonLd from '@/components/JsonLd';
import { SITE_URL } from '@/lib/seo';

/**
 * A two-level trail — Home › This Page — for a top-level section.
 *
 * Deeper pages build their own longer trails (see ServiceSchema and the
 * automation layout) and must not also render this, or the page ends up
 * claiming two conflicting positions for itself.
 *
 * Breadcrumbs earn their place in search results: Google renders the trail in
 * place of the raw URL, so the listing reads "mulesoo.com › Portfolio" instead
 * of a path. That is a small, consistent lift in how clickable the result looks.
 */
export default function PageBreadcrumb({ name, path }: { name: string; path: string }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}${path}` },
        ],
      }}
    />
  );
}
