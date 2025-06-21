
# 🏥 Installation Locale - Caisse Médicale

## 🚀 Installation Ultra-Rapide (1 clic)

### Prérequis
- **Node.js 18+** installé ([télécharger](https://nodejs.org))
- **Connexion internet** (pour l'installation initiale)

### Installation Automatique

1. **Téléchargez** le projet complet
2. **Ouvrez** une invite de commande dans le dossier
3. **Exécutez** :
   ```bash
   scripts\deploy-local.bat
   ```

🎯 **C'est tout !** L'installation est entièrement automatique.

## 📁 Structure Finale

```
%USERPROFILE%\Desktop\caisse-medicale\
├── index.html              # Application principale
├── assets/                 # Ressources (CSS, JS, images)
├── config/                 # Configuration locale
│   ├── app-config.json     # Paramètres application
│   └── install.log         # Journal d'installation
├── backup/                 # Sauvegardes automatiques
├── logs/                   # Fichiers de log
├── start.bat              # 🚀 Démarrer l'application
├── stop.bat               # ⏹️ Arrêter l'application
└── backup.bat             # 💾 Créer une sauvegarde
```

## 🎮 Utilisation Quotidienne

### Démarrage
- **Double-clic** sur l'icône "Caisse Médicale" (bureau)
- **Ou** exécutez `start.bat` dans le dossier

### Accès
- **URL locale** : http://localhost:3000
- **Ouverture automatique** dans le navigateur

### Arrêt
- **Fermez** l'invite de commande
- **Ou** exécutez `stop.bat`

## 🔧 Configuration Supabase

### 1. Création du projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Notez votre **URL** et **clé anonyme**

### 2. Configuration dans l'application
1. **Démarrez** l'application locale
2. **Première ouverture** → Écran de configuration
3. **Saisissez** vos identifiants Supabase :
   - URL du projet
   - Clé anonyme (anon key)
4. **L'application** créera automatiquement les tables

## 📊 Fonctionnalités Disponibles

### ✅ Modules Complets
- **Gestion Médicaments** : Stock, prix, expiration
- **Types d'Examens** : Tarifs, départements
- **Module Ventes** : Panier, facturation
- **Gestion Dépenses** : Catégories, fournisseurs
- **Rapports** : Ventes, profits, statistiques

### ✅ Fonctionnalités Avancées
- **Interface tactile** optimisée
- **Impression factures** automatique
- **Sauvegarde** automatique quotidienne
- **Mode hors-ligne** partiel
- **Audit trail** complet

## 🛡️ Sécurité & Sauvegardes

### Sauvegardes Automatiques
- **Quotidiennes** : Données critiques
- **Manuelles** : Exécutez `backup.bat`
- **Localisation** : Dossier `backup/`

### Données Sensibles
- **Stockage Supabase** : Chiffré et sécurisé
- **Accès local** uniquement
- **Pas de cloud** non autorisé

## 🔧 Maintenance & Support

### Mise à Jour
1. Téléchargez la nouvelle version
2. Exécutez `backup.bat` (précaution)
3. Remplacez les fichiers
4. Gardez le dossier `config/`

### Dépannage
- **Logs** : Consultez `logs/`
- **Configuration** : Vérifiez `config/app-config.json`
- **Port occupé** : Modifiez dans la configuration

### Support Technique
- **Documentation** : Fichiers `.md` inclus
- **Logs détaillés** : Activés par défaut
- **Restauration** : Utilisez les sauvegardes

## 🎯 Optimisations Performance

### Recommandations Système
- **RAM** : 4GB minimum
- **Stockage** : 1GB libre
- **Processeur** : Dual-core minimum
- **Navigateur** : Chrome/Edge/Firefox récent

### Configuration Réseau
- **Port 3000** : Libre par défaut
- **Localhost uniquement** : Sécurité maximale
- **Pas de proxy** requis

---

## ✅ Checklist Post-Installation

- [ ] Node.js installé et fonctionnel
- [ ] Script `deploy-local.bat` exécuté avec succès
- [ ] Raccourci bureau créé
- [ ] Application accessible sur http://localhost:3000
- [ ] Projet Supabase créé
- [ ] Configuration Supabase dans l'application
- [ ] Test de fonctionnalités de base
- [ ] Première sauvegarde effectuée

**🎉 Votre système de caisse médicale est prêt !**

Support : Consultez les fichiers de documentation inclus.
