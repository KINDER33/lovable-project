
<?php
require_once 'config-production.php';

try {
    $pdo = getDBConnection();
    
    // Récupérer le dernier numéro de facture
    $sql = "SELECT invoice_number FROM sales WHERE invoice_number REGEXP '^F[0-9]+$' ORDER BY CAST(SUBSTRING(invoice_number, 2) AS UNSIGNED) DESC LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $lastInvoice = $stmt->fetchColumn();
    
    $nextNumber = 1;
    if ($lastInvoice) {
        $lastNumber = intval(substr($lastInvoice, 1));
        $nextNumber = $lastNumber + 1;
    }
    
    $invoiceNumber = 'F' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    
    echo json_encode([
        'success' => true,
        'invoice_number' => $invoiceNumber
    ]);
    
} catch (Exception $e) {
    error_log("Erreur génération facture: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur lors de la génération du numéro de facture'
    ]);
}
?>
