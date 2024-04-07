setlocal enabledelayedexpansion
@echo off


set THISDIR=%~dp0
set THISDIR=%THISDIR:~,-1%

set inkscape="%tools%\Programs\inkscape\inkscape.exe"

:: icon test
set name=icon

@REM for %%s in (16 32 64 80 128 300) do (
@REM     set size=%%s
@REM     set command=%inkscape% -z "%THISDIR%/%name%.svg" -w !size! -h !size! -e "%THISDIR%/%name%-!size!.png"
@REM     echo !command!
@REM     call !command!
@REM )

:: Generate fluent svg
:: icon

set svg_name=hexagon
set png_name=icon
for %%s in (16 32 64 80 128 300) do (
    set size=%%s

    set png_size=!size!
    set svg_size=!size!
    if !svg_size! GEQ 48 set svg_size=48

    set source_svg="%THISDIR%/fluent-svg/ic_fluent_!svg_name!_!svg_size!_regular.svg"
    set destination_png="%THISDIR%/%png_name%-!png_size!.png"

    echo !png_name! !png_size!
    set command=%inkscape% -z !source_svg! -w !png_size! -h !png_size! -e !destination_png!
    echo !command!
    call !command!
)

:: Generate fluent svg
:: edit
:: play

for %%n in (edit play) do (
    set name=%%n
    set svg_name=!name!
    set png_name=!name!
    for %%s in (16 32 80) do (
        set size=%%s

        set png_size=!size!
        set svg_size=!size!
        if !svg_size! GEQ 48 set svg_size=48

        set source_svg="%THISDIR%/fluent-svg/ic_fluent_!svg_name!_!svg_size!_regular.svg"
        set destination_png="%THISDIR%/%png_name%-!png_size!.png"

        echo !png_name! !png_size!
        set command=%inkscape% -z !source_svg! -w !png_size! -h !png_size! -e !destination_png!
        echo !command!
        call !command!
    )
)


