/**
 * Display-only masking for the guide password shown on the purchase
 * confirmation page.
 *
 * SCOPE — read this before relying on it for anything.
 * This hides characters on a screen. It is not access control. The guide
 * password is derived from the Paystack reference (see derivePassword in
 * lib/guides/deliver.ts), and that reference sits in the buyer's own address
 * bar on /store/success, so anyone who wants the full password can still work
 * it out. What this stops is a password being read over someone's shoulder or
 * caught in a screenshot — not someone deliberately taking the guide.
 *
 * Pure and dependency-free so it can be imported by a client component.
 */

/**
 * Star out the middle three characters, leaving a constant prefix visible.
 *
 * The passwords look like `MS-392018`. The `MS-` prefix is the same on every
 * copy, so masking it would hide nothing and only make the code harder to read
 * back from an email; the six characters after it are the part that varies.
 *
 *   MS-392018  ->  MS-3***18
 *
 * Anything three characters or shorter is masked entirely, since there is no
 * middle to speak of.
 */
export function maskMiddle3(secret: string, prefix = 'MS-'): string {
  if (!secret) return '';

  const head = secret.startsWith(prefix) ? prefix : '';
  const body = secret.slice(head.length);

  if (body.length <= 3) return `${head}${'*'.repeat(body.length)}`;

  const start = Math.floor((body.length - 3) / 2);
  return `${head}${body.slice(0, start)}***${body.slice(start + 3)}`;
}
