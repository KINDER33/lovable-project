
#!/bin/bash
# Script de déploiement automatique pour LWS

echo "========================================="
echo "  DÉPLOIEMENT AUTOMATIQUE LWS"
echo "  Caisse Médicale - Version Production"
echo "========================================="

# Variables de configuration (à modifier selon vos besoins)
REMOTE_HOST="votre-serveur.lws.fr"
REMOTE_USER="votre-utilisateur"
REMOTE_PATH="/home/votre-utilisateur/public_html"
DB_NAME="votre_base"
DB_USER="votre_utilisateur_db"

echo
echo "[1/5] Vérification de l'environnement..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js non trouvé. Installez Node.js avant de continuer."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm non trouvé. Installez npm avant de continuer."
    exit 1
fi

echo
echo "[2/5] Installation des dépendances..."
npm install

echo
echo "[3/5] Build de production..."
npm run build

echo
echo "[4/5] Préparation des fichiers API LWS..."
mkdir -p dist/api

# Création du fichier de configuration API pour LWS
cat > dist/api/config-lws.php << 'EOF'
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$config = [
    'host' => 'localhost',
    'database' => getenv('DB_NAME') ?: 'votre_base',
    'username' => getenv('DB_USER') ?: 'votre_utilisateur',
    'password' => getenv('DB_PASS') ?: 'votre_mot_de_passe',
    'charset' => 'utf8mb4'
];

try {
    $pdo = new PDO(
        "mysql:host={$config['host']};dbname={$config['database']};charset={$config['charset']}",
        $config['username'],
        $config['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
    
    echo json_encode([
        'success' => true,
        'message' => 'Configuration LWS opérationnelle',
        'database' => $config['database'],
        'host' => $config['host']
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Erreur de connexion : ' . $e->getMessage()
    ]);
}
?>
EOF

echo
echo "[5/5] Prêt pour l'upload..."
echo
echo "📁 Fichiers préparés dans le dossier 'dist/'"
echo "📋 INSTRUCTIONS DE FINALISATION :"
echo
echo "1. Uploadez le contenu de 'dist/' vers votre serveur LWS"
echo "2. Modifiez 'api/config-lws.php' avec vos paramètres de base"
echo "3. Importez le schéma SQL dans phpMyAdmin"
echo "4. Testez l'accès : https://votre-domaine.com"
echo
echo "🔧 PARAMÈTRES À CONFIGURER :"
echo "   - DB_NAME: $DB_NAME"
echo "   - DB_USER: $DB_USER"
echo "   - Mot de passe de la base de données"
echo
echo "✅ Build terminé avec succès !"
EOF

chmod +x scripts/deploy-lws.sh

<lov-write file_path="scripts/deploy-wamp.bat">
@echo off
echo ========================================
echo   DEPLOIEMENT AUTOMATIQUE WAMP
echo   Caisse Medicale - Version Locale
echo ========================================

echo.
echo [1/6] Verification de l'environnement...
if not exist "C:\wamp64" (
    echo ERREUR: WAMP Server non trouve dans C:\wamp64
    echo Veuillez installer WAMP Server d'abord
    pause
    exit /b 1
)

node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js non trouve
    echo Installez Node.js depuis https://nodejs.org
    pause
    exit /b 1
)

echo.
echo [2/6] Installation des dependances...
call npm install

echo.
echo [3/6] Build de production...
call npm run build

echo.
echo [4/6] Preparation du dossier WAMP...
if not exist "C:\wamp64\www\caisse-medicale" mkdir "C:\wamp64\www\caisse-medicale"

echo.
echo [5/6] Copie des fichiers...
xcopy /E /Y dist\* "C:\wamp64\www\caisse-medicale\"

echo Copie des fichiers API...
if not exist "C:\wamp64\www\caisse-medicale\api" mkdir "C:\wamp64\www\caisse-medicale\api"

echo ^<?php > "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo header('Access-Control-Allow-Origin: *'); >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS'); >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo header('Access-Control-Allow-Headers: Content-Type'); >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo header('Content-Type: application/json'); >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo. >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo     exit(0); >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo } >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo. >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo $config = [ >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo     'host' =^> 'localhost', >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo     'database' =^> 'caisse_medicale', >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo     'username' =^> 'root', >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo     'password' =^> '', >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo     'charset' =^> 'utf8mb4' >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo ]; >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo. >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo try { >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo     $pdo = new PDO( >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo         "mysql:host={$config['host']};dbname={$config['database']};charset={$config['charset']}", >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo         $config['username'], >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo         $config['password'], >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo         [PDO::ATTR_ERRMODE =^> PDO::ERRMODE_EXCEPTION] >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo     ); >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo     echo json_encode(['success' =^> true, 'message' =^> 'WAMP OK']); >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo } catch (PDOException $e) { >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo     echo json_encode(['success' =^> false, 'error' =^> $e-^>getMessage()]); >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo } >> "C:\wamp64\www\caisse-medicale\api\config-local.php"
echo ?^> >> "C:\wamp64\www\caisse-medicale\api\config-local.php"

echo.
echo [6/6] Finalisation...
echo.
echo ========================================
echo   DEPLOIEMENT WAMP TERMINE !
echo ========================================
echo.
echo PROCHAINES ETAPES :
echo 1. Demarrez WAMP Server (icone verte)
echo 2. Ouvrez phpMyAdmin : http://localhost/phpmyadmin
echo 3. Creez une base 'caisse_medicale'
echo 4. Importez le schema SQL fourni
echo 5. Accedez au logiciel : http://localhost/caisse-medicale
echo.
echo Application disponible a : http://localhost/caisse-medicale
echo Configuration API : http://localhost/caisse-medicale/api/config-local.php
echo.
pause
