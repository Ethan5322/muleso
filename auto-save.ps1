# Auto-Save and Deploy Script for MuleSoo
# This script automatically commits changes to GitHub and deploys to Vercel

param(
    [string]$Message = "auto: save changes"
)

Write-Host "🔄 MuleSoo Auto-Save & Deploy System" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Navigate to project directory
cd "c:\Users\mule\OneDrive\Desktop\mulesoo"

# Check if there are any changes
$status = git status --porcelain
if (-not $status) {
    Write-Host "✅ No changes to commit. Everything is up to date!" -ForegroundColor Green
    exit 0
}

Write-Host "`n📝 Changes detected:" -ForegroundColor Yellow
Write-Host $status
Write-Host ""

# Stage all changes
Write-Host "📦 Staging changes..." -ForegroundColor Cyan
git add -A

# Commit changes
Write-Host "💾 Committing to Git..." -ForegroundColor Cyan
$commitMessage = "auto: save changes - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Commit failed" -ForegroundColor Red
    exit 1
}

# Push to GitHub
Write-Host "`n📤 Pushing to GitHub..." -ForegroundColor Cyan
git push origin master

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Push to GitHub successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Push failed" -ForegroundColor Red
    exit 1
}

# Deploy to Vercel
Write-Host "`n🚀 Deploying to Vercel..." -ForegroundColor Cyan
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ ✅ ✅ AUTO-SAVE & DEPLOY COMPLETE!" -ForegroundColor Green
    Write-Host "Your changes are now live at: https://mulesoo.vercel.app" -ForegroundColor Green
} else {
    Write-Host "❌ Vercel deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n⏰ Timestamp: $(Get-Date)" -ForegroundColor Gray
