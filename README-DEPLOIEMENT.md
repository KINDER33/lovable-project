
# 🏥 Système de Gestion de Caisse Médicale

## 🚀 Installation et Déploiement

### Prérequis
- Base de données : MySQL 5.7+ ou PostgreSQL 12+
- Navigateur web moderne
- Connexion internet

### 📦 Fichiers Importants

#### Scripts de Base de Données
- `deployment/mysql-schema.sql` - Pour hébergement LWS/cPanel
- `deployment/local-schema.sql` - Pour installation locale PostgreSQL

#### Comptes par Défaut
- **Admin** : `admin` / `admin123`
- **Email** : `admin@caisse-medicale.com`

### 🎯 Installation Rapide

#### Pour LWS (Hébergement)
1. Importez `deployment/mysql-schema.sql` dans phpMyAdmin
2. Uploadez les fichiers du projet
3. Accédez à votre domaine

#### Pour Local
1. Installez PostgreSQL
2. Exécutez `deployment/local-schema.sql`
3. Lancez l'application

#### Pour Lovable
1. Cliquez "Publish"
2. Base Supabase automatiquement configurée

### ✅ Système Complet
- 🏪 Module de ventes
- 💊 Gestion médicaments
- 🩺 Examens médicaux  
- 🧾 Facturation automatique
- 📊 Rapports et statistiques
- 👥 Gestion utilisateurs (Admin/Gestionnaire/Caissier)

### 📞 Support
Système professionnel prêt pour production !
