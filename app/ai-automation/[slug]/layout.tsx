import type { Metadata } from 'next';
import { findAutomation } from '@/lib/aiAutomations';
import { pageMetadata } from '@/lib/seo';

/**
 * The 200 automation pages are the long-tail play. Each needs its own title,
 * description and canonical or they collapse into one duplicate cluster.
 * The page body is a client component, so metadata lives in this layout.
 */
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
