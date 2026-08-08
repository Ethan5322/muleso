'use client';

/**
 * Designed SVG cover art for portfolio projects without a real screenshot.
 * Agency-style: a device/app mockup frame with the project monogram, brand
 * gradient, category label and title — looks intentionally designed, not generic.
 */

type ThemeKey = 'blue' | 'gold' | 'green' | 'dark' | 'purple' | 'rose';

interface Theme {
  from: string;
  to: string;
  accent: string;
}

const THEMES: Record<ThemeKey, Theme> = {
  blue: { from: '#7FB3FF', to: '#1B3A8F', accent: '#7FB3FF' },
  gold: { from: '#7FB3FF', to: '#6B4BA8', accent: '#7FB3FF' },
  green: { from: '#00FF88', to: '#0A6E8F', accent: '#7FB3FF' },
  dark: { from: '#2A3550', to: '#0A0F1E', accent: '#7FB3FF' },
  purple: { from: '#7B2FFF', to: '#1B2A6B', accent: '#7FB3FF' },
  rose: { from: '#FF6B9D', to: '#6B2F8F', accent: '#7FB3FF' },
};

const categoryTheme = (category: string): ThemeKey =>
  category === 'Website' ? 'blue'
  : category === 'Chatbot' ? 'green'
  : category === 'E-commerce' ? 'purple'
  : category === 'Logo' || category === 'Logo Design' || category === 'Branding' ? 'gold'
  : category === 'Photography' ? 'dark'
  : category === 'Events' ? 'rose'
  : 'blue';

function initials(title: string): string {
  const words = title.replace(/[^a-zA-Z0-9 ]/g, ' ').trim().split(/\s+/);
  const a = words[0]?.[0] || '';
  const b = words[1]?.[0] || '';
  return (a + b).toUpperCase() || 'M';
}

export default function PortfolioCover({
  title,
  category,
  tagline,
  theme,
}: {
  title: string;
  category: string;
  tagline?: string;
  theme?: ThemeKey;
}) {
  const t = THEMES[theme || categoryTheme(category)];
  const id = title.replace(/[^a-zA-Z0-9]/g, '');
  const titleSize = title.length <= 12 ? 58 : title.length <= 20 ? 46 : 38;

  return (
    <svg
      viewBox="0 0 1200 675"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${title} — ${category}`}
    >
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={t.from} stopOpacity="0.35" />
          <stop offset="100%" stopColor={t.to} stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={`mono-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={t.from} />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <pattern id={`dots-${id}`} width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="#ffffff" fillOpacity="0.06" />
        </pattern>
      </defs>

      {/* Background */}
      <rect width="1200" height="675" fill="#0A0F1E" />
      <rect width="1200" height="675" fill={`url(#bg-${id})`} />
      <rect width="1200" height="675" fill={`url(#dots-${id})`} />

      {/* Device / app mockup card */}
      <rect x="180" y="96" width="840" height="300" rx="18" fill="#0D1528" stroke="#1A2640" strokeWidth="2" />
      {/* top bar */}
      <line x1="180" y1="142" x2="1020" y2="142" stroke="#1A2640" strokeWidth="2" />
      <circle cx="214" cy="119" r="6" fill={t.from} />
      <circle cx="236" cy="119" r="6" fill={t.accent} />
      <circle cx="258" cy="119" r="6" fill="#3A4660" />
      {/* monogram */}
      <text
        x="600"
        y="288"
        textAnchor="middle"
        fontFamily="Sora, sans-serif"
        fontSize="120"
        fontWeight="800"
        fill={`url(#mono-${id})`}
        letterSpacing="2"
      >
        {initials(title)}
      </text>
      {/* skeleton content lines */}
      <rect x="470" y="330" width="260" height="14" rx="7" fill="#ffffff" fillOpacity="0.14" />
      <rect x="510" y="356" width="180" height="12" rx="6" fill="#ffffff" fillOpacity="0.09" />

      {/* Category label */}
      <text x="184" y="486" fontFamily="Sora, sans-serif" fontSize="20" fontWeight="700" letterSpacing="4" fill={t.accent}>
        {category.toUpperCase()}
      </text>

      {/* Title */}
      <text x="182" y="548" fontFamily="Sora, sans-serif" fontSize={titleSize} fontWeight="800" fill="#ffffff">
        {title}
      </text>
      <rect x="184" y="566" width="74" height="5" rx="2.5" fill={t.accent} />

      {/* tagline */}
      {tagline && (
        <text x="184" y="606" fontFamily="Sora, sans-serif" fontSize="22" fontWeight="600" fill="#A8B2D0">
          {tagline}
        </text>
      )}

      {/* Brand mark */}
      <text x="1020" y="606" textAnchor="end" fontFamily="Sora, sans-serif" fontSize="22" fontWeight="700" fill="#ffffff" fillOpacity="0.85">
        MULE<tspan fill={t.accent}>●</tspan>SOO
      </text>
    </svg>
  );
}
