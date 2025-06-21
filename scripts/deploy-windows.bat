
@echo off
cls
echo ========================================
echo   DEPLOIEMENT WINDOWS - GESTION MEDICALE
echo   Version Production Automatisee
echo ========================================
echo.

:: Configuration
set APP_NAME=medical-cashier
set INSTALL_DIR=C:\MedicalCashier
set BACKUP_DIR=%INSTALL_DIR%\backups
set SERVICE_NAME=MedicalCashierService

:: Vérification des privilèges administrateur
net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Ce script doit etre execute en tant qu'administrateur
    echo Clic droit sur le fichier ^> "Executer en tant qu'administrateur"
    pause
    exit /b 1
)

echo [1/10] Verification des prerequis...

:: Vérification Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Node.js n'est pas installe
    echo Telechargez Node.js depuis https://nodejs.org
    pause
    exit /b 1
)

:: Vérification de la version Node.js
for /f "tokens=1 delims=v" %%a in ('node --version') do set NODE_VERSION=%%a
echo Node.js detecte: %NODE_VERSION%

echo.
echo [2/10] Creation des dossiers...
if exist "%INSTALL_DIR%" (
    echo Sauvegarde de l'installation existante...
    move "%INSTALL_DIR%" "%INSTALL_DIR%_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%"
)

mkdir "%INSTALL_DIR%" 2>nul
mkdir "%BACKUP_DIR%" 2>nul
mkdir "%INSTALL_DIR%\logs" 2>nul
mkdir "%INSTALL_DIR%\config" 2>nul

echo.
echo [3/10] Installation de l'application...
:: Copie des fichiers (assume que les fichiers sont dans le repertoire courant)
xcopy /E /Y /Q . "%INSTALL_DIR%\" >nul

cd /d "%INSTALL_DIR%"

echo.
echo [4/10] Installation des dependances...
call npm ci --production --silent
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Echec de l'installation des dependances
    pause
    exit /b 1
)

echo.
echo [5/10] Construction de l'application...
call npm run build --silent
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Echec de la construction
    pause
    exit /b 1
)

echo.
echo [6/10] Configuration du service Windows...

:: Installation de node-windows pour créer un service
call npm install -g node-windows --silent

:: Création du script de service
echo var Service = require('node-windows').Service; > service-install.js
echo. >> service-install.js
echo var svc = new Service({ >> service-install.js
echo   name: '%SERVICE_NAME%', >> service-install.js
echo   description: 'Logiciel de Gestion Medicale', >> service-install.js
echo   script: '%INSTALL_DIR%\\server.js', >> service-install.js
echo   nodeOptions: [ >> service-install.js
echo     '--harmony', >> service-install.js
echo     '--max_old_space_size=4096' >> service-install.js
echo   ], >> service-install.js
echo   env: [ >> service-install.js
echo     { >> service-install.js
echo       name: "NODE_ENV", >> service-install.js
echo       value: "production" >> service-install.js
echo     }, >> service-install.js
echo     { >> service-install.js
echo       name: "PORT", >> service-install.js
echo       value: "3000" >> service-install.js
echo     } >> service-install.js
echo   ] >> service-install.js
echo }); >> service-install.js
echo. >> service-install.js
echo svc.on('install', function(){ >> service-install.js
echo   svc.start(); >> service-install.js
echo }); >> service-install.js
echo. >> service-install.js
echo svc.install(); >> service-install.js

:: Création du serveur Express simple
echo const express = require('express'); > server.js
echo const path = require('path'); >> server.js
echo const app = express(); >> server.js
echo const PORT = process.env.PORT ^|^| 3000; >> server.js
echo. >> server.js
echo app.use(express.static(path.join(__dirname, 'dist'))); >> server.js
echo. >> server.js
echo app.get('*', (req, res) =^> { >> server.js
echo   res.sendFile(path.join(__dirname, 'dist', 'index.html')); >> server.js
echo }); >> server.js
echo. >> server.js
echo app.listen(PORT, () =^> { >> server.js
echo   console.log(`Medical Cashier running on port ${PORT}`); >> server.js
echo }); >> server.js

