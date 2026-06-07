# MuleSoo Website - Quick Testing Guide

## 🚀 Start Testing Locally

```bash
cd c:\Users\mule\OneDrive\Desktop\mulesoo
npm run dev
```

This starts the development server at **http://localhost:3000**

---

## ✅ 30-Second Quick Test

1. **Home Page** → http://localhost:3000
   - See hero with 3D animation? ✓
   - Chatbot widget in corner? ✓
   - All text readable? ✓

2. **Portfolio** → http://localhost:3000/portfolio
   - See 6 project cards? ✓
   - First 2 have images? ✓
   - Hover effect works? ✓

3. **Chatbot Widget** (on any page)
   - Click floating button ✓
   - Type "hello" ✓
   - Get response? ✓
   - Close button works? ✓

4. **Admin Login** → http://localhost:3000/admin/login
   - Login page loads? ✓
   - Form visible? ✓

---

## 🎯 Comprehensive 5-Minute Test

### Pages (Check each one)
```
Home              → http://localhost:3000
About             → http://localhost:3000/about
Services          → http://localhost:3000/services
Portfolio         → http://localhost:3000/portfolio
Contact           → http://localhost:3000/contact
Store             → http://localhost:3000/store
Admin Login       → http://localhost:3000/admin/login
```

### What to Look For
- ✅ Page loads (no 404)
- ✅ Text readable
- ✅ Images display (if any)
- ✅ Buttons clickable
- ✅ Navbar works
- ✅ Footer present
- ✅ Chatbot widget visible

---

## 🤖 Chatbot Widget Testing

**On any page:**

1. Find floating button (bottom-right)
2. Click it → panel opens
3. See "Hi! I'm Soo" message? ✓
4. See quick reply chips? ✓
5. Type a message (e.g., "Tell me about websites")
6. Wait for bot response ✓
7. Test different queries:
   - "What services?" → Info about services
   - "Pricing?" → Pricing information
   - "Contact?" → Contact information
8. Click X button to close ✓

**Expected Behavior:**
- Smooth animations
- Instant response
- No errors in console

---

## 🔐 Admin Panel Testing

**Address:** http://localhost:3000/admin/login

### Steps
1. Navigate to admin login page
2. See login form
3. (If admin credentials available) Enter email/password
4. May see 2FA prompt
5. Enter 2FA code if prompted
6. Should see dashboard
7. Verify sections load:
   - Bookings
   - QR Scans
   - Visitors
8. Logout works

---

## 📱 Mobile Testing

### Chrome DevTools Method
1. Press `F12` to open DevTools
2. Click device icon (top-left)
3. Select "iPhone 12" or "Galaxy S9"
4. Visit each page and verify:
   - Text readable
   - No horizontal scroll
   - Buttons touch-friendly
   - Images scale properly
   - Menu collapses to hamburger

### Test Widths
- 375px (iPhone SE)
- 667px (iPhone 12)
- 1024px (iPad)

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Chatbot doesn't respond | Check .env vars, restart dev server |
| Images don't load | Verify files in `/public` folder |
| Styles look wrong | Clear browser cache (Ctrl+Shift+Del) |
| Admin login fails | Check ADMIN_EMAIL in .env.local |
| Page doesn't load | Run `npm install` to ensure deps |
| 3D background missing | Check Three.js is imported correctly |

---

## 📊 Browser Console Check

While testing, press `F12` and check Console tab:

**Should NOT see:**
- ❌ Red errors
- ❌ Failed to fetch
- ❌ Undefined variables
- ❌ CORS warnings

**OK to see:**
- ✅ Deprecation warnings
- ✅ Next.js dev messages
- ✅ ChatBot messages

---

## ✨ Performance Check

1. Open DevTools → Network tab
2. Refresh page
3. Check:
   - Page loads in < 3 seconds ✓
   - CSS files cached ✓
   - JS bundles reasonable size ✓
   - Images optimized ✓

---

## 🎨 Visual Verification

### Colors Should Be:
- Dark background (near black) ✓
- Cyan/blue accents visible ✓
- Gold highlights present ✓
- White text readable ✓

### Typography:
- Headlines bold/prominent ✓
- Body text readable ✓
- Consistent sizing ✓

### Animations:
- Smooth, not jerky ✓
- 3D elements present ✓
- Hover effects visible ✓

---

## 📋 Checkpoint Checklist

### Before Calling It Done
- [ ] Home page loads without errors
- [ ] All nav links work
- [ ] Portfolio shows images
- [ ] Chatbot responds
- [ ] Admin login page loads
- [ ] Contact form displays
- [ ] Services page loads
- [ ] Footer present
- [ ] Mobile responsive (tested in DevTools)
- [ ] No console errors
- [ ] Images load properly
- [ ] Animations smooth

---

## 🚀 Production Check

**Before deploying to Vercel:**

```bash
npm run build
```

Should show:
```
✓ Compiled successfully
✓ Generating static pages
✓ All 39 pages generated
```

Then deploy:
```bash
vercel --prod
```

Visit: **https://mulesoo.vercel.app**

---

## 📞 Emergency Contacts (Dev)

If something breaks:

1. **Check logs:** `npm run dev` output
2. **Check browser console:** F12 → Console
3. **Check .env.local:** Is it configured?
4. **Rebuild:** Stop dev server, run `npm run build`
5. **Clear cache:** Delete `.next` folder

---

## ✅ Testing Complete!

When you finish testing, you should have verified:
- ✅ All pages load
- ✅ Navigation works
- ✅ Chatbot responds
- ✅ Forms submit
- ✅ Admin panel accessible
- ✅ Responsive design
- ✅ No console errors
- ✅ Performance acceptable

**Website is ready for production!** 🎉

---

*Last Updated: 2026-06-07*
*MuleSoo Digital Services*
