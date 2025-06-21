
# 📦 Guide d'Installation Simple - Logiciel de Gestion Médicale

## 🚀 Installation Rapide (3 étapes)

### Pour Windows

1. **Téléchargez** le dossier complet du logiciel
2. **Clic droit** sur `scripts/deploy-windows.bat` → **"Exécuter en tant qu'administrateur"**
3. **Suivez** les instructions à l'écran

✅ **Terminé !** Votre logiciel est accessible sur http://localhost:3000

### Pour Linux/Ubuntu

1. **Téléchargez** le dossier complet du logiciel
2. **Ouvrez** un terminal dans le dossier
3. **Exécutez** :
   ```bash
   chmod +x scripts/deploy-production.sh
   sudo ./scripts/deploy-production.sh
   ```

✅ **Terminé !** Votre logiciel est accessible via votre navigateur

---

## 🔧 Configuration Initiale (Première utilisation)

### Étape 1 : Connexion à la Base de Données

Choisissez votre option :

#### Option A : Supabase (Recommandé - Cloud)
1. Créez un compte gratuit sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Dans l'interface du logiciel, sélectionnez "Supabase"
4. Saisissez :
   - **URL du projet** : `https://votre-projet.supabase.co`
   - **Clé API** : Votre clé anonyme

#### Option B : Base de Données Locale
1. Installez PostgreSQL sur votre serveur
2. Créez une base de données
3. Dans l'interface du logiciel, sélectionnez "Serveur Local"
4. Saisissez :
   - **Hôte** : `localhost` (ou IP du serveur)
   - **Port** : `5432`
   - **Base** : Nom de votre base
   - **Utilisateur** et **Mot de passe**

### Étape 2 : Création du Compte Administrateur
1. **Nom complet** : Votre nom
2. **Email** : Votre adresse email
3. **Mot de passe** : Minimum 12 caractères avec chiffres et symboles
4. **Confirmation** du mot de passe

### Étape 3 : Configuration du Centre Médical
1. **Nom du centre** : Nom de votre établissement
2. **Adresse complète**
3. **Téléphone** et **Email** de contact
4. **Logo** (optionnel)

---

## 📊 Données Initiales Recommandées

### Catégories de Médicaments
- Antibiotiques
- Antalgiques/Anti-inflammatoires
- Vitamines et suppléments
- Médicaments cardiovasculaires
- Médicaments respiratoires

### Types d'Examens
- Consultation générale (5 000 FCFA)
- Échographie (15 000 FCFA)
- Électrocardiogramme (8 000 FCFA)
- Radiographie (12 000 FCFA)
- Analyses sanguines (10 000 FCFA)

### Catégories de Dépenses
- Fournitures médicales
- Maintenance et réparations
- Personnel et salaires
- Utilities (électricité, eau)
- Marketing et communication

---

## 🛠️ Gestion Quotidienne

### Démarrage Quotidien
- **Windows** : Le service démarre automatiquement avec Windows
- **Linux** : Le service démarre automatiquement avec le serveur

### Accès à l'Application
- Ouvrez votre navigateur
- Allez sur **http://localhost:3000** (ou l'IP de votre serveur)
- Connectez-vous avec vos identifiants

### Sauvegarde
- **Automatique** : Tous les jours à 2h du matin
- **Manuelle** : Bouton "Sauvegarde" dans les paramètres
- **Windows** : Exécutez `backup.bat`
- **Linux** : Exécutez `/opt/scripts/backup-medical.sh`

---

## 🔧 Commandes Utiles

### Windows
```batch
# Démarrer le service
net start MedicalCashierService

# Arrêter le service
net stop MedicalCashierService

# Créer une sauvegarde
C:\MedicalCashier\backup.bat
```

### Linux
```bash
# Statut du service
sudo systemctl status medical-cashier

# Redémarrer le service
sudo systemctl restart medical-cashier

# Voir les logs
sudo journalctl -u medical-cashier -f

# Créer une sauvegarde
sudo /opt/scripts/backup-medical.sh
```

---

## 🚨 Résolution de Problèmes

### L'application ne se lance pas
1. Vérifiez que Node.js est installé (`node --version`)
2. Vérifiez que le service est actif
3. Consultez les logs d'erreur

### Impossible de se connecter à la base
1. Vérifiez votre connexion internet (si Supabase)
2. Vérifiez les paramètres de connexion
3. Testez la connexion depuis les paramètres

### Erreur de permissions
1. **Windows** : Exécutez en tant qu'administrateur
2. **Linux** : Utilisez `sudo`

### Application lente
1. Vérifiez l'espace disque disponible
2. Redémarrez le service
3. Vérifiez la connexion réseau

---

## 📞 Support

### Documentation
- **Guide utilisateur** : Inclus dans le dossier `docs/`
- **FAQ** : Problèmes courants et solutions

### Contacts
- **Support technique** : [Votre email de support]
- **Urgences** : [Numéro d'urgence]

### Mise à jour
1. Téléchargez la nouvelle version
2. Lancez le script d'installation
3. Vos données sont conservées automatiquement

---

## ✅ Checklist Post-Installation

- [ ] Application accessible via navigateur
- [ ] Connexion base de données OK
- [ ] Compte administrateur créé
- [ ] Informations centre médical saisies
- [ ] Premier médicament ajouté
- [ ] Premier type d'examen configuré
- [ ] Sauvegarde testée
- [ ] Utilisateurs formés

---

**🎉 Félicitations ! Votre logiciel de gestion médicale est prêt à l'emploi.**

Pour toute question, consultez la documentation complète ou contactez le support technique.
