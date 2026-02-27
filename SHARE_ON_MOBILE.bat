@echo off
TITLE Mobile Link Generator
echo ===================================================
echo   MEDMANAGE AI - MOBILE / REMOTE LINK GENERATOR
echo ===================================================
echo.
echo WARNING: 
echo Please ensure that your project is currently running 
echo in another terminal using RUN_PLATFORM.bat.
echo.
echo Generating a secure HTTPS link for your mobile device...
echo NOTE: Upon opening the link on mobile, click "Click to Continue" 
echo if a warning page appears.
echo.
npx -y localtunnel --port 5173
pause
