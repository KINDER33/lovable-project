
# 🏥 Installation Caisse Médicale - WAMP

## 🚀 Installation Ultra-Rapide

### 1. Prérequis (à installer une seule fois)
- **WAMP Server** : https://www.wampserver.com/
- **Node.js** : https://nodejs.org/

### 2. Déploiement (3 commandes)
```bash
# 1. Installer les dépendances
npm install

# 2. Construire l'application
npm run build

# 3. Déployer automatiquement
scripts\deploy-wamp.bat
```

### 3. Configuration Base de Données
1. **Démarrer WAMP** (icône verte)
2. **Créer la base** : http://localhost/phpmyadmin
   - Nouvelle base : `caisse_medicale`
   - Importer : `C:\wamp64\www\caisse-medicale\database-schema.sql`
3. **Accéder à l'app** : http://localhost/caisse-medicale
4. **Configurer** dans l'interface :
   - Hôte: `localhost`
   - Base: `caisse_medicale`
   - Utilisateur: `root`
   - Mot de passe: (vide)

## ✅ C'est prêt !

L'application fonctionne maintenant en mode production local.

## 📁 Structure finale
```
C:\wamp64\www\caisse-medicale\
├── index.html          # Application
├── assets/            # Ressources
├── api/               # Backend PHP
└── database-schema.sql # Base de données
```

## 🎯 Accès
- **Application** : http://localhost/caisse-medicale
- **phpMyAdmin** : http://localhost/phpmyadmin
- **WAMP** : http://localhost

---
**Version Production** - Prêt pour utilisation en centre médical
