
@echo off
echo ========================================
echo   BUILD OPTIMISE POUR DEPLOIEMENT LWS
echo   Caisse Médicale - Version Production
echo ========================================

echo.
echo [1/7] Nettoyage des fichiers temporaires...
if exist dist rmdir /s /q dist
if exist build-lws rmdir /s /q build-lws
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo.
echo [2/7] Vérification de l'environnement...
node --version || (
    echo ❌ Node.js non trouvé!
    echo Installez Node.js 18+ avant de continuer
    pause
    exit /b 1
)

echo.
echo [3/7] Installation des dépendances...
call npm ci --production=false --silent

echo.
echo [4/7] Vérification TypeScript...
call npx tsc --noEmit || (
    echo ❌ Erreurs TypeScript détectées!
    echo Corrigez les erreurs avant de continuer
    pause
    exit /b 1
)

echo.
echo [5/7] Build de production optimisé...
set NODE_ENV=production
call npm run build || (
    echo ❌ Erreur lors du build!
    pause
    exit /b 1
)

echo.
echo [6/7] Préparation du package LWS...
mkdir "build-lws"

echo   - Copie des fichiers de build...
xcopy /E /Y "dist\*" "build-lws\"

echo   - Copie des fichiers API LWS...
mkdir "build-lws\api"
copy /Y "api\config-lws.php" "build-lws\api\"
copy /Y "api\users-lws.php" "build-lws\api\"
copy /Y "api\sales-lws.php" "build-lws\api\"
copy /Y "api\medications-lws.php" "build-lws\api\"

echo   - Copie des fichiers de déploiement...
mkdir "build-lws\deployment"
copy /Y "deployment\lws-schema-complete.sql" "build-lws\deployment\"
copy /Y "deployment\guide-deploiement-lws.md" "build-lws\deployment\"

echo.
echo [7/7] Génération du package de déploiement...
tar -czf "caisse-medicale-lws-v1.0.0.tar.gz" -C "build-lws" .

echo.
echo ========================================
echo   ✅ BUILD LWS TERMINÉ AVEC SUCCÈS!
echo ========================================
echo.
echo 📦 Package prêt : caisse-medicale-lws-v1.0.0.tar.gz
echo 📁 Fichiers dans : build-lws\
echo.
echo 🚀 PROCHAINES ÉTAPES :
echo   1. Uploadez le contenu de 'build-lws' vers votre serveur LWS
echo   2. Importez 'deployment\lws-schema-complete.sql' dans phpMyAdmin
echo   3. Testez https://votre-domaine.com/api/config-lws.php
echo   4. Accédez à https://votre-domaine.com
echo.
echo 🔑 COMPTE ADMIN PAR DÉFAUT :
echo   - Utilisateur : admin
echo   - Mot de passe : admin123
echo.
echo ⚠️  N'oubliez pas de changer le mot de passe admin !
echo.
pause
