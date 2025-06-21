
<?php
require_once 'config-lws.php';

try {
    $pdo = getDBConnection();
    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'GET':
            $today = date('Y-m-d');
            $sql = "SELECT s.*, 
                           GROUP_CONCAT(CONCAT(si.item_name, ' (', si.quantity, ')') SEPARATOR ', ') as items,
                           COUNT(si.id) as items_count
                    FROM sales s 
                    LEFT JOIN sale_items si ON s.id = si.sale_id 
                    WHERE DATE(s.sale_date) = :today AND s.is_cancelled = 0 
                    GROUP BY s.id 
                    ORDER BY s.sale_date DESC 
                    LIMIT 100";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['today' => $today]);
            $sales = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'data' => $sales
            ]);
            break;

        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                throw new Exception('Données invalides');
            }
            
            $pdo->beginTransaction();
            
            // Générer le numéro de facture
            $stmt = $pdo->prepare("SELECT invoice_number FROM sales WHERE invoice_number REGEXP '^F[0-9]+$' ORDER BY CAST(SUBSTRING(invoice_number, 2) AS UNSIGNED) DESC LIMIT 1");
            $stmt->execute();
            $lastInvoice = $stmt->fetchColumn();
            
            $nextNumber = 1;
            if ($lastInvoice) {
                $lastNumber = intval(substr($lastInvoice, 1));
                $nextNumber = $lastNumber + 1;
            }
            
            $invoiceNumber = 'F' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
            
            // Données nettoyées
            $customerName = sanitizeInput($input['customer_name'] ?? 'Client');
            $totalAmount = floatval($input['total_amount'] ?? 0);
            $paymentMethod = sanitizeInput($input['payment_method'] ?? 'cash');
            $cashierName = sanitizeInput($input['cashier_name'] ?? 'Caissier');
            $notes = sanitizeInput($input['notes'] ?? '');
            
            // Insérer la vente
            $saleId = generateUUID();
            $sql = "INSERT INTO sales (id, invoice_number, customer_name, total_amount, payment_method, cashier_name, notes, sale_date, is_cancelled) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 0)";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $saleId,
                $invoiceNumber,
                $customerName,
                $totalAmount,
                $paymentMethod,
                $cashierName,
                $notes
            ]);
            
            // Insérer les articles de vente
            if (!empty($input['items']) && is_array($input['items'])) {
                foreach ($input['items'] as $item) {
                    $itemSql = "INSERT INTO sale_items (id, sale_id, item_type, item_id, item_name, quantity, unit_price, total_price) 
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    
                    $itemStmt = $pdo->prepare($itemSql);
                    $itemStmt->execute([
                        generateUUID(),
                        $saleId,
                        sanitizeInput($item['type'] ?? 'medication'),
                        sanitizeInput($item['id'] ?? ''),
                        sanitizeInput($item['name'] ?? ''),
                        intval($item['quantity'] ?? 1),
                        floatval($item['price'] ?? 0),
                        floatval(($item['price'] ?? 0) * ($item['quantity'] ?? 1))
                    ]);
                    
                    // Mettre à jour le stock pour les médicaments
                    if (($item['type'] ?? '') === 'medication' && !empty($item['id'])) {
                        $updateStockSql = "UPDATE medications SET 
                                          stock_quantity = GREATEST(0, stock_quantity - ?),
                                          updated_at = NOW() 
                                          WHERE id = ?";
                        $updateStockStmt = $pdo->prepare($updateStockSql);
                        $updateStockStmt->execute([
                            intval($item['quantity'] ?? 1),
                            sanitizeInput($item['id'])
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
            break;

        default:
            throw new Exception('Méthode non autorisée');
    }

} catch (Exception $e) {
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("Erreur sales-lws.php: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
