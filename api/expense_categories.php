
<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

switch ($method) {
    case 'GET':
        try {
            $sql = "SELECT * FROM expense_categories WHERE is_active = 1 ORDER BY name";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $categories = $stmt->fetchAll();
            
            echo json_encode($categories);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'POST':
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $sql = "INSERT INTO expense_categories (id, name, description, is_active, created_at) 
                    VALUES (:id, :name, :description, 1, NOW())";
            
            $categoryId = generateUUID();
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'id' => $categoryId,
                'name' => $input['name'],
                'description' => $input['description'] ?? ''
            ]);
            
            echo json_encode(['success' => true, 'id' => $categoryId, 'message' => 'Catégorie ajoutée']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'PUT':
        try {
            $pathInfo = $_SERVER['PATH_INFO'] ?? '';
            $id = trim($pathInfo, '/');
            $input = json_decode(file_get_contents('php://input'), true);
            
            $sql = "UPDATE expense_categories SET name = :name, description = :description WHERE id = :id";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'id' => $id,
                'name' => $input['name'],
                'description' => $input['description'] ?? ''
            ]);
            
            echo json_encode(['success' => true, 'message' => 'Catégorie modifiée']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        try {
            $pathInfo = $_SERVER['PATH_INFO'] ?? '';
            $id = trim($pathInfo, '/');
            
            $sql = "UPDATE expense_categories SET is_active = 0 WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['id' => $id]);
            
            echo json_encode(['success' => true, 'message' => 'Catégorie supprimée']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
}
?>
