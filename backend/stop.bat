@echo off
title Stop Yuhetang Backend

set "PORT=8000"
set "FOUND=0"

echo ============================================
echo   Yuhetang Backend Service - Stop
echo ============================================
echo.

for /f "tokens=5" %%a in ('netstat -ano -p tcp ^| findstr "LISTENING" ^| findstr ":8000"') do (
    if not "%%a"=="" (
        set "FOUND=1"
        echo [INFO] Killing PID: %%a
        taskkill /F /PID %%a >nul 2>&1
    )
)

timeout /t 1 >nul

netstat -ano -p tcp | findstr "LISTENING" | findstr ":8000" >nul
if %errorlevel% equ 0 goto :still_running
if "%FOUND%"=="1" goto :stopped
goto :not_running

:still_running
echo [WARN] Port %PORT% still in use, may need admin rights.
goto :end

:stopped
echo.
echo [DONE] Backend service stopped.
goto :end

:not_running
echo [INFO] Port %PORT% not in use, service was not running.

:end
echo.
pause
