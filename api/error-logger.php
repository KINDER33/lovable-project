<?php
// Configuration de la journalisation des erreurs pour la production
class ErrorLogger {
    private static $logFile = '/var/log/medical-app/errors.log';
    private static $instance = null;

    private function __construct() {
        // Création du dossier de logs si nécessaire
        $logDir = dirname(self::$logFile);
        if (!file_exists($logDir)) {
            mkdir($logDir, 0755, true);
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new ErrorLogger();
        }
        return self::$instance;
    }

    public function log($message, $severity = 'ERROR', $context = []) {
        $timestamp = date('Y-m-d H:i:s');
        $contextStr = !empty($context) ? json_encode($context) : '';
        
        $logEntry = sprintf(
            "[%s] %s: %s %s\n",
            $timestamp,
            $severity,
            $message,
            $contextStr
        );

        error_log($logEntry, 3, self::$logFile);

        // En cas d'erreur critique, envoi d'une notification (à implémenter selon les besoins)
        if ($severity === 'CRITICAL') {
            $this->notifyAdmin($message, $context);
        }
    }

    private function notifyAdmin($message, $context) {
        // À implémenter selon les besoins (email, SMS, etc.)
        // Exemple avec mail() :
        /*
        $to = 'admin@example.com';
        $subject = 'Erreur Critique - Caisse Médicale';
        $body = "Message: $message\nContexte: " . json_encode($context, JSON_PRETTY_PRINT);
        $headers = 'From: system@medical-app.com';
        
        mail($to, $subject, $body, $headers);
        */
    }

    public function logException(\Throwable $e) {
        $context = [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ];

        $this->log($e->getMessage(), 'CRITICAL', $context);
    }

    public function logDatabaseError($query, $error) {
        $context = [
            'query' => $query,
            'error' => $error
        ];

        $this->log('Erreur de base de données', 'ERROR', $context);
    }

    public function logAuthenticationFailure($username, $reason) {
        $context = [
            'username' => $username,
            'reason' => $reason,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
        ];

        $this->log('Échec d\'authentification', 'WARNING', $context);
    }

    public function logApiError($endpoint, $method, $error) {
        $context = [
            'endpoint' => $endpoint,
            'method' => $method,
            'error' => $error,
            'request_data' => $_REQUEST
        ];

        $this->log('Erreur API', 'ERROR', $context);
    }

    public function rotateLogFile() {
        if (file_exists(self::$logFile)) {
            $size = filesize(self::$logFile);
            // Rotation si le fichier dépasse 10MB
            if ($size > 10 * 1024 * 1024) {
                $archive = self::$logFile . '.' . date('Y-m-d-H-i-s') . '.gz';
                $data = file_get_contents(self::$logFile);
                file_put_contents('compress.zlib://' . $archive, $data);
                unlink(self::$logFile);
            }
        }
    }

    public function cleanOldLogs($daysToKeep = 30) {
        $logDir = dirname(self::$logFile);
        $files = glob($logDir . '/*.gz');
        
        foreach ($files as $file) {
            if (filemtime($file) < strtotime("-$daysToKeep days")) {
                unlink($file);
            }
        }
    }
}

// Exemple d'utilisation :
/*
try {
    $logger = ErrorLogger::getInstance();
    
    // Log une erreur simple
    $logger->log("Une erreur s'est produite", 'ERROR');
    
    // Log une erreur avec contexte
    $logger->log("Erreur de traitement", 'ERROR', ['user_id' => 123, 'action' => 'payment']);
    
    // Log une exception
    try {
        throw new Exception("Test d'exception");
    } catch (Exception $e) {
        $logger->logException($e);
    }
    
    // Log une erreur de base de données
    $logger->logDatabaseError("SELECT * FROM users", "Table 'users' doesn't exist");
    
    // Log un échec d'authentification
    $logger->logAuthenticationFailure("john.doe", "Mot de passe incorrect");
    
    // Rotation et nettoyage des logs
    $logger->rotateLogFile();
    $logger->cleanOldLogs(30);
    
} catch (Exception $e) {
    // En cas d'erreur avec le logger lui-même
    error_log("Erreur du logger: " . $e->getMessage());
}
*/
?>
