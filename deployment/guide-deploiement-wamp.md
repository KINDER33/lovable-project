
# Guide de Déploiement WAMP Local - Caisse Médicale

## 📋 Prérequis WAMP

### Logiciels Nécessaires
- **WAMP Server** (Windows Apache MySQL PHP)
- **Node.js** version 18+
- **Navigateur web** moderne

### Téléchargements
- WAMP : [wampserver.com](https://www.wampserver.com/)
- Node.js : [nodejs.org](https://nodejs.org/)

## 🚀 Étapes de Déploiement

### 1. Installation de WAMP

1. **Téléchargez et installez WAMP Server**
2. **Démarrez WAMP** (icône verte dans la barre des tâches)
3. **Vérifiez que les services sont actifs** :
   - Apache : vert
   - MySQL : vert
   - PHP : vert

### 2. Configuration de la Base de Données

1. **Ouvrez phpMyAdmin** : `http://localhost/phpmyadmin`
2. **Créez une nouvelle base** :
   - Nom : `caisse_medicale`
   - Collation : `utf8mb4_general_ci`
3. **Importez le schéma** :
   - Cliquez sur "Importer"
   - Sélectionnez le fichier `database-schema.sql`
   - Exécutez l'importation

### 3. Installation de l'Application

1. **Clonez ou téléchargez le projet** dans le dossier WAMP :
```bash
# Dans le répertoire C:\wamp64\www\
git clone [url-du-projet] caisse-medicale
cd caisse-medicale
```

2. **Installez les dépendances** :
```bash
npm install
```

3. **Build pour la production** :
```bash
npm run build
```

4. **Copiez les fichiers buildés** :
   - Copiez le contenu de `dist/` vers `C:\wamp64\www\caisse-medicale\`
   - Assurez-vous que `index.html` est à la racine

### 4. Configuration des Fichiers API

Créez les fichiers PHP pour l'API locale :

```php
<?php
// api/config-local.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Configuration WAMP par défaut
$config = [
    'host' => 'localhost',
    'database' => 'caisse_medicale',
    'username' => 'root',
    'password' => '', // Vide par défaut sur WAMP
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
        'message' => 'Configuration WAMP OK',
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

### 5. Accès à l'Application

1. **Ouvrez votre navigateur**
2. **Accédez à** : `http://localhost/caisse-medicale/`
3. **Configuration automatique** :
   - Sélectionnez "MySQL"
   - Host : `localhost`
   - Port : `3306`
   - Base : `caisse_medicale`
   - Utilisateur : `root`
   - Mot de passe : (laisser vide)
4. **Créez votre compte administrateur**

### 6. Avantages WAMP Local

- ✅ **Fonctionnement hors ligne** : Pas besoin d'internet
- ✅ **Contrôle total** : Vous gérez tout localement
- ✅ **Performances** : Accès direct aux données
- ✅ **Sécurité** : Données sur votre machine
- ✅ **Pas de coûts** : Hébergement gratuit

## 🔧 Configuration Avancée WAMP

### Personnalisation PHP
Modifiez `C:\wamp64\bin\apache\apache2.x.x\conf\httpd.conf` si nécessaire.

### Sauvegarde Automatique
Créez un script batch pour sauvegarder la base :

```batch
@echo off
set MYSQL_PATH=C:\wamp64\bin\mysql\mysql8.x.x\bin
set BACKUP_PATH=C:\backup\caisse-medicale

%MYSQL_PATH%\mysqldump.exe -u root caisse_medicale > %BACKUP_PATH%\backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.sql
```

### Accès Réseau Local
Pour permettre l'accès depuis d'autres postes du réseau :
1. Modifiez la configuration Apache
2. Autorisez les connexions externes dans le firewall

## 🔧 Dépannage WAMP

### WAMP ne démarre pas
- Vérifiez que les ports 80 et 3306 sont libres
- Arrêtez Skype ou autres applications utilisant le port 80
- Relancez en tant qu'administrateur

### Base de données inaccessible
- Vérifiez que MySQL est démarré (icône verte)
- Assurez-vous que la base `caisse_medicale` existe
- Vérifiez les paramètres de connexion

### Erreur 404
- Assurez-vous que les fichiers sont dans `C:\wamp64\www\caisse-medicale\`
- Vérifiez que Apache est démarré
- Contrôlez l'URL : `http://localhost/caisse-medicale/`

---

**Version WAMP** - Déploiement Local
