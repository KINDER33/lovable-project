
<?php
require_once 'config-lws.php';

try {
    $pdo = getDBConnection();
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);

    switch ($method) {
        case 'GET':
            // Récupérer tous les utilisateurs
            $stmt = $pdo->query("SELECT id, username, email, full_name, role, is_active, created_at FROM users WHERE is_active = 1 ORDER BY created_at DESC");
            $users = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'data' => $users
            ]);
            break;

        case 'POST':
            if (isset($input['action']) && $input['action'] === 'login') {
                // Authentification
                $username = sanitizeInput($input['username']);
                $password = $input['password'];
                
                $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? AND is_active = 1");
                $stmt->execute([$username]);
                $user = $stmt->fetch();
                
                if ($user && password_verify($password, $user['password_hash'])) {
                    echo json_encode([
                        'success' => true,
                        'user' => [
                            'id' => $user['id'],
                            'username' => $user['username'],
                            'email' => $user['email'],
                            'full_name' => $user['full_name'],
                            'role' => $user['role']
                        ]
                    ]);
                } else {
                    echo json_encode([
                        'success' => false,
                        'error' => 'Nom d\'utilisateur ou mot de passe incorrect'
                    ]);
                }
            } else {
                // Créer un nouvel utilisateur
                $id = generateUUID();
                $username = sanitizeInput($input['username']);
                $email = sanitizeInput($input['email']);
                $fullName = sanitizeInput($input['fullName']);
                $role = sanitizeInput($input['role'] ?? 'caissier');
                $passwordHash = password_hash($input['password'], PASSWORD_DEFAULT);
                
                $stmt = $pdo->prepare("INSERT INTO users (id, username, email, full_name, role, password_hash) VALUES (?, ?, ?, ?, ?, ?)");
                $result = $stmt->execute([$id, $username, $email, $fullName, $role, $passwordHash]);
                
                if ($result) {
                    echo json_encode([
                        'success' => true,
                        'message' => 'Utilisateur créé avec succès'
                    ]);
                } else {
                    echo json_encode([
                        'success' => false,
                        'error' => 'Erreur lors de la création de l\'utilisateur'
                    ]);
                }
            }
            break;

        case 'PUT':
            // Mettre à jour un utilisateur
            $id = sanitizeInput($input['id']);
            $username = sanitizeInput($input['username']);
            $email = sanitizeInput($input['email']);
            $fullName = sanitizeInput($input['fullName']);
            $role = sanitizeInput($input['role']);
            
            $sql = "UPDATE users SET username = ?, email = ?, full_name = ?, role = ?, updated_at = NOW() WHERE id = ?";
            $params = [$username, $email, $fullName, $role, $id];
            
            if (!empty($input['password'])) {
                $sql = "UPDATE users SET username = ?, email = ?, full_name = ?, role = ?, password_hash = ?, updated_at = NOW() WHERE id = ?";
                $params = [$username, $email, $fullName, $role, password_hash($input['password'], PASSWORD_DEFAULT), $id];
            }
            
            $stmt = $pdo->prepare($sql);
            $result = $stmt->execute($params);
            
            echo json_encode([
                'success' => $result,
                'message' => $result ? 'Utilisateur mis à jour' : 'Erreur lors de la mise à jour'
            ]);
            break;

        case 'DELETE':
            // Supprimer (désactiver) un utilisateur
            $id = sanitizeInput($input['id']);
            
            $stmt = $pdo->prepare("UPDATE users SET is_active = 0, updated_at = NOW() WHERE id = ?");
            $result = $stmt->execute([$id]);
            
            echo json_encode([
                'success' => $result,
                'message' => $result ? 'Utilisateur supprimé' : 'Erreur lors de la suppression'
            ]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Méthode non autorisée']);
            break;
    }

} catch (Exception $e) {
    error_log("Erreur API users LWS: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}
?>
