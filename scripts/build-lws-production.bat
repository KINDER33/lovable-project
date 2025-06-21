
@echo off
echo ========================================
echo   BUILD PRODUCTION OPTIMISE POUR LWS
echo   Caisse Médicale - Version Production
echo ========================================

echo.
echo [1/7] Nettoyage des fichiers temporaires...
if exist dist rmdir /s /q dist
if exist build-lws-production rmdir /s /q build-lws-production
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
echo [6/7] Préparation du package LWS production...
mkdir "build-lws-production"

echo   - Copie des fichiers de build...
xcopy /E /Y "dist\*" "build-lws-production\"

echo   - Copie des fichiers API LWS...
mkdir "build-lws-production\api"
copy /Y "api\config-lws.php" "build-lws-production\api\"
copy /Y "api\users-lws.php" "build-lws-production\api\"
copy /Y "api\sales-lws.php" "build-lws-production\api\"
copy /Y "api\medications-lws.php" "build-lws-production\api\"

echo   - Copie du schéma production...
mkdir "build-lws-production\deployment"
copy /Y "deployment\lws-schema-production.sql" "build-lws-production\deployment\"
copy /Y "deployment\guide-deploiement-lws.md" "build-lws-production\deployment\"

echo.
echo [7/7] Génération du package de déploiement production...
tar -czf "caisse-medicale-lws-production-v1.0.0.tar.gz" -C "build-lws-production" .

echo.
echo ========================================
echo   ✅ BUILD LWS PRODUCTION TERMINÉ!
echo ========================================
echo.
echo 📦 Package prêt : caisse-medicale-lws-production-v1.0.0.tar.gz
echo 📁 Fichiers dans : build-lws-production\
echo.
echo 🚀 DÉPLOIEMENT PRODUCTION :
echo   1. Uploadez le contenu de 'build-lws-production' vers votre serveur LWS
echo   2. Importez 'deployment\lws-schema-production.sql' dans phpMyAdmin
echo   3. Accédez à https://votre-domaine.com
echo   4. Connectez-vous avec admin / admin123
echo.
echo 🔑 COMPTE ADMIN PAR DÉFAUT :
echo   - Utilisateur : admin
echo   - Mot de passe : admin123
echo.
echo ⚠️  SYSTÈME PRÊT AVEC DONNÉES DE BASE - CHANGEZ LE MOT DE PASSE ADMIN !
echo.
pause
