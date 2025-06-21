#!/usr/bin/env php
<?php
require_once __DIR__ . '/../api/error-logger.php';
$config = require __DIR__ . '/../config/monitoring.php';
$logger = ErrorLogger::getInstance();

class SystemMonitor {
    private $config;
    private $logger;
    private $alerts = [];

    public function __construct($config, $logger) {
        $this->config = $config;
        $this->logger = $logger;
    }

    public function runChecks() {
        $this->logger->log("Démarrage de la surveillance système", "INFO");
        
        try {
            $this->checkDiskSpace();
            $this->checkMemory();
            $this->checkCPU();
            $this->checkServices();
            $this->checkEndpoints();
            $this->checkLogs();
            $this->checkDatabase();
            $this->checkSecurity();
            
            $this->processAlerts();
            
        } catch (Exception $e) {
            $this->logger->logException($e);
            die("Erreur critique pendant la surveillance: " . $e->getMessage() . "\n");
        }
    }

    private function checkDiskSpace() {
        $this->logger->log("Vérification de l'espace disque", "INFO");
        
        $df = shell_exec('df -h /');
        $lines = explode("\n", trim($df));
        if (isset($lines[1])) {
            preg_match('/(\d+)%/', $lines[1], $matches);
            if (isset($matches[1])) {
                $usage = (int)$matches[1];
                
                if ($usage >= $this->config['thresholds']['disk']['critical']) {
                    $this->addAlert('critical', "Espace disque critique: {$usage}%");
                } elseif ($usage >= $this->config['thresholds']['disk']['warning']) {
                    $this->addAlert('warning', "Espace disque faible: {$usage}%");
                }
            }
        }
    }

    private function checkMemory() {
        $this->logger->log("Vérification de la mémoire", "INFO");
        
        $free = shell_exec('free -m');
        $lines = explode("\n", $free);
        $memory = preg_split('/\s+/', $lines[1]);
        
        $total = $memory[1];
        $used = $memory[2];
        $usage = round(($used / $total) * 100, 2);
        
        if ($usage >= $this->config['thresholds']['memory']['critical']) {
            $this->addAlert('critical', "Utilisation mémoire critique: {$usage}%");
        } elseif ($usage >= $this->config['thresholds']['memory']['warning']) {
            $this->addAlert('warning', "Utilisation mémoire élevée: {$usage}%");
        }
    }

    private function checkCPU() {
        $this->logger->log("Vérification du CPU", "INFO");
        
        $load = sys_getloadavg();
        $cores = (int)shell_exec('nproc');
        $usage = round(($load[0] / $cores) * 100, 2);
        
        if ($usage >= $this->config['thresholds']['cpu']['critical']) {
            $this->addAlert('critical', "Charge CPU critique: {$usage}%");
        } elseif ($usage >= $this->config['thresholds']['cpu']['warning']) {
            $this->addAlert('warning', "Charge CPU élevée: {$usage}%");
        }
    }

    private function checkServices() {
        $this->logger->log("Vérification des services", "INFO");
        
        foreach ($this->config['monitoring_points']['services'] as $service) {
            $status = shell_exec("systemctl is-active $service 2>&1");
            if (trim($status) !== 'active') {
                $this->addAlert('critical', "Service $service inactif");
            }
        }
    }

