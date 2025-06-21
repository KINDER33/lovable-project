
# 🔧 Guide de Maintenance - Caisse Médicale

## 📅 Planning de Maintenance

### Maintenance Quotidienne (5 minutes)
**Responsable** : Utilisateur principal
**Fréquence** : Chaque jour avant fermeture

#### Actions Quotidiennes
- [ ] **Génération du rapport quotidien**
- [ ] **Vérification des alertes de stock**
- [ ] **Contrôle des totaux de caisse**
- [ ] **Sauvegarde manuelle** (si automatique non configurée)

#### Procédure Quotidienne
```
1. Menu "Rapports" → "Rapport Quotidien"
2. Vérifier que les totaux correspondent aux espèces
3. Menu "Stocks" → Contrôler les alertes rouges
4. Menu "Paramètres" → "Sauvegarde" → "Créer maintenant"
5. Fermer proprement l'application
```

### Maintenance Hebdomadaire (15 minutes)
**Responsable** : Utilisateur principal
**Fréquence** : Chaque vendredi

#### Actions Hebdomadaires
- [ ] **Nettoyage des fichiers temporaires**
- [ ] **Vérification de l'espace disque**
- [ ] **Test d'impression**
- [ ] **Contrôle des sauvegardes**
- [ ] **Mise à jour des stocks périmés**

#### Procédure Hebdomadaire
```
1. Vérifier l'espace disque (minimum 1GB libre)
2. Nettoyer le dossier backup/ (garder 30 derniers jours)
3. Tester l'impression d'une facture test
4. Contrôler les dates d'expiration des médicaments
5. Mettre à jour les prix si nécessaire
```

### Maintenance Mensuelle (30 minutes)
**Responsable** : Administrateur technique
**Fréquence** : Premier samedi du mois

#### Actions Mensuelles
- [ ] **Sauvegarde complète sur support externe**
- [ ] **Vérification des performances**
- [ ] **Nettoyage approfondi de la base de données**
- [ ] **Mise à jour des configurations**
- [ ] **Test de restauration**

## 🛠️ Procédures de Maintenance

### Sauvegarde et Restauration

#### Sauvegarde Manuelle
```batch
# Depuis le dossier d'installation
backup.bat

# Ou depuis l'interface
Menu → Paramètres → Sauvegarde → Créer maintenant
```

#### Sauvegarde sur Support Externe
```
1. Connecter clé USB (minimum 4GB)
2. Copier le dossier backup/ complet
3. Tester l'accessibilité des fichiers
4. Étiqueter la clé avec la date
```

#### Restauration d'Urgence
```
1. Identifier la sauvegarde la plus récente
2. Menu → Paramètres → Restauration
3. Sélectionner le fichier de sauvegarde
4. Confirmer la restauration
5. Redémarrer l'application
```

### Gestion de l'Espace Disque

#### Surveillance de l'Espace
```
1. Vérifier l'espace libre (minimum 1GB)
2. Si < 500MB : nettoyer les anciens logs
3. Si < 200MB : nettoyer les anciennes sauvegardes
4. Si < 100MB : contacter le support technique
```

#### Nettoyage Automatique
```batch
# Script de nettoyage (à exécuter mensuellement)
del /q "%TEMP%\*.*" 2>nul
del /q logs\*.log.old 2>nul
forfiles /p backup /m *.* /d -30 /c "cmd /c del @path" 2>nul
```

### Optimisation des Performances

#### Signes de Ralentissement
- Démarrage > 30 secondes
- Recherche > 3 secondes
- Génération facture > 5 secondes
- Rapports > 10 secondes

#### Actions d'Optimisation
```
1. Redémarrer l'application
2. Redémarrer l'ordinateur
3. Vérifier les programmes en arrière-plan
4. Nettoyer les fichiers temporaires
5. Défragmenter le disque dur (si HDD)
```

## 🚨 Gestion des Problèmes

### Problèmes Courants et Solutions

