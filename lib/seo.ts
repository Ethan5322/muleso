import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_URL || 'https://mulesoo.com';

const BRAND = 'MuleSoo Digital Services';
const TITLE_TEMPLATE = `%s | ${BRAND}`;

interface PageMeta {
  /** Slotted into the root layout's '%s | MuleSoo Digital Services' template. */
  title: string;
  description: string;
  /** Route path, e.g. '/services/chatbot'. Resolved against metadataBase. */
  path: string;
  keywords?: string[];
  /** Utility pages (payment success, staff gates) must never enter the index. */
  noIndex?: boolean;
}

/**
 * Per-page metadata with a SELF-REFERENCING canonical.
 *
 * The root layout used to declare `alternates.canonical`, and Next.js inherits
 * layout metadata into every child page. With only 3 of 54 pages overriding it,
 * all 220 sitemap URLs told Google "I am actually the homepage" — so Google
 * indexed one page and dropped the rest, including all 200 automation pages.
 *
 * Canonicals now live here and nowhere else. A self-referencing canonical also
 * folds ?utm_source= and similar query variants back into the clean URL.
 */
export function pageMetadata({ title, description, path, keywords, noIndex }: PageMeta): Metadata {
  const url = path === '/' ? SITE_URL : `${SITE_URL}${path}`;
  return {
    // A layout whose `title` is a plain string swallows the root's template, so
    // /services/chatbot and the 200 automation pages silently lost their brand
    // suffix. Restating the template at every level passes it down to children;
    // `default` stays UNbranded because the parent template brands it for us.
    title: { default: title, template: TITLE_TEMPLATE },
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: 'MuleSoo',
      locale: 'en_ZA',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
