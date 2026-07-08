@echo off
title Yuhetang Backend (PHP 8000)

set "PHP_EXE=D:\program\php\php.exe"
set "BACKEND_DIR=%~dp0"
set "PORT=8000"

echo ============================================
echo   Yuhetang Backend Service - Start
echo ============================================
echo.

if not exist "%PHP_EXE%" goto :no_php

netstat -ano -p tcp | findstr "LISTENING" | findstr ":8000" >nul
if %errorlevel% equ 0 goto :port_in_use
goto :start

:no_php
echo [ERROR] PHP not found: %PHP_EXE%
pause
exit /b 1

:port_in_use
echo [INFO] Port %PORT% is in use, killing old process...
for /f "tokens=5" %%a in ('netstat -ano -p tcp ^| findstr "LISTENING" ^| findstr ":8000"') do (
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 1 >nul
echo [DONE] Old process terminated.
echo.

:start
echo [INFO] PHP: %PHP_EXE%
echo [INFO] URL: http://127.0.0.1:%PORT%
echo.
echo   Banner API: http://127.0.0.1:%PORT%/api.php/api/ygame/banner
echo   Store  API: http://127.0.0.1:%PORT%/api.php/api/ygame/store
echo   Admin:      http://127.0.0.1:%PORT%/yuhetangAdmin.php
echo.
echo Press Ctrl+C to stop, or run stop.bat
echo.

cd /d "%BACKEND_DIR%"
"%PHP_EXE%" -S 127.0.0.1:%PORT% -t public
pause