:: Installation du service
call node service-install.js

echo.
echo [7/10] Configuration du pare-feu Windows...
netsh advfirewall firewall add rule name="Medical Cashier HTTP" dir=in action=allow protocol=TCP localport=3000

echo.
echo [8/10] Configuration des sauvegardes...

:: Script de sauvegarde
echo @echo off > backup.bat
echo set TIMESTAMP=%%date:~-4,4%%%%date:~-10,2%%%%date:~-7,2%%_%%time:~0,2%%%%time:~3,2%%%%time:~6,2%% >> backup.bat
echo set TIMESTAMP=%%TIMESTAMP: =0%% >> backup.bat
echo set BACKUP_NAME=backup_%%TIMESTAMP%% >> backup.bat
echo echo Creation sauvegarde: %%BACKUP_NAME%% >> backup.bat
echo mkdir "%BACKUP_DIR%\%%BACKUP_NAME%%" ^>nul 2^>nul >> backup.bat
echo xcopy /E /Y "%INSTALL_DIR%\config" "%BACKUP_DIR%\%%BACKUP_NAME%%\config\" ^>nul >> backup.bat
echo xcopy /E /Y "%INSTALL_DIR%\logs" "%BACKUP_DIR%\%%BACKUP_NAME%%\logs\" ^>nul >> backup.bat
echo echo Sauvegarde terminee: %%BACKUP_NAME%% >> backup.bat

:: Planification de la sauvegarde quotidienne
schtasks /create /sc daily /st 02:00 /tn "Medical Cashier Backup" /tr "%INSTALL_DIR%\backup.bat" /f >nul 2>nul

echo.
echo [9/10] Creation des raccourcis...

:: Raccourci bureau pour l'application
powershell -command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\Gestion Medicale.lnk'); $Shortcut.TargetPath = 'http://localhost:3000'; $Shortcut.IconLocation = 'shell32.dll,13'; $Shortcut.Save()" 2>nul

:: Scripts de gestion
echo @echo off > start-service.bat
echo net start "%SERVICE_NAME%" >> start-service.bat
echo echo Service demarre >> start-service.bat
echo pause >> start-service.bat

echo @echo off > stop-service.bat
echo net stop "%SERVICE_NAME%" >> stop-service.bat
echo echo Service arrete >> stop-service.bat
echo pause >> stop-service.bat

echo @echo off > restart-service.bat
echo net stop "%SERVICE_NAME%" >> restart-service.bat
echo timeout /t 3 /nobreak ^>nul >> restart-service.bat
echo net start "%SERVICE_NAME%" >> restart-service.bat
echo echo Service redémarre >> restart-service.bat
echo pause >> restart-service.bat

echo.
echo [10/10] Tests de validation...

:: Attendre que le service démarre
timeout /t 10 /nobreak >nul

:: Test du service
sc query "%SERVICE_NAME%" | find "RUNNING" >nul
if %ERRORLEVEL% EQU 0 (
    echo Service actif: OUI
) else (
    echo Service actif: NON
)

:: Test HTTP
powershell -command "try { Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 5 | Out-Null; Write-Host 'Application accessible: OUI' } catch { Write-Host 'Application accessible: NON' }"

echo.
echo ========================================
echo   DEPLOIEMENT WINDOWS TERMINE !
echo ========================================
echo.
echo INFORMATIONS IMPORTANTES:
echo.
echo Application: http://localhost:3000
echo Dossier: %INSTALL_DIR%
echo Service: %SERVICE_NAME%
echo Sauvegardes: %BACKUP_DIR%
echo.
echo SCRIPTS DISPONIBLES:
echo - start-service.bat    : Demarrer le service
echo - stop-service.bat     : Arreter le service
echo - restart-service.bat  : Redemarrer le service
echo - backup.bat          : Creer une sauvegarde
echo.
echo PROCHAINES ETAPES:
echo 1. Ouvrir http://localhost:3000
echo 2. Configurer la base de donnees
echo 3. Creer le compte administrateur
echo 4. Configurer le centre medical
echo.
echo Support: Consultez la documentation fournie
echo.
pause
