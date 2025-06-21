
# Caisse Médicale - Centre de Santé Solidarité Islamique

## 🏥 À propos

Système de gestion de caisse médical développé pour le Centre de Santé Solidarité Islamique à MONGO, TCHAD.

## 🚀 Déploiement en Production

### Prérequis
- Serveur web (Apache/Nginx)
- Base de données MySQL/PostgreSQL (optionnel)
- Certificat SSL pour HTTPS
- Node.js 18+ (pour la construction)

### Construction pour Production

```bash
# Installation des dépendances
npm install

# Construction optimisée
npm run build

# Ou utiliser le script dédié
./scripts/build-production.sh
```

### Déploiement avec Docker

```bash
# Construction de l'image
docker build -f Dockerfile.production -t caisse-medicale .

# Lancement du container
docker run -d -p 80:80 --name caisse-medicale caisse-medicale
```

### Déploiement Manuel

1. Construisez l'application avec `npm run build`
2. Uploadez le contenu du dossier `dist/` vers votre serveur
3. Configurez votre serveur web pour servir les fichiers statiques
4. Configurez la redirection des routes vers `index.html`

## 🔐 Comptes par Défaut

### Administrateur
- **Nom d'utilisateur**: `admin`
- **Mot de passe**: `admin123`
- **Accès**: Toutes les fonctionnalités

### Caissier
- **Nom d'utilisateur**: `caissier`
- **Mot de passe**: `caissier123`
- **Accès**: Ventes et tableau de bord

## 🛠️ Fonctionnalités

- ✅ Gestion des ventes et consultations
- ✅ Gestion des médicaments
- ✅ Gestion des types d'examens
- ✅ Gestion des catégories de dépenses
- ✅ Génération de factures
- ✅ Rapports et statistiques
- ✅ Gestion des utilisateurs (Admin)
- ✅ Interface multilingue (Français)
- ✅ Mode hors ligne

## 🔧 Configuration

### Variables d'Environnement
```bash
NODE_ENV=production
APP_NAME="Caisse Médicale"
APP_VERSION="1.0.0"
```

### Configuration Apache
Le fichier `.htaccess` est automatiquement généré lors de la construction.

### Configuration Nginx
Utilisez le fichier `nginx.production.conf` fourni.

## 📱 Utilisation

1. Accédez à l'application via votre navigateur
2. Connectez-vous avec un compte administrateur ou caissier
3. Configurez les données de base (médicaments, examens, etc.)
4. Commencez à enregistrer les ventes

## 🔒 Sécurité

- Authentification obligatoire
- Sessions sécurisées
- Protection CSRF
- Headers de sécurité configurés
- Chiffrement HTTPS recommandé

## 📞 Support

**Centre de Santé Solidarité Islamique**
- 📍 MONGO, TCHAD
- ☎️ +235 66 49 22 54
- 📧 contact@solidarite-islamique.td

## 📄 Licence

© 2024 Centre de Santé Solidarité Islamique. Tous droits réservés.
