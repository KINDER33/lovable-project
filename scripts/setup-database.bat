
@echo off
echo ========================================
echo   CONFIGURATION BASE DE DONNEES
echo   Caisse Medicale - Installation
echo ========================================
echo.

set DB_NAME=caisse_medicale
set MYSQL_PATH=C:\wamp64\bin\mysql\mysql8.0.31\bin
set SCHEMA_FILE=C:\wamp64\www\caisse-medicale\database-schema.sql

echo Configuration de la base de donnees MySQL...
echo.
echo Nom de la base: %DB_NAME%
echo Chemin MySQL: %MYSQL_PATH%
echo Schema: %SCHEMA_FILE%
echo.

if not exist "%MYSQL_PATH%\mysql.exe" (
    echo ERREUR: MySQL non trouve dans %MYSQL_PATH%
    echo Verifiez que WAMP est installe et MySQL fonctionne
    pause
    exit /b 1
)

if not exist "%SCHEMA_FILE%" (
    echo ERREUR: Fichier schema non trouve
    echo Verifiez que l'installation s'est bien deroulee
    pause
    exit /b 1
)

echo Tentative de creation de la base de donnees...
"%MYSQL_PATH%\mysql.exe" -u root -p -e "CREATE DATABASE IF NOT EXISTS %DB_NAME%; USE %DB_NAME%; SOURCE %SCHEMA_FILE%;"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   BASE DE DONNEES CONFIGUREE !
    echo ========================================
    echo.
    echo La base de donnees '%DB_NAME%' a ete creee avec succes.
    echo Le schema a ete importe automatiquement.
    echo.
    echo Vous pouvez maintenant acceder au logiciel:
    echo http://localhost/caisse-medicale
    echo.
) else (
    echo.
    echo ========================================
    echo   CONFIGURATION MANUELLE REQUISE
    echo ========================================
    echo.
    echo Veuillez configurer manuellement:
    echo 1. Ouvrez phpMyAdmin: http://localhost/phpmyadmin
    echo 2. Creez une base '%DB_NAME%'
    echo 3. Importez le fichier: %SCHEMA_FILE%
    echo.
)

pause
