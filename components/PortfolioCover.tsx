'use client';

/**
 * Branded SVG cover art for portfolio projects without a real screenshot.
 * Renders a designed, framed card (gradient, emblem, category badge, title)
 * so the portfolio never shows an empty placeholder.
 */

type ThemeKey = 'blue' | 'gold' | 'green' | 'dark' | 'purple' | 'rose';

interface Theme {
  from: string;
  to: string;
  accent: string;
  icon: string;
}

const THEMES: Record<ThemeKey, Theme> = {
  blue: { from: '#00C8FF', to: '#7B2FFF', accent: '#E8B84B', icon: '🌐' },
  gold: { from: '#E8B84B', to: '#7B2FFF', accent: '#00C8FF', icon: '🎉' },
  green: { from: '#00FF88', to: '#00C8FF', accent: '#E8B84B', icon: '💪' },
  dark: { from: '#1A2640', to: '#0D1528', accent: '#E8B84B', icon: '📷' },
  purple: { from: '#7B2FFF', to: '#00C8FF', accent: '#E8B84B', icon: '✨' },
  rose: { from: '#FF6B9D', to: '#7B2FFF', accent: '#E8B84B', icon: '💍' },
};

const categoryTheme = (category: string): ThemeKey =>
  category === 'Website' ? 'blue'
  : category === 'Chatbot' ? 'green'
  : category === 'E-commerce' ? 'purple'
  : category === 'Logo' || category === 'Logo Design' || category === 'Branding' ? 'gold'
  : category === 'Photography' ? 'dark'
  : category === 'Events' ? 'rose'
  : 'blue';

export default function PortfolioCover({
  title,
  category,
  tagline,
  theme,
  icon,
}: {
  title: string;
  category: string;
  tagline?: string;
  theme?: ThemeKey;
  icon?: string;
}) {
  const t = THEMES[theme || categoryTheme(category)];
  const glyph = icon || t.icon;
  const id = title.replace(/[^a-zA-Z0-9]/g, '');
  const titleSize = title.length <= 12 ? 64 : title.length <= 20 ? 50 : 40;

  return (
    <svg viewBox="0 0 1200 675" className="w-full h-full" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${title} — ${category}`}>
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={t.from} />
          <stop offset="100%" stopColor={t.to} />
        </linearGradient>
        <radialGradient id={`glow-${id}`} cx="50%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="1200" height="675" fill="#0A0F1E" />
      <rect width="1200" height="675" fill={`url(#bg-${id})`} opacity="0.9" />
      <rect width="1200" height="675" fill={`url(#glow-${id})`} />

      {/* Decorative frame */}
      <rect x="28" y="28" width="1144" height="619" rx="14" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" />
      <rect x="40" y="40" width="1120" height="595" rx="10" fill="none" stroke={t.accent} strokeOpacity="0.5" strokeWidth="1.5" />

      {/* Corner accents */}
      {[
        [40, 40, 1, 1], [1160, 40, -1, 1], [40, 635, 1, -1], [1160, 635, -1, -1],
      ].map(([cx, cy, dx, dy], i) => (
        <path
          key={i}
          d={`M ${cx} ${cy + dy * 34} L ${cx} ${cy} L ${cx + dx * 34} ${cy}`}
          fill="none"
          stroke={t.accent}
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}

      {/* Category badge */}
      <g>
        <rect x="72" y="84" rx="20" ry="20" width={120 + category.length * 13} height="44" fill="#000000" fillOpacity="0.35" stroke="#ffffff" strokeOpacity="0.4" />
        <text x="92" y="113" fontFamily="Sora, sans-serif" fontSize="22" fontWeight="700" fill="#ffffff">
          {category.toUpperCase()}
        </text>
      </g>

      {/* Emblem */}
      <circle cx="600" cy="300" r="92" fill="#000000" fillOpacity="0.28" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="2" />
      <text x="600" y="338" textAnchor="middle" fontSize="92">{glyph}</text>

      {/* Title + tagline */}
      <text x="72" y="540" fontFamily="Sora, sans-serif" fontSize={titleSize} fontWeight="800" fill="#ffffff">
        {title}
      </text>
      {tagline && (
        <text x="74" y="582" fontFamily="Sora, sans-serif" fontSize="26" fontWeight="600" fill={t.accent}>
          {tagline}
        </text>
      )}

      {/* Watermark */}
      <text x="1128" y="600" textAnchor="end" fontFamily="Sora, sans-serif" fontSize="22" fontWeight="700" fill="#ffffff" fillOpacity="0.85">
        MULE<tspan fill={t.accent}>●</tspan>SOO
      </text>
    </svg>
  );
}
