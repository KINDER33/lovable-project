
<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

switch ($method) {
    case 'GET':
        try {
            $sql = "SELECT * FROM exams WHERE is_cancelled = 0 ORDER BY exam_date DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $exams = $stmt->fetchAll();
            
            echo json_encode($exams);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'POST':
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $sql = "INSERT INTO exams (id, exam_type_id, patient_name, patient_age, price, notes, exam_date, is_cancelled) 
                    VALUES (:id, :exam_type_id, :patient_name, :patient_age, :price, :notes, NOW(), 0)";
            
            $examId = generateUUID();
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'id' => $examId,
                'exam_type_id' => $input['exam_type_id'] ?? null,
                'patient_name' => $input['patient_name'],
                'patient_age' => $input['patient_age'] ?? '',
                'price' => $input['price'],
                'notes' => $input['notes'] ?? ''
            ]);
            
            echo json_encode(['success' => true, 'id' => $examId, 'message' => 'Examen enregistré']);
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
