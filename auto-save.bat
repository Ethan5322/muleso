@echo off
REM Auto-Save and Deploy Batch Script for MuleSoo
REM Simply run this file to automatically save and deploy your website

echo.
echo ===============================================
echo   MULESOO AUTO-SAVE & DEPLOY
echo ===============================================
echo.

cd /d "c:\Users\mule\OneDrive\Desktop\mulesoo"

REM Run PowerShell script
powershell -NoProfile -ExecutionPolicy Bypass -File "auto-save.ps1"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===============================================
    echo   SUCCESS! Website updated and live
    echo ===============================================
    pause
) else (
    echo.
    echo ===============================================
    echo   ERROR: Auto-save failed
    echo ===============================================
    pause
)
