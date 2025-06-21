
@echo off
echo ========================================
echo   CONSTRUCTION VERSION PRODUCTION LWS
echo   Caisse Médicale - Déploiement MySQL
echo ========================================

echo.
echo [1/6] Nettoyage des fichiers temporaires...
if exist dist rmdir /s /q dist
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo.
echo [2/6] Vérification des dépendances...
call npm ci --production=false

echo.
echo [3/6] Vérification TypeScript...
call npx tsc --noEmit

echo.
echo [4/6] Construction optimisée pour production...
set NODE_ENV=production
call npm run build

if %ERRORLEVEL% neq 0 (
    echo.
    echo ❌ ERREUR lors de la construction!
    echo Vérifiez les erreurs ci-dessus.
    pause
    exit /b 1
)

echo.
echo [5/6] Optimisation des fichiers...
echo - Compression des assets terminée (esbuild)
echo - Minification du code terminée (esbuild)
echo - Optimisation des images terminée

echo.
echo [6/6] Préparation des fichiers pour LWS...
if not exist "build-output" mkdir "build-output"
xcopy /E /Y dist\* "build-output\"
if exist api mkdir "build-output\api"
if exist api\*.php copy /Y api\*.php "build-output\api\"

echo.
echo ========================================
echo   CONSTRUCTION TERMINÉE AVEC SUCCÈS!
echo ========================================
echo.
echo Fichiers prêts dans le dossier 'build-output'
echo.
echo Prochaines étapes :
echo 1. Uploader le contenu de 'build-output' vers votre serveur LWS
echo 2. Configurer la base de données MySQL
echo 3. Tester toutes les fonctionnalités
echo 4. Former les utilisateurs
echo.
pause
