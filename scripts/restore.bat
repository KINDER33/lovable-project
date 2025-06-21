@echo off
setlocal EnableDelayedExpansion

:: Configuration
set BACKUP_DIR=C:\medical-app\backups
set MYSQL_BIN=C:\xampp\mysql\bin
set DB_NAME=medical_production
set DB_USER=medical_user
set DB_PASS=votre_mot_de_passe_securise
set APP_DIR=C:\medical-app

echo ========================================
echo  RESTAURATION DU SYSTEME MEDICAL
echo  %date% %time%
echo ========================================

:: Vérification des services
echo.
echo [1/5] Vérification des services...
net stop Apache2.4 2>nul
net stop MySQL 2>nul
timeout /t 5 /nobreak > nul

:: Liste des sauvegardes disponibles
echo.
echo [2/5] Sauvegardes disponibles:
echo.
dir /B /O-D "%BACKUP_DIR%\db_backup_*.sql" 2>nul
echo.
set /p BACKUP_FILE="Entrez le nom du fichier de sauvegarde DB à restaurer: "

if not exist "%BACKUP_DIR%\%BACKUP_FILE%" (
    echo ERREUR: Fichier de sauvegarde introuvable
    exit /b 1
)

:: Extraction du timestamp de la sauvegarde DB
for %%F in ("%BACKUP_FILE%") do set "TIMESTAMP=%%~nF"
set "TIMESTAMP=%TIMESTAMP:db_backup_=%"

:: Vérification du fichier ZIP correspondant
if not exist "%BACKUP_DIR%\files_backup_%TIMESTAMP%.zip" (
    echo ERREUR: Archive des fichiers correspondante introuvable
    exit /b 1
)

:: Restauration de la base de données
echo.
echo [3/5] Restauration de la base de données...
net start MySQL
timeout /t 5 /nobreak > nul

"%MYSQL_BIN%\mysql" --user=%DB_USER% --password=%DB_PASS% -e "DROP DATABASE IF EXISTS %DB_NAME%"
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Impossible de supprimer l'ancienne base de données
    exit /b 1
)

"%MYSQL_BIN%\mysql" --user=%DB_USER% --password=%DB_PASS% < "%BACKUP_DIR%\%BACKUP_FILE%"
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Échec de la restauration de la base de données
    exit /b 1
)

:: Sauvegarde des fichiers actuels
echo.
echo [4/5] Sauvegarde des fichiers actuels...
set EMERGENCY_BACKUP=%BACKUP_DIR%\emergency_backup_%date:~6,4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.zip
"C:\Program Files\7-Zip\7z.exe" a -tzip "%EMERGENCY_BACKUP%" "%APP_DIR%\*" -xr!backups -xr!logs\*.log
if %ERRORLEVEL% NEQ 0 (
    echo ATTENTION: Impossible de créer la sauvegarde d'urgence
    set /p CONTINUE="Voulez-vous continuer quand même? (O/N): "
    if /i "!CONTINUE!" neq "O" exit /b 1
)

:: Restauration des fichiers
echo.
echo [5/5] Restauration des fichiers...
rd /s /q "%APP_DIR%\temp" 2>nul
mkdir "%APP_DIR%\temp"
"C:\Program Files\7-Zip\7z.exe" x -y "%BACKUP_DIR%\files_backup_%TIMESTAMP%.zip" -o"%APP_DIR%\temp"
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Échec de l'extraction des fichiers
    exit /b 1
)

xcopy /E /I /Y "%APP_DIR%\temp\*" "%APP_DIR%\"
rd /s /q "%APP_DIR%\temp"

:: Redémarrage des services
echo.
echo Redémarrage des services...
net start MySQL
timeout /t 2 /nobreak > nul
net start Apache2.4

echo.
echo ========================================
echo  RESTAURATION TERMINÉE AVEC SUCCÈS
echo  Date: %date% %time%
echo ========================================
echo.
echo Points importants:
echo 1. Vérifiez la connexion à l'application
echo 2. Testez une opération simple (ex: connexion)
echo 3. Vérifiez les logs pour des erreurs
echo.
echo En cas de problème:
echo - Une sauvegarde d'urgence a été créée: %EMERGENCY_BACKUP%
echo - Contactez le support technique: +XXX XXX XXX XXX
echo.
pause

exit /b 0
