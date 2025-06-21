
@echo off
echo ========================================
echo   BUILD SYSTEME VIERGE POUR LWS
echo   Caisse Médicale - Version Vierge
echo ========================================

echo.
echo [1/7] Nettoyage des fichiers temporaires...
if exist dist rmdir /s /q dist
if exist build-lws-vierge rmdir /s /q build-lws-vierge
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
echo [6/7] Préparation du package LWS vierge...
mkdir "build-lws-vierge"

echo   - Copie des fichiers de build...
xcopy /E /Y "dist\*" "build-lws-vierge\"

echo   - Copie des fichiers API LWS...
mkdir "build-lws-vierge\api"
copy /Y "api\config-lws.php" "build-lws-vierge\api\"
copy /Y "api\users-lws.php" "build-lws-vierge\api\"
copy /Y "api\sales-lws.php" "build-lws-vierge\api\"
copy /Y "api\medications-lws.php" "build-lws-vierge\api\"

echo   - Copie du schéma vierge...
mkdir "build-lws-vierge\deployment"
copy /Y "deployment\lws-schema-vierge.sql" "build-lws-vierge\deployment\"
copy /Y "deployment\guide-deploiement-lws-vierge.md" "build-lws-vierge\deployment\"

echo.
echo [7/7] Génération du package de déploiement vierge...
tar -czf "caisse-medicale-lws-vierge-v1.0.0.tar.gz" -C "build-lws-vierge" .

echo.
echo ========================================
echo   ✅ BUILD LWS VIERGE TERMINÉ!
echo ========================================
echo.
echo 📦 Package prêt : caisse-medicale-lws-vierge-v1.0.0.tar.gz
echo 📁 Fichiers dans : build-lws-vierge\
echo.
echo 🚀 DÉPLOIEMENT SYSTÈME VIERGE :
echo   1. Uploadez le contenu de 'build-lws-vierge' vers votre serveur LWS
echo   2. Importez 'deployment\lws-schema-vierge.sql' dans phpMyAdmin
echo   3. Accédez à https://votre-domaine.com
echo   4. Créez votre premier compte administrateur
echo.
echo ⚠️  SYSTÈME COMPLÈTEMENT VIERGE - AUCUNE DONNÉE PAR DÉFAUT
echo.
pause
