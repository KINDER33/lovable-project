
# 🚀 Guide de Déploiement WAMP - Simple et Rapide

## 📋 Prérequis (Une seule fois)
1. **WAMP Server installé** (télécharger sur www.wampserver.com)
2. **Node.js installé** (télécharger sur nodejs.org)

## 🎯 Déploiement Automatique (3 étapes)

### Étape 1: Exécuter le script de déploiement
```bash
# Double-cliquez sur ce fichier ou exécutez:
scripts\deploy-wamp.bat
```

### Étape 2: Configurer la base de données
1. **Démarrez WAMP** (icône verte dans la barre des tâches)
2. **Ouvrez phpMyAdmin** : http://localhost/phpmyadmin
3. **Créez une nouvelle base** : `caisse_medicale`
4. **Importez le schéma** : Utilisez le fichier `database-schema.sql` dans `C:\wamp64\www\caisse-medicale\`

### Étape 3: Lancer l'application
1. **Accédez à** : http://localhost/caisse-medicale
2. **Configurez la connexion** dans l'interface :
   - Hôte: `localhost`
   - Port: `3306`
   - Base: `caisse_medicale`
   - Utilisateur: `root`
   - Mot de passe: (laisser vide)
   - URL API: `http://localhost/caisse-medicale/api`

## ✅ C'est tout !

L'application est maintenant prête à être utilisée en production locale.

## 🔧 Structure des fichiers déployés
```
C:\wamp64\www\caisse-medicale\
├── index.html              # Interface principale
├── assets/                 # CSS, JS, images
├── api/                    # Scripts PHP pour la base
├── database-schema.sql     # Schéma de la base
└── .htaccess              # Configuration Apache
```

## 📞 En cas de problème
1. **WAMP pas démarré** → Icône rouge/orange = vérifier les services
2. **Page blanche** → Vérifier que `index.html` existe dans le dossier
3. **Erreur de base** → Vérifier que MySQL est démarré et la base créée
4. **API non accessible** → Vérifier que le dossier `api/` contient les fichiers PHP

## 🎉 Fonctionnalités disponibles
- ✅ Interface tactile optimisée
- ✅ Gestion des médicaments et stocks
- ✅ Enregistrement des examens
- ✅ Génération automatique de factures
- ✅ Rapports financiers
- ✅ Sauvegarde automatique
- ✅ Fonctionnement 100% local (pas d'internet requis)
