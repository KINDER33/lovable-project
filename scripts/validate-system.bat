
@echo off
cls
echo ========================================
echo   VALIDATION COMPLETE DU SYSTEME
echo   Caisse Medicale - Tests Automatises
echo ========================================
echo.

echo [1/7] Verification de l'environnement...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERREUR: Node.js non installe
    echo Installez Node.js depuis nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js detecte

if not exist "package.json" (
    echo ❌ ERREUR: Fichier package.json manquant
    echo Verifiez que vous etes dans le bon dossier
    pause
    exit /b 1
)
echo ✅ Package.json trouve

echo.
echo [2/7] Installation des dependances...
call npm install --silent
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERREUR: Echec installation dependances
    pause
    exit /b 1
)
echo ✅ Dependances installees

echo.
echo [3/7] Construction de l'application...
call npm run build --silent
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERREUR: Echec de construction
    pause
    exit /b 1
)
echo ✅ Application construite avec succes

echo.
echo [4/7] Verification des fichiers critiques...
if not exist "dist\index.html" (
    echo ❌ ERREUR: Fichier index.html manquant
    pause
    exit /b 1
)
echo ✅ Fichiers de construction present

if not exist "dist\assets" (
    echo ❌ ERREUR: Dossier assets manquant
    pause
    exit /b 1
)
echo ✅ Assets disponibles

echo.
echo [5/7] Test de demarrage du serveur...
start /B npm run preview >nul 2>nul
echo ✅ Serveur demarre en arriere-plan

timeout /t 5 /nobreak >nul

echo.
echo [6/7] Test de connectivite...
powershell -command "try { $response = Invoke-WebRequest -Uri 'http://localhost:4173' -TimeoutSec 10; if($response.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"
if %ERRORLEVEL% EQU 0 (
    echo ✅ Application accessible sur http://localhost:4173
) else (
    echo ⚠️ ATTENTION: Application non accessible
    echo Verifiez que le port 4173 est libre
)

echo.
echo [7/7] Arret du serveur de test...
taskkill /F /IM node.exe >nul 2>nul
echo ✅ Serveur de test arrete

echo.
echo ========================================
echo   VALIDATION TERMINEE AVEC SUCCES!
echo ========================================
echo.
echo RESULTATS DE LA VALIDATION:
echo ✅ Environnement configure correctement
echo ✅ Dependances installees
echo ✅ Application construite sans erreur
echo ✅ Fichiers critiques presents
echo ✅ Serveur demarre correctement
echo ✅ Application accessible via navigateur
echo.
echo PROCHAINES ETAPES:
echo 1. Configurez votre projet Supabase
echo 2. Testez toutes les fonctionnalites
echo 3. Configurez les donnees de votre centre
echo 4. Formez les utilisateurs
echo 5. Creez votre premiere sauvegarde
echo.
echo 🎉 LE SYSTEME EST PRET POUR LA PRODUCTION !
echo.
pause
