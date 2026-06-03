# CLAUDE.md — MuleSoo Website Build Instructions
# =====================================================
# Copy this entire file into your project root as CLAUDE.md
# Claude Code reads this file automatically every session.
# =====================================================

## WHO YOU ARE BUILDING FOR

You are building the official website for **MuleSoo Digital Services** — a premium tech agency
based in Pretoria, South Africa, run by Ethan. MuleSoo builds world-class websites, AI chatbots,
widgets, logos, QR codes, and PDF guides for corporate clients across South Africa and Africa.

The website owner also runs **Habesha Celebration Events** (habeshaeventsplanner.netlify.app)
— a full-service Ethiopian wedding and event planning company. MuleSoo is the tech brand.
Both brands share the same owner. The MuleSoo website must position the owner as a
professional-grade tech builder — someone corporate clients can trust with serious money.

---

## BRAND IDENTITY — FOLLOW EXACTLY

### Colors (CSS Variables — use ALWAYS)
```css
:root {
  --bg-primary:    #050810;   /* deepest background */
  --bg-secondary:  #0A0F1E;   /* card backgrounds */
  --bg-card:       #0D1528;   /* inner card bg */
  --accent-blue:   #00C8FF;   /* electric blue — primary CTA */
  --accent-purple: #7B2FFF;   /* purple — secondary glow */
  --accent-gold:   #E8B84B;   /* gold — premium highlights */
  --accent-green:  #00FF88;   /* success / live indicators */
  --text-primary:  #F0F2FA;   /* main text */
  --text-secondary:#A8B2D0;   /* supporting text */
  --border:        #1A2640;   /* subtle borders */
  --glow-blue:     rgba(0, 200, 255, 0.15);
  --glow-purple:   rgba(123, 47, 255, 0.15);
  --glow-gold:     rgba(232, 184, 75, 0.12);
}
```

### Typography
- **Headlines:** `Sora` or `Space Grotesk` — import from Google Fonts
- **Body:** `DM Sans` or `Outfit` — clean, modern, readable
- **Code/Tech elements:** `JetBrains Mono` — for terminal-style accents
- **Taglines/Quotes:** `Cormorant Garamond` italic — adds luxury contrast

### Design Style
- **Dark**, **futuristic**, **premium** — think Vercel.com meets Linear.app
- Glassmorphism cards (backdrop-filter: blur + semi-transparent borders)
- Gradient text on headlines using blue → purple
- Glowing borders on hover (box-shadow with accent colors)
- Ethiopian cultural accents: subtle cross patterns, geometric borders (used as decorative SVG dividers)
- NOT generic — every component must feel intentionally designed for MuleSoo

---

## TECH STACK — USE EXACTLY THIS

```
Framework:    Next.js 14 with App Router (TypeScript)
Styling:      Tailwind CSS + custom CSS variables above
3D:           Three.js via @react-three/fiber + @react-three/drei
Animation:    Framer Motion (motion library)
Icons:        Lucide React
Fonts:        next/font/google
Forms:        React Hook Form
Emails:       Resend API
Database:     Supabase
Payments:     Stripe
Deployment:   Netlify
```

---

## PROJECT FILE STRUCTURE — BUILD EXACTLY THIS

```
mulesoo/
├── app/
│   ├── layout.tsx              ← Root layout, fonts, navbar, chatbot, footer
│   ├── page.tsx                ← Home page
│   ├── globals.css             ← Global CSS variables, scrollbar, base styles
│   ├── services/
│   │   ├── page.tsx            ← Services index
│   │   ├── website-design/page.tsx
│   │   ├── chatbot/page.tsx
│   │   ├── logo-design/page.tsx
│   │   ├── pdf-guides/page.tsx
│   │   ├── qr-codes/page.tsx
│   │   └── email-setup/page.tsx
│   ├── portfolio/page.tsx
│   ├── store/
│   │   ├── page.tsx
│   │   └── success/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── not-found.tsx
│   └── api/
│       ├── chat/route.ts
│       ├── contact/route.ts
│       ├── create-checkout/route.ts
│       └── webhooks/stripe/route.ts
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ChatbotWidget.tsx
│   ├── ThreeBackground.tsx
│   ├── FloatingOrb.tsx
│   ├── AnimatedSection.tsx
│   ├── ServiceCard.tsx
│   ├── StatCounter.tsx
│   └── PageHero.tsx
├── lib/
│   ├── supabase.ts
│   ├── stripe.ts
│   └── resend.ts
├── .env.local
├── netlify.toml
└── CLAUDE.md                   ← This file
```

---

## ═══════════════════════════════════════════════════
## PROMPT 1 — FIRST THING TO RUN: PROJECT SETUP
## Copy everything between the triple dashes below
## ═══════════════════════════════════════════════════

---
Create a new Next.js 14 project for MuleSoo Digital Services agency website.

Run these commands in order:
```
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false
npm install three @react-three/fiber @react-three/drei
npm install framer-motion
npm install lucide-react
npm install @supabase/supabase-js
npm install stripe @stripe/stripe-js
npm install react-hook-form
npm install resend
npm install @types/three
```

Then create app/globals.css with this exact content:

