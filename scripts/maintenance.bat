
@echo off
echo ========================================
echo   MAINTENANCE SYSTEME
echo   Caisse Medicale - Outils
echo ========================================
echo.

:MENU
echo Choisissez une option:
echo.
echo 1. Sauvegarde de la base de donnees
echo 2. Nettoyage des fichiers temporaires
echo 3. Verification de l'etat du systeme
echo 4. Reinitialiser la configuration
echo 5. Voir les logs d'erreurs
echo 6. Test de connectivite
echo 7. Quitter
echo.
set /p choice="Votre choix (1-7): "

if "%choice%"=="1" goto BACKUP
if "%choice%"=="2" goto CLEANUP
if "%choice%"=="3" goto STATUS
if "%choice%"=="4" goto RESET
if "%choice%"=="5" goto LOGS
if "%choice%"=="6" goto TEST
if "%choice%"=="7" goto EXIT
goto MENU

:BACKUP
echo.
echo === SAUVEGARDE ===
call scripts\backup-database.bat
goto MENU

:CLEANUP
echo.
echo === NETTOYAGE ===
echo Suppression des fichiers temporaires...
if exist "C:\wamp64\www\caisse-medicale\temp" rmdir /s /q "C:\wamp64\www\caisse-medicale\temp"
if exist "C:\wamp64\tmp" del /q "C:\wamp64\tmp\*.*" 2>nul
echo Nettoyage termine.
pause
goto MENU

:STATUS
echo.
echo === ETAT DU SYSTEME ===
echo Verification WAMP...
tasklist /FI "IMAGENAME eq wampmanager.exe" 2>NUL | find /I /N "wampmanager.exe">NUL
if %ERRORLEVEL% EQU 0 (echo ✓ WAMP: DEMARRE) else (echo ✗ WAMP: ARRETE)

echo Verification Apache...
tasklist /FI "IMAGENAME eq httpd.exe" 2>NUL | find /I /N "httpd.exe">NUL
if %ERRORLEVEL% EQU 0 (echo ✓ Apache: ACTIF) else (echo ✗ Apache: INACTIF)

echo Verification MySQL...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if %ERRORLEVEL% EQU 0 (echo ✓ MySQL: ACTIF) else (echo ✗ MySQL: INACTIF)

echo Verification application...
if exist "C:\wamp64\www\caisse-medicale\index.html" (echo ✓ Application: INSTALLEE) else (echo ✗ Application: NON TROUVEE)

pause
goto MENU

:RESET
echo.
echo === REINITIALISATION ===
echo ATTENTION: Ceci va supprimer la configuration actuelle
set /p confirm="Etes-vous sur ? (oui/non): "
if /i "%confirm%"=="oui" (
    if exist "C:\wamp64\www\caisse-medicale\config" rmdir /s /q "C:\wamp64\www\caisse-medicale\config"
    echo Configuration reinitilisee.
) else (
    echo Operation annulee.
)
pause
goto MENU

:LOGS
echo.
echo === LOGS D'ERREURS ===
echo Logs Apache:
if exist "C:\wamp64\logs\apache_error.log" (
    echo Dernieres erreurs Apache:
    powershell "Get-Content 'C:\wamp64\logs\apache_error.log' | Select-Object -Last 10"
) else (
    echo Aucun log Apache trouve.
)
echo.
echo Logs MySQL:
if exist "C:\wamp64\logs\mysql.log" (
    echo Dernieres erreurs MySQL:
    powershell "Get-Content 'C:\wamp64\logs\mysql.log' | Select-Object -Last 10"
) else (
    echo Aucun log MySQL trouve.
)
pause
goto MENU

:TEST
echo.
echo === TEST DE CONNECTIVITE ===
echo Test de l'application...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost/caisse-medicale' -TimeoutSec 5; Write-Host '✓ Application accessible' } catch { Write-Host '✗ Application inaccessible' }"

echo Test de phpMyAdmin...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost/phpmyadmin' -TimeoutSec 5; Write-Host '✓ phpMyAdmin accessible' } catch { Write-Host '✗ phpMyAdmin inaccessible' }"

pause
goto MENU

:EXIT
echo.
echo Maintenance terminee.
pause
