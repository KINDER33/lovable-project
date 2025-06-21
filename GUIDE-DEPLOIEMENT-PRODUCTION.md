
# 🚀 Guide de Déploiement Production - Logiciel de Gestion Médicale

## 📋 Vue d'Ensemble

Ce guide détaille les étapes complètes pour déployer le logiciel de gestion médicale en environnement de production, avec toutes les mesures de sécurité et de performance nécessaires.

---

## 🎯 Prérequis Système

### Serveur/Poste de Travail
- **OS** : Windows 10/11 (64-bit) ou Ubuntu 20.04+ LTS
- **RAM** : 8GB minimum (16GB recommandé)
- **Stockage** : 50GB libre minimum
- **Processeur** : Intel i5 ou équivalent AMD
- **Réseau** : Connexion internet stable (pour configuration initiale)

### Logiciels Requis
- **Node.js** 18.x ou supérieur
- **PostgreSQL** 15.x (si base locale) OU compte **Supabase**
- **Git** (pour versioning)
- Navigateur moderne (Chrome, Firefox, Edge)

---

## 🔧 Installation Étape par Étape

### Phase 1 : Préparation de l'Environnement

#### 1.1 Installation Node.js
```bash
# Windows (via chocolatey)
choco install nodejs

# Ubuntu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérification
node --version
npm --version
```

#### 1.2 Installation PostgreSQL (Option Locale)
```bash
# Ubuntu
sudo apt update
sudo apt install postgresql postgresql-contrib

# Configuration initiale
sudo -u postgres createuser --interactive
sudo -u postgres createdb medical_cashier
```

#### 1.3 Configuration Supabase (Option Cloud)
1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez l'URL et la clé API anonyme
4. Configurez l'authentification par email/mot de passe

---

### Phase 2 : Déploiement de l'Application

#### 2.1 Téléchargement et Configuration
```bash
# Clonage du projet
git clone [URL_DU_PROJET]
cd logiciel-gestion-medicale

# Installation des dépendances
npm ci --production

# Configuration environnement
cp .env.example .env.production
```

#### 2.2 Configuration des Variables d'Environnement
Éditez `.env.production` :
```env
# Configuration générale
NODE_ENV=production
PORT=3000
APP_NAME="Centre Médical - Gestion"

# Base de données (choisir une option)
# Option 1: Supabase
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme

# Option 2: PostgreSQL local
DATABASE_URL=postgresql://user:password@localhost:5432/medical_cashier

# Sécurité
ENCRYPTION_KEY=votre_cle_chiffrement_32_caracteres
JWT_SECRET=votre_jwt_secret_complexe
```

#### 2.3 Construction de l'Application
```bash
# Build optimisé pour production
npm run build

# Test de fonctionnement
npm run preview
```

---

### Phase 3 : Configuration de Production

#### 3.1 Configuration Nginx (Serveur Web)
```nginx
# /etc/nginx/sites-available/medical-cashier
server {
    listen 80;
    server_name votre-domaine.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 3.2 Configuration SSL (HTTPS)
```bash
# Installation Certbot
sudo apt install certbot python3-certbot-nginx

# Génération certificat SSL
sudo certbot --nginx -d votre-domaine.com
```

#### 3.3 Service Système (Auto-démarrage)
```ini
# /etc/systemd/system/medical-cashier.service
[Unit]
Description=Logiciel de Gestion Médicale
After=network.target

[Service]
Type=simple
User=medical
WorkingDirectory=/opt/medical-cashier
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Activation du service :
```bash
sudo systemctl enable medical-cashier
sudo systemctl start medical-cashier
sudo systemctl status medical-cashier
```

---

### Phase 4 : Configuration de la Base de Données

#### 4.1 Initialisation des Tables (Automatique)
Le système créera automatiquement les tables lors du premier lancement :
- ✅ Tables utilisateurs et authentification
- ✅ Tables médicaments et stocks
- ✅ Tables examens et types d'examens
- ✅ Tables ventes et facturation
- ✅ Tables audit et journalisation

#### 4.2 Configuration du Compte Administrateur
Lors du premier accès :
1. Configurez la connexion à la base de données
2. Créez le compte administrateur principal
3. Configurez les informations du centre médical

---

### Phase 5 : Sécurisation

#### 5.1 Pare-feu
```bash
# Ubuntu UFW
sudo ufw enable
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw deny 3000   # Port application (accès via Nginx uniquement)
```

#### 5.2 Sauvegarde Automatique
```bash
# Script de sauvegarde /opt/scripts/backup-medical.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/medical"
DB_NAME="medical_cashier"

# Création du dossier de sauvegarde
mkdir -p $BACKUP_DIR

# Sauvegarde base de données
pg_dump $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Sauvegarde fichiers application
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz -C /opt/medical-cashier .

# Nettoyage (garder 30 jours)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Sauvegarde terminée : $DATE"
```

Configuration crontab :
```bash
# Sauvegarde quotidienne à 2h du matin
0 2 * * * /opt/scripts/backup-medical.sh
```

---

### Phase 6 : Tests de Validation

#### 6.1 Tests Fonctionnels
- [ ] Connexion à la base de données
- [ ] Création compte administrateur
- [ ] Ajout de médicaments
- [ ] Enregistrement d'examens
- [ ] Génération de factures
- [ ] Impression des factures
- [ ] Sauvegarde manuelle
- [ ] Journal d'audit

#### 6.2 Tests de Performance
```bash
# Test de charge avec Apache Bench
ab -n 1000 -c 10 http://votre-domaine.com/
```

#### 6.3 Tests de Sécurité
- [ ] Connexion HTTPS fonctionnelle
- [ ] Authentification obligatoire
- [ ] Protection contre l'injection SQL
- [ ] Chiffrement des données sensibles
- [ ] Journalisation des accès

---

### Phase 7 : Formation et Documentation

#### 7.1 Formation Utilisateurs
1. **Formation Administrateur** (4h)
   - Configuration système
   - Gestion des utilisateurs
   - Paramétrage
   - Sauvegardes

2. **Formation Caissiers** (2h)
   - Interface de vente
   - Gestion des stocks
   - Impression factures

#### 7.2 Documentation Remise
- [ ] Guide d'utilisation quotidienne
- [ ] Procédures de sauvegarde/restauration
- [ ] Guide de dépannage
- [ ] Contacts support technique

---

## 🚨 Procédures d'Urgence

### Restauration Rapide
```bash
# Restauration base de données
psql medical_cashier < /opt/backups/medical/db_backup_YYYYMMDD_HHMMSS.sql

# Restauration application
cd /opt/medical-cashier
tar -xzf /opt/backups/medical/app_backup_YYYYMMDD_HHMMSS.tar.gz
sudo systemctl restart medical-cashier
```

### Contacts Support
- **Technique** : support-technique@centre-medical.local
- **Urgence** : +XXX XXX XXX XXX
- **Documentation** : [URL_DOCUMENTATION]

---

## ✅ Checklist de Déploiement

### Avant Production
- [ ] Serveur configuré et sécurisé
- [ ] Base de données installée et configurée
- [ ] Application buildée et testée
- [ ] SSL/HTTPS configuré
- [ ] Sauvegardes automatiques configurées
- [ ] Utilisateurs formés
- [ ] Documentation remise

### Après Production
- [ ] Monitoring actif
- [ ] Sauvegardes vérifiées
- [ ] Performance surveillée
- [ ] Support technique disponible

---

**Version** : 1.0  
**Date** : 2025  
**Validé par** : [NOM_RESPONSABLE]

Cette procédure garantit un déploiement sécurisé et professionnel de votre logiciel de gestion médicale.
