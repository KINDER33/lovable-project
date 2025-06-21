
-- =====================================================
-- SCHEMA POSTGRESQL POUR DÉPLOIEMENT LOCAL
-- Système de Gestion de Caisse Médicale
-- Version PostgreSQL pour ordinateur local
-- =====================================================

-- Création de la base de données (à exécuter en tant que superuser)
-- CREATE DATABASE caisse_medicale WITH ENCODING 'UTF8';
-- \c caisse_medicale;

-- Table des utilisateurs (caissiers, gestionnaires, administrateurs)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'gestionnaire', 'caissier')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des médicaments
CREATE TABLE IF NOT EXISTS medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    min_stock_level INTEGER DEFAULT 10,
    supplier VARCHAR(255),
    expiry_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des types d'examens
CREATE TABLE IF NOT EXISTS exam_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    duration_minutes INTEGER DEFAULT 30,
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des catégories de dépenses
CREATE TABLE IF NOT EXISTS expense_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des ventes
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255),
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(50) DEFAULT 'cash',
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cashier_name VARCHAR(255),
    user_id UUID REFERENCES users(id),
    notes TEXT,
    is_cancelled BOOLEAN DEFAULT FALSE,
    cancelled_at TIMESTAMP WITH TIME ZONE NULL,
    cancellation_reason TEXT
);

-- Table des détails de vente
CREATE TABLE IF NOT EXISTS sale_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('medication', 'exam')),
    item_id UUID NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des examens
CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_type_id UUID REFERENCES exam_types(id),
    patient_name VARCHAR(255) NOT NULL,
    patient_age VARCHAR(10),
    price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    exam_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sale_id UUID REFERENCES sales(id),
    user_id UUID REFERENCES users(id),
    is_cancelled BOOLEAN DEFAULT FALSE
);

-- Table des dépenses
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_category_id UUID REFERENCES expense_categories(id),
    category_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    supplier VARCHAR(255),
    expense_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    receipt_number VARCHAR(100),
    user_id UUID REFERENCES users(id),
    is_cancelled BOOLEAN DEFAULT FALSE,
    cancelled_at TIMESTAMP WITH TIME ZONE NULL,
    cancellation_reason TEXT
);

-- Table des sessions utilisateurs
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    session_token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des actions utilisateurs (audit)
CREATE TABLE IF NOT EXISTS user_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL,
    table_name VARCHAR(50),
    record_id UUID,
    description TEXT,
    amount DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_invoice ON sales(invoice_number);
CREATE INDEX IF NOT EXISTS idx_medications_active ON medications(is_active);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Fonction pour générer les numéros de facture
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
    invoice_num TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 2) AS INTEGER)), 0) + 1 
    INTO next_number 
    FROM sales 
    WHERE invoice_number ~ '^F[0-9]+$';
    
    invoice_num := 'F' || LPAD(next_number::TEXT, 6, '0');
    
    RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON medications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exam_types_updated_at BEFORE UPDATE ON exam_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Données par défaut - Catégories de dépenses
INSERT INTO expense_categories (name, description) VALUES
('Achat médicaments', 'Achat de stock pharmaceutique'),
('Maintenance équipements', 'Réparation et maintenance du matériel médical'),
('Fournitures bureau', 'Papeterie et fournitures administratives'),
('Électricité', 'Factures d''électricité'),
('Eau', 'Factures d''eau'),
('Internet/Téléphone', 'Frais de télécommunications'),
('Carburant', 'Essence et transport'),
('Nettoyage', 'Produits et services de nettoyage'),
('Sécurité', 'Services de sécurité'),
('Autres', 'Autres dépenses diverses')
ON CONFLICT (name) DO NOTHING;

-- Données par défaut - Types d'examens
INSERT INTO exam_types (name, description, base_price, duration_minutes, department) VALUES
('Consultation générale', 'Consultation médicale standard', 5000, 30, 'Médecine générale'),
('Prise de tension', 'Mesure de la tension artérielle', 2000, 10, 'Cardiologie'),
('Test de glycémie', 'Test du taux de sucre dans le sang', 3000, 15, 'Laboratoire'),
('Pansement', 'Soins de pansement', 1500, 15, 'Soins infirmiers'),
('Injection', 'Administration d''injection', 2500, 10, 'Soins infirmiers'),
('Vaccination', 'Administration de vaccins', 8000, 20, 'Prévention')
ON CONFLICT (name) DO NOTHING;

-- Données par défaut - Médicaments de base
INSERT INTO medications (name, description, category, unit_price, stock_quantity, min_stock_level, supplier) VALUES
('Paracétamol 500mg', 'Antalgique et antipyrétique', 'Antalgiques', 250, 100, 20, 'Pharmacie Centrale'),
('Amoxicilline 500mg', 'Antibiotique à large spectre', 'Antibiotiques', 500, 50, 10, 'Pharmacie Centrale'),
('Aspirine 100mg', 'Antiagrégant plaquettaire', 'Cardiologie', 150, 80, 15, 'Pharmacie Centrale'),
('Oméprazole 20mg', 'Inhibiteur de la pompe à protons', 'Gastroentérologie', 300, 60, 12, 'Pharmacie Centrale'),
('Metformine 500mg', 'Antidiabétique oral', 'Diabète', 400, 40, 8, 'Pharmacie Centrale')
ON CONFLICT (name) DO NOTHING;

-- Création du premier utilisateur administrateur par défaut
-- Mot de passe: admin123 (encodé en base64: YWRtaW4xMjM=)
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@caisse-medicale.com', 'YWRtaW4xMjM=', 'Administrateur Système', 'admin')
ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- SCHEMA POSTGRESQL COMPLET - PRÊT POUR PRODUCTION
-- =====================================================
