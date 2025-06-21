
@echo off
echo ========================================
echo   DEMARRAGE CAISSE MEDICALE
echo   Version Production
echo ========================================
echo.

:: Vérification que WAMP est démarré
echo Verification des services WAMP...
tasklist /FI "IMAGENAME eq wampmanager.exe" 2>NUL | find /I /N "wampmanager.exe">NUL
if %ERRORLEVEL% NEQ 0 (
    echo ATTENTION: WAMP Server ne semble pas demarre
    echo Veuillez demarrer WAMP Server avant de continuer
    echo.
    set /p "=Appuyez sur Entree une fois WAMP demarre..."
)

:: Vérification de l'installation
if not exist "C:\wamp64\www\caisse-medicale\index.html" (
    echo ERREUR: Application non trouvee
    echo Veuillez executer scripts\install-production.bat d'abord
    pause
    exit /b 1
)

:: Ouverture automatique
echo Ouverture de l'application...
start "" "http://localhost/caisse-medicale"

echo.
echo ========================================
echo   APPLICATION DEMARREE
echo ========================================
echo.
echo L'application s'ouvre dans votre navigateur.
echo.
echo LIENS UTILES:
echo - Application: http://localhost/caisse-medicale
echo - phpMyAdmin: http://localhost/phpmyadmin
echo - WAMP: http://localhost
echo.
echo Pour arreter: Fermez simplement le navigateur
echo Pour redemarrer: Executez ce script
echo.
pause
