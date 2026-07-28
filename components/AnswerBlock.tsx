import { findServiceAeo } from '@/lib/serviceAeo';

/**
 * The passage an answer engine lifts.
 *
 * ChatGPT, Perplexity and Google's AI Overviews build a reply by quoting a
 * short self-contained passage, then crediting the page it came from. They can
 * only do that when such a passage exists: a question stated as a heading and
 * answered immediately below it in plain prose, with the price and the place
 * inside the answer rather than assumed from context further up the page.
 *
 * Deliberately plain markup — no Framer Motion, no `whileInView`, no collapsed
 * state. Anything on these pages that animates in or hides behind a click is
 * absent from the HTML at the moment a crawler reads it. This block is always
 * in the served DOM.
 */
export default function AnswerBlock({ slug }: { slug: string }) {
  const service = findServiceAeo(slug);
  if (!service) return null;

  return (
    <section className="max-w-3xl mx-auto my-14" aria-labelledby="quick-answer">
      <div className="glass-card p-6 sm:p-8 border-l-[3px] border-l-[var(--accent-gold)]">
        <p className="text-xs font-sora font-semibold tracking-[0.18em] uppercase text-[var(--accent-gold)] mb-3">
          Quick answer
        </p>
        <h2
          id="quick-answer"
          className="text-xl sm:text-2xl font-bold font-sora text-[var(--text-primary)] mb-3 leading-snug"
        >
          {service.question}
        </h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">{service.answer}</p>
      </div>
    </section>
  );
}
