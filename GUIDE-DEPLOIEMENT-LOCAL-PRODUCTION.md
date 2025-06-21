# 🚀 Guide de Déploiement Local - Production
# Centre de Santé Solidarité Islamique - MONGO, TCHAD

## 📋 Table des Matières
1. Prérequis Système
2. Installation des Dépendances
3. Configuration Initiale
4. Déploiement de l'Application
5. Configuration de la Base de Données
6. Tests et Validation
7. Procédures de Maintenance
8. Résolution des Problèmes

## 1. 💻 Prérequis Système

### Configuration Minimale
- Windows 10/11 Professionnel 64 bits
- Processeur Intel Core i5 ou équivalent
- 8 Go RAM minimum (16 Go recommandé)
- 256 Go d'espace disque
- Connexion Internet stable (pour l'installation initiale)

### Logiciels Requis
- XAMPP 8.1+ (inclut PHP, MySQL, Apache)
- Node.js 18.x LTS
- Git (optionnel)

## 2. 🔧 Installation des Dépendances

### 2.1 Installation de XAMPP
1. Télécharger XAMPP depuis [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. Installer dans `C:\xampp`
3. Lancer XAMPP Control Panel
4. Démarrer Apache et MySQL

### 2.2 Installation de Node.js
1. Télécharger Node.js depuis [https://nodejs.org/](https://nodejs.org/)
2. Installer avec les options par défaut
3. Vérifier l'installation :
```bash
node --version
npm --version
```

## 3. ⚙️ Configuration Initiale

### 3.1 Structure des Dossiers
```
C:\medical-app\
├── api/
├── config/
├── database/
├── logs/
├── public/
└── scripts/
```

### 3.2 Configuration Apache
1. Ouvrir `C:\xampp\apache\conf\extra\httpd-vhosts.conf`
2. Ajouter :
```apache
<VirtualHost *:80>
    DocumentRoot "C:/medical-app/public"
    ServerName medical.local
    ErrorLog "C:/medical-app/logs/error.log"
    CustomLog "C:/medical-app/logs/access.log" combined
    
    <Directory "C:/medical-app/public">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### 3.3 Configuration MySQL
1. Ouvrir phpMyAdmin (http://localhost/phpmyadmin)
2. Créer une base de données : `medical_production`
3. Créer un utilisateur dédié :
   - Nom : `medical_user`
   - Mot de passe : `votre_mot_de_passe_securise`
   - Droits : SELECT, INSERT, UPDATE, DELETE

## 4. 📦 Déploiement de l'Application

### 4.1 Installation des Fichiers
1. Copier tous les fichiers dans `C:\medical-app`
2. Ouvrir une invite de commande dans ce dossier
3. Installer les dépendances :
```bash
npm install --production
```

### 4.2 Configuration de l'Application
1. Copier `.env.example` vers `.env`
2. Modifier les paramètres :
```env
DB_HOST=localhost
DB_USER=medical_user
DB_PASS=votre_mot_de_passe_securise
DB_NAME=medical_production
APP_ENV=production
```

### 4.3 Build de Production
```bash
npm run build
```

## 5. 🗄️ Configuration de la Base de Données

### 5.1 Import Initial
1. Ouvrir phpMyAdmin
2. Sélectionner `medical_production`
3. Importer `database/production-schema.sql`

### 5.2 Création du Compte Administrateur
1. Accéder à http://localhost/setup
2. Créer le compte administrateur :
   - Identifiant : `admin`
   - Mot de passe : `mot_de_passe_securise`
   - Centre : "Centre de Santé Solidarité Islamique"
   - Localisation : "MONGO, TCHAD"

## 6. ✅ Tests et Validation

### 6.1 Liste de Contrôle
- [ ] Connexion à l'application
- [ ] Création d'une vente test
- [ ] Impression d'une facture
- [ ] Vérification des stocks
- [ ] Test de sauvegarde

### 6.2 Tests de Performance
1. Vérifier le temps de chargement des pages
2. Tester la génération de rapports
3. Valider les impressions

## 7. 🔄 Procédures de Maintenance

### 7.1 Sauvegarde Quotidienne
1. Ouvrir le planificateur de tâches Windows
2. Créer une tâche :
   - Programme : `C:\medical-app\scripts\backup.bat`
   - Fréquence : Quotidienne à 23h00
   - Dossier de sauvegarde : `C:\medical-app\backups`

### 7.2 Nettoyage des Logs
- Nettoyer les logs tous les 30 jours
- Conserver les sauvegardes pendant 90 jours

### 7.3 Maintenance Mensuelle
1. Vérifier l'espace disque
2. Optimiser la base de données
3. Vérifier les logs d'erreurs

## 8. 🔍 Résolution des Problèmes

### 8.1 Problèmes Courants
1. **Erreur de connexion à la base de données**
   - Vérifier les paramètres dans `.env`
   - Vérifier que MySQL est démarré
   - Tester la connexion via phpMyAdmin

2. **Page blanche**
   - Vérifier les logs Apache
   - Vérifier les permissions des fichiers
   - Activer le mode debug temporairement

3. **Erreur d'impression**
   - Vérifier la configuration de l'imprimante
   - Tester avec PDF Creator
   - Vérifier les paramètres du navigateur

### 8.2 Contacts Support
- Support Technique : +XXX XXX XXX XXX
- Email : support@centre-medical.local
- Horaires : 8h00 - 18h00 (Lundi-Vendredi)

## 📞 Procédure d'Urgence

### En Cas de Panne
1. Vérifier les logs dans `C:\medical-app\logs`
2. Contacter le support technique
3. Préparer les informations :
   - Message d'erreur exact
   - Actions effectuées avant l'erreur
   - Captures d'écran si possible

### Restauration
1. Arrêter les services :
```batch
net stop Apache2.4
net stop MySQL
```

2. Restaurer la dernière sauvegarde :
```batch
C:\medical-app\scripts\restore.bat
```

3. Redémarrer les services :
```batch
net start MySQL
net start Apache2.4
```

## 🔐 Sécurité

### Recommandations
1. Changer les mots de passe régulièrement
2. Effectuer les sauvegardes quotidiennes
3. Maintenir Windows à jour
4. Utiliser un antivirus actif
5. Ne pas installer de logiciels non autorisés

### Accès
- Limiter l'accès physique au poste
- Verrouiller la session en cas d'absence
- Ne pas partager les identifiants

## 📋 Checklist Finale

### Avant Utilisation
- [ ] Tous les services démarrent correctement
- [ ] Base de données accessible
- [ ] Impressions configurées
- [ ] Sauvegardes programmées
- [ ] Formation utilisateur effectuée
- [ ] Documentation remise

### Documentation Fournie
- [ ] Guide utilisateur
- [ ] Procédures d'urgence
- [ ] Contacts support
- [ ] Calendrier de maintenance

---

Version: 1.0.0  
Date: 2025  
Support: support@centre-medical.local
