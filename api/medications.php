
<?php
require_once 'config.php';

try {
    $pdo = getDBConnection();
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);

    switch ($method) {
        case 'GET':
            $stmt = $pdo->prepare("SELECT * FROM medications WHERE is_active = 1 ORDER BY name");
            $stmt->execute();
            $medications = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'data' => $medications
            ]);
            break;

        case 'POST':
            $name = $input['name'] ?? '';
            $category = $input['category'] ?? '';
            $unitPrice = $input['unit_price'] ?? 0;
            $stockQuantity = $input['stock_quantity'] ?? 0;
            $supplier = $input['supplier'] ?? '';
            $description = $input['description'] ?? '';
            
            if (empty($name)) {
                throw new Exception('Nom du médicament requis');
            }
            
            $id = generateUUID();
            
            $stmt = $pdo->prepare("INSERT INTO medications (id, name, category, unit_price, stock_quantity, supplier, description) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$id, $name, $category, $unitPrice, $stockQuantity, $supplier, $description]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Médicament créé avec succès'
            ]);
            break;

        case 'PUT':
            $id = $input['id'] ?? '';
            $name = $input['name'] ?? '';
            $category = $input['category'] ?? '';
            $unitPrice = $input['unit_price'] ?? 0;
            $stockQuantity = $input['stock_quantity'] ?? 0;
            $supplier = $input['supplier'] ?? '';
            $description = $input['description'] ?? '';
            
            if (empty($id)) {
                throw new Exception('ID médicament requis');
            }
            
            $stmt = $pdo->prepare("UPDATE medications SET name = ?, category = ?, unit_price = ?, stock_quantity = ?, supplier = ?, description = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([$name, $category, $unitPrice, $stockQuantity, $supplier, $description, $id]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Médicament mis à jour'
            ]);
            break;

        case 'DELETE':
            $id = $input['id'] ?? '';
            
            if (empty($id)) {
                throw new Exception('ID médicament requis');
            }
            
            $stmt = $pdo->prepare("UPDATE medications SET is_active = 0 WHERE id = ?");
            $stmt->execute([$id]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Médicament supprimé'
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
