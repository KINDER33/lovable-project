
@echo off
echo ========================================
echo   INSTALLATION DES DEPENDANCES
echo ========================================

echo.
echo [1/3] Nettoyage du cache npm...
call npm cache clean --force

echo.
echo [2/3] Installation des dépendances...
call npm install

echo.
echo [3/3] Vérification de l'installation...
call npm list --depth=0

if %ERRORLEVEL% neq 0 (
    echo.
    echo ❌ ERREUR lors de l'installation!
    echo Essayez de supprimer node_modules et package-lock.json puis relancez ce script.
    pause
    exit /b 1
)

echo.
echo ✅ Installation terminée avec succès!
echo.
echo Vous pouvez maintenant lancer:
echo - npm run dev (pour le développement)
echo - npm run build (pour la production)
echo.
pause
