# MuleSoo Auto-Save & Auto-Deploy Guide

## ⚡ Quick Start

After making changes to your website, simply:

**Option 1 (Easiest):** Double-click the shortcut on your desktop
- `MuleSoo Auto-Save.vbs` → Automatically saves and deploys

**Option 2:** Run the batch file
- Open Command Prompt in the project folder
- Type: `auto-save.bat`
- Press Enter

**Option 3:** Run PowerShell script directly
```powershell
.\auto-save.ps1
```

---

## 🔄 What Happens When You Run Auto-Save

1. **Detects Changes** - Scans for any modified files
2. **Stages Files** - Adds all changes to git
3. **Creates Commit** - Commits with timestamp
4. **Pushes to GitHub** - Uploads to GitHub repository
5. **Deploys to Vercel** - Website goes live (2-3 minutes)

---

## 📋 Complete Workflow

### Step 1: Make Changes
- Edit any files in your MuleSoo project
- Save your changes in VS Code or your editor

### Step 2: Run Auto-Save
Choose one method:

**Desktop Shortcut (Recommended):**
```
Double-click: MuleSoo Auto-Save.vbs
```

**PowerShell:**
```powershell
cd "c:\Users\mule\OneDrive\Desktop\mulesoo"
.\auto-save.ps1
```

**Command Prompt:**
```cmd
cd c:\Users\mule\OneDrive\Desktop\mulesoo
auto-save.bat
```

### Step 3: Wait for Completion
- Script shows progress for each step
- Watch for the green "✅ SUCCESS!" message
- Website updates within 2-3 minutes

### Step 4: Verify Live
- Visit https://mulesoo.vercel.app
- Your changes are now live

---

## 📊 What Gets Saved

✅ **Automatically committed to GitHub:**
- All TypeScript/React changes (.tsx, .ts files)
- CSS and styling updates
- Configuration changes
- Image and asset updates
- API route changes

✅ **Automatically deployed to Vercel:**
- Rebuilt website from latest code
- All 39 pages regenerated
- Environment variables applied
- SSL certificate active
- CDN cache refreshed

❌ **NOT committed (stays local):**
- node_modules/ folder
- .env.local (secrets stay safe)
- .next/ build folder

---

## 🛡️ Safety Features

### Your Files Are Protected
- Local backup on your computer
- OneDrive cloud sync active
- GitHub has full history (90+ commits)
- Vercel keeps 90-day rollback

### Nothing Gets Lost
- Even if something breaks, you can rollback
- All commits visible in GitHub history
- Can restore any previous version

### Secrets Stay Secret
- API keys never committed
- Environment variables in Vercel only
- .env.local ignored by git

---

## 🔍 Checking Status

### See what will be saved:
```powershell
git status
```

### See recent commits:
```powershell
git log --oneline -10
```

### See all GitHub changes:
```powershell
git log --oneline -30
```

---

## 🚀 Example: Making a Change

### Scenario: Update the contact page

1. **Edit file**: `app/contact/page.tsx`
   - Change email, phone, or text
   - Save in VS Code

2. **Run auto-save**: Double-click `MuleSoo Auto-Save.vbs`
   ```
   🔄 MuleSoo Auto-Save & Deploy System
   
   📝 Changes detected: app/contact/page.tsx
   📦 Staging changes...
   💾 Committing to Git...
   ✅ Commit successful!
   
   📤 Pushing to GitHub...
   ✅ Push to GitHub successful!
   
   🚀 Deploying to Vercel...
   ✅ ✅ ✅ AUTO-SAVE & DEPLOY COMPLETE!
   Your changes are now live at: https://mulesoo.vercel.app
   ```

3. **Done!** Your website is updated
   - Changes committed to GitHub
   - Website rebuilt on Vercel
   - Live and accessible to visitors

---

## 📝 Commit Messages

Auto-save uses timestamps for commit messages:
```
auto: save changes - 2026-06-07 14:30:45
```

This shows exactly when you made the save.

---

## ⚙️ Advanced Options

### Save with custom message:
```powershell
.\auto-save.ps1 -Message "Updated pricing on services page"
```

### Only commit without deploying:
```powershell
git add -A
git commit -m "Your message"
git push origin master
```
(Vercel will still auto-deploy from GitHub webhook)

### Manual Vercel deployment:
```powershell
vercel --prod
```

---

## 🆘 Troubleshooting

### Script doesn't run?
1. Right-click `auto-save.bat`
2. Select "Run as Administrator"
3. Try again

### Permission denied error?
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Git not recognized?
- Make sure Git is installed
- Restart your terminal after installing

### Vercel deployment hangs?
- Wait 2-3 minutes
- Check https://vercel.com/dashboard for build status
- Previous build may still be running

---

## 📅 Recommended Workflow

**Multiple Small Changes:**
1. Edit file 1
2. Run auto-save
3. Edit file 2
4. Run auto-save
5. Repeat as needed

**Batch Changes:**
1. Edit multiple files
2. Run auto-save once
3. All changes deployed together

**Daily Routine:**
- Morning: Check website on Vercel
- Make updates throughout day
- Before leaving: Run auto-save
- Website updated and live by next morning

---

## 🎯 Key Benefits

✅ **Never lose work** - Always backed up to GitHub
✅ **One-click deploy** - No manual steps
✅ **Always live** - Website updates automatically
✅ **Simple process** - Just double-click and wait
✅ **Safe** - Secrets protected, history preserved
✅ **Fast** - 2-3 minutes to live

---

## 📞 Support

If auto-save fails:
1. Check internet connection
2. Verify Git is installed
3. Make sure Vercel CLI is installed: `npm install -g vercel`
4. Check GitHub token is valid
5. See git status: `git status`

---

**Last Updated:** 2026-06-07
**System:** MuleSoo Auto-Save v1.0
**Status:** Production Ready ✅
