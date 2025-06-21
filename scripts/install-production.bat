
@echo off
cls
echo ========================================
echo   INSTALLATION PRODUCTION
echo   Caisse Medicale - Centre Medical
echo ========================================
echo.

:: Vérification des prérequis
echo [1/8] Verification des prerequis...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Node.js n'est pas installe
    echo Telechargez et installez Node.js depuis nodejs.org
    pause
    exit /b 1
)

if not exist "C:\wamp64" (
    echo ERREUR: WAMP Server non detecte
    echo Installez WAMP Server depuis www.wampserver.com
    pause
    exit /b 1
)

echo ✓ Node.js detecte
echo ✓ WAMP Server detecte

:: Nettoyage
echo.
echo [2/8] Nettoyage des fichiers temporaires...
if exist dist rmdir /s /q dist >nul 2>nul
if exist node_modules\.cache rmdir /s /q node_modules\.cache >nul 2>nul
echo ✓ Nettoyage termine

:: Installation des dépendances
echo.
echo [3/8] Installation des dependances...
call npm ci --silent
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Echec de l'installation des dependances
    pause
    exit /b 1
)
echo ✓ Dependances installees

:: Build de production
echo.
echo [4/8] Construction de l'application...
set NODE_ENV=production
call npm run build --silent
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Echec de la construction
    pause
    exit /b 1
)
echo ✓ Application construite

:: Préparation du dossier WAMP
echo.
echo [5/8] Preparation du serveur WAMP...
set DEST_DIR=C:\wamp64\www\caisse-medicale
if exist "%DEST_DIR%" rmdir /s /q "%DEST_DIR%"
mkdir "%DEST_DIR%" >nul 2>nul
mkdir "%DEST_DIR%\backup" >nul 2>nul
mkdir "%DEST_DIR%\config" >nul 2>nul
echo ✓ Dossiers prepares

:: Copie des fichiers
echo.
echo [6/8] Deploiement des fichiers...
xcopy /E /Y /Q dist\* "%DEST_DIR%\" >nul
xcopy /E /Y /Q api\* "%DEST_DIR%\api\" >nul
copy /Y database-schema.sql "%DEST_DIR%\" >nul
copy /Y public\.htaccess "%DEST_DIR%\" >nul 2>nul
echo ✓ Fichiers deployes

:: Configuration finale
echo.
echo [7/8] Configuration finale...
echo # Configuration automatique > "%DEST_DIR%\config\auto-config.txt"
echo Installation terminee le %date% %time% >> "%DEST_DIR%\config\auto-config.txt"
echo ✓ Configuration terminee

:: Finalisation
echo.
echo [8/8] Finalisation...
echo.
echo ========================================
echo   INSTALLATION REUSSIE !
echo ========================================
echo.
echo PROCHAINES ETAPES:
echo.
echo 1. Demarrez WAMP Server (icone verte)
echo 2. Ouvrez phpMyAdmin: http://localhost/phpmyadmin
echo 3. Creez une base de donnees 'caisse_medicale'
echo 4. Importez le fichier: %DEST_DIR%\database-schema.sql
echo 5. Accedez au logiciel: http://localhost/caisse-medicale
echo.
echo INFORMATIONS:
echo - Application: http://localhost/caisse-medicale
echo - Administration DB: http://localhost/phpmyadmin
echo - Dossier d'installation: %DEST_DIR%
echo.
echo ✓ Le systeme est pret pour la production !
echo.
set /p "=Appuyez sur Entree pour continuer..."
