REM Clear the Wef cache for Office per
REM https://learn.microsoft.com/en-us/office/dev/add-ins/testing/clear-cache
setlocal
set target=%USERPROFILE%\AppData\Local\Microsoft\Office\16.0\Wef
rmdir /S /Q "%target%"
mkdir "%target%"

dir /B %target%
PAUSE