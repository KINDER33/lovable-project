
-- Schéma de base de données pour Caisse Médicale
-- Compatible avec MySQL WAMP Server

CREATE DATABASE IF NOT EXISTS caisse_medicale;
USE caisse_medicale;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'caissier',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des médicaments
CREATE TABLE IF NOT EXISTS medications (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    description TEXT,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    stock_quantity INT NOT NULL DEFAULT 0,
    min_stock_level INT DEFAULT 10,
    supplier VARCHAR(255),
    expiry_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des types d'examens
CREATE TABLE IF NOT EXISTS exam_types (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    duration_minutes INT DEFAULT 30,
    department VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des ventes
CREATE TABLE IF NOT EXISTS sales (
    id VARCHAR(36) PRIMARY KEY,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    customer_name VARCHAR(255),
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(50) DEFAULT 'cash',
    cashier_name VARCHAR(255),
    user_id VARCHAR(36),
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_cancelled BOOLEAN DEFAULT FALSE,
    cancelled_at TIMESTAMP NULL,
    cancellation_reason TEXT,
    notes TEXT
);

-- Table des articles de vente
CREATE TABLE IF NOT EXISTS sale_items (
    id VARCHAR(36) PRIMARY KEY,
    sale_id VARCHAR(36),
    item_type VARCHAR(50) NOT NULL, -- 'medication' ou 'exam'
    item_id VARCHAR(36) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
);

-- Table des examens
CREATE TABLE IF NOT EXISTS exams (
    id VARCHAR(36) PRIMARY KEY,
    exam_type_id VARCHAR(36),
    patient_name VARCHAR(255) NOT NULL,
    patient_age VARCHAR(10),
    price DECIMAL(10,2) NOT NULL,
    sale_id VARCHAR(36),
    user_id VARCHAR(36),
    exam_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_cancelled BOOLEAN DEFAULT FALSE,
    notes TEXT,
    FOREIGN KEY (exam_type_id) REFERENCES exam_types(id),
    FOREIGN KEY (sale_id) REFERENCES sales(id)
);

-- Table des catégories de dépenses
CREATE TABLE IF NOT EXISTS expense_categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des dépenses
CREATE TABLE IF NOT EXISTS expenses (
    id VARCHAR(36) PRIMARY KEY,
    expense_category_id VARCHAR(36),
    category_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    supplier VARCHAR(255),
    receipt_number VARCHAR(255),
    user_id VARCHAR(36),
    expense_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_cancelled BOOLEAN DEFAULT FALSE,
    cancelled_at TIMESTAMP NULL,
    cancellation_reason TEXT,
    FOREIGN KEY (expense_category_id) REFERENCES expense_categories(id)
);

-- Insertion des données par défaut
INSERT IGNORE INTO users (id, username, email, password_hash, full_name, role) VALUES 
('admin-uuid-1234', 'admin', 'admin@caisse-medicale.com', 'YWRtaW4xMjM=', 'Administrateur Système', 'admin'),
('caissier-uuid-5678', 'caissier', 'caissier@caisse-medicale.com', 'Y2Fpc3NpZXI=', 'Caissier Principal', 'caissier');

INSERT IGNORE INTO exam_types (id, name, description, base_price, duration_minutes, department) VALUES 
('exam-uuid-1', 'Consultation générale', 'Consultation médicale standard', 5000, 30, 'Médecine générale'),
('exam-uuid-2', 'Tension artérielle', 'Mesure de la tension artérielle', 2000, 15, 'Cardiologie'),
('exam-uuid-3', 'Glycémie', 'Test de glycémie à jeun', 3000, 10, 'Laboratoire');

INSERT IGNORE INTO expense_categories (id, name, description) VALUES 
('expense-cat-1', 'Médicaments', 'Achat de médicaments et produits pharmaceutiques'),
('expense-cat-2', 'Équipement médical', 'Achat et maintenance d\'équipement médical'),
('expense-cat-3', 'Fournitures de bureau', 'Papeterie et fournitures administratives'),
('expense-cat-4', 'Autres', 'Autres dépenses diverses');

-- Index pour optimiser les performances
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_invoice ON sales(invoice_number);
CREATE INDEX idx_medications_active ON medications(is_active);
CREATE INDEX idx_exam_types_active ON exam_types(is_active);
CREATE INDEX idx_sale_items_sale_id ON sale_items(sale_id);
