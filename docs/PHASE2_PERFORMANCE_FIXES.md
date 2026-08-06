# Phase 2: Performance Optimization Checklist

## Quick Wins (Implement Immediately)

### 1. ✅ Image Optimization
- [ ] Compress all PNG/JPG images (TinyPNG.com)
- [ ] Convert images to WebP format
- [ ] Add width/height to all images (prevents CLS)
- [ ] Use Next.js Image component with proper sizing

**Impact:** -30-40% image size, +15-20% load time

### 2. ✅ Code Splitting
- [ ] Lazy load ChatbotWidget (already using dynamic import)
- [ ] Lazy load Three.js components
- [ ] Remove unused Lucide icons

**Impact:** -25% initial JS bundle

### 3. ✅ CSS Optimization
- [ ] Verify Tailwind purge is working
- [ ] Remove unused CSS classes
- [ ] Minify global.css

**Impact:** -15% CSS size

### 4. ✅ Font Optimization
- [ ] Use `font-display: swap` (already configured)
- [ ] Only load needed font weights
- [ ] Preload critical fonts

**Impact:** +10-15% FCP

### 5. ✅ Next.js Optimizations
- [ ] Enable Image Optimization
- [ ] Add proper meta tags
- [ ] Use dynamic imports for heavy components
- [ ] Enable gzip compression

**Impact:** -20% overall size

## Target Lighthouse Scores

| Metric | Current | Target | Weight |
|--------|---------|--------|--------|
| Performance | ? | 85+ | High |
| FCP | ? | <2.5s | Critical |
| LCP | ? | <4s | Critical |
| CLS | ? | <0.1 | Critical |
| TTI | ? | <5s | High |

## Implementation Order

1. **Images** (biggest impact)
2. **Code Splitting** (second biggest)
3. **CSS/Fonts** (quick wins)
4. **Next.js configs** (polish)

## After implementing, run:
```bash
npm run build
# Check bundle size
ls -lh .next/static/chunks/
```

Then re-run Lighthouse and compare scores.
