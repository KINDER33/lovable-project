
@echo off
echo ========================================
echo   SAUVEGARDE BASE DE DONNÉES
echo   Caisse Médicale - Version Production
echo ========================================

set BACKUP_DIR=C:\wamp64\www\caisse-medicale\backup
set DATE=%date:~-4,4%-%date:~-10,2%-%date:~-7,2%
set TIME=%time:~0,2%-%time:~3,2%
set FILENAME=backup_caisse_medicale_%DATE%_%TIME%.sql

echo.
echo Création du répertoire de sauvegarde...
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo.
echo Sauvegarde en cours...
echo Fichier : %FILENAME%

:: Sauvegarde MySQL (adapter selon votre configuration)
"C:\wamp64\bin\mysql\mysql8.0.31\bin\mysqldump.exe" -u root -p caisse_medicale > "%BACKUP_DIR%\%FILENAME%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SAUVEGARDE RÉUSSIE!
    echo ========================================
    echo Fichier sauvegardé : %FILENAME%
    echo Emplacement : %BACKUP_DIR%
    echo.
) else (
    echo.
    echo ========================================
    echo   ERREUR LORS DE LA SAUVEGARDE!
    echo ========================================
    echo Vérifiez :
    echo - MySQL est démarré
    echo - Mot de passe root correct
    echo - Base de données existe
    echo.
)

echo Nettoyage des anciennes sauvegardes (+ de 30 jours)...
forfiles /p "%BACKUP_DIR%" /s /m backup_*.sql /d -30 /c "cmd /c del @path" 2>nul

echo.
echo Appuyez sur une touche pour continuer...
pause >nul
