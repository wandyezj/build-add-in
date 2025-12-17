@echo off
setlocal enabledelayedexpansion

set THISDIR=%~dp0
set THISDIR=%THISDIR:~,-1%

set inkscape="%tools%\Programs\inkscape\inkscape.exe"

:: Generate fluent svg
:: icon

set svg_name=hexagon
set png_name=icon
for %%s in (16 32 64 80 128 192 300) do (
    set size=%%s

    set png_size=!size!
    set svg_size=!size!
    if !svg_size! GEQ 48 set svg_size=48

    set source_svg="%THISDIR%/fluent-svg/ic_fluent_!svg_name!_!svg_size!_regular.svg"
    set destination_png="%THISDIR%/!png_name!-!png_size!.png"

    echo !png_name! !png_size!
    set command=%inkscape% -z !source_svg! -w !png_size! -h !png_size! -e !destination_png!
    echo !command!
    call !command!
    echo.
)

:: Generate fluent svg
:: edit
:: play

for %%n in (edit play settings) do (
    set name=%%n
    set svg_name=!name!
    set png_name=icon-!name!
    call :make_icon !svg_name! !png_name!
)

:: help
call :make_icon question icon-help

:: actions
call :make_icon script icon-actions


goto :eof

::
:: Make icon in standard sizes
::
:make_icon
set svg_name=%1
set png_name=%2
for %%s in (16 32 80) do (
    set size=%%s

    set png_size=!size!
    set svg_size=!size!
    if !svg_size! GEQ 48 set svg_size=48

    set source_svg="%THISDIR%/fluent-svg/ic_fluent_!svg_name!_!svg_size!_regular.svg"
    if not exist !source_svg! (
        set svg_size=32
        set source_svg="%THISDIR%/fluent-svg/ic_fluent_!svg_name!_!svg_size!_regular.svg"
    )

    set destination_png="%THISDIR%/!png_name!-!png_size!.png"

    echo !png_name! !png_size!
    set command=%inkscape% -z !source_svg! -w !png_size! -h !png_size! -e !destination_png!
    echo !command!
    call !command!
    echo.
)
goto :eof