#### Problème 1: Application ne démarre pas
**Symptômes** : Erreur au lancement, écran noir
**Diagnostic** :
```
1. Vérifier que Node.js est installé
2. Contrôler les droits d'accès au dossier
3. Vérifier l'espace disque disponible
```
**Solution** :
```
1. Redémarrer l'ordinateur
2. Lancer en tant qu'administrateur
3. Réinstaller Node.js si nécessaire
```

#### Problème 2: Erreur de base de données
**Symptômes** : "Impossible de se connecter", données non sauvées
**Diagnostic** :
```
1. Vérifier la connexion internet
2. Contrôler les paramètres Supabase
3. Tester l'accès à supabase.com
```
**Solution** :
```
1. Redémarrer l'application
2. Vérifier les paramètres de connexion
3. Contacter le support si persistant
```

#### Problème 3: Impression défaillante
**Symptômes** : Factures ne s'impriment pas, mise en page incorrecte
**Diagnostic** :
```
1. Vérifier que l'imprimante est allumée
2. Contrôler la connexion USB/réseau
3. Tester avec un autre document
```
**Solution** :
```
1. Redémarrer l'imprimante
2. Réinstaller les pilotes
3. Utiliser l'export PDF comme alternative
```

#### Problème 4: Stocks incorrects
**Symptômes** : Quantités erronées, ventes bloquées
**Diagnostic** :
```
1. Vérifier les dernières ventes
2. Contrôler les mouvements de stock
3. Comparer avec l'inventaire physique
```
**Solution** :
```
1. Correction manuelle dans l'interface
2. Restaurer une sauvegarde récente
3. Recalculer les stocks depuis l'historique
```

### Procédure d'Escalade

#### Niveau 1 : Utilisateur
- Redémarrage simple
- Vérifications de base
- Consultation de ce guide

#### Niveau 2 : Administrateur Local
- Diagnostics avancés
- Restauration de sauvegardes
- Maintenance système

#### Niveau 3 : Support Technique
- Problèmes complexes
- Corruption de données
- Mises à jour système

## 📊 Suivi des Performances

### Métriques à Surveiller

#### Performance Système
```
Temps de démarrage : ___ secondes (objectif < 30s)
Temps de recherche : ___ secondes (objectif < 2s)
Génération facture : ___ secondes (objectif < 3s)
Temps de sauvegarde : ___ secondes (objectif < 10s)
```

#### Usage de l'Espace
```
Taille base de données : ___ MB
Espace libre disque : ___ GB
Taille des sauvegardes : ___ MB
Taille des logs : ___ MB
```

#### Statistiques d'Utilisation
```
Ventes par jour : ___ (moyenne)
Nombre de produits : ___
Utilisateurs actifs : ___
Uptime système : ___% (objectif > 99%)
```

### Rapports de Maintenance

#### Fiche de Maintenance Mensuelle
```
Date : _______________
Responsable : _______________

Actions Effectuées :
□ Sauvegarde complète
□ Nettoyage fichiers temporaires
□ Vérification performances
□ Test de restauration
□ Mise à jour configurations

Problèmes Identifiés :
_________________________________
_________________________________

Actions Correctives :
_________________________________
_________________________________

Recommandations :
_________________________________
_________________________________

Prochaine maintenance : _______________
Signature : _______________
```

## 🔄 Mises à Jour

### Politique de Mises à Jour
- **Critiques** : Immédiatement
- **Sécurité** : Dans les 48h
- **Fonctionnalités** : Planifiées mensuellement
- **Corrections** : Selon criticité

### Procédure de Mise à Jour
```
1. Créer une sauvegarde complète
2. Télécharger la nouvelle version
3. Arrêter l'application
4. Remplacer les fichiers (sauf config/)
5. Redémarrer et tester
6. Valider le fonctionnement
```

## 📞 Contacts de Support

### Support Interne
```
Administrateur Principal : _______________
Responsable Technique : _______________
Utilisateur Expert : _______________
```

### Support Externe
```
Développeur : support@caisse-medicale.local
Urgence 24/7 : _______________
Documentation : Dossier docs/ fourni
```

---

**📝 Note** : Conservez ce guide accessible et mettez-le à jour selon vos procédures spécifiques.

**⚠️ Important** : Effectuez toujours une sauvegarde avant toute intervention de maintenance.
