
# Base de Données - Système de Gestion Pharmaceutique

## Vue d'ensemble
Cette base de données gère un système complet de pharmacie avec ventes, examens médicaux, médicaments et dépenses.

## Tables Principales

### 1. medications
Gestion du stock de médicaments

| Colonne | Type | Description | Contraintes |
|---------|------|-------------|-------------|
| id | UUID | Identifiant unique | PRIMARY KEY, DEFAULT gen_random_uuid() |
| name | VARCHAR(255) | Nom du médicament | NOT NULL |
| description | TEXT | Description détaillée | |
| category | VARCHAR(100) | Catégorie du médicament | |
| unit_price | DECIMAL(10,2) | Prix unitaire | NOT NULL, DEFAULT 0 |
| stock_quantity | INTEGER | Quantité en stock | NOT NULL, DEFAULT 0 |
| min_stock_level | INTEGER | Seuil d'alerte stock | DEFAULT 10 |
| supplier | VARCHAR(255) | Fournisseur | |
| expiry_date | DATE | Date d'expiration | |
| created_at | TIMESTAMP WITH TIME ZONE | Date de création | NOT NULL, DEFAULT now() |
| updated_at | TIMESTAMP WITH TIME ZONE | Date de modification | NOT NULL, DEFAULT now() |
| is_active | BOOLEAN | Statut actif | NOT NULL, DEFAULT true |

**Index:**
- `idx_medications_category` sur `category`
- `idx_medications_active` sur `is_active`

### 2. exam_types
Types d'examens médicaux disponibles

| Colonne | Type | Description | Contraintes |
|---------|------|-------------|-------------|
| id | UUID | Identifiant unique | PRIMARY KEY, DEFAULT gen_random_uuid() |
| name | VARCHAR(255) | Nom de l'examen | NOT NULL |
| description | TEXT | Description de l'examen | |
| base_price | DECIMAL(10,2) | Prix de base | NOT NULL, DEFAULT 0 |
| duration_minutes | INTEGER | Durée en minutes | DEFAULT 30 |
| department | VARCHAR(100) | Département médical | |
| created_at | TIMESTAMP WITH TIME ZONE | Date de création | NOT NULL, DEFAULT now() |
| updated_at | TIMESTAMP WITH TIME ZONE | Date de modification | NOT NULL, DEFAULT now() |
| is_active | BOOLEAN | Statut actif | NOT NULL, DEFAULT true |

**Index:**
- `idx_exam_types_active` sur `is_active`

### 3. expense_categories
Catégories de dépenses

| Colonne | Type | Description | Contraintes |
|---------|------|-------------|-------------|
| id | UUID | Identifiant unique | PRIMARY KEY, DEFAULT gen_random_uuid() |
| name | VARCHAR(255) | Nom de la catégorie | NOT NULL |
| description | TEXT | Description de la catégorie | |
| created_at | TIMESTAMP WITH TIME ZONE | Date de création | NOT NULL, DEFAULT now() |
| is_active | BOOLEAN | Statut actif | NOT NULL, DEFAULT true |

### 4. sales
Historique des ventes

| Colonne | Type | Description | Contraintes |
|---------|------|-------------|-------------|
| id | UUID | Identifiant unique | PRIMARY KEY, DEFAULT gen_random_uuid() |
| invoice_number | VARCHAR(50) | Numéro de facture | NOT NULL, UNIQUE |
| customer_name | VARCHAR(255) | Nom du client | |
| total_amount | DECIMAL(10,2) | Montant total | NOT NULL, DEFAULT 0 |
| payment_method | VARCHAR(50) | Méthode de paiement | DEFAULT 'cash' |
| sale_date | TIMESTAMP WITH TIME ZONE | Date de vente | NOT NULL, DEFAULT now() |
| cashier_name | VARCHAR(255) | Nom du caissier | |
| notes | TEXT | Notes additionnelles | |
| is_cancelled | BOOLEAN | Vente annulée | NOT NULL, DEFAULT false |
| cancelled_at | TIMESTAMP WITH TIME ZONE | Date d'annulation | |
| cancellation_reason | TEXT | Raison de l'annulation | |

**Index:**
- `idx_sales_date` sur `sale_date`

### 5. sale_items
Détails des articles vendus

