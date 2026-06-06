# 🔑 How to Find Environmental Variables

## 1️⃣ RESEND_API_KEY (For Sending 2FA Emails)

You're already using Resend, so this is easiest.

### Step 1: Go to Resend Dashboard
- URL: https://resend.com/dashboard
- **Login** with your account (same email you use for MuleSoo)

### Step 2: Navigate to API Keys
- Click on your profile icon (top right)
- Select **"API Keys"** from dropdown
- Or go directly to: https://resend.com/api-keys

### Step 3: Copy Your API Key
```
You'll see something like:
"re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

This entire string is your RESEND_API_KEY
```

### Step 4: Add to `.env.local`
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 2️⃣ Google reCAPTCHA v3 Keys (For Bot Protection)

### Step 1: Go to Google Cloud Console
- URL: https://console.cloud.google.com
- **Login** with your Google account

### Step 2: Create a New Project (if you don't have one)
- Click **"Select a Project"** (top left)
- Click **"New Project"**
- Enter name: `mulesoo-security`
- Click **"Create"**
- Wait for it to load (2-3 minutes)

### Step 3: Enable reCAPTCHA API
- Go to: https://console.cloud.google.com/apis/library
- Search for **"reCAPTCHA Enterprise"** or **"reCAPTCHA"**
- Click on **"reCAPTCHA Enterprise API"**
- Click **"Enable"**
- Wait 30 seconds for it to activate

### Step 4: Create reCAPTCHA Keys
- Go to: https://console.cloud.google.com/security/recaptcha
- Click **"Create Key"**
- Fill in the form:
  ```
  Display name: "MuleSoo Admin Panel"
  reCAPTCHA type: Select "reCAPTCHA v3"
  
  Website URLs (add both):
  - https://mulesoo.vercel.app
  - https://mulesoo.netlify.app
  - http://localhost:3000 (for local testing)
  ```
- Click **"Create and Continue"**

### Step 5: Copy Your Keys
```
You'll see two keys:

Site key (public):     6Le7xxxxxxxxxxxxxxxxxxxxx
Secret key (private):  6Le7xxxxxxxxxxxxxxxxxxxxx
```

**IMPORTANT:** Keep these separate!
- **Site key** → `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (can be public)
- **Secret key** → `RECAPTCHA_SECRET_KEY` (NEVER share this)

### Step 6: Add to `.env.local`
```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Le7xxxxxxxxxxxxxxxxxxxxx
RECAPTCHA_SECRET_KEY=6Le7xxxxxxxxxxxxxxxxxxxxx
```

---

## 3️⃣ ADMIN_EMAIL (Your Email for Alerts)

This is simple - it's just your email address.

### Where to Get It
```
Your email: mulukenendashaw68@gmail.com
```

### Step: Add to `.env.local`
```
ADMIN_EMAIL=mulukenendashaw68@gmail.com
```

---

## 📝 Complete `.env.local` Template

Create a file called `.env.local` in your project root:

```bash
# Location: c:\Users\mule\OneDrive\Desktop\mulesoo\.env.local

# Resend API (for 2FA emails)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google reCAPTCHA v3 (bot protection)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Le7xxxxxxxxxxxxxxxxxxxxx
RECAPTCHA_SECRET_KEY=6Le7xxxxxxxxxxxxxxxxxxxxx

# Admin email (for security alerts)
ADMIN_EMAIL=mulukenendashaw68@gmail.com

# Supabase (already set up)
NEXT_PUBLIC_SUPABASE_URL=your_existing_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_existing_supabase_key

# Stripe (already set up)
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# URL (for redirect after payment)
NEXT_PUBLIC_URL=https://mulesoo.vercel.app
```

---

## 🚀 Step-by-Step Summary

### **To Get RESEND_API_KEY (2 minutes):**
1. Go to https://resend.com/dashboard
2. Click API Keys
3. Copy key that looks like `re_xxxx...`
4. Paste into `.env.local`

### **To Get reCAPTCHA Keys (5 minutes):**
1. Go to https://console.cloud.google.com
2. Create new project (name: `mulesoo-security`)
3. Enable reCAPTCHA API
4. Go to Security > reCAPTCHA
5. Create Key → select reCAPTCHA v3
6. Add your domains (localhost, vercel, netlify)
7. Copy both keys
8. Paste into `.env.local`

### **To Get ADMIN_EMAIL (1 minute):**
1. Use: `mulukenendashaw68@gmail.com`
2. Paste into `.env.local`

---

## ⚠️ SECURITY IMPORTANT

### Never Share These:
- ❌ `RECAPTCHA_SECRET_KEY`
- ❌ `RESEND_API_KEY`
- ❌ Any key that doesn't have `NEXT_PUBLIC_` prefix

### Safe to Share:
- ✅ `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (public)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public, anon only)
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (public)

### Store Safely:
- `.env.local` is in `.gitignore` (NOT pushed to GitHub) ✅
- `.env.local` only exists on your local machine ✅
- Production keys stored in Vercel/Netlify dashboard, not in repo ✅

---

## ✅ Where to Add `.env.local`

The file goes here (same level as `package.json`):

```
mulesoo/
├── .env.local          ← CREATE THIS FILE HERE
├── .gitignore
├── package.json
├── next.config.ts
├── app/
├── components/
└── lib/
```

---

## 🔍 How to Find Your Keys Later

### **Resend API Key:**
- Always at: https://resend.com/api-keys
- Shows in plaintext (only you can see)

### **Google reCAPTCHA Keys:**
- Always at: https://console.cloud.google.com/security/recaptcha
- Shows after you click on your key name

### **Your Email:**
- Check your Gmail inbox or Supabase profile

---

## ❓ Troubleshooting

### "Can't find Resend API Key"
- Make sure you're logged into Resend
- URL should be: https://resend.com/api-keys
- If new account, you might need to click "Create API Key" button

### "Can't find reCAPTCHA keys"
- Make sure reCAPTCHA API is enabled in Google Cloud
- Make sure you selected "reCAPTCHA v3" (not v2)
- Go to: https://console.cloud.google.com/security/recaptcha

### "Keys don't work after adding to `.env.local`"
- Save the file
- Stop your dev server (`Ctrl+C`)
- Restart dev server: `npm run dev`
- Keys won't load until server restarts

---

## 📊 Quick Checklist

- [ ] Got RESEND_API_KEY from https://resend.com/api-keys
- [ ] Got NEXT_PUBLIC_RECAPTCHA_SITE_KEY from Google Cloud
- [ ] Got RECAPTCHA_SECRET_KEY from Google Cloud
- [ ] Got ADMIN_EMAIL (your email)
- [ ] Created `.env.local` file in project root
- [ ] Added all 4 variables to `.env.local`
- [ ] Saved the file
- [ ] Restarted dev server
- [ ] Ready to integrate security features

---

## 🎯 Next After Getting Keys

Once you have all keys in `.env.local`:

1. **Run database migration** in Supabase:
   - Copy/paste from: `migrations/add_security_tables.sql`
   - Run in Supabase SQL Editor

2. **Integrate 2FA into login page**:
   - File: `app/admin/login/page.tsx`
   - Add 2FA code input step
   - Import `sendTwoFactorEmail` function
   - Import `verifyTwoFactorCode` function

3. **Test the system**:
   - Try logging in with wrong password 5x → should lock
   - Try logging in correctly → should get 2FA email
   - Enter wrong code → should fail
   - Enter correct code → should log in

---

*Questions? Check the `.env.local` format above and make sure all values are filled in correctly.*
