<?php
require_once 'config-production.php';

// Désactiver la mise en cache pour ce endpoint
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

function checkDatabaseConnection() {
    try {
        $pdo = getDBConnection();
        $start = microtime(true);
        $stmt = $pdo->query("SELECT 1");
        $end = microtime(true);
        return [
            'status' => 'healthy',
            'responseTime' => round(($end - $start) * 1000, 2) . 'ms'
        ];
    } catch (Exception $e) {
        error_log("Erreur de connexion DB dans health-check: " . $e->getMessage());
        return [
            'status' => 'unhealthy',
            'error' => 'Erreur de connexion à la base de données'
        ];
    }
}

function checkDiskSpace() {
    $totalSpace = disk_total_space('/');
    $freeSpace = disk_free_space('/');
    $usedSpace = $totalSpace - $freeSpace;
    $usedPercentage = ($usedSpace / $totalSpace) * 100;

    return [
        'status' => $usedPercentage < 90 ? 'healthy' : 'warning',
        'total' => formatBytes($totalSpace),
        'free' => formatBytes($freeSpace),
        'used' => round($usedPercentage, 2) . '%'
    ];
}

function checkMemoryUsage() {
    $memInfo = file_get_contents('/proc/meminfo');
    preg_match_all('/^(.+?):\s+(\d+)/m', $memInfo, $matches);
    $mem = array_combine($matches[1], $matches[2]);
    
    $totalMem = $mem['MemTotal'] * 1024;
    $freeMem = $mem['MemFree'] * 1024;
    $usedMem = $totalMem - $freeMem;
    $usedPercentage = ($usedMem / $totalMem) * 100;

    return [
        'status' => $usedPercentage < 90 ? 'healthy' : 'warning',
        'total' => formatBytes($totalMem),
        'free' => formatBytes($freeMem),
        'used' => round($usedPercentage, 2) . '%'
    ];
}

function formatBytes($bytes) {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= pow(1024, $pow);
    return round($bytes, 2) . ' ' . $units[$pow];
}

function checkApplicationStatus() {
    $requiredFiles = [
        '/usr/share/nginx/html/index.html',
        '/etc/nginx/nginx.conf'
    ];

    $missingFiles = [];
    foreach ($requiredFiles as $file) {
        if (!file_exists($file)) {
            $missingFiles[] = $file;
        }
    }

    return [
        'status' => empty($missingFiles) ? 'healthy' : 'warning',
        'missingFiles' => $missingFiles
    ];
}

// Exécution des vérifications
$healthStatus = [
    'timestamp' => date('Y-m-d H:i:s'),
    'environment' => 'production',
    'version' => '1.0.0',
    'checks' => [
        'database' => checkDatabaseConnection(),
        'disk' => checkDiskSpace(),
        'memory' => checkMemoryUsage(),
        'application' => checkApplicationStatus()
    ]
];

// Détermination du statut global
$isHealthy = true;
foreach ($healthStatus['checks'] as $check) {
    if ($check['status'] === 'unhealthy') {
        $isHealthy = false;
        break;
    }
}

// Définition du code HTTP approprié
http_response_code($isHealthy ? 200 : 503);

// Ajout du statut global
$healthStatus['status'] = $isHealthy ? 'healthy' : 'unhealthy';

// Envoi de la réponse
echo json_encode($healthStatus, JSON_PRETTY_PRINT);
?>
