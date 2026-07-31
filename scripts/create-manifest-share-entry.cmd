@echo off
setlocal

set THISDIR=%~dp0
set THISDIR=%THISDIR:~,-1%

:: Must run as local user

:: Check for administrative privileges
net session >nul 2>&1

if %errorlevel% == 0 (
    echo Failure: Running as Administrator. Please run as a local user.
    pause
    exit /b
) else (
    echo Success: Running as a local user.
)

:: set share and share_name
call %THISDIR%\create-manifest-share-config.cmd
echo share: %share%
echo share_name: %share_name%

:: Add the Office Trusted Catalog registry keys
set guid=50473000-0000-0000-0000-000000000000
set share_network_path=%COMPUTERNAME%\%share_name%

reg add "HKCU\Software\Microsoft\Office\16.0\WEF\TrustedCatalogs\{%guid%}" /v "Id" /t REG_SZ /d "{%guid%}" /f
reg add "HKCU\Software\Microsoft\Office\16.0\WEF\TrustedCatalogs\{%guid%}" /v "Url" /t REG_SZ /d "\\%share_network_path%" /f
reg add "HKCU\Software\Microsoft\Office\16.0\WEF\TrustedCatalogs\{%guid%}" /v "Flags" /t REG_DWORD /d 1 /f


reg query "HKCU\Software\Microsoft\Office\16.0\WEF\TrustedCatalogs\{%guid%}"
echo Trusted catalog registry keys configured successfully.