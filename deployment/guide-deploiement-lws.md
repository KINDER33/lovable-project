
# Guide de Déploiement LWS - Caisse Médicale

## 📋 Prérequis LWS

### Hébergement LWS
- Plan d'hébergement avec support PHP 7.4+ et MySQL
- Accès au panneau de contrôle LWS
- Accès à phpMyAdmin
- Base de données MySQL créée

### Informations Nécessaires
- Nom de la base de données
- Utilisateur MySQL
- Mot de passe MySQL
- Hôte de la base (généralement localhost)

## 🚀 Étapes de Déploiement

### 1. Préparation de la Base de Données

1. **Connectez-vous au panneau LWS**
2. **Créez une base de données MySQL** :
   - Nom : `votre_nom_caisse_medicale`
   - Utilisateur : `votre_utilisateur`
   - Mot de passe : `votre_mot_de_passe`
3. **Notez les informations de connexion**

### 2. Configuration des Fichiers API

Créez le fichier de configuration pour LWS :

```php
<?php
// api/config-lws.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Configuration base de données LWS
$config = [
    'host' => 'localhost', // ou votre host LWS
    'database' => 'votre_nom_base',
    'username' => 'votre_utilisateur',
    'password' => 'votre_mot_de_passe',
    'charset' => 'utf8mb4'
];

try {
    $pdo = new PDO(
        "mysql:host={$config['host']};dbname={$config['database']};charset={$config['charset']}",
        $config['username'],
        $config['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
    
    echo json_encode([
        'success' => true,
        'message' => 'Configuration LWS OK',
        'database' => $config['database'],
        'host' => $config['host']
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Erreur de connexion : ' . $e->getMessage()
    ]);
}
?>
```

### 3. Build et Upload

1. **Build local de l'application** :
```bash
npm install
npm run build
```

2. **Upload des fichiers** :
   - Uploadez le contenu du dossier `dist/` vers `public_html/`
   - Uploadez les fichiers API PHP vers `public_html/api/`
   - Assurez-vous que les permissions sont correctes (644 pour les fichiers)

### 3. Importation du Schéma de Base

1. **Accédez à phpMyAdmin** depuis votre panneau LWS
2. **Sélectionnez votre base de données**
3. **Importez le fichier SQL** fourni avec le projet
4. **Vérifiez que toutes les tables sont créées** :
   - users
   - medications
   - exam_types
   - expense_categories
   - sales, sale_items, exams, expenses

### 4. Configuration de l'Application

1. **Accédez à votre site** : `https://votre-domaine.com`
2. **L'écran de configuration apparaît**
3. **Sélectionnez "MySQL"** comme type de base
4. **Entrez vos paramètres de connexion** :
   - Hôte : `localhost`
   - Port : `3306`
   - Base : `votre_nom_base`
   - Utilisateur : `votre_utilisateur`
   - Mot de passe : `votre_mot_de_passe`
5. **Testez la connexion**
6. **Créez votre compte administrateur**

### 5. Tests de Validation

- ✅ Application accessible via votre domaine
- ✅ Connexion à la base de données fonctionnelle
- ✅ Création de compte administrateur réussie
- ✅ Interface de connexion opérationnelle

## 🔧 Dépannage LWS

### Erreur 500
- Vérifiez les logs d'erreurs dans le panneau LWS
- Assurez-vous que les paramètres de connexion sont corrects
- Vérifiez les permissions des fichiers

### Base de données inaccessible
- Vérifiez les paramètres de connexion
- Assurez-vous que la base existe
- Contactez le support LWS si nécessaire

---

**Version LWS** - Déploiement Production
