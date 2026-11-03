@echo off
title Jyoti AI - Free Vedic Astrologer Launcher
echo ========================================================
echo   Jyoti AI - 100%% Free & Zero-Cost AI Vedic Astrologer
echo ========================================================
echo.
echo Starting local web server at http://localhost:8080 ...
start "" http://localhost:8080
python -m http.server 8080
pause
