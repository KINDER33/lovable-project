
<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

switch ($method) {
    case 'GET':
        try {
            $today = date('Y-m-d');
            $sql = "SELECT s.*, GROUP_CONCAT(si.item_name, ' (', si.quantity, ')' SEPARATOR ', ') as items 
                    FROM sales s 
                    LEFT JOIN sale_items si ON s.id = si.sale_id 
                    WHERE DATE(s.sale_date) = :today AND s.is_cancelled = 0 
                    GROUP BY s.id 
                    ORDER BY s.sale_date DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['today' => $today]);
            $sales = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'data' => $sales
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;

    case 'POST':
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $pdo->beginTransaction();
            
            // Générer le numéro de facture
            $invoiceResponse = file_get_contents('http://localhost/caisse-medicale/api/generate-invoice-number.php');
            $invoiceData = json_decode($invoiceResponse, true);
            $invoiceNumber = $invoiceData['invoice_number'];
            
            // Insérer la vente
            $sql = "INSERT INTO sales (id, invoice_number, customer_name, total_amount, payment_method, cashier_name, sale_date, is_cancelled) 
                    VALUES (:id, :invoice_number, :customer_name, :total_amount, :payment_method, :cashier_name, NOW(), 0)";
            
            $saleId = generateUUID();
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'id' => $saleId,
                'invoice_number' => $invoiceNumber,
                'customer_name' => $input['customer_name'] ?? 'Client',
                'total_amount' => $input['total_amount'],
                'payment_method' => $input['payment_method'] ?? 'cash',
                'cashier_name' => $input['cashier_name'] ?? 'Caissier'
            ]);
            
            // Insérer les articles de vente
            if (!empty($input['items'])) {
                foreach ($input['items'] as $item) {
                    $itemSql = "INSERT INTO sale_items (id, sale_id, item_type, item_id, item_name, quantity, unit_price, total_price) 
                               VALUES (:id, :sale_id, :item_type, :item_id, :item_name, :quantity, :unit_price, :total_price)";
                    $itemStmt = $pdo->prepare($itemSql);
                    $itemStmt->execute([
                        'id' => generateUUID(),
                        'sale_id' => $saleId,
                        'item_type' => $item['type'],
                        'item_id' => $item['id'],
                        'item_name' => $item['name'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['price'],
                        'total_price' => $item['price'] * $item['quantity']
                    ]);
                    
                    // Mettre à jour le stock pour les médicaments
                    if ($item['type'] === 'medication') {
                        $updateStockSql = "UPDATE medications SET stock_quantity = stock_quantity - :quantity WHERE id = :id";
                        $updateStockStmt = $pdo->prepare($updateStockSql);
                        $updateStockStmt->execute([
                            'quantity' => $item['quantity'],
                            'id' => $item['id']
                        ]);
                    }
                }
            }
            
            $pdo->commit();
            echo json_encode([
                'success' => true, 
                'id' => $saleId, 
                'invoice_number' => $invoiceNumber,
                'message' => 'Vente enregistrée avec succès'
            ]);
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Méthode non autorisée']);
}
?>