```css
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Cormorant+Garamond:ital@1&display=swap');

:root {
  --bg-primary: #050810;
  --bg-secondary: #0A0F1E;
  --bg-card: #0D1528;
  --accent-blue: #00C8FF;
  --accent-purple: #7B2FFF;
  --accent-gold: #E8B84B;
  --accent-green: #00FF88;
  --text-primary: #F0F2FA;
  --text-secondary: #A8B2D0;
  --border: #1A2640;
  --glow-blue: rgba(0, 200, 255, 0.15);
  --glow-purple: rgba(123, 47, 255, 0.15);
  --glow-gold: rgba(232, 184, 75, 0.12);
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  overflow-x: hidden;
}
h1, h2, h3, h4 { font-family: 'Sora', sans-serif; }

/* Custom scrollbar */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--bg-primary); }
::-webkit-scrollbar-thumb { background: var(--accent-blue); border-radius: 10px; }

/* Gradient text utility */
.gradient-text {
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.gold-text {
  background: linear-gradient(135deg, var(--accent-gold), #fff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Glass card */
.glass-card {
  background: rgba(13, 21, 40, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border);
  border-radius: 16px;
}

/* Glow effects */
.glow-blue { box-shadow: 0 0 30px var(--glow-blue), 0 0 60px var(--glow-blue); }
.glow-purple { box-shadow: 0 0 30px var(--glow-purple), 0 0 60px var(--glow-purple); }
.glow-gold { box-shadow: 0 0 20px var(--glow-gold); }

/* Selection color */
::selection { background: var(--accent-blue); color: #000; }
```

Confirm when done and show me the folder structure.
---


---
## ═══════════════════════════════════════════════════
## PROMPT 2 — NAVBAR + FOOTER (Run after Prompt 1)
## ═══════════════════════════════════════════════════

---
Create components/Navbar.tsx — the MuleSoo navigation bar.

EXACT REQUIREMENTS:

Design:
- Fixed at top of page (position: fixed, z-index: 50)
- Background: transparent when at top of page
- Background: rgba(5,8,16,0.85) with backdrop-filter: blur(20px) when scrolled down
- Bottom border: 1px solid var(--border) when scrolled
- Transition: all 0.3s ease

Logo (left side):
- Text: "MULE" in var(--accent-blue) bold + "SOO" in var(--text-primary) bold
- Font: Sora, 22px, letter-spacing: 2px
- Small glowing dot (●) between words in var(--accent-gold)
- Example: MULE●SOO

Navigation links (center, hide on mobile):
- Home → /
- Services → /services
- Portfolio → /portfolio
- Store → /store
- About → /about
- Contact → /contact
- Links: color var(--text-secondary), hover: var(--accent-blue), transition 0.2s
- Font size: 14px, font-weight: 500

CTA Button (right side):
- Text: "Get a Quote"
- Background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple))
- Padding: 10px 22px, border-radius: 8px
- Font: Sora, 14px, bold, color: white
- Hover: scale(1.05) + glow-blue box-shadow
- Links to: /contact

Mobile (below 768px):
- Hide nav links
- Show hamburger icon (3 lines, color var(--accent-blue))
- Click hamburger → full-height slide-in drawer from right
- Drawer background: var(--bg-secondary)
- All nav links stacked vertically in drawer
- Close X button at top of drawer
- Animate drawer with Framer Motion (x: "100%" → x: 0)

Use useEffect + useState for scroll detection and mobile menu open/close.
Use Next.js Link component for all navigation.
Write the complete file with all imports.

---

Then create components/Footer.tsx:

Design:
- Background: var(--bg-secondary)
- Top border: 1px solid var(--border)
- Padding: 60px top, 30px bottom

Layout (4 columns on desktop, stack on mobile):
Column 1 — Brand:
  - MULE●SOO logo (same as navbar)
  - Tagline: "Building world-class digital products for Africa's boldest businesses."
  - Font: DM Sans, 14px, color var(--text-secondary)
  - Social icons row: LinkedIn, Twitter/X, Instagram, WhatsApp
  - Icons from Lucide React, color var(--accent-blue) on hover

Column 2 — Services:
  - Heading: "Services" (Sora, 13px, var(--accent-gold), letter-spacing: 1px, uppercase)
  - Links: Website Design, AI Chatbots, Logo Design, QR Codes, Custom Email, PDF Guides
  - Link color: var(--text-secondary), hover: var(--accent-blue)

Column 3 — Company:
  - Heading: "Company"
  - Links: About Us, Portfolio, PDF Store, Contact, Privacy Policy, Terms

Column 4 — Contact:
  - Heading: "Get In Touch"
  - Email: hello@mulesoo.com (with Mail icon)
  - WhatsApp: +27 XX XXX XXXX (with Phone icon)
  - Location: Pretoria, South Africa (with MapPin icon)
  - Response time: "Reply within 2 hours" in var(--accent-green) small text

Bottom bar:
  - Line separator: var(--border)
  - Left: "© 2025 MuleSoo Digital Services. All rights reserved."
  - Right: "Built with Claude Code 🤖" in var(--text-secondary)
  - Font: 12px

Write the complete file.
---


---
## ═══════════════════════════════════════════════════
## PROMPT 3 — 3D BACKGROUND (Run after Prompt 2)
## ═══════════════════════════════════════════════════

---
Create components/ThreeBackground.tsx — a full-screen 3D animated background.

This component sits behind ALL page content (position: fixed, top:0, left:0, width:100%, height:100%, z-index: -1).

Build it using @react-three/fiber Canvas and @react-three/drei.

SCENE CONTENTS:

1. PARTICLE FIELD (main background element):
   - 3000 tiny particles floating in 3D space
   - Use InstancedMesh for performance (not individual meshes)
   - Particle size: random between 0.01 and 0.03
   - Colors: 70% use var(--accent-blue) = #00C8FF, 30% use var(--accent-purple) = #7B2FFF
   - Spread: random positions in a cube from -15 to +15 on all axes
   - Animation: slow continuous rotation on Y and X axes (useFrame hook)
   - Rotation speed: Y: delta * 0.03, X: delta * 0.01

2. FLOATING GEOMETRIC SHAPES (3 shapes):
   - One wireframe octahedron — position: (4, 2, -5), color: #00C8FF, slow rotate
   - One wireframe torus — position: (-5, -1, -8), color: #7B2FFF, slow rotate opposite direction
   - One wireframe icosahedron — position: (0, -4, -6), color: #E8B84B, slow pulse scale
   - All use MeshBasicMaterial with wireframe: true

3. MOUSE PARALLAX:
   - On mouse move, rotate the entire scene group slightly toward mouse
   - Max rotation: ±0.08 radians
   - Lerp (smooth) the rotation: current + (target - current) * 0.05

