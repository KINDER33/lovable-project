@echo off
setlocal EnableDelayedExpansion

:: Configuration
set APP_DIR=C:\medical-app
set XAMPP_DIR=C:\xampp
set DB_NAME=medical_production
set DB_USER=medical_user
set DEFAULT_PORT=80

echo ================================================
echo    INSTALLATION DU SYSTEME DE GESTION MEDICALE
echo    Centre de Sante Solidarite Islamique
echo    MONGO, TCHAD
echo ================================================
echo.

:: Vérification des prérequis
echo [1/7] Verification des prerequis...
echo.

:: Vérification de XAMPP
if not exist "%XAMPP_DIR%\mysql\bin\mysql.exe" (
    echo ERREUR: XAMPP n'est pas installe correctement
    echo Veuillez installer XAMPP depuis https://www.apachefriends.org/
    pause
    exit /b 1
)

:: Vérification de Node.js
node --version > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Node.js n'est pas installe
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo Prerequis valides ✓
echo.

:: Création des dossiers
echo [2/7] Creation des dossiers...
if not exist "%APP_DIR%" mkdir "%APP_DIR%"
if not exist "%APP_DIR%\logs" mkdir "%APP_DIR%\logs"
if not exist "%APP_DIR%\backups" mkdir "%APP_DIR%\backups"
if not exist "%APP_DIR%\temp" mkdir "%APP_DIR%\temp"

echo Dossiers crees ✓
echo.

:: Configuration de la base de données
echo [3/7] Configuration de la base de donnees...
set /p DB_PASS="Entrez un mot de passe pour la base de donnees: "
echo.

:: Démarrage de MySQL
net start MySQL > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Demarrage de MySQL...
    "%XAMPP_DIR%\mysql\bin\mysqld" --install
    net start MySQL
)

:: Création de la base de données et de l'utilisateur
echo Creation de la base de donnees...
"%XAMPP_DIR%\mysql\bin\mysql" -u root -e "CREATE DATABASE IF NOT EXISTS %DB_NAME% CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
"%XAMPP_DIR%\mysql\bin\mysql" -u root -e "CREATE USER IF NOT EXISTS '%DB_USER%'@'localhost' IDENTIFIED BY '%DB_PASS%';"
"%XAMPP_DIR%\mysql\bin\mysql" -u root -e "GRANT ALL PRIVILEGES ON %DB_NAME%.* TO '%DB_USER%'@'localhost';"
"%XAMPP_DIR%\mysql\bin\mysql" -u root -e "FLUSH PRIVILEGES;"

echo Base de donnees configuree ✓
echo.

:: Configuration d'Apache
echo [4/7] Configuration d'Apache...
set /p PORT="Entrez le port pour l'application [%DEFAULT_PORT%]: "
if "!PORT!"=="" set PORT=%DEFAULT_PORT%

:: Création du virtual host
echo ^<VirtualHost *:!PORT!^> > "%XAMPP_DIR%\apache\conf\extra\httpd-vhosts.conf"
echo     DocumentRoot "%APP_DIR%\public" >> "%XAMPP_DIR%\apache\conf\extra\httpd-vhosts.conf"
echo     ServerName medical.local >> "%XAMPP_DIR%\apache\conf\extra\httpd-vhosts.conf"
echo     ErrorLog "%APP_DIR%\logs\error.log" >> "%XAMPP_DIR%\apache\conf\extra\httpd-vhosts.conf"
echo     CustomLog "%APP_DIR%\logs\access.log" combined >> "%XAMPP_DIR%\apache\conf\extra\httpd-vhosts.conf"
echo     ^<Directory "%APP_DIR%\public"^> >> "%XAMPP_DIR%\apache\conf\extra\httpd-vhosts.conf"
echo         Options Indexes FollowSymLinks >> "%XAMPP_DIR%\apache\conf\extra\httpd-vhosts.conf"
echo         AllowOverride All >> "%XAMPP_DIR%\apache\conf\extra\httpd-vhosts.conf"
echo         Require all granted >> "%XAMPP_DIR%\apache\conf\extra\httpd-vhosts.conf"
echo     ^</Directory^> >> "%XAMPP_DIR%\apache\conf\extra\httpd-vhosts.conf"
echo ^</VirtualHost^> >> "%XAMPP_DIR%\apache\conf\extra\httpd-vhosts.conf"

echo Configuration Apache terminee ✓
echo.

:: Installation des dépendances
echo [5/7] Installation des dependances...
cd "%APP_DIR%"
call npm install --production
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Impossible d'installer les dependances
    exit /b 1
)

echo Dependances installees ✓
echo.

:: Configuration de l'application
echo [6/7] Configuration de l'application...
echo DB_HOST=localhost > "%APP_DIR%\.env"
echo DB_USER=%DB_USER% >> "%APP_DIR%\.env"
echo DB_PASS=%DB_PASS% >> "%APP_DIR%\.env"
echo DB_NAME=%DB_NAME% >> "%APP_DIR%\.env"
echo APP_ENV=production >> "%APP_DIR%\.env"
echo PORT=%PORT% >> "%APP_DIR%\.env"

echo Configuration terminee ✓
echo.

:: Configuration des sauvegardes automatiques
echo [7/7] Configuration des sauvegardes automatiques...
schtasks /create /tn "Medical-Backup" /tr "%APP_DIR%\scripts\backup.bat" /sc daily /st 23:00 /ru SYSTEM
if %ERRORLEVEL% EQU 0 (
    echo Sauvegarde automatique configuree ✓
) else (
    echo ATTENTION: Impossible de configurer la sauvegarde automatique
)
echo.

:: Redémarrage des services
echo Redemarrage des services...
net stop Apache2.4 > nul 2>&1
net stop MySQL > nul 2>&1
timeout /t 2 /nobreak > nul
net start MySQL
net start Apache2.4

echo.
echo ================================================
echo    INSTALLATION TERMINEE AVEC SUCCES
echo ================================================
echo.
echo L'application est accessible a l'adresse:
echo http://localhost:%PORT%
echo.
echo Informations importantes:
echo - Base de donnees: %DB_NAME%
echo - Utilisateur DB: %DB_USER%
echo - Dossier application: %APP_DIR%
echo - Logs: %APP_DIR%\logs
echo - Sauvegardes: %APP_DIR%\backups
echo.
echo Prochaines etapes:
echo 1. Accedez a http://localhost:%PORT%/setup
echo 2. Creez le compte administrateur
echo 3. Configurez les parametres du centre
echo.
echo En cas de probleme:
echo - Consultez les logs dans %APP_DIR%\logs
echo - Contactez le support: +XXX XXX XXX XXX
echo.
pause

exit /b 0
