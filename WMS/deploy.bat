@echo on
set target="\\192.168.0.230\wwwroot\app\wms\Altron\"
xcopy /y/e/s www %target%\www

pause

copy /y index.html %target%
copy /y update.json %target%
copy /y Altron.apk %target%\Altron.apk
del Altron.apk /f /q

pause 