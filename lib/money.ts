// Currency display for the whole site.
//
// ZAR is the currency MuleSoo actually charges: Paystack settles this account in
// Rand, so every checkout initialize call sends a Rand amount. The storefront
// used to *display* USD while charging ZAR, which meant a buyer saw "$19" and
// then met "R299" on the payment page. The Rand figure now always leads.
//
// The USD line is a courtesy for overseas clients only. It is converted at
// R16.60 — not a live rate, but the one implied by the guide catalogue in
// storeProducts.ts (five of six guides sit exactly on it). If the real rate
// moves far from this, update USD_RATE here and regenerate the *ZAR fields in
// storeSystems.ts / storeAutomations.ts; nothing else reads it.
export const USD_RATE = 16.6;

/** Rand, grouped with commas to match the site's existing "R3,500" copy. */
export const zar = (n: number) => `R${n.toLocaleString('en-US')}`;

/** The smaller secondary figure. Always rendered beside a Rand price, never alone. */
export const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
