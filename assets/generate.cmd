setlocal enabledelayedexpansion
@echo off

:: icon test
set name=icon

set THISDIR=%~dp0
set THISDIR=%THISDIR:~,-1%

set inkscape="%tools%\Programs\inkscape\inkscape.exe"

for %%s in (16 32 64 80 128 300) do (
    set size=%%s
    set command=%inkscape% -z "%THISDIR%/%name%.svg" -w !size! -h !size! -e "%THISDIR%/%name%-!size!.png"
    echo !command!
    call !command!
)

:: Generate fluent svg
:: edit
:: play


for %%n in (edit play) do (
    set name=%%n
    for %%s in (16 32 48) do (
        set size=%%s
        set out_size=!size!
        if !size! == 48 set out_size=80
        set command=%inkscape% -z "%THISDIR%/fluent-svg/ic_fluent_!name!_!size!_regular.svg" -w !size! -h !size! -e "%THISDIR%/icon-!name!-!out_size!.png"
        echo !command!
        call !command!
    )

)


