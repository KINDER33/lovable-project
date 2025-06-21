
# Guide de Déploiement Supabase - Caisse Médicale

## 📋 Prérequis Supabase

### Compte Supabase
- Compte gratuit ou payant sur [supabase.com](https://supabase.com)
- Projet Supabase créé
- Accès aux clés API

### Informations Nécessaires
- URL du projet Supabase
- Clé API anonyme (anon key)
- Clé API de service (optionnel)

## 🚀 Étapes de Déploiement

### 1. Configuration du Projet Supabase

1. **Créez un nouveau projet** sur [supabase.com](https://supabase.com)
2. **Notez les informations de connexion** :
   - Project URL : `https://votre-projet.supabase.co`
   - API Key (anon) : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. **Accédez au SQL Editor** dans le dashboard Supabase

### 2. Importation du Schéma de Base

1. **Dans le SQL Editor de Supabase**, exécutez le script suivant :

```sql
-- Création des tables principales
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  full_name VARCHAR NOT NULL,
  role VARCHAR NOT NULL CHECK (role IN ('admin', 'caissier')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE medications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  min_stock_level INTEGER DEFAULT 10,
  supplier VARCHAR,
  expiry_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ajoutez les autres tables (exam_types, expense_categories, sales, etc.)
-- ... (script complet fourni séparément)
```

### 3. Configuration des Politiques RLS

```sql
-- Activation de la sécurité au niveau des lignes
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Politiques d'accès (exemple basique)
CREATE POLICY "Public access" ON medications FOR SELECT USING (true);
CREATE POLICY "Public access" ON exam_types FOR SELECT USING (true);
```

### 4. Build et Déploiement

1. **Build local de l'application** :
```bash
npm install
npm run build
```

2. **Déploiement sur votre hébergeur** :
   - Uploadez le contenu de `dist/` vers votre serveur web
   - Aucun fichier PHP nécessaire (Supabase gère l'API)

### 5. Configuration de l'Application

1. **Accédez à votre application**
2. **Sélectionnez "Supabase"** comme type de base
3. **Entrez vos paramètres Supabase** :
   - URL : `https://votre-projet.supabase.co`
   - Clé API : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. **Testez la connexion**
5. **Créez votre compte administrateur**

### 6. Avantages Supabase

- ✅ **Sécurité intégrée** : Authentication et RLS
- ✅ **Sauvegarde automatique** : Pas de gestion manuelle
- ✅ **Scalabilité** : Croît avec vos besoins
- ✅ **Monitoring** : Dashboard intégré
- ✅ **API REST automatique** : Pas de code backend

## 🔧 Dépannage Supabase

### Erreur de connexion
- Vérifiez l'URL du projet
- Vérifiez la clé API
- Assurez-vous que le projet est actif

### Problème d'authentification
- Vérifiez les politiques RLS
- Assurez-vous que l'authentication est activée

---

**Version Supabase** - Déploiement Cloud
