
@echo off
echo ========================================
echo   DEPLOIEMENT AUTOMATIQUE WAMP
echo   Caisse Medicale - Version Production
echo ========================================

echo.
echo [1/6] Verification de l'environnement...
if not exist "C:\wamp64" (
    echo ERREUR: WAMP Server non trouve dans C:\wamp64
    echo Veuillez installer WAMP Server d'abord
    pause
    exit /b 1
)

echo.
echo [2/6] Nettoyage des fichiers temporaires...
if exist dist rmdir /s /q dist
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo.
echo [3/6] Installation des dependances...
call npm install

echo.
echo [4/6] Construction optimisee pour production...
set NODE_ENV=production
call npm run build

echo.
echo [5/6] Copie des fichiers vers WAMP...
if not exist "C:\wamp64\www\caisse-medicale" mkdir "C:\wamp64\www\caisse-medicale"

echo Copie du dossier dist...
xcopy /E /Y dist\* "C:\wamp64\www\caisse-medicale\"

echo Copie des fichiers API...
if not exist "C:\wamp64\www\caisse-medicale\api" mkdir "C:\wamp64\www\caisse-medicale\api"
xcopy /E /Y api\* "C:\wamp64\www\caisse-medicale\api\"

echo Copie du schema de base de donnees...
copy /Y database-schema.sql "C:\wamp64\www\caisse-medicale\"

echo.
echo [6/6] Configuration finale...
copy /Y public\.htaccess "C:\wamp64\www\caisse-medicale\" 2>nul

echo.
echo ========================================
echo   DEPLOIEMENT TERMINE AVEC SUCCES!
echo ========================================
echo.
echo PROCHAINES ETAPES:
echo 1. Demarrez WAMP Server (icone verte)
echo 2. Ouvrez phpMyAdmin: http://localhost/phpmyadmin
echo 3. Creez une base 'caisse_medicale'
echo 4. Importez le fichier: C:\wamp64\www\caisse-medicale\database-schema.sql
echo 5. Accedez au logiciel: http://localhost/caisse-medicale
echo 6. Configurez la connexion dans l'interface
echo.
echo Application disponible a: http://localhost/caisse-medicale
echo.
pause