4. PERFORMANCE:
   - On mobile (window.innerWidth < 768), reduce particles to 800
   - Wrap Canvas in a React.Suspense with a simple dark div fallback
   - Canvas background: #050810 (matches --bg-primary)

Also create components/FloatingOrb.tsx:
- A glowing 3D sphere, centered in the hero section (NOT fixed — normal document flow)
- Sphere geometry: radius 2, widthSegments 32
- Material: MeshStandardMaterial, color #00C8FF, emissive #00C8FF, emissiveIntensity 0.3
- Wireframe overlay: second sphere slightly larger, wireframe: true, opacity 0.2
- Rotation: useFrame, rotateY by delta * 0.4, rotateX by delta * 0.15
- PointLight inside: color #00C8FF, intensity 2
- On hover: speed doubles, emissiveIntensity increases to 0.8 (spring animation)
- Canvas size: 400x400px, transparent background

Write complete files with all imports.
---


---
## ═══════════════════════════════════════════════════
## PROMPT 4 — HOME PAGE (Run after Prompt 3)
## ═══════════════════════════════════════════════════

---
Create app/page.tsx — the complete MuleSoo home page.

Import and use:
- ThreeBackground from '../components/ThreeBackground'
- FloatingOrb from '../components/FloatingOrb'
- Framer Motion: motion, useInView, useAnimation
- Lucide React icons

SECTION 1 — HERO (full screen height, centered content):
Layout: two columns on desktop (text left 55%, orb right 45%), stack on mobile

Left column content:
- Small badge above headline:
  Small pill: "🚀 South Africa's #1 AI-Powered Digital Agency"
  Style: border 1px solid var(--accent-blue), background var(--glow-blue),
  padding 6px 14px, border-radius 99px, font 12px Sora, color var(--accent-blue)
  Animate: fade in + slide down, delay 0.1s

- Main headline (two lines):
  Line 1: "We Build Digital" — color var(--text-primary), font Sora 72px bold
  Line 2: "Experiences" — gradient text (blue to purple), font Sora 72px bold
  Line 3: "That Win." — color var(--accent-gold), font Sora 72px bold
  On mobile: font-size 42px
  Animate: each line fades in and slides up with 0.15s stagger

- Subheadline:
  Text: "MuleSoo delivers world-class websites, AI chatbots, and digital tools for companies that refuse to look average."
  Font: DM Sans 18px, color var(--text-secondary), max-width 480px, line-height 1.7
  Animate: fade in, delay 0.5s

- Two CTA buttons (row):
  Button 1: "Explore Services" — filled, gradient blue→purple, padding 14px 32px, font Sora 15px bold
    → hover: scale 1.05, glow-blue shadow
    → links to /services
  Button 2: "View Our Work" — outlined, border 1px solid var(--accent-blue), color var(--accent-blue)
    → hover: background var(--glow-blue)
    → links to /portfolio
  Animate: slide up, delay 0.65s

Right column: FloatingOrb component, centered

SECTION 2 — STATS BAR:
Dark card row, full width, 4 stats inside:
  - "50+" label "Projects Delivered" — use animated count-up on scroll
  - "100%" label "Client Satisfaction"
  - "3+" label "Years Experience"
  - "24/7" label "Support Available"
Style: var(--bg-secondary), padding 40px, subtle top+bottom border (var(--border))
Each stat: number in Sora 48px gradient-text, label in DM Sans 13px var(--text-secondary)
Separator: vertical line (var(--border)) between each stat on desktop
Animate: fade in with 0.1s stagger per stat on scroll

SECTION 3 — SERVICES GRID:
Heading: "What We Build For You" centered, Sora 42px, gradient-text
Sub: "From concept to launch — everything your business needs to dominate online"
Color: var(--text-secondary), center, DM Sans 16px, margin-bottom 48px

6 service cards in a 3x2 grid (2 columns on tablet, 1 on mobile):
Each card (glass-card class):
  - Icon: Lucide React, 28px, color var(--accent-blue), inside a small circle background (var(--glow-blue))
  - Title: Sora 18px bold, var(--text-primary)
  - Description: DM Sans 14px, var(--text-secondary), 2 lines max
  - Bottom link: "Learn more →" color var(--accent-blue), 13px
  - Hover: border color changes to var(--accent-blue), subtle glow-blue shadow, translateY -4px
  - Animate: fade up with 0.08s stagger on scroll

Cards:
  1. Icon: Globe — "Website Design" — "Stunning, fast websites built to convert visitors into clients."
  2. Icon: Bot — "AI Chatbots" — "24/7 intelligent assistants that handle your customer service."
  3. Icon: Palette — "Logo Design" — "Professional brand identity that makes you unforgettable."
  4. Icon: FileText — "PDF Guides" — "Expert knowledge packaged as downloadable products you sell forever."
  5. Icon: QrCode — "QR Code Design" — "Custom branded QR codes with built-in analytics tracking."
  6. Icon: Mail — "Custom Email" — "Professional @yourdomain.com email that builds instant credibility."

SECTION 4 — PROCESS:
Heading: "How We Work" centered
4 steps in a horizontal row (stack on mobile), connected by a dashed line between:
  Step 1: "Discovery" — Icon: Search — "We learn your business, goals, and audience in detail."
  Step 2: "Design" — Icon: Layers — "We craft wireframes and visual concepts for your approval."
  Step 3: "Build" — Icon: Code2 — "We develop with precision using the world's best tech stack."
  Step 4: "Launch" — Icon: Rocket — "We deploy, test, and hand you the keys to your new digital asset."
Each step: number badge (1/2/3/4) in gradient blue-purple, title in Sora 16px, description 13px
Connecting line: dashed, var(--accent-blue), opacity 0.3
Animate: draw line left to right on scroll + steps fade in with stagger

