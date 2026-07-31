@echo off
setlocal

set THISDIR=%~dp0
set THISDIR=%THISDIR:~,-1%

:: Must run as administrator

:: Check for administrative privileges
net session >nul 2>&1

if %errorlevel% == 0 (
    echo Success: Running as Administrator.
) else (
    echo Failure: Please right-click and Run as Administrator.
    pause
    exit /b
)

:: set share and share_name
call %THISDIR%\create-manifest-share-config.cmd
echo share: %share%
echo share_name: %share_name%

:: Create a share for the manifest files

if exist %share% (
    echo Share folder already exists:
    echo %share%
    echo.
    echo If not shared, share the folder manually 
    echo Properties -> Sharing -> Share
    goto :eof
)

:: make the folder
md %share%

:: delete existing share if it exists
net share %share_name% /delete

:: share the folder
net share %share_name%=%share%


:: open the folder
start %share%