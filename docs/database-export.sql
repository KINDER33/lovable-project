
-- =====================================================
-- EXPORT DE LA BASE DE DONNÉES - SYSTÈME PHARMACEUTIQUE
-- Date de génération: $(date)
-- =====================================================

-- Supprimer les tables existantes si elles existent (optionnel)
-- DROP TABLE IF EXISTS public.expenses CASCADE;
-- DROP TABLE IF EXISTS public.exams CASCADE;
-- DROP TABLE IF EXISTS public.sale_items CASCADE;
-- DROP TABLE IF EXISTS public.sales CASCADE;
-- DROP TABLE IF EXISTS public.expense_categories CASCADE;
-- DROP TABLE IF EXISTS public.exam_types CASCADE;
-- DROP TABLE IF EXISTS public.medications CASCADE;

-- =====================================================
-- CRÉATION DES TABLES
-- =====================================================

-- Table des médicaments
CREATE TABLE public.medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  min_stock_level INTEGER DEFAULT 10,
  supplier VARCHAR(255),
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Table des types d'examens
CREATE TABLE public.exam_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration_minutes INTEGER DEFAULT 30,
  department VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Table des catégories de dépenses
CREATE TABLE public.expense_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Table des ventes
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  customer_name VARCHAR(255),
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method VARCHAR(50) DEFAULT 'cash',
  sale_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  cashier_name VARCHAR(255),
  notes TEXT,
  is_cancelled BOOLEAN NOT NULL DEFAULT false,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT
);

-- Table des détails de ventes
CREATE TABLE public.sale_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID REFERENCES public.sales(id) ON DELETE CASCADE,
  item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('medication', 'exam')),
  item_id UUID NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des examens réalisés
CREATE TABLE public.exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_type_id UUID REFERENCES public.exam_types(id),
  patient_name VARCHAR(255) NOT NULL,
  patient_age VARCHAR(10),
  price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  exam_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sale_id UUID REFERENCES public.sales(id),
  is_cancelled BOOLEAN NOT NULL DEFAULT false
);

-- Table des dépenses
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expense_category_id UUID REFERENCES public.expense_categories(id),
  category_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  supplier VARCHAR(255),
  expense_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  receipt_number VARCHAR(100),
  is_cancelled BOOLEAN NOT NULL DEFAULT false,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT
);

-- =====================================================
-- DONNÉES PAR DÉFAUT
-- =====================================================

-- Catégories de dépenses par défaut
INSERT INTO public.expense_categories (name, description) VALUES
('Achat de médicaments', 'Achat de stock pharmaceutique'),
('Maintenance équipements', 'Réparation et maintenance du matériel médical'),
('Fournitures bureau', 'Papeterie et fournitures administratives'),
('Électricité', 'Factures d''électricité'),
('Eau', 'Factures d''eau'),
('Internet/Téléphone', 'Frais de télécommunications'),
('Carburant', 'Essence et transport'),
('Nettoyage', 'Produits et services de nettoyage'),
('Sécurité', 'Services de sécurité'),
('Autres', 'Autres dépenses diverses');

-- Types d'examens par défaut
INSERT INTO public.exam_types (name, description, base_price, duration_minutes, department) VALUES
('Consultation générale', 'Consultation médicale standard', 5000, 30, 'Médecine générale'),
('Radiologie', 'Examen radiologique', 15000, 20, 'Imagerie'),
('Échographie', 'Examen échographique', 20000, 30, 'Imagerie'),
('Analyse de sang', 'Analyse sanguine complète', 8000, 15, 'Laboratoire'),
('Analyse d''urine', 'Analyse d''urine standard', 5000, 10, 'Laboratoire'),
('Électrocardiogramme', 'ECG standard', 12000, 15, 'Cardiologie');

-- Médicaments d'exemple
INSERT INTO public.medications (name, description, category, unit_price, stock_quantity, supplier) VALUES
('Paracétamol 500mg', 'Antalgique et antipyrétique', 'Antalgique', 500, 120, 'Pharmadis'),
('Amoxicilline 250mg', 'Antibiotique à large spectre', 'Antibiotique', 1200, 85, 'Pharmadis'),
('Aspirine 100mg', 'Anti-inflammatoire et antalgique', 'Antalgique', 300, 200, 'Medico'),
('Vitamine C', 'Complément vitaminique', 'Complément', 800, 150, 'Vitacare'),
('Oméprazole 20mg', 'Inhibiteur de la pompe à protons', 'Gastro', 1500, 60, 'Gastrocare');

-- =====================================================
-- SÉCURITÉ RLS (Row Level Security)
-- =====================================================

-- Activer RLS pour toutes les tables
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Politiques RLS permissives (à adapter selon les besoins)
CREATE POLICY "Allow all operations on medications" ON public.medications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on exam_types" ON public.exam_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on expense_categories" ON public.expense_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on sales" ON public.sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on sale_items" ON public.sale_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on exams" ON public.exams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- INDEX POUR LES PERFORMANCES
-- =====================================================

CREATE INDEX idx_medications_category ON public.medications(category);
CREATE INDEX idx_medications_active ON public.medications(is_active);
CREATE INDEX idx_exam_types_active ON public.exam_types(is_active);
CREATE INDEX idx_sales_date ON public.sales(sale_date);
CREATE INDEX idx_expenses_date ON public.expenses(expense_date);
CREATE INDEX idx_sale_items_sale_id ON public.sale_items(sale_id);

-- =====================================================
-- FONCTIONS PERSONNALISÉES
-- =====================================================

-- Fonction pour générer les numéros de facture
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
    invoice_num TEXT;
BEGIN
    -- Obtenir le prochain numéro de facture
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 2) AS INTEGER)), 0) + 1 
    INTO next_number 
    FROM public.sales 
    WHERE invoice_number ~ '^F[0-9]+$';
    
    -- Formater le numéro de facture
    invoice_num := 'F' || LPAD(next_number::TEXT, 6, '0');
    
    RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================

-- Commentaires utiles:
-- 1. Ce script crée une base de données complète pour un système de pharmacie
-- 2. Les soft deletes préservent l'intégrité comptable (is_active, is_cancelled)
-- 3. Les index améliorent les performances sur les requêtes fréquentes
-- 4. La fonction generate_invoice_number() assure l'unicité des factures
-- 5. RLS est activé mais avec des politiques permissives (à sécuriser en production)