SECTION 5 — TESTIMONIAL BANNER:
Full-width dark section (var(--bg-secondary)):
Large italic quote (Cormorant Garamond):
"MuleSoo transformed our digital presence in 2 weeks. Our bookings tripled."
Attribution: "— Corporate Client, Pretoria" in DM Sans 13px var(--text-secondary)
Background: subtle radial gradient glow in center (var(--accent-blue) at 5% opacity)
Animate: fade in from below

SECTION 6 — FINAL CTA:
Background: linear-gradient(135deg, var(--bg-secondary), var(--bg-primary))
Border top and bottom: 1px solid var(--border)
Centered content:
  - "Ready to Build Something the World Will Notice?" — Sora 38px, gradient-text
  - "Book your free 30-minute strategy call. No pressure. Just clarity." — DM Sans 16px var(--text-secondary)
  - Button: "Book Free Consultation" — gold gradient, large, links to /contact
  - Below button: small text "🔒 No contracts. No setup fees. Cancel anytime." — 12px var(--text-secondary)

Write the complete app/page.tsx file with all imports.
---


---
## ═══════════════════════════════════════════════════
## PROMPT 5 — SERVICES INDEX PAGE
## ═══════════════════════════════════════════════════

---
Create app/services/page.tsx — the MuleSoo services overview page.

HERO SECTION:
- Background: radial gradient from var(--accent-purple) at 8% opacity in center
- Small badge: "Our Services"
- Main heading: "Every Digital Tool Your Business Needs" — Sora 56px, gradient-text
- Sub: "Websites. Chatbots. Branding. Automation. We build it all — at world-class quality."
- No buttons — scroll down is the CTA

SERVICES DETAIL SECTION:
6 large service blocks, alternating layout (text left / image right, then flip):
Each block:
  - Background: var(--bg-secondary) with subtle border
  - Icon badge: large icon (80px) with glow effect
  - Title: Sora 32px
  - Description: 3-4 sentences about the service and its benefits
  - Feature list: 5 bullet points with ✓ in var(--accent-green)
  - Price: "Starting from R3,500" in var(--accent-gold) Sora 20px bold
  - Button: "View Details" → links to the sub-page

Services:
1. Website Design → /services/website-design — Starting from R3,500
2. AI Chatbots → /services/chatbot — Starting from R2,500
3. Logo Design → /services/logo-design — Starting from R800
4. PDF Guides → /services/pdf-guides — Passive income product
5. QR Code Design → /services/qr-codes — Starting from R300
6. Custom Email Setup → /services/email-setup — Starting from R400

Each section uses scroll-triggered Framer Motion animation (slide in from left or right based on position).

COMPARISON TABLE at bottom:
Show a table comparing MuleSoo vs "Freelancer" vs "Big Agency":
Rows: Quality, Speed, Price, Support, AI-Powered, Cultural Understanding
MuleSoo column: all green checkmarks with gold highlight
Use --bg-card for table cells, var(--accent-gold) for MuleSoo header

Write the complete file.
---


---
## ═══════════════════════════════════════════════════
## PROMPT 6 — WEBSITE DESIGN SUB-PAGE
## ═══════════════════════════════════════════════════

---
Create app/services/website-design/page.tsx — the Website Design service page.

HERO:
- Animated headline: "Websites That Make" → new line → "Your Competition Nervous"
- Animate each word flying in from below with stagger
- Background: subtle grid pattern (CSS background-image with gradient lines)

WHAT YOU GET section:
8 deliverable cards in 4x2 grid:
  1. Responsive Design — works on all devices
  2. SEO Optimised — rank on Google from day one
  3. Blazing Fast — loads under 2 seconds
  4. 3D Animations — Three.js or CSS3 visual effects
  5. Contact Forms — connected to your email
  6. Custom Domain — professional .com or .co.za setup
  7. 30-Day Support — free fixes after launch
  8. Source Code — you own everything

PROCESS section (4 steps, vertical timeline on mobile):
  Step 1 Discovery — "Fill a brief form about your business, goals, audience."
  Step 2 Design — "We present 2 visual mockups in Figma or HTML within 5 days."
  Step 3 Development — "We build the full site using Next.js, Tailwind, and Framer Motion."
  Step 4 Launch — "We deploy to Netlify, set up your domain, and hand over full access."

PRICING TABLE (3 tiers):
  STARTER — R3,500
    - 3 pages
    - Mobile responsive
    - Basic SEO
    - Contact form
    - 2-week delivery

  BUSINESS — R7,500 (highlight this one with "Most Popular" badge)
    - 6 pages + sub-pages
    - Advanced animations
    - AI chatbot included
    - SEO full setup
    - 3-week delivery

  ENTERPRISE — R15,000+
    - Unlimited pages
    - 3D animations
    - E-commerce ready
    - Monthly maintenance included
    - Priority support

Pricing cards: glass-card, hover glow. Business tier: var(--accent-blue) border + glow.

FAQ section (5 questions, accordion expand/collapse with Framer Motion AnimatePresence):
  Q1: How long does a website take to build?
  Q2: Do I own the website after it's built?
  Q3: Can you redesign my existing website?
  Q4: Do you work with clients outside South Africa?
  Q5: What happens if I need changes after launch?

FINAL CTA: "Start Your Project Today" → /contact

Write the complete file.
---


---
## ═══════════════════════════════════════════════════
## PROMPT 7 — CHATBOT SUB-PAGE + LIVE DEMO WIDGET
## ═══════════════════════════════════════════════════

---
Create app/services/chatbot/page.tsx.

HERO: "Your Business, On Autopilot" — subheading: "AI chatbots that answer questions, book appointments, and qualify leads — 24 hours a day."

Add a LIVE DEMO section midway through the page:
- Heading: "Try a Live Demo — Chat With Soo"
- Show the actual ChatbotWidget component embedded inline (not just floating)
- This lets visitors experience the product before buying

