# Performance Optimization Guide

Every 1 second faster = +7% conversion improvement.

## Quick Audit (5 minutes)

1. **Google Lighthouse** (Chrome DevTools)
   - Press F12 → Lighthouse tab → Analyze page load
   - Goal: 90+ on desktop, 80+ on mobile

2. **Check Current Scores**
   ```
   Go to: mulesoo.com
   DevTools > Lighthouse > Analyze Page Load
   ```

## Key Metrics to Target

| Metric | Goal | Current |
|--------|------|---------|
| **FCP** (First Contentful Paint) | <2.5s | ? |
| **LCP** (Largest Contentful Paint) | <4s | ? |
| **CLS** (Cumulative Layout Shift) | <0.1 | ? |
| **TTI** (Time to Interactive) | <5s | ? |
| **Page Size** | <3MB total | ? |
| **Requests** | <100 | ? |

## Quick Wins (15-30 min each)

### 1. Image Optimization
**Problem**: Images often eat 50% of page size  
**Fix**:
```javascript
// Use Next.js Image component (already doing this!)
// But check:
1. Images are compressed (use tinypng.com)
2. Use WebP format with fallback
3. Lazy load off-screen images (Next/Image does this)
4. Responsive images (srcSet)
```

### 2. Code Splitting
**Problem**: Ship entire app on first load  
**Fix**:
```javascript
// Dynamic imports (already in some places)
const ChatbotWidget = dynamic(() => import('@/components/ChatbotWidget'), {
  loading: () => <p>Loading...</p>,
});

// Check: all heavy components are lazy-loaded
// Goal: First JS bundle < 100KB
```

### 3. Remove Unused CSS
**Problem**: Tailwind can bloat if not configured  
**Fix**:
```javascript
// tailwind.config.ts already has purge
// But verify: content paths include ALL component files
content: [
  './app/**/*.{js,ts,jsx,tsx}',
  './components/**/*.{js,ts,jsx,tsx}',
],
```

### 4. Optimize Three.js
**Problem**: 3D background can be 500KB+  
**Fix**:
```javascript
// ThreeBackground should:
1. Use InstancedMesh (not individual geometries)
2. Reduce particle count on mobile (already doing this)
3. Disable on very slow networks
4. Use LOD (level of detail) for complex models

// Check: Mobile gets 500 particles, desktop gets 3000
```

### 5. Font Loading
**Problem**: Google Fonts can delay first paint  
**Fix**:
```javascript
// next/font/google uses optimal loading
// But verify in DevTools:
1. Fonts load with font-display: swap (don't block)
2. Only load needed weights/styles
3. Check: System fonts are backup (font-family stack)
```

## Detailed Fixes (1-2 hours)

### Network Waterfall
Open DevTools Network tab → Check for:
- Large JS bundles → code split
- Uncompressed images → optimize
- Slow API calls → add caching
- Third-party scripts → defer or remove

### JavaScript Bundle Analysis
```bash
npm install --save-dev @next/bundle-analyzer
# Add to next.config.js, then build
# Identify largest modules - can they be lazy-loaded?
```

### CSS/Tailwind Bloat
```bash
npm run build
# Check .next/static/css/*.css file sizes
# If > 300KB, you're including unused styles
```

### Database/API Optimization
- Cache static pages (Next.js ISR)
- Cache API responses (60s+ for data that doesn't change)
- Compress API responses (gzip)

## Performance Checklist

### Critical (Do First)
- [ ] Lighthouse score 80+ on mobile
- [ ] First Contentful Paint < 2.5s
- [ ] Largest Contentful Paint < 4s
- [ ] Page size < 3MB total
- [ ] No render-blocking resources

### Important (Do Second)
- [ ] Images are optimized (compressed + WebP)
- [ ] Three.js loads only on desktop
- [ ] Fonts use font-display: swap
- [ ] Critical CSS is inlined
- [ ] Unused CSS/JS is removed

### Nice-to-Have (Do Last)
- [ ] Preload critical resources
- [ ] Service worker for offline support
- [ ] Edge caching headers configured
- [ ] Compress static assets (gzip/brotli)

## Monitoring

After optimizations, track these:

**Google Lighthouse** (free)
- Monthly check
- Track trends over time

**Web Vitals** (free, via Google Analytics)
- Real-user metrics
- Automatically tracked if GA4 is configured

**Vercel Analytics** (if using Vercel)
- Automatic performance tracking
- Shows per-page metrics

## Estimated Impact

| Optimization | Current Impact |
|--------------|----------------|
| Image optimization | -40% page size |
| Code splitting | -30% initial JS |
| Remove Three.js on mobile | -20% mobile load |
| Font optimization | -15% First Paint |
| CSS purging | -10% CSS size |
| **Total Estimated** | **-20-30% load time = +14-21% conversion** |

## Commands to Run

```bash
# Analyze bundle
npm run build
ls -lh .next/static/chunks/

# Check Lighthouse (via DevTools)
1. DevTools F12
2. Lighthouse tab
3. Generate report

# Verify image optimization
1. DevTools Network tab
2. Filter by images
3. Check sizes and formats
```

## Next Steps

1. ✅ Run Lighthouse audit (5 min)
2. ✅ Compare to targets above (2 min)
3. ✅ Identify top 3 bottlenecks (5 min)
4. ✅ Implement quick wins (30 min)
5. ✅ Re-run Lighthouse (5 min)
6. ✅ Repeat with detailed fixes

**Target**: 90+ Lighthouse score within 2 hours of focused work.

---

**Current Status**: [Run Lighthouse to fill in]
- FCP: ?
- LCP: ?
- Page Size: ?

Once you run Lighthouse, reply with the scores and I can pinpoint exact fixes!
