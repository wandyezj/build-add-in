@echo off
setlocal
:: Must run as administrator
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

:: open the folder
start %share%