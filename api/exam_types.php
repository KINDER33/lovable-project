
<?php
require_once 'config.php';

try {
    $pdo = getDBConnection();
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);

    switch ($method) {
        case 'GET':
            $stmt = $pdo->prepare("SELECT * FROM exam_types WHERE is_active = 1 ORDER BY name");
            $stmt->execute();
            $examTypes = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'data' => $examTypes
            ]);
            break;

        case 'POST':
            $name = $input['name'] ?? '';
            $description = $input['description'] ?? '';
            $basePrice = $input['base_price'] ?? 0;
            $duration = $input['duration_minutes'] ?? 30;
            $department = $input['department'] ?? '';
            
            if (empty($name)) {
                throw new Exception('Nom de l\'examen requis');
            }
            
            $id = generateUUID();
            
            $stmt = $pdo->prepare("INSERT INTO exam_types (id, name, description, base_price, duration_minutes, department) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$id, $name, $description, $basePrice, $duration, $department]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Type d\'examen créé avec succès'
            ]);
            break;

        default:
            throw new Exception('Méthode non supportée');
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
