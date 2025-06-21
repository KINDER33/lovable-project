
# Guide de Déploiement WAMP - Caisse Médicale

## 🚀 Configuration pour Serveur Local WAMP

### Prérequis
- WAMP Server installé et configuré
- Base de données MySQL/PostgreSQL active
- PHP 8.0+ recommandé
- Accès administrateur au serveur

### 1. Installation Automatique

#### Exécuter le script de déploiement
```batch
# Dans le dossier du projet
scripts\deploy-wamp.bat
```

### 2. Configuration Manuelle (si nécessaire)

#### A. Copier les fichiers
```bash
# Construire le projet
npm run build

# Copier vers WAMP
xcopy /E /Y dist\* "C:\wamp64\www\caisse-medicale\"
xcopy /E /Y api\* "C:\wamp64\www\caisse-medicale\api\"
```

#### B. Configurer la base de données
1. Ouvrir phpMyAdmin : `http://localhost/phpmyadmin`
2. Créer une base `caisse_medicale`
3. Importer le fichier `database-schema.sql`

### 3. Accès à l'application

L'application sera disponible à :
- `http://localhost/caisse-medicale/`

### 4. Comptes par défaut

#### Administrateur
- **Utilisateur** : `admin`
- **Mot de passe** : `admin123`

#### Caissier
- **Utilisateur** : `caissier`
- **Mot de passe** : `caissier`

### 5. Fonctionnalités Principales

✅ **Ventes et Factures**
- Vente de médicaments
- Enregistrement d'examens
- Génération automatique de factures
- Impression optimisée

✅ **Gestion Stock**
- Suivi des médicaments
- Alertes de stock bas
- Mise à jour automatique lors des ventes

✅ **Rapports**
- Ventes quotidiennes
- Statistiques financières
- Historique des transactions

✅ **Configuration**
- Paramètres du centre médical
- Gestion des utilisateurs (admin)
- Sauvegarde et restauration

### 6. Support et Maintenance

- **Sauvegardes** : Automatiques quotidiennes
- **Logs** : Disponibles dans `C:\wamp64\logs\`
- **Mises à jour** : Via le système intégré

---

## 🎯 Version Production Prête

Cette version est optimisée pour un fonctionnement local stable avec WAMP Server, sans dépendances externes.
