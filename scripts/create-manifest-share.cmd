@echo off
setlocal
:: Must run as administrator

:: Check for administrative privileges
net session >nul 2>&1

if %errorlevel% == 0 (
    echo Success: Running as Administrator.
    goto :main
) else (
    echo Failure: Please right-click and Run as Administrator.
    pause
    exit /b
)


:: Create a share for the manifest files
set share=C:\manifests

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

:: share the folder
net share manifests=%share%

:: Add the Office Trusted Catalog registry keys
set guid=50473000-0000-0000-0000-000000000000
set share_name=%COMPUTERNAME%\manifests

reg add "HKCU\Software\Microsoft\Office\16.0\WEF\TrustedCatalogs\{%guid%}" /v "Id" /t REG_SZ /d "{%guid%}" /f
reg add "HKCU\Software\Microsoft\Office\16.0\WEF\TrustedCatalogs\{%guid%}" /v "Url" /t REG_SZ /d "\\%share_name%" /f
reg add "HKCU\Software\Microsoft\Office\16.0\WEF\TrustedCatalogs\{%guid%}" /v "Flags" /t REG_DWORD /d 1 /f

echo Trusted catalog registry keys configured successfully.


:: open the folder
start %share%