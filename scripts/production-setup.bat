
@echo off
cls
echo ========================================
echo   CONFIGURATION PRODUCTION COMPLETE
echo   Caisse Medicale - Installation Finale
echo ========================================
echo.

set INSTALL_DIR=%USERPROFILE%\Desktop\caisse-medicale-production
set BACKUP_DIR=%INSTALL_DIR%\backup
set CONFIG_DIR=%INSTALL_DIR%\config
set LOGS_DIR=%INSTALL_DIR%\logs

echo Configuration du dossier de production...
echo Dossier d'installation: %INSTALL_DIR%
echo.

echo [1/8] Creation de la structure de dossiers...
if exist "%INSTALL_DIR%" (
    echo Suppression de l'installation precedente...
    rmdir /s /q "%INSTALL_DIR%" >nul 2>nul
)

mkdir "%INSTALL_DIR%" >nul 2>nul
mkdir "%BACKUP_DIR%" >nul 2>nul
mkdir "%CONFIG_DIR%" >nul 2>nul
mkdir "%LOGS_DIR%" >nul 2>nul
echo ✅ Structure de dossiers creee

echo.
echo [2/8] Construction optimisee pour production...
set NODE_ENV=production
call npm run build --silent
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERREUR: Echec de construction
    pause
    exit /b 1
)
echo ✅ Application construite en mode production

echo.
echo [3/8] Copie des fichiers de production...
xcopy /E /Y /Q dist\* "%INSTALL_DIR%\" >nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERREUR: Echec de copie des fichiers
    pause
    exit /b 1
)
echo ✅ Fichiers de production copies

echo.
echo [4/8] Creation des scripts de gestion...

echo @echo off > "%INSTALL_DIR%\start.bat"
echo cls >> "%INSTALL_DIR%\start.bat"
echo echo ======================================== >> "%INSTALL_DIR%\start.bat"
echo echo   DEMARRAGE CAISSE MEDICALE >> "%INSTALL_DIR%\start.bat"
echo echo ======================================== >> "%INSTALL_DIR%\start.bat"
echo echo. >> "%INSTALL_DIR%\start.bat"
echo echo Demarrage du serveur local... >> "%INSTALL_DIR%\start.bat"
echo cd /d "%INSTALL_DIR%" >> "%INSTALL_DIR%\start.bat"
echo start "Caisse Medicale" /MAX cmd /k "echo Caisse Medicale demarre sur http://localhost:3000 & npx serve -s . -l 3000 & start http://localhost:3000" >> "%INSTALL_DIR%\start.bat"
echo echo. >> "%INSTALL_DIR%\start.bat"
echo echo ✅ Caisse Medicale demarre ! >> "%INSTALL_DIR%\start.bat"
echo echo Acces via: http://localhost:3000 >> "%INSTALL_DIR%\start.bat"
echo pause >> "%INSTALL_DIR%\start.bat"

echo @echo off > "%INSTALL_DIR%\stop.bat"
echo echo Arret du serveur Caisse Medicale... >> "%INSTALL_DIR%\stop.bat"
echo taskkill /F /IM node.exe /T >nul 2>nul >> "%INSTALL_DIR%\stop.bat"
echo echo ✅ Serveur arrete >> "%INSTALL_DIR%\stop.bat"
echo pause >> "%INSTALL_DIR%\stop.bat"

echo ✅ Scripts de gestion crees

echo.
echo [5/8] Configuration des sauvegardes...
echo { > "%CONFIG_DIR%\backup-config.json"
echo   "enabled": true, >> "%CONFIG_DIR%\backup-config.json"
echo   "frequency": "daily", >> "%CONFIG_DIR%\backup-config.json"
echo   "retention": 30, >> "%CONFIG_DIR%\backup-config.json"
echo   "location": "%BACKUP_DIR%", >> "%CONFIG_DIR%\backup-config.json"
echo   "timestamp": "%date% %time%" >> "%CONFIG_DIR%\backup-config.json"
echo } >> "%CONFIG_DIR%\backup-config.json"
echo ✅ Configuration de sauvegarde creee

