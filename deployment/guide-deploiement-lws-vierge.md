
# Guide de Déploiement LWS - Système Vierge

## 📋 Système Complètement Vierge

### Caractéristiques
- **AUCUNE donnée par défaut**
- **AUCUN compte utilisateur pré-créé**
- **Base de données vierge**
- Configuration initiale via l'interface web

### Hébergement LWS
- Serveur Web avec PHP 7.4+ et MySQL
- Base de données : `afric2012609_225kcxe`
- Utilisateur : `afric2012609`
- Mot de passe : `Dounia@2025`

## 🚀 Étapes de Déploiement

### 1. Préparation de la Base de Données

1. **Connectez-vous à phpMyAdmin** via votre panel LWS
2. **Sélectionnez la base** `afric2012609_225kcxe`
3. **Importez le schéma vierge** : `deployment/lws-schema-vierge.sql`
4. **Vérifiez l'import** : Les tables doivent être créées SANS aucune donnée

### 2. Upload des Fichiers

1. **Uploadez le contenu de `build-lws-vierge/`** vers `public_html/`
2. **Uploadez le dossier `api/`** vers `public_html/api/`
3. **Vérifiez les permissions** : 644 pour les fichiers PHP

### 3. Première Utilisation

#### Accès Initial
```
https://votre-domaine.com
```

#### Configuration Automatique
1. **L'écran de configuration** apparaît automatiquement
2. **Aucun compte existant** - système complètement vierge
3. **Créez votre premier compte administrateur** :
   - Nom complet
   - Adresse email
   - Nom d'utilisateur
   - Mot de passe (minimum 6 caractères)

#### Processus de Configuration
- **Étape 1** : Création du compte administrateur
- **Étape 2** : Confirmation et accès au système

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
  "users_count": 0
}
```

#### Test Application
```
https://votre-domaine.com
```
- L'écran de configuration initiale doit apparaître
- Aucun compte existant

## 🔧 Configuration Post-Déploiement

### Après Création du Premier Admin

1. **Connectez-vous** avec vos identifiants
2. **Configurez vos données de base** :
   - Ajoutez vos médicaments
   - Créez vos types d'examens
   - Définissez vos catégories de dépenses
3. **Créez des comptes** pour vos caissiers
4. **Testez une vente** pour valider le système

### Données de Base Recommandées

#### Médicaments Courants
- Paracétamol, Aspirine, Amoxicilline
- Définir prix, stock, fournisseurs

#### Types d'Examens
- Consultation générale
- Prise de tension
- Test de glycémie
- Vaccinations

#### Catégories de Dépenses
- Achat médicaments
- Fournitures bureau
- Électricité/Eau
- Maintenance équipements

## 📊 Fonctionnalités Incluses

### ✅ Modules Disponibles
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

### Écran de Configuration ne s'Affiche Pas
1. Vérifiez que la base de données est vierge (aucun utilisateur)
2. Assurez-vous que le schéma vierge a été importé
3. Testez l'API utilisateurs : `/api/users-lws.php`

## 📈 Avantages du Système Vierge

### ✅ Avantages
- **Sécurité maximale** : Aucun compte par défaut
- **Personnalisation complète** : Configurez selon vos besoins
- **Démarrage propre** : Aucune donnée parasite
- **Contrôle total** : Vous créez tout vous-même

### ⚠️ À Retenir
- **Sauvegardez vos identifiants** de premier admin
- **Notez vos paramètres** de configuration
- **Testez immédiatement** après configuration
- **Créez une sauvegarde** après configuration

## 📞 Support

En cas de problème :
1. Consultez les logs d'erreurs LWS
2. Vérifiez que la base est complètement vierge
3. Réimportez le schéma si nécessaire
4. Contactez le support LWS si nécessaire

---

## 🎯 Version Déployée : 1.0.0 VIERGE
**Date :** 2025-06-08  
**Statut :** Production Ready - Système Vierge  
**Environnement :** LWS MySQL - Configuration Initiale
