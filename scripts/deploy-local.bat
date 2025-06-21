
@echo off
cls
echo ========================================
echo   DEPLOIEMENT LOCAL - CAISSE MEDICALE
echo   Configuration automatique complete
echo ========================================
echo.

:: Variables de configuration
set PROJECT_NAME=caisse-medicale
set LOCAL_PORT=3000
set BACKUP_ENABLED=true
set AUTO_START=true

echo [1/8] Verification des prerequis...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Node.js requis - Telechargez sur nodejs.org
    pause
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: NPM requis - Reinstallez Node.js
    pause
    exit /b 1
)

echo ✓ Node.js detecte
echo ✓ NPM detecte

:: Installation des dependances
echo.
echo [2/8] Installation des dependances...
call npm install --silent
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Echec installation dependances
    pause
    exit /b 1
)
echo ✓ Dependances installees

:: Build de production locale
echo.
echo [3/8] Construction version locale...
set NODE_ENV=production
call npm run build --silent
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Echec de la construction
    pause
    exit /b 1
)
echo ✓ Application construite

:: Creation dossier local
echo.
echo [4/8] Configuration dossier local...
set LOCAL_DIR=%USERPROFILE%\Desktop\%PROJECT_NAME%
if exist "%LOCAL_DIR%" rmdir /s /q "%LOCAL_DIR%"
mkdir "%LOCAL_DIR%"
mkdir "%LOCAL_DIR%\backup"
mkdir "%LOCAL_DIR%\config"
mkdir "%LOCAL_DIR%\logs"
echo ✓ Dossiers crees

:: Copie des fichiers
echo.
echo [5/8] Copie des fichiers application...
xcopy /E /Y /Q dist\* "%LOCAL_DIR%\" >nul
copy /Y package.json "%LOCAL_DIR%\" >nul
copy /Y *.md "%LOCAL_DIR%\" >nul 2>nul
echo ✓ Fichiers copies

:: Creation scripts de gestion
echo.
echo [6/8] Creation scripts de gestion...

echo @echo off > "%LOCAL_DIR%\start.bat"
echo cd /d "%LOCAL_DIR%" >> "%LOCAL_DIR%\start.bat"
echo echo Demarrage Caisse Medicale... >> "%LOCAL_DIR%\start.bat"
echo start "" "http://localhost:%LOCAL_PORT%" >> "%LOCAL_DIR%\start.bat"
echo npx serve -s . -p %LOCAL_PORT% >> "%LOCAL_DIR%\start.bat"

echo @echo off > "%LOCAL_DIR%\backup.bat"
echo cd /d "%LOCAL_DIR%" >> "%LOCAL_DIR%\backup.bat"
echo set BACKUP_NAME=backup_%%date:~-4,4%%%%date:~-10,2%%%%date:~-7,2%%_%%time:~0,2%%%%time:~3,2%% >> "%LOCAL_DIR%\backup.bat"
echo echo Creation sauvegarde %%BACKUP_NAME%%... >> "%LOCAL_DIR%\backup.bat"
echo mkdir backup\%%BACKUP_NAME%% 2^>nul >> "%LOCAL_DIR%\backup.bat"
echo copy config\* backup\%%BACKUP_NAME%%\ ^>nul 2^>nul >> "%LOCAL_DIR%\backup.bat"
echo echo Sauvegarde terminee dans backup\%%BACKUP_NAME%% >> "%LOCAL_DIR%\backup.bat"

echo @echo off > "%LOCAL_DIR%\stop.bat"
echo taskkill /F /IM node.exe 2^>nul >> "%LOCAL_DIR%\stop.bat"
echo echo Application arretee >> "%LOCAL_DIR%\stop.bat"

:: Configuration initiale
echo.
echo [7/8] Configuration initiale...
echo {> "%LOCAL_DIR%\config\app-config.json"
echo   "appName": "Caisse Medicale",>> "%LOCAL_DIR%\config\app-config.json"
echo   "version": "1.0.0",>> "%LOCAL_DIR%\config\app-config.json"
echo   "environment": "local",>> "%LOCAL_DIR%\config\app-config.json"
echo   "port": %LOCAL_PORT%,>> "%LOCAL_DIR%\config\app-config.json"
echo   "autoBackup": %BACKUP_ENABLED%,>> "%LOCAL_DIR%\config\app-config.json"
echo   "autoStart": %AUTO_START%>> "%LOCAL_DIR%\config\app-config.json"
echo }>> "%LOCAL_DIR%\config\app-config.json"

echo Installation terminee le %date% %time% > "%LOCAL_DIR%\config\install.log"
echo ✓ Configuration terminee

:: Installation serve si necessaire
echo.
echo [8/8] Installation serveur local...
call npm install -g serve --silent 2>nul
echo ✓ Serveur local configure

:: Creation raccourci bureau
echo.
echo Creation raccourci bureau...
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\Caisse Medicale.lnk'); $Shortcut.TargetPath = '%LOCAL_DIR%\start.bat'; $Shortcut.WorkingDirectory = '%LOCAL_DIR%'; $Shortcut.IconLocation = 'shell32.dll,21'; $Shortcut.Save()" 2>nul

echo.
echo ========================================
echo   INSTALLATION LOCALE TERMINEE !
echo ========================================
echo.
echo DOSSIER D'INSTALLATION:
echo %LOCAL_DIR%
echo.
echo ACCES RAPIDE:
echo - Double-clic sur "Caisse Medicale" (bureau)
echo - Ou executez: %LOCAL_DIR%\start.bat
echo.
echo GESTION:
echo - Demarrer: start.bat
echo - Arreter: stop.bat  
echo - Sauvegarder: backup.bat
echo.
echo URL d'acces: http://localhost:%LOCAL_PORT%
echo.
echo L'application va se lancer automatiquement...
echo.
pause

:: Lancement automatique
if "%AUTO_START%"=="true" (
    echo Lancement automatique...
    cd /d "%LOCAL_DIR%"
    start "" "%LOCAL_DIR%\start.bat"
)
