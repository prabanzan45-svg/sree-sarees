@echo off
title Sree Sarees — Launch System
echo ==============================================================================
echo 🌸 SREE SAREES: E-COMMERCE ^& SMART INVENTORY MANAGEMENT SYSTEM
echo    Tagline: "Tradition Woven with Elegance."
echo ==============================================================================
echo.
echo Starting Backend Server on http://localhost:5000 ...
start "Sree Sarees Backend (Port 5000)" cmd /k "cd server && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Boutique on http://localhost:5173 ...
start "Sree Sarees Frontend (Port 5173)" cmd /k "cd client && npm run dev"

echo.
echo ==============================================================================
echo ✅ Both services launched successfully!
echo    Customer Boutique:   http://localhost:5173
echo    Backend API:          http://localhost:5000/api
echo    Owner Inventory CLI:  node server/scripts/manage-inventory.js
echo    WhatsApp Alerts:      Automatic Meta WhatsApp Business Platform
echo ==============================================================================
pause
