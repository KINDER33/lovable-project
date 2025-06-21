
@echo off
cls
echo ========================================
echo   DEMARRAGE CAISSE MEDICALE
echo   Version Client
echo ========================================
echo.

echo Demarrage du serveur local...
cd /d "%~dp0.."

:: Vérification que le build existe
if not exist "dist\index.html" (
    echo Construction de l'application...
    call npm run build --silent
)

echo Serveur demarre sur http://localhost:3000
echo.
echo ✅ Caisse Medicale demarre !
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

npx serve -s dist -l 3000
