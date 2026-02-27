@echo off
TITLE MEDMANAGE AI PLATFORM RUNNER
echo ===================================================
echo   MEDMANAGE AI SYSTEM: ROBUST LAUNCH PROTOCOL
echo ===================================================
echo.

:: Step 1: Run core setup/check
python SYSTEM_CORE_SETUP.py

echo.
echo Launching all services...
echo.

:: Start concurrently in the background
npm start

pause
