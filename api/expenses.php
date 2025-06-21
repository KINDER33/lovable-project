
<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

switch ($method) {
    case 'GET':
        try {
            $sql = "SELECT * FROM expenses WHERE is_cancelled = 0 ORDER BY expense_date DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $expenses = $stmt->fetchAll();
            
            echo json_encode($expenses);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'POST':
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $sql = "INSERT INTO expenses (id, expense_category_id, category_name, amount, description, supplier, receipt_number, expense_date, is_cancelled) 
                    VALUES (:id, :expense_category_id, :category_name, :amount, :description, :supplier, :receipt_number, NOW(), 0)";
            
            $expenseId = generateUUID();
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'id' => $expenseId,
                'expense_category_id' => $input['expense_category_id'] ?? null,
                'category_name' => $input['category_name'],
                'amount' => $input['amount'],
                'description' => $input['description'] ?? '',
                'supplier' => $input['supplier'] ?? '',
                'receipt_number' => $input['receipt_number'] ?? ''
            ]);
            
            echo json_encode(['success' => true, 'id' => $expenseId, 'message' => 'Dépense enregistrée']);
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
