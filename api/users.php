
<?php
require_once 'config.php';

try {
    $pdo = getDBConnection();
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);

    switch ($method) {
        case 'GET':
            // Récupérer tous les utilisateurs
            $stmt = $pdo->prepare("SELECT id, username, email, full_name, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC");
            $stmt->execute();
            $users = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'data' => $users
            ]);
            break;

        case 'POST':
            if (isset($input['action']) && $input['action'] === 'login') {
                // Connexion utilisateur
                $username = $input['username'] ?? '';
                $password = $input['password'] ?? '';
                
                if (empty($username) || empty($password)) {
                    throw new Exception('Nom d\'utilisateur et mot de passe requis');
                }
                
                $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? AND is_active = 1");
                $stmt->execute([$username]);
                $user = $stmt->fetch();
                
                if (!$user) {
                    throw new Exception('Utilisateur non trouvé');
                }
                
                // Vérifier le mot de passe (simple pour la démo - en production, utiliser password_hash)
                $isPasswordValid = ($user['password_hash'] === base64_encode($password)) || 
                                 ($user['password_hash'] === $password);
                
                if (!$isPasswordValid) {
                    throw new Exception('Mot de passe incorrect');
                }
                
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
                // Créer un nouvel utilisateur
                $username = $input['username'] ?? '';
                $email = $input['email'] ?? '';
                $password = $input['password'] ?? '';
                $fullName = $input['fullName'] ?? '';
                $role = $input['role'] ?? 'caissier';
                
                if (empty($username) || empty($email) || empty($password)) {
                    throw new Exception('Tous les champs sont requis');
                }
                
                $passwordHash = base64_encode($password); // Simple pour la démo
                $id = generateUUID();
                
                $stmt = $pdo->prepare("INSERT INTO users (id, username, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([$id, $username, $email, $passwordHash, $fullName, $role]);
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Utilisateur créé avec succès'
                ]);
            }
            break;

        case 'PUT':
            // Mettre à jour un utilisateur
            $id = $input['id'] ?? '';
            $username = $input['username'] ?? '';
            $email = $input['email'] ?? '';
            $fullName = $input['fullName'] ?? '';
            $role = $input['role'] ?? '';
            $isActive = $input['isActive'] ?? true;
            
            if (empty($id)) {
                throw new Exception('ID utilisateur requis');
            }
            
            $stmt = $pdo->prepare("UPDATE users SET username = ?, email = ?, full_name = ?, role = ?, is_active = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([$username, $email, $fullName, $role, $isActive, $id]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Utilisateur mis à jour'
            ]);
            break;

        case 'DELETE':
            // Supprimer un utilisateur
            $id = $input['id'] ?? '';
            
            if (empty($id)) {
                throw new Exception('ID utilisateur requis');
            }
            
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$id]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Utilisateur supprimé'
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
