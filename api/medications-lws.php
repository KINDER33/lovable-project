
<?php
require_once 'config-lws.php';

try {
    $pdo = getDBConnection();
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);

    switch ($method) {
        case 'GET':
            // Récupérer tous les médicaments actifs
            $stmt = $pdo->query("SELECT * FROM medications WHERE is_active = 1 ORDER BY name ASC");
            $medications = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'data' => $medications
            ]);
            break;

        case 'POST':
            // Créer un nouveau médicament
            $id = generateUUID();
            $name = sanitizeInput($input['name']);
            $description = sanitizeInput($input['description'] ?? '');
            $category = sanitizeInput($input['category'] ?? '');
            $unitPrice = floatval($input['unitPrice'] ?? 0);
            $stockQuantity = intval($input['stockQuantity'] ?? 0);
            $minStockLevel = intval($input['minStockLevel'] ?? 10);
            $supplier = sanitizeInput($input['supplier'] ?? '');
            $expiryDate = $input['expiryDate'] ?? null;
            
            $stmt = $pdo->prepare("INSERT INTO medications (id, name, description, category, unit_price, stock_quantity, min_stock_level, supplier, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $result = $stmt->execute([$id, $name, $description, $category, $unitPrice, $stockQuantity, $minStockLevel, $supplier, $expiryDate]);
            
            echo json_encode([
                'success' => $result,
                'message' => $result ? 'Médicament créé avec succès' : 'Erreur lors de la création'
            ]);
            break;

        case 'PUT':
            // Mettre à jour un médicament
            $id = sanitizeInput($input['id']);
            $name = sanitizeInput($input['name']);
            $description = sanitizeInput($input['description'] ?? '');
            $category = sanitizeInput($input['category'] ?? '');
            $unitPrice = floatval($input['unitPrice'] ?? 0);
            $stockQuantity = intval($input['stockQuantity'] ?? 0);
            $minStockLevel = intval($input['minStockLevel'] ?? 10);
            $supplier = sanitizeInput($input['supplier'] ?? '');
            $expiryDate = $input['expiryDate'] ?? null;
            
            $stmt = $pdo->prepare("UPDATE medications SET name = ?, description = ?, category = ?, unit_price = ?, stock_quantity = ?, min_stock_level = ?, supplier = ?, expiry_date = ?, updated_at = NOW() WHERE id = ?");
            $result = $stmt->execute([$name, $description, $category, $unitPrice, $stockQuantity, $minStockLevel, $supplier, $expiryDate, $id]);
            
            echo json_encode([
                'success' => $result,
                'message' => $result ? 'Médicament mis à jour' : 'Erreur lors de la mise à jour'
            ]);
            break;

        case 'DELETE':
            // Supprimer (désactiver) un médicament
            $id = sanitizeInput($input['id']);
            
            $stmt = $pdo->prepare("UPDATE medications SET is_active = 0, updated_at = NOW() WHERE id = ?");
            $result = $stmt->execute([$id]);
            
            echo json_encode([
                'success' => $result,
                'message' => $result ? 'Médicament supprimé' : 'Erreur lors de la suppression'
            ]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Méthode non autorisée']);
            break;
    }

} catch (Exception $e) {
    error_log("Erreur API medications LWS: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}
?>