    private function checkEndpoints() {
        $this->logger->log("Vérification des endpoints", "INFO");
        
        foreach ($this->config['monitoring_points']['endpoints'] as $endpoint) {
            $start = microtime(true);
            $ch = curl_init("http://localhost$endpoint");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 5);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $time = (microtime(true) - $start) * 1000;
            curl_close($ch);
            
            if ($httpCode !== 200) {
                $this->addAlert('critical', "Endpoint $endpoint inaccessible (HTTP $httpCode)");
            } elseif ($time >= $this->config['thresholds']['response_time']['critical']) {
                $this->addAlert('critical', "Temps de réponse critique pour $endpoint: {$time}ms");
            } elseif ($time >= $this->config['thresholds']['response_time']['warning']) {
                $this->addAlert('warning', "Temps de réponse lent pour $endpoint: {$time}ms");
            }
        }
    }

    private function checkLogs() {
        $this->logger->log("Vérification des logs", "INFO");
        
        foreach ($this->config['monitoring_points']['files'] as $logFile) {
            if (!file_exists($logFile)) {
                $this->addAlert('warning', "Fichier de log manquant: $logFile");
                continue;
            }
            
            $size = filesize($logFile);
            if ($size >= $this->config['logs']['max_size']) {
                $this->addAlert('warning', "Fichier de log $logFile dépasse la taille maximale");
            }
            
            // Vérification des erreurs récentes
            $lastLines = $this->tailCustom($logFile, 100);
            $errorCount = preg_match_all('/(error|critical|emergency)/i', $lastLines);
            if ($errorCount > 10) {
                $this->addAlert('critical', "Nombre élevé d'erreurs détectées dans $logFile");
            }
        }
    }

    private function checkDatabase() {
        $this->logger->log("Vérification de la base de données", "INFO");
        
        try {
            $pdo = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
                DB_USER,
                DB_PASS
            );
            
            // Vérification des connexions actives
            $stmt = $pdo->query("SHOW STATUS LIKE 'Threads_connected'");
            $connections = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ((int)$connections['Value'] >= $this->config['database']['max_connections']) {
                $this->addAlert('critical', "Nombre de connexions DB critique: {$connections['Value']}");
            }
            
            // Vérification des requêtes lentes
            $stmt = $pdo->query("SHOW GLOBAL STATUS LIKE 'Slow_queries'");
            $slowQueries = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ((int)$slowQueries['Value'] > 0) {
                $this->addAlert('warning', "Requêtes lentes détectées: {$slowQueries['Value']}");
            }
            
        } catch (PDOException $e) {
            $this->addAlert('critical', "Erreur de connexion à la base de données: " . $e->getMessage());
        }
    }

    private function checkSecurity() {
        $this->logger->log("Vérification de la sécurité", "INFO");
        
        // Vérification des tentatives de connexion échouées
        $authLog = '/var/log/auth.log';
        if (file_exists($authLog)) {
            $lastLines = $this->tailCustom($authLog, 1000);
            $failedAttempts = preg_match_all('/Failed password/i', $lastLines);
            
            if ($failedAttempts >= $this->config['security']['failed_login_threshold']) {
                $this->addAlert('critical', "Nombre élevé de tentatives de connexion échouées: $failedAttempts");
            }
        }
        
        // Vérification des permissions des fichiers sensibles
        $sensitiveDirs = ['/var/log/medical-app', '/etc/nginx/conf.d'];
        foreach ($sensitiveDirs as $dir) {
            if (file_exists($dir) && (fileperms($dir) & 0777) > 0755) {
                $this->addAlert('critical', "Permissions non sécurisées sur: $dir");
            }
        }
    }

    private function tailCustom($filepath, $lines = 1) {
        $output = [];
        if (!file_exists($filepath)) return '';
        
        $fp = fopen($filepath, "r");
        $pos = -2;
        $EOF = "";
        $currentLines = 0;
        
        while ($currentLines < $lines && -1 !== fseek($fp, $pos, SEEK_END)) {
            $char = fgetc($fp);
            if ("\n" == $char) {
                $currentLines++;
            }
            $EOF = $char . $EOF;
            $pos--;
        }
        
        fclose($fp);
        return $EOF;
    }

    private function addAlert($level, $message) {
        $this->alerts[] = [
            'level' => $level,
            'message' => $message,
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }

    private function processAlerts() {
        if (empty($this->alerts)) {
            $this->logger->log("Aucune alerte détectée", "INFO");
            return;
        }

        foreach ($this->alerts as $alert) {
            $this->logger->log($alert['message'], strtoupper($alert['level']));
            
            // Envoi des notifications selon la configuration
            if ($alert['level'] === 'critical' && $this->config['notifications']['email']['enabled']) {
                $this->sendEmailAlert($alert);
            }
        }

        // Génération du rapport
        $this->generateReport();
    }

    private function sendEmailAlert($alert) {
        $subject = $this->config['notifications']['email']['subject_prefix'] . 
                  "Alerte " . strtoupper($alert['level']);
        
        $message = "Une alerte a été détectée:\n\n" .
                  "Niveau: " . strtoupper($alert['level']) . "\n" .
                  "Message: " . $alert['message'] . "\n" .
                  "Date: " . $alert['timestamp'] . "\n\n" .
                  "Ceci est un message automatique, merci de ne pas y répondre.";
        
        foreach ($this->config['notifications']['email']['recipients'] as $recipient) {
            mail(
                $recipient,
                $subject,
                $message,
                "From: " . $this->config['notifications']['email']['from']
            );
        }
    }

    private function generateReport() {
        $reportFile = $this->config['logs']['path'] . '/monitoring_' . date('Y-m-d') . '.log';
        
        $report = "=== Rapport de surveillance ===\n";
        $report .= "Date: " . date('Y-m-d H:i:s') . "\n\n";
        
        foreach ($this->alerts as $alert) {
            $report .= sprintf(
                "[%s] %s: %s\n",
                $alert['timestamp'],
                strtoupper($alert['level']),
                $alert['message']
            );
        }
        
        $report .= "\n=== Fin du rapport ===\n";
        
        file_put_contents($reportFile, $report, FILE_APPEND);
    }
}

// Exécution de la surveillance
$monitor = new SystemMonitor($config, $logger);
$monitor->runChecks();
