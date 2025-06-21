
# Guide de Déploiement - Caisse Médicale

## 📋 Trois Options de Déploiement

Ce logiciel de gestion de caisse médicale peut être déployé de trois façons différentes selon vos besoins :

### 1. 🌐 Hébergement Web (LWS)
**Recommandé pour** : Utilisation multi-postes, accès distant, sauvegarde automatique

- **Avantages** :
  - Accès depuis n'importe où
  - Sauvegarde professionnelle
  - Support technique inclus
  - Certificat SSL automatique

- **Prérequis** :
  - Hébergement web avec MySQL
  - Nom de domaine
  - 10€-30€/mois selon l'hébergeur

📖 **Guide détaillé** : [guide-deploiement-lws.md](./guide-deploiement-lws.md)

### 2. ☁️ Cloud Supabase
**Recommandé pour** : Démarrage rapide, évolutivité, fonctionnalités avancées

- **Avantages** :
  - Déploiement en 10 minutes
  - Authentification intégrée
  - Sauvegardes automatiques
  - API REST générée automatiquement
  - Plan gratuit disponible

- **Prérequis** :
  - Compte Supabase (gratuit)
  - Hébergement web basique
  - 0€-25€/mois selon l'usage

📖 **Guide détaillé** : [guide-deploiement-supabase.md](./guide-deploiement-supabase.md)

### 3. 💻 Local WAMP
**Recommandé pour** : Usage local, données sensibles, fonctionnement hors ligne

- **Avantages** :
  - Fonctionnement 100% hors ligne
  - Données entièrement sous votre contrôle
  - Aucun coût récurrent
  - Performances maximales

- **Prérequis** :
  - PC Windows
  - WAMP Server (gratuit)
  - Node.js (gratuit)

📖 **Guide détaillé** : [guide-deploiement-wamp.md](./guide-deploiement-wamp.md)

## 🔄 Comparaison des Options

| Critère | LWS Web | Supabase | WAMP Local |
|---------|---------|----------|------------|
| **Coût** | 10-30€/mois | 0-25€/mois | Gratuit |
| **Complexité** | Moyenne | Facile | Moyenne |
| **Accès distant** | ✅ | ✅ | ❌ |
| **Hors ligne** | ❌ | ❌ | ✅ |
| **Sauvegarde** | Incluse | Automatique | Manuelle |
| **Évolutivité** | Limitée | Excellente | Limitée |
| **Support** | Inclus | Communauté | Aucun |

## 🚀 Démarrage Rapide

### Pour Débuter Immédiatement
➡️ **Choisissez Supabase** : Déploiement en 10 minutes, plan gratuit

### Pour un Usage Professionnel
➡️ **Choisissez LWS** : Hébergement stable, support inclus

### Pour un Cabinet Local
➡️ **Choisissez WAMP** : Contrôle total, fonctionnement hors ligne

## 📞 Support

Chaque guide contient :
- ✅ Instructions étape par étape
- ✅ Scripts de configuration
- ✅ Section dépannage
- ✅ Exemples de commandes

## 🔧 Migration Entre Solutions

Il est possible de migrer d'une solution à l'autre :
- **WAMP → LWS** : Export/import de la base MySQL
- **WAMP → Supabase** : Migration via CSV ou SQL
- **LWS → Supabase** : Migration automatisée possible

---

**Choisissez le guide correspondant à vos besoins et suivez les instructions détaillées.**