| Colonne | Type | Description | Contraintes |
|---------|------|-------------|-------------|
| id | UUID | Identifiant unique | PRIMARY KEY, DEFAULT gen_random_uuid() |
| sale_id | UUID | Référence vente | FOREIGN KEY → sales(id) |
| item_type | VARCHAR(20) | Type d'article | CHECK IN ('medication', 'exam') |
| item_id | UUID | ID de l'article | NOT NULL |
| item_name | VARCHAR(255) | Nom de l'article | NOT NULL |
| quantity | INTEGER | Quantité | NOT NULL, DEFAULT 1 |
| unit_price | DECIMAL(10,2) | Prix unitaire | NOT NULL |
| total_price | DECIMAL(10,2) | Prix total | NOT NULL |
| created_at | TIMESTAMP WITH TIME ZONE | Date de création | NOT NULL, DEFAULT now() |

**Index:**
- `idx_sale_items_sale_id` sur `sale_id`

### 6. exams
Examens réalisés

| Colonne | Type | Description | Contraintes |
|---------|------|-------------|-------------|
| id | UUID | Identifiant unique | PRIMARY KEY, DEFAULT gen_random_uuid() |
| exam_type_id | UUID | Type d'examen | FOREIGN KEY → exam_types(id) |
| patient_name | VARCHAR(255) | Nom du patient | NOT NULL |
| patient_age | VARCHAR(10) | Âge du patient | |
| price | DECIMAL(10,2) | Prix de l'examen | NOT NULL |
| notes | TEXT | Notes sur l'examen | |
| exam_date | TIMESTAMP WITH TIME ZONE | Date de l'examen | NOT NULL, DEFAULT now() |
| sale_id | UUID | Vente associée | FOREIGN KEY → sales(id) |
| is_cancelled | BOOLEAN | Examen annulé | NOT NULL, DEFAULT false |

### 7. expenses
Dépenses de la pharmacie

| Colonne | Type | Description | Contraintes |
|---------|------|-------------|-------------|
| id | UUID | Identifiant unique | PRIMARY KEY, DEFAULT gen_random_uuid() |
| expense_category_id | UUID | Catégorie de dépense | FOREIGN KEY → expense_categories(id) |
| category_name | VARCHAR(255) | Nom de la catégorie | NOT NULL |
| amount | DECIMAL(10,2) | Montant de la dépense | NOT NULL |
| description | TEXT | Description de la dépense | |
| supplier | VARCHAR(255) | Fournisseur/Bénéficiaire | |
| expense_date | TIMESTAMP WITH TIME ZONE | Date de la dépense | NOT NULL, DEFAULT now() |
| receipt_number | VARCHAR(100) | Numéro de reçu | |
| is_cancelled | BOOLEAN | Dépense annulée | NOT NULL, DEFAULT false |
| cancelled_at | TIMESTAMP WITH TIME ZONE | Date d'annulation | |
| cancellation_reason | TEXT | Raison de l'annulation | |

**Index:**
- `idx_expenses_date` sur `expense_date`

## Fonctions

### generate_invoice_number()
Génère automatiquement un numéro de facture unique au format F000001, F000002, etc.

**Retour:** TEXT - Numéro de facture formaté

## Sécurité (RLS)

Toutes les tables ont la sécurité au niveau des lignes (Row Level Security) activée avec des politiques permissives pour toutes les opérations. En production, ces politiques devraient être plus restrictives selon les rôles utilisateurs.

## Données par défaut

### Catégories de dépenses pré-configurées:
- Achat de médicaments
- Maintenance équipements
- Fournitures bureau
- Électricité
- Eau
- Internet/Téléphone
- Carburant
- Nettoyage
- Sécurité
- Autres

### Types d'examens pré-configurés:
- Consultation générale (5000 FCFA)
- Radiologie (15000 FCFA)
- Échographie (20000 FCFA)
- Analyse de sang (8000 FCFA)
- Analyse d'urine (5000 FCFA)
- Électrocardiogramme (12000 FCFA)

### Médicaments d'exemple:
- Paracétamol 500mg (500 FCFA)
- Amoxicilline 250mg (1200 FCFA)
- Aspirine 100mg (300 FCFA)
- Vitamine C (800 FCFA)
- Oméprazole 20mg (1500 FCFA)

## Intégrité comptable

Le système utilise des "soft deletes" (champ `is_active` ou `is_cancelled`) pour préserver l'intégrité des données comptables. Les enregistrements ne sont jamais physiquement supprimés pour maintenir l'historique des transactions.

## Relations principales

```
sales (1) ←→ (n) sale_items
sales (1) ←→ (n) exams
exam_types (1) ←→ (n) exams
expense_categories (1) ←→ (n) expenses
```

---
*Documentation générée automatiquement - Version 1.0*
