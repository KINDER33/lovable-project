
# 📖 Guide Utilisateur - Caisse Médicale

## 🚀 Première Utilisation

### 1. Configuration Initiale
Lors du premier lancement, configurez la connexion à la base de données :
- **Hôte** : `localhost`
- **Port** : `3306`
- **Base** : `caisse_medicale`
- **Utilisateur** : `root`
- **Mot de passe** : (laisser vide pour WAMP)

### 2. Configuration du Centre Médical
Allez dans **Paramètres** pour configurer :
- Nom de votre centre médical
- Adresse complète
- Numéro de téléphone
- Email de contact

## 💊 Gestion des Médicaments

### Ajouter un Médicament
1. Allez dans **Paramètres** → **Médicaments**
2. Cliquez **Ajouter un médicament**
3. Remplissez les informations :
   - Nom du médicament
   - Prix unitaire
   - Quantité en stock
   - Seuil d'alerte (stock minimum)
   - Date d'expiration (optionnel)
   - Fournisseur (optionnel)

### Gérer les Stocks
- **Stock faible** : Alertes automatiques en rouge
- **Réapprovisionnement** : Modifiez la quantité directement
- **Historique** : Consultez les mouvements de stock

## 🏥 Gestion des Examens

### Types d'Examens Disponibles
- Consultation générale
- Tension artérielle
- Test de glycémie
- Vaccination
- Pansement

### Ajouter un Nouvel Examen
1. **Paramètres** → **Types d'Examens**
2. **Ajouter un type d'examen**
3. Définissez le prix et la durée

## 🛒 Module de Ventes

### Processus de Vente
1. **Rechercher** médicaments ou examens
2. **Ajouter au panier** avec quantités
3. **Saisir informations patient** (optionnel)
4. **Choisir mode de paiement**
5. **Finaliser la vente**
6. **Imprimer la facture** automatiquement

### Modes de Paiement
- Espèces
- Carte bancaire
- Chèque
- Assurance

## 📊 Rapports et Statistiques

### Rapport Quotidien
- Chiffre d'affaires du jour
- Nombre de ventes
- Détail par catégorie
- Médicaments les plus vendus

### Historique des Ventes
- Recherche par date
- Filtrage par montant
- Export en PDF
- Annulation possible

## 💰 Gestion des Dépenses

### Enregistrer une Dépense
1. **Module Dépenses**
2. **Nouvelle dépense**
3. Choisir la catégorie
4. Montant et description
5. Numéro de reçu (optionnel)

### Catégories de Dépenses
- Achats médicaments
- Équipements médicaux
- Services publics
- Maintenance
- Formation

## 🔧 Maintenance Quotidienne

### Sauvegarde
- **Automatique** : Configurée dans le système
- **Manuelle** : Exécutez `scripts\backup-database.bat`
- **Vérification** : Dossier `C:\wamp64\www\caisse-medicale\backup`

### Nettoyage
- Supprimez les anciennes sauvegardes (>30 jours)
- Vérifiez les logs d'erreur
- Redémarrez WAMP si nécessaire

## ⚠️ Dépannage

### Problèmes Courants

**Application ne s'ouvre pas**
- Vérifiez que WAMP est démarré (icône verte)
- Testez : http://localhost
- Redémarrez Apache dans WAMP

**Erreur de base de données**
- Vérifiez que MySQL fonctionne
- Reconfigurez la connexion
- Importez le schéma si nécessaire

**Facturation ne fonctionne pas**
- Vérifiez les paramètres du centre médical
- Testez la génération de numéros
- Consultez les logs d'erreur

**Stock incorrect**
- Vérifiez les mouvements récents
- Recalculez manuellement si besoin
- Contactez le support technique

### Support Technique
- **Logs** : Consultez les fichiers de log WAMP
- **Sauvegarde** : Restaurez une version antérieure
- **Reset** : Réinitialisez la configuration

## 📱 Utilisation Tactile

L'interface est optimisée pour :
- **Écrans tactiles** de tablettes
- **Claviers virtuels**
- **Navigation simplifiée**
- **Boutons larges** pour faciliter l'usage

## 🔒 Sécurité

### Bonnes Pratiques
- **Sauvegardez** régulièrement
- **Fermez** l'application après usage
- **Protégez** l'accès au serveur
- **Mettez à jour** WAMP régulièrement

### Données Sensibles
- Toutes les données restent **locales**
- Aucune transmission **internet**
- **Chiffrement** des sauvegardes recommandé

---

**Support** : Consultez la documentation technique complète  
**Version** : 1.0 Production  
**Mis à jour** : 2025