FEATURES SECTION (6 cards):
  1. Natural Language — understands conversational messages
  2. Trained on Your Business — knows your products, prices, policies
  3. Lead Collection — captures name, email, and intent
  4. WhatsApp Integration — can connect to WhatsApp Business API
  5. Supabase Logging — every conversation is saved and searchable
  6. Easy to Embed — one script tag on any website

USE CASES (icon + title + 1 sentence):
  - Restaurant: "Takes reservations and answers menu questions"
  - Law Firm: "Screens client intake and books consultations"
  - Events Business: "Handles pricing enquiries and package bookings"
  - E-commerce: "Tracks orders and handles returns"
  - Medical Practice: "Books appointments and answers FAQ"

PRICING: R2,500 starter / R4,500 business / R8,000 enterprise
Include what's different per tier.

Write the complete file.
---


---
## ═══════════════════════════════════════════════════
## PROMPT 8 — CHATBOT WIDGET COMPONENT (Floating)
## ═══════════════════════════════════════════════════

---
Create components/ChatbotWidget.tsx — the floating AI chatbot that appears on every page.

DESIGN:
- Floating button: bottom-right corner, 60px circle, background gradient blue→purple
- Icon: MessageCircle from Lucide, white, 26px
- Pulse animation ring around button (CSS keyframes, var(--accent-blue), opacity 0 → 1 → 0, 2s loop)
- On click: button rotates 45deg and shows X icon, chat panel slides up

CHAT PANEL (350px wide, 500px tall on desktop. Full screen on mobile):
- Background: var(--bg-secondary)
- Border: 1px solid var(--border), border-radius 16px top
- Top bar: "Soo ●" (● = var(--accent-green) pulsing dot = online indicator)
  Sub text: "MuleSoo AI Assistant — typically replies instantly"
  Background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple))
  Text: white, Sora font

- Messages area: scrollable, padding 16px
- Bot message bubble: left-aligned, var(--bg-card), border-radius 12px 12px 12px 4px, DM Sans 14px
- User message bubble: right-aligned, gradient blue→purple, white text, border-radius 12px 12px 4px 12px

- Typing indicator: 3 animated dots (bounce keyframes) shown while waiting for AI response

- Input bar at bottom:
  - Text input: var(--bg-card) background, var(--border) border, focus: var(--accent-blue) border
  - Send button: gradient blue→purple, ArrowUp icon

FIRST MESSAGE (auto-displayed when chat opens, after 0.5s delay):
"👋 Hi! I'm Soo, MuleSoo's AI assistant.
I can help you learn about our services, pricing, and timeline.
What can I help you with today? 😊"

FUNCTIONALITY:
- On send: add user message to state, call POST /api/chat with message history
- Show typing indicator while waiting
- Add bot response to state when received
- Save conversation to localStorage so it persists on page refresh

QUICK REPLY CHIPS (shown after first bot message):
  "💻 Website Design"  |  "🤖 Chatbot"  |  "💰 Pricing"  |  "📞 Book a Call"
  Clicking a chip sends that message as the user

Create app/api/chat/route.ts:
```typescript
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    system: `You are Soo, the friendly AI assistant for MuleSoo Digital Services in Pretoria, South Africa.
Your role: Help potential clients understand MuleSoo's services and pricing.

SERVICES AND PRICING:
- Website Design: R3,500 (Starter) | R7,500 (Business) | R15,000+ (Enterprise)
- AI Chatbots: R2,500 | R4,500 | R8,000+
- Logo Design: R800 | R1,800 | R3,500+
- QR Codes: R300 | R600 | R1,200+
- Custom Email Setup: R400 | R800 | R1,500+
- PDF Guides (for sale): R99 – R499

RULES:
- Be warm, professional, and concise (max 3 sentences per reply)
- Always end with a question to continue the conversation
- If they are ready to buy: direct them to fill the contact form at /contact
- Never make up information not listed above`,
    messages: messages,
  });
  return NextResponse.json({ reply: (response.content[0] as any).text });
}
```

Also add the ChatbotWidget to app/layout.tsx so it appears on every page.
Write all complete files.
---


---
## ═══════════════════════════════════════════════════
## PROMPT 9 — PORTFOLIO PAGE
## ═══════════════════════════════════════════════════

---
Create app/portfolio/page.tsx — MuleSoo project portfolio.

HERO:
- Heading: "Work That Speaks For Itself"
- Subheading: "From Ethiopian wedding platforms to corporate chatbots — we build the digital products that matter."
- Animated text reveal: words appear one by one

FILTER TABS (horizontal scrollable on mobile):
  All | Websites | Chatbots | Logos | PDF Products | QR Codes
  Active tab: gradient background, others: outlined
  Filter switches with Framer Motion layout animation

PORTFOLIO GRID (masonry or uniform grid):
12 project cards, filterable.

Each card (glass-card):
  - Colored placeholder image area (different gradient per project) — 220px height
  - Category badge (top-left on image)
  - Project name: Sora 16px bold
  - Client type: DM Sans 13px var(--text-secondary) (e.g. "Events Business")
  - Tech tags (small pills): React, Next.js, etc.
  - Hover: overlay slides up showing "View Project" button + short result stat (e.g. "+300% bookings")

Projects to include:
  1. "Habesha Celebration Events" — Website — Events Business — React, Vite, Netlify
  2. "Restaurant Booking Bot" — Chatbot — Restaurant — Claude API, n8n
  3. "Law Firm Secretary AI" — Chatbot — Legal — GPT-4o, Supabase, Twilio
  4. "Ethiopian Food Store" — Website — E-commerce — Next.js, Stripe
  5. "Church Community Site" — Website — Religious Org — HTML, CSS
  6. "Habesha Events Logo" — Logo — Events Business — Canva Pro, Illustrator
  7. "ABOO HOUSE Store" — Website — E-commerce — React, Supabase
  8. "Claude Code Master Guide" — PDF Product — Education — ReportLab, Python
  9. "AI Tools Beginner Course" — PDF Product — Education — 58-page guide
  10. "Ethiopian Restaurant QR" — QR Code — Restaurant — Custom branded
  11. "Pretoria Events Planner" — Website — Events — Next.js, Framer Motion
  12. "Wedding Invitation Bot" — Chatbot — Events — Claude API

