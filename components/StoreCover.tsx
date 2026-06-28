'use client';

/**
 * Designed SVG cover for store products (PDF guides).
 * Ebook-style banner: brand gradient, title, page badge, and a stacked-pages
 * graphic so each product looks like a real, intentionally designed cover.
 */

type AccentKey = 'gold' | 'blue' | 'purple' | 'green';

const ACCENTS: Record<AccentKey, { from: string; to: string; accent: string }> = {
  gold: { from: '#E8B84B', to: '#1B2A6B', accent: '#E8B84B' },
  blue: { from: '#00C8FF', to: '#1B2A6B', accent: '#00C8FF' },
  purple: { from: '#7B2FFF', to: '#101A40', accent: '#9D6BFF' },
  green: { from: '#00FF88', to: '#0A3A5F', accent: '#00FF88' },
};

function wrap(title: string): string[] {
  if (title.length <= 16) return [title];
  const words = title.split(' ');
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

export default function StoreCover({
  title,
  pages,
  difficulty,
  accent = 'gold',
}: {
  title: string;
  pages: string;
  difficulty: string;
  accent?: AccentKey;
}) {
  const a = ACCENTS[accent];
  const id = title.replace(/[^a-zA-Z0-9]/g, '');
  const lines = wrap(title);

  return (
    <svg
      viewBox="0 0 1200 480"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${title} — guide cover`}
    >
      <defs>
        <linearGradient id={`sbg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a.from} stopOpacity="0.4" />
          <stop offset="100%" stopColor={a.to} stopOpacity="0.97" />
        </linearGradient>
        <pattern id={`sgrid-${id}`} width="34" height="34" patternUnits="userSpaceOnUse">
          <path d="M34 0 L0 0 0 34" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Background */}
      <rect width="1200" height="480" fill="#0A0F1E" />
      <rect width="1200" height="480" fill={`url(#sbg-${id})`} />
      <rect width="1200" height="480" fill={`url(#sgrid-${id})`} />

      {/* Left accent bar */}
      <rect x="0" y="0" width="14" height="480" fill={a.accent} />

      {/* Brand + label */}
      <text x="70" y="86" fontFamily="Sora, sans-serif" fontSize="26" fontWeight="700" fill="#ffffff">
        MULE<tspan fill={a.accent}>●</tspan>SOO
      </text>
      <text x="70" y="120" fontFamily="Sora, sans-serif" fontSize="18" fontWeight="700" letterSpacing="4" fill={a.accent}>
        DIGITAL GUIDE
      </text>

      {/* Title (1–2 lines) */}
      {lines.map((line, i) => (
        <text
          key={i}
          x="70"
          y={210 + i * 64}
          fontFamily="Sora, sans-serif"
          fontSize="56"
          fontWeight="800"
          fill="#ffffff"
        >
          {line}
        </text>
      ))}

      {/* Page + difficulty badges */}
      <g>
        <rect x="70" y="372" width="150" height="46" rx="23" fill="#000000" fillOpacity="0.35" stroke={a.accent} strokeOpacity="0.6" />
        <text x="145" y="402" textAnchor="middle" fontFamily="Sora, sans-serif" fontSize="22" fontWeight="700" fill="#ffffff">
          {pages} PAGES
        </text>
        <rect x="234" y="372" width={70 + difficulty.length * 11} height="46" rx="23" fill="#000000" fillOpacity="0.25" stroke="#ffffff" strokeOpacity="0.3" />
        <text x={269 + (difficulty.length * 11) / 2} y="402" textAnchor="middle" fontFamily="Sora, sans-serif" fontSize="20" fontWeight="600" fill="#A8B2D0">
          {difficulty}
        </text>
      </g>

      {/* Stacked pages graphic (right) */}
      <g transform="translate(880,110)">
        <rect x="40" y="30" width="200" height="270" rx="12" fill="#0D1528" stroke={a.accent} strokeOpacity="0.4" strokeWidth="2" transform="rotate(8 140 165)" />
        <rect x="20" y="20" width="200" height="270" rx="12" fill="#101A33" stroke={a.accent} strokeOpacity="0.6" strokeWidth="2" transform="rotate(3 120 155)" />
        <rect x="0" y="10" width="200" height="270" rx="12" fill="#13203D" stroke={a.accent} strokeWidth="2" />
        {/* lines on top page */}
        <rect x="24" y="44" width="150" height="12" rx="6" fill="#ffffff" fillOpacity="0.18" />
        <rect x="24" y="70" width="120" height="10" rx="5" fill="#ffffff" fillOpacity="0.12" />
        <rect x="24" y="92" width="140" height="10" rx="5" fill="#ffffff" fillOpacity="0.12" />
        <rect x="24" y="240" width="90" height="28" rx="6" fill={a.accent} fillOpacity="0.85" />
      </g>
    </svg>
  );
}
