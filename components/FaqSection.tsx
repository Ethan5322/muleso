/**
 * A visible FAQ accordion (native <details> — no JS, fully crawlable) that also
 * emits FAQPage JSON-LD. Great for both Google rich results and AI answer
 * engines that quote Q&A content.
 */
export interface Faq {
  q: string;
  a: string;
}

export default function FaqSection({
  title = 'Frequently Asked Questions',
  items,
}: {
  title?: string;
  items: Faq[];
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <section className="my-24 max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h2 className="text-3xl sm:text-4xl font-bold font-sora text-center mb-10 gradient-text">{title}</h2>
      <div className="space-y-3">
        {items.map((f, i) => (
          <details key={i} className="glass-card p-5 group">
            <summary className="cursor-pointer font-semibold text-[var(--text-primary)] flex items-center justify-between gap-3 list-none">
              <span>{f.q}</span>
              <span className="text-[var(--accent-blue)] text-2xl leading-none transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="text-[var(--text-secondary)] mt-3 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