PROJECT MODAL (opens on card click):
  - Full-screen overlay with Framer Motion scale animation
  - Large image placeholder at top
  - Project title, client, year, services used
  - Challenge / Solution / Result (3 columns)
  - Tech stack icons row
  - "Visit Live Site" button (if applicable)
  - Close button (X) top right

BOTTOM CTA: "Want Results Like These? Let's Talk." → /contact

Write the complete file.
---


---
## ═══════════════════════════════════════════════════
## PROMPT 10 — PDF STORE WITH STRIPE PAYMENTS
## ═══════════════════════════════════════════════════

---
Create app/store/page.tsx — the MuleSoo PDF guide store.

HERO:
- Heading: "Expert Knowledge. Instant Download."
- Sub: "Battle-tested guides built from real projects. Buy once, use forever."
- Small badge: "🔒 Secure payments via Stripe • Instant PDF delivery"

PRODUCTS GRID (2 columns desktop, 1 mobile):
4 product cards. Each card (glass-card, hover glow-gold):
  - Cover image area (180px, colored gradient placeholder)
  - "BESTSELLER" badge on first card (var(--accent-gold) background)
  - Title: Sora 20px bold
  - Description: 2 sentences, DM Sans 14px
  - "What's inside:" — 4 bullet points with ✓
  - Pages count + difficulty badge
  - Price: Sora 28px var(--accent-gold) bold ("R299")
  - "Buy Now" button: gold gradient, full width
  - Below button: "⭐⭐⭐⭐⭐ 47 downloads" in 12px var(--text-secondary)

Products:
  1. "Claude Code Master Guide" — R299 — "Build any professional website using AI in days, not weeks."
     Inside: Project setup, 7 master prompts, 3D animations, deployment, SEO
     52 pages | Beginner-Friendly

  2. "n8n Automation Bible" — R249 — "Automate your entire business with zero code. Real workflows included."
     Inside: Email automation, lead capture, payment workflows, AI integrations
     44 pages | Intermediate

  3. "Chatbot Business Blueprint" — R199 — "How to start a chatbot agency and land R5,000+ clients."
     Inside: Niche selection, client scripts, pricing, Claude API setup, delivery
     38 pages | Beginner-Friendly

  4. "Netlify Deployment Guide" — R149 — "Deploy any website professionally in under 30 minutes."
     Inside: Project setup, environment variables, custom domain, SSL, CI/CD
     28 pages | Beginner-Friendly

BUY NOW button behavior:
  - Shows loading spinner
  - Calls POST /api/create-checkout with { productId, productName, amount }
  - Redirects to Stripe checkout page

