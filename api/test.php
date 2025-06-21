
<?php
// Test simple pour vérifier la configuration
echo "<!DOCTYPE html><html><head><title>Test WAMP</title></head><body>";
echo "<h1>Test de Configuration WAMP</h1>";

// Test PHP
echo "<h2>✅ PHP fonctionne</h2>";
echo "<p>Version PHP: " . phpversion() . "</p>";

// Test extensions
echo "<h2>Extensions PHP</h2>";
$extensions = ['pdo', 'pdo_mysql', 'json'];
foreach ($extensions as $ext) {
    $status = extension_loaded($ext) ? '✅' : '❌';
    echo "<p>{$status} {$ext}</p>";
}

// Test connexion base de données
echo "<h2>Test Base de Données</h2>";
try {
    $pdo = new PDO(
        "mysql:host=localhost;dbname=caisse_medicale;charset=utf8",
        'root',
        '',
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
    echo "<p>✅ Connexion MySQL réussie</p>";
    
    // Test table
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "<p>Tables trouvées: " . implode(', ', $tables) . "</p>";
    
} catch (PDOException $e) {
    echo "<p>❌ Erreur base de données: " . $e->getMessage() . "</p>";
}

echo "</body></html>";
?>
