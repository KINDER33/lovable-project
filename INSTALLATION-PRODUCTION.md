
# 🏥 Guide d'Installation Production - Caisse Médicale

## 🚀 Installation Rapide (3 étapes)

### Prérequis
- **WAMP Server** installé (télécharger sur www.wampserver.com)
- **Node.js 18+** installé (télécharger sur nodejs.org)

### Étape 1: Installation automatique
```bash
# Téléchargez le projet et naviguez dans le dossier
cd caisse-medicale

# Exécutez le script d'installation
scripts\install-production.bat
```

### Étape 2: Configuration base de données
1. **Démarrez WAMP** (icône verte dans la barre des tâches)
2. **Ouvrez phpMyAdmin** : http://localhost/phpmyadmin
3. **Créez une base** : `caisse_medicale`
4. **Importez le schéma** : Fichier `database-schema.sql` fourni

### Étape 3: Premier lancement
1. **Accédez à l'application** : http://localhost/caisse-medicale
2. **Configurez la connexion** :
   - Hôte: `localhost`
   - Port: `3306`
   - Base: `caisse_medicale`
   - Utilisateur: `root`
   - Mot de passe: (laisser vide pour WAMP par défaut)

## ✅ Le système est prêt !

## 📂 Structure finale
```
C:\wamp64\www\caisse-medicale\
├── index.html              # Application principale
├── assets/                 # Ressources (CSS, JS, images)
├── api/                    # Scripts PHP pour la base
├── database-schema.sql     # Schéma de base de données
├── backup/                 # Dossier de sauvegardes
└── config/                 # Configuration
```

## 🔧 Fonctionnalités
- ✅ Interface utilisateur optimisée
- ✅ Gestion complète des stocks
- ✅ Facturation automatique
- ✅ Rapports de ventes
- ✅ Système de sauvegarde
- ✅ Fonctionnement 100% local

## 📞 Support
- Documentation complète incluse
- Système de logs pour le dépannage
- Sauvegarde automatique configurée

---
**Version Production 1.0** - Prêt pour utilisation immédiate