Create app/api/create-checkout/route.ts:
```typescript
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { productName, amount } = await req.json();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'zar',
        product_data: { name: productName },
        unit_amount: amount * 100,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/store/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/store`,
  });
  return NextResponse.json({ url: session.url });
}
```

Create app/store/success/page.tsx:
- Verify Stripe session ID from URL params
- Show animated success checkmark (Framer Motion scale + green glow)
- Heading: "Payment Confirmed! 🎉"
- Show what was purchased
- Large "Download Your PDF" button (gold, prominent)
- "You'll also receive a copy by email within 5 minutes"
- "Explore More Guides" → /store

Write all complete files.
---


---
## ═══════════════════════════════════════════════════
## PROMPT 11 — ABOUT PAGE
## ═══════════════════════════════════════════════════

---
Create app/about/page.tsx.

HERO:
- Heading (2 lines): "The Builder Behind" / "MuleSoo"
- "The Builder Behind" — var(--text-primary)
- "MuleSoo" — gradient text
- Sub: "One entrepreneur. Multiple ventures. One mission: bring world-class tech to African businesses."

FOUNDER SECTION (2 columns):
Left: Large placeholder profile image (400x500px, var(--bg-card), rounded-2xl, gold border glow)
Right:
  - "Hi, I'm Ethan." — Sora 36px
  - Bio paragraph: "I'm an entrepreneur and digital builder based in Pretoria, South Africa. I run MuleSoo Digital Services alongside Habesha Celebration Events — a full-service Ethiopian wedding planning company. I'm also completing my MSc in Chemical Engineering, where I work on AI systems for industrial process monitoring. I build websites, chatbots, automation systems, and educational content because I believe every African business deserves world-class digital tools — not just the big corporates."
  - "What I'm currently building:" label
  - 3 badges: "MuleSoo.com 🛠️" | "Habesha Events 🎊" | "YouTube AI Channel 🎥"
  - Social links: LinkedIn, GitHub, YouTube — icon buttons with hover glow

MISSION SECTION:
Full-width centered, var(--bg-secondary) background:
Large quote: "Africa doesn't need cheaper versions of Western tech. It needs builders who understand the culture AND the code."
Attribution: "— Ethan, Founder of MuleSoo"
Styling: Cormorant Garamond italic, 28px, var(--text-primary)

VALUES (4 cards in row):
  💎 Quality First — "We build to the highest standard, every time. No shortcuts."
  ⚡ Speed — "Clients get results fast. Most websites launch within 3 weeks."
  🤝 Honesty — "We tell you exactly what you'll get, what it costs, and when."
  🔬 Innovation — "We use the latest AI tools so you benefit from cutting-edge tech."

TECH STACK SECTION:
"The Tools We Use" heading
Two rows of animated technology logos/icons:
  Row 1: React, Next.js, Three.js, Framer Motion, Tailwind CSS
  Row 2: Supabase, Stripe, n8n, Claude API, Netlify
Logos slide in from left on scroll, each with a subtle hover lift effect.

TIMELINE (vertical, animated line draws on scroll):
  2022 — "Started freelancing: first paid website project"
  2023 — "Launched Habesha Celebration Events — first major digital brand"
  2024 — "Learned Claude Code + n8n automation, 10x build speed"
  2025 — "Launched MuleSoo as a formal digital agency"

BOTTOM CTA: "Let's Build Your Vision Together" → /contact

Write the complete file.
---


---
## ═══════════════════════════════════════════════════
## PROMPT 12 — CONTACT PAGE
## ═══════════════════════════════════════════════════

---
Create app/contact/page.tsx.

HERO: "Let's Start Building"
Sub: "Tell us what you need. We respond within 2 hours on business days."

TWO-COLUMN LAYOUT (60% form / 40% info):

LEFT — CONTACT FORM (react-hook-form):
Fields:
  1. Full Name * — text input
  2. Email Address * — email input
  3. Company/Business Name — text input (optional)
  4. Service Needed * — select dropdown:
      "Website Design" | "AI Chatbot" | "Logo Design" | "QR Code" | "Custom Email" | "PDF Guide" | "Other"
  5. Budget Range * — select:
      "Under R2,000" | "R2,000 – R5,000" | "R5,000 – R10,000" | "R10,000+" | "Not sure yet"
  6. Project Details * — textarea (placeholder: "Tell us about your project, goals, and timeline...")
  7. How did you hear about us? — select: LinkedIn | WhatsApp | YouTube | Google | Referral | Other

Submit button: "Send My Enquiry →" — gradient blue→purple, full width, loading spinner on submit

On submit:
  - POST to /api/contact
  - On success: replace form with animated success message:
    Big green checkmark animation, "Thank you, [name]! We've received your enquiry and will reply to [email] within 2 hours."
  - On error: show red error message below form

Create app/api/contact/route.ts:
  - Validate required fields
  - Save lead to Supabase 'leads' table
  - Send notification email to hello@mulesoo.com via Resend API
  - Send auto-reply email to the client
  - Return success/error JSON

RIGHT — CONTACT INFO:
Contact card (glass-card):
  - Email: hello@mulesoo.com — Mail icon — "Click to email us"
  - WhatsApp: "Chat on WhatsApp" — green button → opens wa.me link
  - Location: Pretoria, South Africa — MapPin icon
  - Hours: Mon–Fri 8am–6pm SAST | Sat 9am–1pm
  - Response time: "⚡ Usually reply within 2 hours"

Below card: "Prefer to talk? Book a free 30-min strategy call" → Calendly link placeholder button

FAQ (3 quick questions, always visible, no accordion):
  "Do you work remotely?" — Yes, we serve clients across all of South Africa and Africa.
  "What payment methods do you accept?" — EFT, card via Stripe, and PayFast.
  "Do you offer payment plans?" — Yes. Ask us about splitting payments.

Write the complete file with API route.
---


---
## ═══════════════════════════════════════════════════
## PROMPT 13 — ANIMATIONS FOR EACH PAGE (Page Hero Illustrations)
## ═══════════════════════════════════════════════════

---
Create components/PageHeroAnimation.tsx

This renders a different SVG + Framer Motion animation depending on the 'type' prop.
It appears at the top of each inner page (not the home page) as a visual accent.

Props: type: 'services' | 'portfolio' | 'store' | 'about' | 'contact'

SERVICES animation:
  - Animated SVG gear icon (50px)
  - It rotates 360deg continuously (duration: 8s, ease: linear, repeat: Infinity)
  - A second smaller gear rotates in the opposite direction (counter-rotate)
  - Color: var(--accent-blue)

PORTFOLIO animation:
  - 6 small square tiles arranged in a 3x2 grid
  - On mount: tiles fly in from random positions, each with a delay (stagger 0.08s)
  - Once assembled, they gently float up and down (loop)
  - Colors: blue, purple, gold tiles mixed

STORE animation:
  - Shopping bag SVG outline
  - On mount: slides down from above + bounces 2x (spring animation)
  - Sparkle particles (4 stars) orbit around it
  - Color: var(--accent-gold)

ABOUT animation:
  - Circular orbit: a small dot orbiting a central circle
  - The orbit draws its path (strokeDashoffset animation)
  - Color: var(--accent-blue)

CONTACT animation:
  - Envelope SVG
  - On mount: flap opens and closes once
  - A small paper slides out of envelope
  - Color: var(--accent-purple)

All animations: width 80px, height 80px, inline-block.
Add this component to the top of each service sub-page and main page.
Write the complete file.
---


---
## ═══════════════════════════════════════════════════
## PROMPT 14 — MOBILE RESPONSIVENESS FIX
## (Run this after each page is built)
## ═══════════════════════════════════════════════════

---
Review and fix the full mobile responsiveness of [PAGE NAME]:

Do the following:
1. Navbar: confirm hamburger menu works, all links accessible in the mobile drawer
2. Hero section: on 375px width, stack columns vertically, reduce font sizes:
   - 72px headlines → 36px on mobile
   - 56px → 28px
   - 42px → 24px
3. All grids: max 1 column on mobile (< 640px), 2 columns on tablet (640-1024px)
4. The ThreeBackground 3D canvas: on mobile, disable it and replace with this CSS:
   background: radial-gradient(ellipse at top, rgba(0,200,255,0.08) 0%, var(--bg-primary) 70%),
               radial-gradient(ellipse at bottom-right, rgba(123,47,255,0.06) 0%, transparent 60%);
5. All buttons: minimum height 48px, minimum width 44px for touch targets
6. Padding: use px-4 on mobile, px-8 on tablet, px-16 on desktop (Tailwind responsive)
7. Cards: full width on mobile with 16px horizontal margin
8. Stats bar: 2x2 grid on mobile (not 4-in-a-row)
9. Footer: all 4 columns stack to 2 columns on tablet, 1 on mobile
10. No horizontal scrollbar at any breakpoint — test at 320px, 375px, 414px

Show me only the changes needed, not the full file, unless the changes are extensive.
---


---
## ═══════════════════════════════════════════════════
## PROMPT 15 — SEO + METADATA
## ═══════════════════════════════════════════════════

---
Add complete SEO to the MuleSoo website.

1. Update app/layout.tsx metadata export:
```typescript
export const metadata: Metadata = {
  title: {
    template: '%s | MuleSoo Digital Services',
    default: 'MuleSoo | World-Class Websites & AI Solutions — Pretoria, SA',
  },
  description: 'MuleSoo builds professional websites, AI chatbots, logos, and digital solutions for businesses across South Africa. Based in Pretoria. Fast delivery. Premium quality.',
  keywords: ['web design Pretoria', 'AI chatbot South Africa', 'website design South Africa', 'digital agency Pretoria', 'Next.js developer South Africa'],
  openGraph: {
    title: 'MuleSoo Digital Services',
    description: 'World-class websites and AI solutions for South African businesses.',
    url: 'https://mulesoo.com',
    siteName: 'MuleSoo',
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'MuleSoo Digital Services' },
  robots: { index: true, follow: true },
};
```

2. Create app/sitemap.ts that auto-generates XML sitemap including all 6 pages and all service sub-pages.

3. Create app/robots.ts that allows all crawlers and points to the sitemap URL.

4. Add JSON-LD LocalBusiness schema to app/layout.tsx:
```json
{
  "@type": "LocalBusiness",
  "name": "MuleSoo Digital Services",
  "address": { "addressLocality": "Pretoria", "addressCountry": "ZA" },
  "priceRange": "R500 - R15000",
  "serviceArea": "South Africa"
}
```

5. Each page must export its own metadata (add to each page file):
   - app/services/page.tsx: title "Our Services"
   - app/portfolio/page.tsx: title "Portfolio"
   - app/store/page.tsx: title "PDF Store"
   - app/about/page.tsx: title "About MuleSoo"
   - app/contact/page.tsx: title "Contact Us"

Write all complete files.
---


---
## ═══════════════════════════════════════════════════
## PROMPT 16 — DEPLOYMENT PREPARATION
## ═══════════════════════════════════════════════════

---
Prepare the MuleSoo project for Netlify deployment.

1. Create netlify.toml in project root:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
  NEXT_TELEMETRY_DISABLED = "1"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

2. Create .env.local with these placeholder variables (I will fill in values):
```
ANTHROPIC_API_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
STRIPE_SECRET_KEY=sk_test_your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
RESEND_API_KEY=your_resend_key
NEXT_PUBLIC_URL=https://mulesoo.netlify.app
```

3. Create .gitignore and make sure .env.local is included.

4. Run npm run build and fix any TypeScript or build errors that appear.

5. Show me the git commands to push to GitHub:
```
git init
git add .
git commit -m "Initial MuleSoo website build"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/mulesoo-website.git
git push -u origin main
```

Then list the 5 environment variables I must add in Netlify dashboard before the site will work.
---


---
## ═══════════════════════════════════════════════════
## PROMPT 17 — 404 ERROR PAGE
## ═══════════════════════════════════════════════════

---
Create app/not-found.tsx — a memorable custom 404 page.

Content:
- Background: full screen, var(--bg-primary) + subtle radial glow in purple
- Giant "404" — Sora 200px, gradient text (blue→purple), letter-spacing: -8px
  Animate: on mount, scale from 1.5 to 1 with a spring, opacity 0→1
- Below: "You've drifted into deep space." — Sora 24px, var(--text-secondary)
- Small: "The page you're looking for doesn't exist or has moved." — DM Sans 16px
- Animated floating astronaut:
  SVG astronaut (simple stick figure with helmet bubble)
  It bobs up and down on an infinite loop (y: 0 → -15px → 0, 3s ease-in-out)
  Tiny stars (5 dots) randomly positioned around it, blinking
- Button: "Take Me Home" → links to /
  Gold gradient, Sora 16px bold, hover: scale + glow-gold

Write the complete file.
---


---
## ═══════════════════════════════════════════════════
## EMERGENCY FIX PROMPTS — USE WHEN SOMETHING BREAKS
## ═══════════════════════════════════════════════════

### When you get a TypeScript error:
"Fix this TypeScript error without changing the component's functionality:
[paste the full error message here]
File: [paste file path]"

### When a component looks wrong on mobile:
"The [component name] in [file path] is breaking on mobile screens (375px width).
Fix the layout to be fully responsive. Keep all desktop styles unchanged.
Only show me the CSS/Tailwind changes needed."

### When Three.js is causing performance issues:
"The ThreeBackground component is making the page slow on mid-range phones.
Reduce the particle count to 500 on screens smaller than 768px.
Use window.innerWidth detection inside the component before creating particles.
Write the updated ThreeBackground.tsx."

### When animations are not triggering on scroll:
"The Framer Motion scroll animations in [file] are not working.
Add useInView from framer-motion with a threshold of 0.1 and once: true.
Update the component to trigger animations when it enters the viewport."

### When the build fails on Netlify:
"The Netlify build failed with this error:
[paste error]
Fix the code to resolve this. Do not change any functionality."

---

## NOTES FOR EVERY CLAUDE CODE SESSION

1. Always use the CSS variables defined at the top — NEVER hardcode hex colors
2. All animations use Framer Motion unless it's a Three.js scene
3. Every page must have a metadata export for SEO
4. Test every component at 375px width before saying it's done
5. API keys go ONLY in .env.local — never in component files
6. Every form must validate on client AND server side
7. All images use Next.js Image component with width and height props
8. External links must have target="_blank" rel="noopener noreferrer"
9. The chatbot widget must appear on EVERY page via layout.tsx
10. Push to GitHub after every working feature — Netlify auto-deploys

---
*CLAUDE.md — MuleSoo Digital Services — Built by Ethan — Pretoria, South Africa*
