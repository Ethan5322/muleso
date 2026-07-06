'use client';

/**
 * Designed SVG cover for "done-for-you" system products. Brand gradient with an
 * app/dashboard motif so each build looks like a real, premium software product.
 */

type AccentKey = 'gold' | 'blue' | 'purple' | 'green';

const ACCENTS: Record<AccentKey, { from: string; to: string; accent: string }> = {
  gold: { from: '#E8B84B', to: '#1B2A6B', accent: '#E8B84B' },
  blue: { from: '#00C8FF', to: '#1B2A6B', accent: '#00C8FF' },
  purple: { from: '#7B2FFF', to: '#101A40', accent: '#9D6BFF' },
  green: { from: '#00FF88', to: '#0A3A5F', accent: '#00FF88' },
};

function wrap(title: string, max = 16): string[] {
  if (title.length <= max) return [title];
  const words = title.split(' ');
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

export default function SystemCover({
  brand,
  tagline,
  category,
  accent = 'blue',
}: {
  brand: string;
  tagline: string;
  category: string;
  accent?: AccentKey;
}) {
  const a = ACCENTS[accent];
  const id = brand.replace(/[^a-zA-Z0-9]/g, '');
  const lines = wrap(tagline, 18);

  return (
    <svg viewBox="0 0 1200 480" className="w-full h-full" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${brand} — ${tagline}`}>
      <defs>
        <linearGradient id={`ybg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a.from} stopOpacity="0.42" />
          <stop offset="100%" stopColor={a.to} stopOpacity="0.97" />
        </linearGradient>
        <pattern id={`ygrid-${id}`} width="34" height="34" patternUnits="userSpaceOnUse">
          <path d="M34 0 L0 0 0 34" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="1200" height="480" fill="#0A0F1E" />
      <rect width="1200" height="480" fill={`url(#ybg-${id})`} />
      <rect width="1200" height="480" fill={`url(#ygrid-${id})`} />
      <rect x="0" y="0" width="14" height="480" fill={a.accent} />

      {/* Brand + label */}
      <text x="70" y="86" fontFamily="Sora, sans-serif" fontSize="26" fontWeight="700" fill="#ffffff">
        MULE<tspan fill={a.accent}>●</tspan>SOO
      </text>
      <text x="70" y="120" fontFamily="Sora, sans-serif" fontSize="16" fontWeight="700" letterSpacing="4" fill={a.accent}>
        DONE-FOR-YOU SYSTEM
      </text>

      {/* Brand name (big) */}
      <text x="70" y="215" fontFamily="Sora, sans-serif" fontSize="76" fontWeight="800" fill="#ffffff">
        {brand}
      </text>

      {/* Tagline (1–2 lines) */}
      {lines.map((line, i) => (
        <text key={i} x="72" y={262 + i * 34} fontFamily="Sora, sans-serif" fontSize="27" fontWeight="600" fill="#C9D2E8">
          {line}
        </text>
      ))}

      {/* Category chip */}
      <rect x="70" y="372" width={70 + category.length * 12} height="46" rx="23" fill="#000000" fillOpacity="0.3" stroke={a.accent} strokeOpacity="0.6" />
      <text x={105 + (category.length * 12) / 2} y="402" textAnchor="middle" fontFamily="Sora, sans-serif" fontSize="20" fontWeight="600" fill="#ffffff">
        {category}
      </text>

      {/* Dashboard/app window motif (right) */}
      <g transform="translate(830,96)">
        <rect x="0" y="0" width="290" height="288" rx="16" fill="#0D1528" stroke={a.accent} strokeOpacity="0.5" strokeWidth="2" />
        {/* window header */}
        <rect x="0" y="0" width="290" height="34" rx="16" fill={a.accent} fillOpacity="0.18" />
        <circle cx="20" cy="17" r="4" fill="#FF5C7C" />
        <circle cx="36" cy="17" r="4" fill="#E8B84B" />
        <circle cx="52" cy="17" r="4" fill="#00FF88" />
        {/* stat tiles */}
        <rect x="18" y="52" width="120" height="60" rx="8" fill="#13203D" stroke={a.accent} strokeOpacity="0.3" />
        <rect x="152" y="52" width="120" height="60" rx="8" fill="#13203D" stroke={a.accent} strokeOpacity="0.3" />
        <rect x="30" y="66" width="60" height="10" rx="5" fill="#ffffff" fillOpacity="0.5" />
        <rect x="30" y="86" width="40" height="14" rx="4" fill={a.accent} fillOpacity="0.85" />
        <rect x="164" y="66" width="60" height="10" rx="5" fill="#ffffff" fillOpacity="0.5" />
        <rect x="164" y="86" width="40" height="14" rx="4" fill={a.accent} fillOpacity="0.85" />
        {/* chart line */}
        <polyline
          points="18,220 60,190 100,205 140,160 180,175 220,130 272,150"
          fill="none"
          stroke={a.accent}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="18" y="248" width="254" height="22" rx="6" fill={a.accent} fillOpacity="0.85" />
      </g>
    </svg>
  );
}
