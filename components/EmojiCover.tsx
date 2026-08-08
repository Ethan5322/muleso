'use client';

/**
 * Unified store cover: a big representative emoji on a branded gradient, with a
 * type label (DIGITAL GUIDE / AUTO PILOT SYSTEM / AI AUTOMATION), the item name
 * and a category chip. Clean, attractive, and consistent across the store.
 */

type AccentKey = 'gold' | 'blue' | 'purple' | 'green';

/* Each cover ramps its accent into a ground of the SAME temperature. Mixing
   them — a cool accent over a warm ground — is what made the old covers read
   as generic stock art.

   The keys are historical: product data still asks for `gold` and `blue`, so
   they stay, but `gold` now paints azure (the action hue) and `blue` paints
   copper (the premium hue). Renaming them means migrating the product data,
   which is a content change, not a colour one. */
const ACCENTS: Record<AccentKey, { from: string; to: string; accent: string }> = {
  gold: { from: '#7FB3FF', to: '#0A1A33', accent: '#7FB3FF' },   // azure, cool ground
  blue: { from: '#D97645', to: '#2A1408', accent: '#F0A46B' },   // copper, warm ground
  purple: { from: '#7B2FFF', to: '#180E33', accent: '#9D6BFF' },
  green: { from: '#00FF88', to: '#062B1C', accent: '#00FF88' },
};

function wrap(title: string, max = 16): string[] {
  const words = title.replace(/^AI\s+/, '').split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max) {
      if (cur) lines.push(cur.trim());
      cur = w;
    } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

export default function EmojiCover({
  emoji,
  title,
  label,
  category,
  accent = 'blue',
}: {
  emoji: string;
  title: string;
  label: string;
  category?: string;
  accent?: AccentKey;
}) {
  const a = ACCENTS[accent];
  const id = (label + title).replace(/[^a-zA-Z0-9]/g, '');
  const lines = wrap(title);

  return (
    <svg viewBox="0 0 1200 480" className="w-full h-full" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${title}`}>
      <defs>
        <linearGradient id={`ebg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a.from} stopOpacity="0.42" />
          <stop offset="100%" stopColor={a.to} stopOpacity="0.97" />
        </linearGradient>
        <pattern id={`egrid-${id}`} width="34" height="34" patternUnits="userSpaceOnUse">
          <path d="M34 0 L0 0 0 34" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
        </pattern>
        <radialGradient id={`eglow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={a.accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={a.accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1200" height="480" fill="#0A0F1E" />
      <rect width="1200" height="480" fill={`url(#ebg-${id})`} />
      <rect width="1200" height="480" fill={`url(#egrid-${id})`} />
      <rect x="0" y="0" width="14" height="480" fill={a.accent} />

      <text x="70" y="86" fontFamily="Sora, sans-serif" fontSize="26" fontWeight="700" fill="#ffffff">
        MULE<tspan fill={a.accent}>●</tspan>SOO
      </text>
      <text x="70" y="120" fontFamily="Sora, sans-serif" fontSize="16" fontWeight="700" letterSpacing="4" fill={a.accent}>
        {label}
      </text>

      {lines.map((line, i) => (
        <text key={i} x="70" y={200 + i * 50} fontFamily="Sora, sans-serif" fontSize="44" fontWeight="800" fill="#ffffff">
          {line}
        </text>
      ))}

      {category && (
        <>
          <rect x="70" y="392" width={70 + category.length * 11} height="44" rx="22" fill="#000000" fillOpacity="0.3" stroke={a.accent} strokeOpacity="0.6" />
          <text x={105 + (category.length * 11) / 2} y="420" textAnchor="middle" fontFamily="Sora, sans-serif" fontSize="19" fontWeight="600" fill="#ffffff">
            {category}
          </text>
        </>
      )}

      {/* Big representative emoji (right) */}
      <circle cx="980" cy="240" r="200" fill={`url(#eglow-${id})`} />
      <circle cx="980" cy="240" r="132" fill="#0D1528" stroke={a.accent} strokeOpacity="0.5" strokeWidth="3" />
      <text x="980" y="240" textAnchor="middle" dominantBaseline="central" fontSize="155">
        {emoji}
      </text>
    </svg>
  );
}
