/**
 * Turns "we reply within 2 hours on business days" into an actual clock time.
 *
 * The promise on its own asks the visitor to do the arithmetic, and at 21:00 on
 * a Saturday it reads as a promise the business has not made. This resolves it
 * against real Pretoria office hours so the answer is always both concrete and
 * true — and never claims a reply outside the hours the site publishes.
 *
 * SAST is UTC+2 year round with no daylight saving, so the offset is a constant
 * rather than a timezone database lookup.
 */

const SAST_OFFSET_MIN = 2 * 60;
const REPLY_MINUTES = 120;

/** Mon–Fri 08:00–18:00, Sat 09:00–13:00, Sun closed. Minutes from midnight. */
const HOURS: Record<number, { open: number; close: number } | null> = {
  0: null,                          // Sunday
  1: { open: 8 * 60, close: 18 * 60 },
  2: { open: 8 * 60, close: 18 * 60 },
  3: { open: 8 * 60, close: 18 * 60 },
  4: { open: 8 * 60, close: 18 * 60 },
  5: { open: 8 * 60, close: 18 * 60 },
  6: { open: 9 * 60, close: 13 * 60 },  // Saturday
};

const DAY_NAME = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export interface ReplyWindow {
  /** True when the enquiry landed inside opening hours. */
  openNow: boolean;
  /** "16:42" — when a reply is due, in SAST. */
  time: string;
  /** "today", "tomorrow", or "Monday". */
  day: string;
  /** Pretoria wall-clock time when the enquiry landed, e.g. "14:42". */
  localNow: string;
}

function toSast(now: Date): { dow: number; minutes: number } {
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000;
  const sast = new Date(utc + SAST_OFFSET_MIN * 60_000);
  return { dow: sast.getDay(), minutes: sast.getHours() * 60 + sast.getMinutes() };
}

const hhmm = (m: number) =>
  `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(Math.round(m) % 60).padStart(2, '0')}`;

export function replyWindow(now: Date = new Date()): ReplyWindow {
  const { dow, minutes } = toSast(now);
  const localNow = hhmm(minutes);
  const today = HOURS[dow];

  // Inside hours, and the two-hour window still fits before closing.
  if (today && minutes >= today.open && minutes + REPLY_MINUTES <= today.close) {
    return { openNow: true, time: hhmm(minutes + REPLY_MINUTES), day: 'today', localNow };
  }

  // Before opening on a day we are open: the reply lands this morning, not
  // tomorrow. Missing this pushed every early enquiry a full day out.
  if (today && minutes < today.open) {
    return { openNow: false, time: hhmm(today.open + REPLY_MINUTES), day: 'today', localNow };
  }

  // Otherwise the reply lands at the start of the next day we are open. Late in
  // the day counts as closed: promising a reply two hours after closing would
  // be a promise the published hours do not support.
  for (let step = 1; step <= 7; step++) {
    const next = (dow + step) % 7;
    const h = HOURS[next];
    if (!h) continue;
    const day = step === 1 ? 'tomorrow' : DAY_NAME[next];
    return { openNow: false, time: hhmm(h.open + REPLY_MINUTES), day, localNow };
  }

  // Unreachable while any day has hours; keeps the return type total.
  return { openNow: false, time: '10:00', day: 'Monday', localNow };
}
