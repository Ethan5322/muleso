import FaqSection from '@/components/FaqSection';
import { findServiceAeo } from '@/lib/serviceAeo';

/**
 * The service page's FAQ, rendered from `layout.tsx` so it is server HTML.
 *
 * FaqSection uses native <details>, which keeps the answers in the DOM whether
 * or not anyone clicks — and emits the FAQPage JSON-LD alongside them. That
 * combination is the point: /services/website-design previously showed five
 * questions whose answers lived behind `{isOpen && ...}`, so the served HTML
 * carried the questions and none of the answers. A page that asks and never
 * answers is worth nothing to an answer engine, and little to a reader who
 * arrived from one.
 */
export default function ServiceFaqs({ slug }: { slug: string }) {
  const service = findServiceAeo(slug);
  if (!service?.faqs.length) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <FaqSection title={`${service.name} — Common Questions`} items={service.faqs} />
    </div>
  );
}
