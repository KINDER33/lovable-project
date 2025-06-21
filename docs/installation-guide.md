
# Guide d'Installation - Logiciel de Gestion de Caisse Médical

## Prérequis Système

### Option 1: Installation avec XAMPP (Recommandée)
- **XAMPP** (Apache + MySQL + PHP)
- **Node.js** version 18 ou supérieure
- **Navigateur web moderne** (Chrome, Firefox, Edge)

### Option 2: Installation avec WAMP
- **WAMP Server** (Windows Apache MySQL PHP)
- **Node.js** version 18 ou supérieure

### Option 3: Installation avec Docker
- **Docker Desktop**
- **Docker Compose**

## Installation Étape par Étape

### 🚀 Option 1: Installation avec XAMPP

#### 1. Installation de XAMPP
1. Téléchargez XAMPP depuis [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. Installez XAMPP dans `C:\xampp` (Windows) ou `/Applications/XAMPP` (Mac)
3. Démarrez le panneau de contrôle XAMPP
4. Lancez les services **Apache** et **MySQL**

#### 2. Configuration de la Base de Données
1. Ouvrez votre navigateur et allez sur `http://localhost/phpmyadmin`
2. Créez une nouvelle base de données nommée `medical_cashier`
3. Sélectionnez la base de données créée
4. Cliquez sur l'onglet **SQL**
5. Copiez le contenu du fichier `docs/production-database.sql`
6. Collez-le dans l'éditeur SQL et cliquez sur **Exécuter**

#### 3. Installation du Frontend
1. Ouvrez un terminal/invite de commande
2. Naviguez vers le dossier du projet
3. Exécutez les commandes suivantes :

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Démarrer l'application en mode développement
npm run dev
```

#### 4. Configuration des Variables d'Environnement
Éditez le fichier `.env.local` avec vos paramètres :

```env
# Configuration Supabase (si utilisé)
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_supabase

# Configuration locale (si MySQL local)
VITE_DATABASE_URL=mysql://root:@localhost:3306/medical_cashier
```

### 🐳 Option 2: Installation avec Docker

#### 1. Préparer Docker
1. Installez Docker Desktop
2. Créez un fichier `docker-compose.yml` :

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    container_name: medical_cashier_db
    environment:
      MYSQL_ROOT_PASSWORD: medical123
      MYSQL_DATABASE: medical_cashier
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./docs/production-database.sql:/docker-entrypoint-initdb.d/init.sql

  frontend:
    build: .
    container_name: medical_cashier_app
    ports:
      - "3000:3000"
    depends_on:
      - mysql
    environment:
      - VITE_DATABASE_URL=mysql://root:medical123@mysql:3306/medical_cashier

volumes:
  mysql_data:
```

#### 2. Lancer l'Application
```bash
# Construire et démarrer les conteneurs
docker-compose up -d

# Vérifier que tout fonctionne
docker-compose ps
```

L'application sera accessible sur `http://localhost:3000`

## Configuration Post-Installation

### 1. Premier Démarrage
1. Ouvrez votre navigateur et allez sur `http://localhost:3000`
2. Vous devriez voir l'interface de gestion de caisse
3. Allez dans **Paramètres** > **Centre Médical** pour configurer vos informations

### 2. Configuration du Centre Médical
- **Nom du centre** : Votre nom d'établissement
- **Adresse** : Adresse complète
- **Téléphone** : Numéro de contact
- **Email** : Email de contact

### 3. Ajout des Premiers Médicaments
1. Allez dans **Paramètres** > **Médicaments**
2. Cliquez sur **Ajouter un médicament**
3. Remplissez les informations (nom, prix, stock, etc.)

### 4. Configuration des Examens
1. Allez dans **Paramètres** > **Types d'Examens**
2. Modifiez les examens par défaut selon vos besoins
3. Ajoutez vos examens spécifiques

## Utilisation Quotidienne

### Module de Ventes
- **Ajouter des médicaments** au panier
- **Enregistrer des examens**
- **Générer des factures** automatiquement
- **Gérer les paiements** (espèces, carte, etc.)

### Gestion des Stocks
- **Surveiller les stocks faibles**
- **Ajouter de nouveaux médicaments**
- **Mettre à jour les quantités**

### Rapports et Comptabilité
- **Rapport quotidien** des ventes
- **Historique des transactions**
- **Gestion des dépenses**

## Dépannage

### Problèmes Courants

#### Base de données non accessible
- Vérifiez que MySQL est démarré dans XAMPP
- Vérifiez les paramètres de connexion dans `.env.local`

#### Page blanche au démarrage
- Vérifiez les logs dans la console du navigateur (F12)
- Vérifiez que Node.js est installé et fonctionnel

#### Erreurs de permissions
- Sur Windows : Lancez XAMPP en tant qu'administrateur
- Sur Mac/Linux : Vérifiez les permissions des dossiers

### Support Technique
Pour toute assistance technique :
1. Vérifiez les logs d'erreur
2. Consultez la documentation technique
3. Contactez le support développeur

## Sauvegarde et Maintenance

### Sauvegarde Quotidienne
```bash
# Sauvegarde de la base de données
mysqldump -u root -p medical_cashier > backup_$(date +%Y%m%d).sql
```

### Mise à Jour
```bash
# Mettre à jour l'application
git pull origin main
npm install
npm run build
```

---

**Version du logiciel** : 1.0.0 Production  
**Date de création** : 2025  
**Développé pour** : Centres médicaux et pharmacies
