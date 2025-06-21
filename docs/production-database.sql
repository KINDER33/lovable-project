
-- =====================================================
-- SCRIPT SQL DE PRODUCTION - SYSTÈME DE GESTION PHARMACEUTIQUE
-- Version finale prête pour la production
-- Compatible avec MySQL, PostgreSQL et autres SGBD
-- =====================================================

-- =====================================================
-- CRÉATION DES TABLES
-- =====================================================

-- Table des médicaments
CREATE TABLE medications (
  id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock_quantity INT NOT NULL DEFAULT 0,
  min_stock_level INT DEFAULT 10,
  supplier VARCHAR(255),
  expiry_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Table des types d'examens
CREATE TABLE exam_types (
  id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration_minutes INT DEFAULT 30,
  department VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Table des catégories de dépenses
CREATE TABLE expense_categories (
  id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Table des ventes
CREATE TABLE sales (
  id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  customer_name VARCHAR(255),
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method VARCHAR(50) DEFAULT 'cash',
  sale_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cashier_name VARCHAR(255),
  notes TEXT,
  is_cancelled BOOLEAN NOT NULL DEFAULT FALSE,
  cancelled_at TIMESTAMP NULL,
  cancellation_reason TEXT
);

-- Table des détails de ventes
CREATE TABLE sale_items (
  id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  sale_id CHAR(36),
  item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('medication', 'exam')),
  item_id CHAR(36) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
);

-- Table des examens réalisés
CREATE TABLE exams (
  id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  exam_type_id CHAR(36),
  patient_name VARCHAR(255) NOT NULL,
  patient_age VARCHAR(10),
  price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  exam_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sale_id CHAR(36),
  is_cancelled BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (exam_type_id) REFERENCES exam_types(id),
  FOREIGN KEY (sale_id) REFERENCES sales(id)
);

-- Table des dépenses
CREATE TABLE expenses (
  id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  expense_category_id CHAR(36),
  category_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  supplier VARCHAR(255),
  expense_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  receipt_number VARCHAR(100),
  is_cancelled BOOLEAN NOT NULL DEFAULT FALSE,
  cancelled_at TIMESTAMP NULL,
  cancellation_reason TEXT,
  FOREIGN KEY (expense_category_id) REFERENCES expense_categories(id)
);

-- =====================================================
-- INDEX POUR LES PERFORMANCES
-- =====================================================

CREATE INDEX idx_medications_category ON medications(category);
CREATE INDEX idx_medications_active ON medications(is_active);
CREATE INDEX idx_exam_types_active ON exam_types(is_active);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_sale_items_sale_id ON sale_items(sale_id);

-- =====================================================
-- DONNÉES DE CONFIGURATION ESSENTIELLES
-- =====================================================

-- Catégories de dépenses par défaut
INSERT INTO expense_categories (id, name, description) VALUES
(UUID(), 'Achat de médicaments', 'Achat de stock pharmaceutique'),
(UUID(), 'Maintenance équipements', 'Réparation et maintenance du matériel médical'),
(UUID(), 'Fournitures bureau', 'Papeterie et fournitures administratives'),
(UUID(), 'Électricité', 'Factures d''électricité'),
(UUID(), 'Eau', 'Factures d''eau'),
(UUID(), 'Internet/Téléphone', 'Frais de télécommunications'),
(UUID(), 'Carburant', 'Essence et transport'),
(UUID(), 'Nettoyage', 'Produits et services de nettoyage'),
(UUID(), 'Sécurité', 'Services de sécurité'),
(UUID(), 'Autres', 'Autres dépenses diverses');

-- Types d'examens par défaut
INSERT INTO exam_types (id, name, description, base_price, duration_minutes, department) VALUES
(UUID(), 'Consultation générale', 'Consultation médicale standard', 5000, 30, 'Médecine générale'),
(UUID(), 'Radiologie', 'Examen radiologique', 15000, 20, 'Imagerie'),
(UUID(), 'Échographie', 'Examen échographique', 20000, 30, 'Imagerie'),
(UUID(), 'Analyse de sang', 'Analyse sanguine complète', 8000, 15, 'Laboratoire'),
(UUID(), 'Analyse d''urine', 'Analyse d''urine standard', 5000, 10, 'Laboratoire'),
(UUID(), 'Électrocardiogramme', 'ECG standard', 12000, 15, 'Cardiologie');

-- =====================================================
-- FONCTION POUR GÉNÉRER LES NUMÉROS DE FACTURE
-- =====================================================

DELIMITER //
CREATE FUNCTION generate_invoice_number() 
RETURNS VARCHAR(50)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE next_number INT;
    DECLARE invoice_num VARCHAR(50);
    
    -- Obtenir le prochain numéro de facture
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number, 2) AS UNSIGNED)), 0) + 1 
    INTO next_number 
    FROM sales 
    WHERE invoice_number REGEXP '^F[0-9]+$';
    
    -- Formater le numéro de facture
    SET invoice_num = CONCAT('F', LPAD(next_number, 6, '0'));
    
    RETURN invoice_num;
END//
DELIMITER ;

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
