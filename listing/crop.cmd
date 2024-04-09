@echo off
setlocal

::
:: Produce cropped images for the store listing
::

set THISDIR=%~dp0
set THISDIR=%THISDIR:~,-1%

if not defined tools (
    echo Must define tool path
    goto :eof
)

set magick="%tools%\Programs\ImageMagick\magick.exe"

:: specific width and height needed for the store
set width=1366
set height=768

:: save over the original image and them crop.

call :crop excel
call :crop powerpoint
call :crop word

goto :eof

:crop
set name=%1
echo.
echo Crop %name%
set image_name_in=%name%-taskpane-%width%-%height%.png
set image_name_out=%name%-taskpane-%width%-%height%.png

set image_in=%THISDIR%\%image_name_in%
set image_out=%THISDIR%\%image_name_out%

set command=%magick% %image_in% -crop %width%x%height%+0+0 %image_out%
echo %command%
call %command%
goto :eof

