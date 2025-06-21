<?php
// Inclusion du logger
require_once __DIR__ . '/error-logger.php';

// Configuration de production - Désactivation de l'affichage des erreurs
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', '/var/log/medical-app/errors.log');

// Initialisation du logger
$logger = ErrorLogger::getInstance();

// En-têtes de sécurité
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . ($_ENV['ALLOWED_ORIGINS'] ?? 'https://votre-domaine.com'));
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Configuration sécurisée de la base de données
define('DB_HOST', $_ENV['DB_HOST'] ?? '127.0.0.1');
define('DB_USER', $_ENV['DB_USER'] ?? 'afric2012609');
define('DB_PASS', $_ENV['DB_PASS'] ?? 'Dounia@2025');
define('DB_NAME', $_ENV['DB_NAME'] ?? 'afric2012609_225kcxe');

// Fonction de connexion sécurisée à la base de données
function getDBConnection() {
    global $logger;
    static $pdo = null;
    
    if ($pdo !== null) {
        return $pdo;
    }

    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
            PDO::ATTR_TIMEOUT => 10,
            PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true
        ];
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        
        // Configuration supplémentaire pour la sécurité
        $pdo->exec("SET SESSION sql_mode = 'STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'");
        
        // Log de la connexion réussie
        $logger->log("Connexion à la base de données établie", "INFO");
        
        return $pdo;
    } catch (PDOException $e) {
        // Log détaillé de l'erreur
        $logger->logDatabaseError("Connexion initiale", $e->getMessage());
        
        // Réponse générique pour la production
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Une erreur est survenue lors de la connexion à la base de données.',
            'error_code' => 'DB_CONNECTION_ERROR'
        ]);
        exit;
    }
}

// Fonction sécurisée pour générer un UUID v4
function generateUUID() {
    if (function_exists('random_bytes')) {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
    
    // Fallback sécurisé si random_bytes n'est pas disponible
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

// Fonction de validation et nettoyage des entrées
function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    }
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// Gestion des requêtes OPTIONS (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Gestionnaire d'erreurs personnalisé
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    global $logger;
    
    // Conversion du niveau d'erreur en texte
    $severity = match($errno) {
        E_ERROR => 'ERROR',
        E_WARNING => 'WARNING',
        E_PARSE => 'PARSE',
        E_NOTICE => 'NOTICE',
        default => 'UNKNOWN'
    };
    
    $logger->log($errstr, $severity, [
        'file' => $errfile,
        'line' => $errline
    ]);
    
    return false; // Continue avec le gestionnaire d'erreurs standard de PHP
});

// Gestionnaire d'exceptions non attrapées
set_exception_handler(function($e) {
    global $logger;
    $logger->logException($e);
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Une erreur inattendue est survenue.',
        'error_code' => 'UNEXPECTED_ERROR'
    ]);
});

// Vérification de l'état si appelé directement
if (basename($_SERVER['PHP_SELF']) === 'config-production.php') {
    try {
        $pdo = getDBConnection();
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
        $result = $stmt->fetch();
        
        echo json_encode([
            'success' => true,
            'message' => 'Configuration de production opérationnelle',
            'environment' => 'production',
            'database' => DB_NAME,
            'users_count' => $result['count'] ?? 0,
            'timestamp' => date('Y-m-d H:i:s'),
            'php_version' => PHP_VERSION,
            'charset' => 'UTF-8'
        ]);
    } catch (Exception $e) {
        error_log("Erreur de vérification: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Erreur lors de la vérification de la configuration',
            'error_code' => 'CONFIG_CHECK_ERROR'
        ]);
    }
}
?>
