
# Guide de Déploiement LWS - Version Production

## 📋 Version Complète avec Données

### Caractéristiques
- **Données de base incluses** (médicaments, examens, catégories)
- **Compte administrateur par défaut** : admin / admin123
- **Base de données pré-configurée**
- Prêt à utiliser immédiatement

### Hébergement LWS
- Serveur Web avec PHP 7.4+ et MySQL
- Base de données : `afric2012609_225kcxe`
- Utilisateur : `afric2012609`
- Mot de passe : `Dounia@2025`

## 🚀 Étapes de Déploiement

### 1. Build de l'Application

```bash
# Exécutez le script de build
scripts/build-lws-production.bat
```

### 2. Préparation de la Base de Données

1. **Connectez-vous à phpMyAdmin** via votre panel LWS
2. **Sélectionnez la base** `afric2012609_225kcxe`
3. **Importez le schéma complet** : `deployment/lws-schema-production.sql`
4. **Vérifiez l'import** : Les tables doivent être créées AVEC les données de base

### 3. Upload des Fichiers

1. **Uploadez le contenu de `build-lws-production/`** vers `public_html/`
2. **Uploadez le dossier `api/`** vers `public_html/api/`
3. **Vérifiez les permissions** : 644 pour les fichiers PHP

### 4. Tests de Validation

#### Test de Connexion API
```
https://votre-domaine.com/api/config-lws.php
```
**Résultat attendu :**
```json
{
  "success": true,
  "message": "Configuration LWS opérationnelle",
  "database": "afric2012609_225kcxe",
  "host": "127.0.0.1",
  "users_count": 1
}
```

#### Test Application
```
https://votre-domaine.com
```
- L'application doit se charger
- Page de connexion disponible
- Connexion avec admin / admin123

## 🔧 Configuration Post-Déploiement

### Première Connexion
- **Nom d'utilisateur :** `admin`
- **Mot de passe :** `admin123`
- **Rôle :** Administrateur

⚠️ **IMPORTANT :** Changez ce mot de passe dès la première connexion !

### Données Pré-installées

#### Médicaments de Base
- Paracétamol 500mg (2.50 €, stock: 100)
- Amoxicilline 500mg (5.00 €, stock: 50)
- Aspirine 100mg (1.75 €, stock: 80)
- Oméprazole 20mg (3.25 €, stock: 40)

#### Types d'Examens
- Consultation générale (150.00 €)
- Prise de tension (20.00 €)
- Test de glycémie (30.00 €)
- Vaccination (50.00 €)

#### Catégories de Dépenses
- Achat médicaments
- Fournitures bureau
- Électricité/Eau
- Maintenance équipements

### Utilisation Immédiate

1. **Connectez-vous** avec admin / admin123
2. **Changez le mot de passe** administrateur
3. **Créez des comptes** pour vos caissiers
4. **Commencez les ventes** immédiatement
5. **Ajustez les stocks** selon vos besoins

## 📊 Fonctionnalités Opérationnelles

### ✅ Modules Prêts
- **Gestion des ventes** avec génération automatique de factures
- **Gestion de stock** de médicaments
- **Gestion des examens** médicaux
- **Reporting** quotidien et mensuel
- **Gestion des utilisateurs** (admin/caissier)
- **Gestion des dépenses** avec catégories

### ✅ Sécurité
- Authentification sécurisée
- Protection contre l'injection SQL
- Validation des données
- Gestion des sessions
- Système de rôles (admin/caissier)

### ✅ Performance
- Base de données optimisée avec index
- API REST efficace
- Interface responsive
- Génération automatique des numéros de facture

## 🔍 Dépannage

### Erreur 500
1. Vérifiez les logs d'erreurs dans le panel LWS
2. Assurez-vous que les paramètres de connexion sont corrects
3. Vérifiez les permissions des fichiers (644)

### Erreur de Connexion MySQL
1. Testez `https://votre-domaine.com/api/config-lws.php`
2. Vérifiez les paramètres dans `config-lws.php`
3. Assurez-vous que la base existe et est accessible

### Interface ne se Charge Pas
1. Vérifiez que `index.html` est à la racine
2. Assurez-vous que les assets sont uploadés
3. Vérifiez la console du navigateur pour les erreurs

### Problème de Connexion Admin
1. Vérifiez que la table `users` contient l'admin
2. Utilisez : admin / admin123
3. Réimportez le schéma si nécessaire

## 📈 Avantages Version Production

### ✅ Avantages
- **Démarrage immédiat** : Données pré-configurées
- **Aucune configuration** : Prêt à l'emploi
- **Données réalistes** : Médicaments et examens courants
- **Formation facilitée** : Données d'exemple incluses

### ⚠️ À Retenir
- **Changez le mot de passe admin** immédiatement
- **Adaptez les prix** à votre contexte local
- **Ajustez les stocks** selon vos besoins
- **Créez une sauvegarde** après personnalisation

## 📞 Support

En cas de problème :
1. Consultez les logs d'erreurs LWS
2. Vérifiez la documentation technique
3. Contactez le support LWS si nécessaire

---

## 🎯 Version Déployée : 1.0.0 PRODUCTION
**Date :** 2025-06-08  
**Statut :** Production Ready - Données Incluses  
**Environnement :** LWS MySQL - Prêt à l'emploi
