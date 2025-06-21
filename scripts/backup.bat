@echo off
setlocal EnableDelayedExpansion

:: Configuration
set BACKUP_DIR=C:\medical-app\backups
set MYSQL_BIN=C:\xampp\mysql\bin
set DB_NAME=medical_production
set DB_USER=medical_user
set DB_PASS=votre_mot_de_passe_securise

:: Date format pour le nom du fichier
set YEAR=%date:~6,4%
set MONTH=%date:~3,2%
set DAY=%date:~0,2%
set TIMESTAMP=%YEAR%%MONTH%%DAY%_%time:~0,2%%time:~3,2%

:: Création du dossier de sauvegarde
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo ========================================
echo  SAUVEGARDE DU SYSTEME MEDICAL
echo  %date% %time%
echo ========================================

:: Sauvegarde de la base de données
echo.
echo [1/3] Sauvegarde de la base de données...
"%MYSQL_BIN%\mysqldump" --user=%DB_USER% --password=%DB_PASS% --databases %DB_NAME% --add-drop-database --add-drop-table --triggers --routines --events > "%BACKUP_DIR%\db_backup_%TIMESTAMP%.sql"
if %ERRORLEVEL% EQU 0 (
    echo Base de données sauvegardée avec succès
) else (
    echo ERREUR: Échec de la sauvegarde de la base de données
    exit /b 1
)

:: Sauvegarde des fichiers de l'application
echo.
echo [2/3] Sauvegarde des fichiers...
"C:\Program Files\7-Zip\7z.exe" a -tzip "%BACKUP_DIR%\files_backup_%TIMESTAMP%.zip" "C:\medical-app\*" -xr!backups -xr!logs\*.log
if %ERRORLEVEL% EQU 0 (
    echo Fichiers sauvegardés avec succès
) else (
    echo ERREUR: Échec de la sauvegarde des fichiers
    exit /b 1
)

:: Nettoyage des anciennes sauvegardes (plus de 90 jours)
echo.
echo [3/3] Nettoyage des anciennes sauvegardes...
forfiles /P "%BACKUP_DIR%" /S /M *.* /D -90 /C "cmd /c del @path" 2>nul
echo Nettoyage terminé

echo.
echo ========================================
echo  SAUVEGARDE TERMINÉE AVEC SUCCÈS
echo  Emplacement: %BACKUP_DIR%
echo  Date: %date% %time%
echo ========================================

:: Création du fichier log
echo Sauvegarde effectuée le %date% à %time% > "%BACKUP_DIR%\backup_log.txt"
echo Base de données: db_backup_%TIMESTAMP%.sql >> "%BACKUP_DIR%\backup_log.txt"
echo Fichiers: files_backup_%TIMESTAMP%.zip >> "%BACKUP_DIR%\backup_log.txt"

exit /b 0
