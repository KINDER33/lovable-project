
@echo off
echo ========================================
echo   BUILD PRODUCTION LWS - CENTRE SANTE
echo   Version Client Final - Pret a Deployer
echo ========================================

echo.
echo [1/8] Nettoyage des fichiers temporaires...
if exist dist rmdir /s /q dist
if exist build-production-lws rmdir /s /q build-production-lws
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo.
echo [2/8] Verification de l'environnement...
node --version || (
    echo ❌ Node.js non trouve!
    echo Installez Node.js 18+ avant de continuer
    pause
    exit /b 1
)

echo.
echo [3/8] Installation des dependances...
call npm ci --production=false --silent

echo.
echo [4/8] Verification TypeScript...
call npx tsc --noEmit || (
    echo ❌ Erreurs TypeScript detectees!
    echo Corrigez les erreurs avant de continuer
    pause
    exit /b 1
)

echo.
echo [5/8] Build de production optimise...
set NODE_ENV=production
call npm run build || (
    echo ❌ Erreur lors du build!
    pause
    exit /b 1
)

echo.
echo [6/8] Preparation du package production LWS...
mkdir "build-production-lws"

echo   - Copie des fichiers de build...
xcopy /E /Y "dist\*" "build-production-lws\"

echo   - Copie des fichiers API LWS production...
mkdir "build-production-lws\api"
copy /Y "api\config-lws.php" "build-production-lws\api\"
copy /Y "api\users-lws.php" "build-production-lws\api\"
copy /Y "api\sales-lws.php" "build-production-lws\api\"
copy /Y "api\medications-lws.php" "build-production-lws\api\"

echo   - Creation du fichier .htaccess...
echo RewriteEngine On > "build-production-lws\.htaccess"
echo RewriteCond %%{REQUEST_FILENAME} !-f >> "build-production-lws\.htaccess"
echo RewriteCond %%{REQUEST_FILENAME} !-d >> "build-production-lws\.htaccess"
echo RewriteRule . /index.html [L] >> "build-production-lws\.htaccess"

echo   - Copie des fichiers de deploiement...
mkdir "build-production-lws\deployment"
copy /Y "deployment\lws-schema-production.sql" "build-production-lws\deployment\"
copy /Y "deployment\guide-deploiement-lws.md" "build-production-lws\deployment\"

echo.
echo [7/8] Creation du manuel utilisateur...
echo # CENTRE DE SANTE SOLIDARITE ISLAMIQUE > "build-production-lws\MANUEL-UTILISATEUR.md"
echo ## Systeme de Caisse Medicale >> "build-production-lws\MANUEL-UTILISATEUR.md"
echo. >> "build-production-lws\MANUEL-UTILISATEUR.md"
echo ### Acces au systeme : >> "build-production-lws\MANUEL-UTILISATEUR.md"
echo - URL : https://votre-domaine.com >> "build-production-lws\MANUEL-UTILISATEUR.md"
echo - Utilisateur : admin >> "build-production-lws\MANUEL-UTILISATEUR.md"
echo - Mot de passe : admin123 >> "build-production-lws\MANUEL-UTILISATEUR.md"
echo. >> "build-production-lws\MANUEL-UTILISATEUR.md"
echo ### Fonctionnalites principales : >> "build-production-lws\MANUEL-UTILISATEUR.md"
echo - Vente de medicaments et enregistrement d'examens >> "build-production-lws\MANUEL-UTILISATEUR.md"
echo - Generation de factures avec 3 formats d'impression >> "build-production-lws\MANUEL-UTILISATEUR.md"
echo - Historique des ventes >> "build-production-lws\MANUEL-UTILISATEUR.md"
echo - Gestion des stocks >> "build-production-lws\MANUEL-UTILISATEUR.md"
echo - Rapports et statistiques >> "build-production-lws\MANUEL-UTILISATEUR.md"

echo.
echo [8/8] Generation du package final...
tar -czf "centre-sante-solidarite-islamique-v1.0.0.tar.gz" -C "build-production-lws" .

echo.
echo ========================================
echo   ✅ BUILD PRODUCTION LWS TERMINE !
echo ========================================
echo.
echo 📦 Package pret : centre-sante-solidarite-islamique-v1.0.0.tar.gz
echo 📁 Fichiers dans : build-production-lws\
echo.
echo 🚀 DEPLOIEMENT PRODUCTION :
echo   1. Uploadez le contenu de 'build-production-lws' vers votre serveur LWS
echo   2. Importez 'deployment\lws-schema-production.sql' dans phpMyAdmin
echo   3. Modifiez api\config-lws.php avec vos parametres DB
echo   4. Accedez a https://votre-domaine.com
echo.
echo 🏥 CENTRE DE SANTE SOLIDARITE ISLAMIQUE
echo   📍 MONGO - TCHAD
echo   📞 +235 66 49 22 54
echo.
echo 🔑 COMPTE ADMIN :
echo   - Utilisateur : admin
echo   - Mot de passe : admin123
echo.
echo ⚠️  CHANGEZ LE MOT DE PASSE ADMIN APRES INSTALLATION !
echo.
pause
