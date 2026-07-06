'use client';

/**
 * Designed SVG cover for the store's AI automation picks. Brand gradient with a
 * chat/bot + connected-nodes motif so each automation looks like a real product.
 */

type AccentKey = 'gold' | 'blue' | 'purple' | 'green';

const ACCENTS: Record<AccentKey, { from: string; to: string; accent: string }> = {
  gold: { from: '#E8B84B', to: '#1B2A6B', accent: '#E8B84B' },
  blue: { from: '#00C8FF', to: '#1B2A6B', accent: '#00C8FF' },
  purple: { from: '#7B2FFF', to: '#101A40', accent: '#9D6BFF' },
  green: { from: '#00FF88', to: '#0A3A5F', accent: '#00FF88' },
};

function wrap(title: string, max = 15): string[] {
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

export default function AutomationCover({
  name,
  category,
  accent = 'blue',
}: {
  name: string;
  category: string;
  accent?: AccentKey;
}) {
  const a = ACCENTS[accent];
  const id = name.replace(/[^a-zA-Z0-9]/g, '');
  const lines = wrap(name);

  return (
    <svg viewBox="0 0 1200 480" className="w-full h-full" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${name} — ${category}`}>
      <defs>
        <linearGradient id={`abg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a.from} stopOpacity="0.42" />
          <stop offset="100%" stopColor={a.to} stopOpacity="0.97" />
        </linearGradient>
        <pattern id={`agrid-${id}`} width="34" height="34" patternUnits="userSpaceOnUse">
          <path d="M34 0 L0 0 0 34" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="1200" height="480" fill="#0A0F1E" />
      <rect width="1200" height="480" fill={`url(#abg-${id})`} />
      <rect width="1200" height="480" fill={`url(#agrid-${id})`} />
      <rect x="0" y="0" width="14" height="480" fill={a.accent} />

      <text x="70" y="86" fontFamily="Sora, sans-serif" fontSize="26" fontWeight="700" fill="#ffffff">
        MULE<tspan fill={a.accent}>●</tspan>SOO
      </text>
      <text x="70" y="120" fontFamily="Sora, sans-serif" fontSize="16" fontWeight="700" letterSpacing="4" fill={a.accent}>
        AI AUTOMATION
      </text>

      {/* Name (up to 3 lines) */}
      {lines.map((line, i) => (
        <text key={i} x="70" y={190 + i * 52} fontFamily="Sora, sans-serif" fontSize="46" fontWeight="800" fill="#ffffff">
          {line}
        </text>
      ))}

      {/* Category chip */}
      <rect x="70" y="392" width={70 + category.length * 11} height="44" rx="22" fill="#000000" fillOpacity="0.3" stroke={a.accent} strokeOpacity="0.6" />
      <text x={105 + (category.length * 11) / 2} y="420" textAnchor="middle" fontFamily="Sora, sans-serif" fontSize="19" fontWeight="600" fill="#ffffff">
        {category}
      </text>

      {/* Chat bubble + nodes motif (right) */}
      <g transform="translate(858,120)">
        {/* connected nodes */}
        <line x1="60" y1="40" x2="200" y2="20" stroke={a.accent} strokeOpacity="0.5" strokeWidth="2" />
        <line x1="60" y1="40" x2="150" y2="150" stroke={a.accent} strokeOpacity="0.5" strokeWidth="2" />
        <line x1="200" y1="20" x2="250" y2="120" stroke={a.accent} strokeOpacity="0.5" strokeWidth="2" />
        <circle cx="200" cy="20" r="10" fill={a.accent} />
        <circle cx="250" cy="120" r="8" fill={a.accent} fillOpacity="0.8" />
        <circle cx="150" cy="150" r="8" fill={a.accent} fillOpacity="0.8" />
        {/* chat bubble */}
        <rect x="10" y="30" width="230" height="150" rx="20" fill="#0D1528" stroke={a.accent} strokeOpacity="0.6" strokeWidth="2" />
        <path d="M40 180 L40 210 L75 180 Z" fill="#0D1528" stroke={a.accent} strokeOpacity="0.6" strokeWidth="2" />
        <circle cx="45" cy="70" r="9" fill={a.accent} />
        <rect x="65" y="63" width="150" height="12" rx="6" fill="#ffffff" fillOpacity="0.5" />
        <rect x="30" y="100" width="180" height="10" rx="5" fill="#ffffff" fillOpacity="0.25" />
        <rect x="30" y="122" width="140" height="10" rx="5" fill="#ffffff" fillOpacity="0.25" />
        <rect x="30" y="148" width="90" height="18" rx="6" fill={a.accent} fillOpacity="0.85" />
      </g>
    </svg>
  );
}
