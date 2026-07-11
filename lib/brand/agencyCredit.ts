/**
 * The MuleSoo agency credit — "Designed & built by MuleSoo Digital Services",
 * with the transparent logo, mulesoo.com and hello@mulesoo.com.
 *
 * One lockup, stamped identically into every PDF and ID card we produce, in
 * MuleSoo's own typefaces. It is an image rather than live text because jsPDF
 * ships only helvetica/courier/times — Sora and DM Sans are not available to
 * it, which is precisely why these credit lines were never on-brand. See
 * scripts/make-agency-credit.cjs for the full reasoning.
 *
 * OVERLAP SAFETY: callers must treat the bottom `CREDIT_BAND_MM` of the page as
 * reserved. `creditBandTop()` returns the Y above which content must stop, and
 * `assertClearOfCredit()` will throw in development if something is drawn into
 * the band. Nothing should ever be printed over the agency mark, and the mark
 * should never be printed over a signature, a QR code, or a photo.
 */
import type { jsPDF } from 'jspdf';
import {
  CREDIT_ON_DARK_PNG,
  CREDIT_ON_LIGHT_PNG,
  CREDIT_COMPACT_ON_DARK_PNG,
  CREDIT_COMPACT_ON_LIGHT_PNG,
} from './creditAssets';

/** Native aspect of the stacked lockup (width ÷ height). Fixed by the generator. */
export const CREDIT_ASPECT = 4.25;

/** Native aspect of the one-line lockup, for tight card footers. */
export const CREDIT_COMPACT_ASPECT = 11.923;

/** Pick the right artwork for the background and the space available. */
export function creditImage(onDark: boolean, compact = false): string {
  if (compact) return onDark ? CREDIT_COMPACT_ON_DARK_PNG : CREDIT_COMPACT_ON_LIGHT_PNG;
  return onDark ? CREDIT_ON_DARK_PNG : CREDIT_ON_LIGHT_PNG;
}

/** Default printed width of the lockup on an A4/Letter page. */
export const CREDIT_WIDTH_MM = 46;

/** Gap between the page's bottom edge and the lockup. */
export const CREDIT_BOTTOM_MARGIN_MM = 10;

/** Total height of the reserved footer band. Content must not enter this. */
export const CREDIT_BAND_MM =
  CREDIT_WIDTH_MM / CREDIT_ASPECT + CREDIT_BOTTOM_MARGIN_MM + 4; // +4mm breathing room

export interface CreditOptions {
  /** Light artwork on a dark page, or dark artwork on a white page. */
  onDark?: boolean;
  /** Where along the footer to place it. */
  align?: 'left' | 'center' | 'right';
  /** Override the printed width (mm). Height follows from the aspect. */
  widthMm?: number;
  /** Page side margin (mm) used for left/right alignment. */
  marginMm?: number;
}

/** Y coordinate above which page content must stop, to stay clear of the credit. */
export function creditBandTop(doc: jsPDF): number {
  return doc.internal.pageSize.getHeight() - CREDIT_BAND_MM;
}

/**
 * Stamp the credit into the footer of the CURRENT page.
 * Returns the rectangle it occupied, so callers can assert nothing collides.
 */
export function stampAgencyCredit(doc: jsPDF, opts: CreditOptions = {}) {
  const { onDark = false, align = 'right', widthMm = CREDIT_WIDTH_MM, marginMm = 14 } = opts;

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const w = widthMm;
  const h = w / CREDIT_ASPECT; // never distort the mark
  const y = pageH - CREDIT_BOTTOM_MARGIN_MM - h;

  let x: number;
  if (align === 'left') x = marginMm;
  else if (align === 'center') x = (pageW - w) / 2;
  else x = pageW - marginMm - w;

  // PNG with alpha — it composites onto whatever is beneath rather than
  // punching an opaque box over the artwork.
  doc.addImage(onDark ? CREDIT_ON_DARK_PNG : CREDIT_ON_LIGHT_PNG, 'PNG', x, y, w, h, undefined, 'FAST');

  return { x, y, w, h };
}

/**
 * Throws if `contentBottomY` has run into the reserved credit band. Call this
 * after laying out a page whose content length is variable (line items, long
 * notes) — that is exactly where an overlap would otherwise appear silently.
 */
export function assertClearOfCredit(doc: jsPDF, contentBottomY: number, label = 'content') {
  const limit = creditBandTop(doc);
  if (contentBottomY > limit) {
    throw new Error(
      `${label} overruns the agency-credit band ` +
        `(bottom ${contentBottomY.toFixed(1)}mm > limit ${limit.toFixed(1)}mm). ` +
        `Break to a new page before drawing into the footer.`
    );
  }
}

/** True when the remaining space on the page cannot fit `neededMm` of content. */
export function needsPageBreak(doc: jsPDF, currentY: number, neededMm: number): boolean {
  return currentY + neededMm > creditBandTop(doc);
}
