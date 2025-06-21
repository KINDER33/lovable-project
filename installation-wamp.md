
# Guide d'Installation Complet - WAMP Local

## 🚀 Installation Étape par Étape

### 1. Prérequis
- WAMP Server installé et fonctionnel
- Navigateur web moderne

### 2. Installation de la Base de Données
1. Ouvrez phpMyAdmin : `http://localhost/phpmyadmin`
2. Créez une nouvelle base de données : `caisse_medicale`
3. Importez le fichier `database-schema.sql`

### 3. Installation des Fichiers
1. Copiez tous les fichiers dans : `C:\wamp64\www\caisse-medicale\`
2. Assurez-vous que le dossier `api/` est présent

### 4. Configuration
- Les fichiers de configuration sont automatiquement configurés pour WAMP
- Aucune modification nécessaire

### 5. Accès
URL : `http://localhost/caisse-medicale/`

## ✅ Vérifications
- WAMP Server démarré (icône verte)
- MySQL service actif
- Apache service actif
- Base de données créée

## 🔧 Dépannage
Si problème de connexion :
1. Vérifiez que WAMP est démarré
2. Vérifiez que MySQL fonctionne
3. Vérifiez les permissions des dossiers

## 📞 Support
Système conçu pour fonctionner hors ligne avec MySQL local.