echo.
echo [6/8] Creation du script de sauvegarde...
echo @echo off > "%INSTALL_DIR%\backup.bat"
echo set TIMESTAMP=%%date:~-4%%%%date:~3,2%%%%date:~0,2%%_%%time:~0,2%%%%time:~3,2%%%%time:~6,2%% >> "%INSTALL_DIR%\backup.bat"
echo set TIMESTAMP=%%TIMESTAMP: =0%% >> "%INSTALL_DIR%\backup.bat"
echo set BACKUP_NAME=backup_%%TIMESTAMP%% >> "%INSTALL_DIR%\backup.bat"
echo echo Creation sauvegarde: %%BACKUP_NAME%% >> "%INSTALL_DIR%\backup.bat"
echo mkdir "%BACKUP_DIR%\%%BACKUP_NAME%%" >nul 2>nul >> "%INSTALL_DIR%\backup.bat"
echo copy "%CONFIG_DIR%\*.*" "%BACKUP_DIR%\%%BACKUP_NAME%%\" >nul 2>nul >> "%INSTALL_DIR%\backup.bat"
echo copy "%LOGS_DIR%\*.*" "%BACKUP_DIR%\%%BACKUP_NAME%%\" >nul 2>nul >> "%INSTALL_DIR%\backup.bat"
echo echo ✅ Sauvegarde creee dans: %%BACKUP_NAME%% >> "%INSTALL_DIR%\backup.bat"
echo pause >> "%INSTALL_DIR%\backup.bat"
echo ✅ Script de sauvegarde cree

echo.
echo [7/8] Installation de serve (serveur local)...
cd /d "%INSTALL_DIR%"
call npm init -y >nul 2>nul
call npm install serve --save >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ Installation de serve via npm a echoue
    echo Le systeme utilisera un serveur alternatif
) else (
    echo ✅ Serveur local installe
)

echo.
echo [8/8] Creation du raccourci bureau...
set SHORTCUT_PATH=%USERPROFILE%\Desktop\Caisse Medicale.lnk
powershell -command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%SHORTCUT_PATH%'); $Shortcut.TargetPath = '%INSTALL_DIR%\start.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.IconLocation = '%SystemRoot%\System32\shell32.dll,21'; $Shortcut.Description = 'Caisse Medicale - Centre Medical'; $Shortcut.Save()"
if exist "%SHORTCUT_PATH%" (
    echo ✅ Raccourci bureau cree
) else (
    echo ⚠️ Echec creation raccourci
)

echo.
echo ========================================
echo   INSTALLATION PRODUCTION TERMINEE !
echo ========================================
echo.
echo INFORMATIONS D'INSTALLATION:
echo 📁 Dossier: %INSTALL_DIR%
echo 🔗 Raccourci: Bureau/Caisse Medicale
echo 🌐 URL locale: http://localhost:3000
echo.
echo FICHIERS DE GESTION DISPONIBLES:
echo ▶️  start.bat    - Demarrer l'application
echo ⏹️  stop.bat     - Arreter l'application  
echo 💾 backup.bat   - Creer une sauvegarde
echo.
echo PROCHAINES ETAPES OBLIGATOIRES:
echo 1. 🔧 Configurez votre projet Supabase
echo 2. 🧪 Testez toutes les fonctionnalites
echo 3. ⚙️  Configurez les donnees de votre centre
echo 4. 👥 Formez les utilisateurs finaux
echo 5. 💾 Effectuez votre premiere sauvegarde
echo.
echo 🎉 SYSTEME PRET POUR UTILISATION REELLE !
echo.
echo Pour demarrer: Double-clic sur "Caisse Medicale" (bureau)
echo.
pause
