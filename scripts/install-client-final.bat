
@echo off
cls
echo ========================================
echo   INSTALLATION CAISSE MEDICALE
echo   Version Finale Client
echo ========================================
echo.

:: Vérification des prérequis
echo [1/6] Verification des prerequis...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Node.js n'est pas installe
    echo Telechargez Node.js depuis: https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js detecte

:: Installation des dépendances
echo.
echo [2/6] Installation des dependances...
call npm install --silent
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Echec installation dependances
    pause
    exit /b 1
)
echo ✓ Dependances installees

:: Build de production
echo.
echo [3/6] Construction de l'application...
set NODE_ENV=production
call npm run build --silent
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Echec de la construction
    pause
    exit /b 1
)
echo ✓ Application construite

:: Création du dossier d'installation
echo.
echo [4/6] Preparation de l'installation...
set INSTALL_DIR=%USERPROFILE%\Desktop\CaisseMedicale
if exist "%INSTALL_DIR%" rmdir /s /q "%INSTALL_DIR%"
mkdir "%INSTALL_DIR%" >nul 2>nul
mkdir "%INSTALL_DIR%\config" >nul 2>nul
mkdir "%INSTALL_DIR%\backup" >nul 2>nul
echo ✓ Dossiers prepares

:: Copie des fichiers
echo.
echo [5/6] Installation des fichiers...
xcopy /E /Y /Q dist\* "%INSTALL_DIR%\" >nul
echo ✓ Fichiers copies

:: Création des scripts de démarrage
echo.
echo [6/6] Creation des raccourcis...
echo @echo off > "%INSTALL_DIR%\Demarrer.bat"
echo cd /d "%INSTALL_DIR%" >> "%INSTALL_DIR%\Demarrer.bat"
echo start "Caisse Medicale" /MAX cmd /k "npx serve -s . -l 3000 & start http://localhost:3000" >> "%INSTALL_DIR%\Demarrer.bat"

:: Installation de serve localement
cd /d "%INSTALL_DIR%"
call npm init -y >nul 2>nul
call npm install serve --save >nul 2>nul

:: Création du raccourci bureau
set SHORTCUT_PATH=%USERPROFILE%\Desktop\Caisse Medicale.lnk
powershell -command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%SHORTCUT_PATH%'); $Shortcut.TargetPath = '%INSTALL_DIR%\Demarrer.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.IconLocation = '%SystemRoot%\System32\shell32.dll,21'; $Shortcut.Save()"

echo.
echo ========================================
echo   INSTALLATION TERMINEE !
echo ========================================
echo.
echo PROCHAINES ETAPES:
echo 1. Double-cliquez sur "Caisse Medicale" (bureau)
echo 2. Configurez votre projet Supabase
echo 3. Ajoutez vos medicaments et examens
echo 4. Commencez à utiliser le logiciel
echo.
echo Dossier d'installation: %INSTALL_DIR%
echo Acces: http://localhost:3000
echo.
pause
