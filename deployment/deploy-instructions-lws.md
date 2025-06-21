
# Instructions de Déploiement LWS

## Configuration de la Base de Données

### 1. Créer la Base de Données
- Connectez-vous à votre panel LWS
- Allez dans "Bases de données MySQL"
- La base `afric2012609_225kcxe` devrait déjà être créée
- Utilisateur: `afric2012609`
- Mot de passe: `Dounia@2025`
- Serveur: `127.0.0.1`

### 2. Importer le Schéma
- Utilisez phpMyAdmin depuis votre panel LWS
- Sélectionnez la base `afric2012609_225kcxe`
- Importez le fichier `deployment/lws-schema.sql`

### 3. Vérifier les Tables
Après l'import, vous devriez avoir ces tables :
- users
- medications
- exam_types
- expense_categories
- sales
- sale_items
- exams
- expenses

## Déploiement des Fichiers

### 1. Structure des Dossiers
```
public_html/
├── api/
│   ├── config-production.php
│   ├── users.php
│   ├── medications.php
│   ├── sales-lws.php
│   ├── exam_types.php
│   ├── exams.php
│   ├── expenses.php
│   ├── expense_categories.php
│   └── generate-invoice-number-lws.php
├── index.html
├── assets/
└── autres fichiers de build...
```

### 2. Configuration API
- Copiez tous les fichiers PHP du dossier `api/` vers `public_html/api/`
- Assurez-vous que `config-production.php` contient les bons paramètres de connexion
- Testez la connexion via `votre-domaine.com/api/config-production.php`

### 3. Build de l'Application
```bash
npm run build
```

### 4. Upload des Fichiers
- Uploadez le contenu du dossier `dist/` vers `public_html/`
- Uploadez le dossier `api/` vers `public_html/api/`

## Tests de Validation

### 1. Test de Connexion Base
Visitez : `votre-domaine.com/api/config-production.php`
Résultat attendu :
```json
{
  "success": true,
  "message": "Configuration LWS OK",
  "database": "afric2012609_225kcxe",
  "host": "127.0.0.1"
}
```

### 2. Test API Médicaments
Visitez : `votre-domaine.com/api/medications.php`
Devrait retourner la liste des médicaments

### 3. Test Application
Visitez : `votre-domaine.com`
L'application devrait se charger et se connecter automatiquement à MySQL LWS

## Utilisateur par Défaut

- **Nom d'utilisateur :** admin
- **Mot de passe :** admin123
- **Rôle :** Administrateur

## Dépannage

### Erreur 500
- Vérifiez les logs d'erreurs dans le panel LWS
- Assurez-vous que les permissions des fichiers PHP sont correctes (644)

### Erreur de Connexion MySQL
- Vérifiez les paramètres dans `config-production.php`
- Assurez-vous que la base de données existe
- Vérifiez que l'utilisateur a les bonnes permissions

### Problème CORS
- Les headers CORS sont configurés dans `config-production.php`
- Si problème persiste, contactez le support LWS

## Sécurité Post-Déploiement

1. **Changez le mot de passe administrateur** dans l'interface
2. **Configurez des sauvegardes automatiques** de la base
3. **Activez HTTPS** si disponible
4. **Surveillez les logs** régulièrement

## Support

Pour toute question technique :
- Consultez la documentation LWS
- Vérifiez les logs d'erreurs
- Contactez le support si nécessaire
