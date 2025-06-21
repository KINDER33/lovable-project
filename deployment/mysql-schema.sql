
-- =====================================================
-- SCHEMA MYSQL POUR DÉPLOIEMENT LWS
-- Système de Gestion de Caisse Médicale
-- Version MySQL compatible
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;

-- Table des utilisateurs (caissiers, gestionnaires, administrateurs)
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'gestionnaire', 'caissier') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des médicaments
CREATE TABLE IF NOT EXISTS medications (
    id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
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
    id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    duration_minutes INT DEFAULT 30,
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des catégories de dépenses
CREATE TABLE IF NOT EXISTS expense_categories (
    id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des ventes
CREATE TABLE IF NOT EXISTS sales (
    id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255),
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(50) DEFAULT 'cash',
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cashier_name VARCHAR(255),
    user_id CHAR(36),
    notes TEXT,
    is_cancelled BOOLEAN DEFAULT FALSE,
    cancelled_at TIMESTAMP NULL,
    cancellation_reason TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des détails de vente
CREATE TABLE IF NOT EXISTS sale_items (
    id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    sale_id CHAR(36),
    item_type ENUM('medication', 'exam') NOT NULL,
    item_id CHAR(36) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
);

-- Table des examens
CREATE TABLE IF NOT EXISTS exams (
    id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    exam_type_id CHAR(36),
    patient_name VARCHAR(255) NOT NULL,
    patient_age VARCHAR(10),
    price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    exam_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sale_id CHAR(36),
    user_id CHAR(36),
    is_cancelled BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (exam_type_id) REFERENCES exam_types(id),
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des dépenses
CREATE TABLE IF NOT EXISTS expenses (
    id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    expense_category_id CHAR(36),
    category_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    supplier VARCHAR(255),
    expense_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    receipt_number VARCHAR(100),
    user_id CHAR(36),
    is_cancelled BOOLEAN DEFAULT FALSE,
    cancelled_at TIMESTAMP NULL,
    cancellation_reason TEXT,
    FOREIGN KEY (expense_category_id) REFERENCES expense_categories(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des sessions utilisateurs
CREATE TABLE IF NOT EXISTS user_sessions (
    id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    user_id CHAR(36),
    session_token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des actions utilisateurs (audit)
CREATE TABLE IF NOT EXISTS user_actions (
    id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    user_id CHAR(36),
    action_type VARCHAR(50) NOT NULL,
    table_name VARCHAR(50),
    record_id CHAR(36),
    description TEXT,
    amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Index pour optimiser les performances
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_invoice ON sales(invoice_number);
CREATE INDEX idx_medications_active ON medications(is_active);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Fonction pour générer les numéros de facture (MySQL)
DELIMITER //
CREATE FUNCTION generate_invoice_number() 
RETURNS VARCHAR(50)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE next_number INT;
    DECLARE invoice_num VARCHAR(50);
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number, 2) AS UNSIGNED)), 0) + 1 
    INTO next_number 
    FROM sales 
    WHERE invoice_number REGEXP '^F[0-9]+$';
    
    SET invoice_num = CONCAT('F', LPAD(next_number, 6, '0'));
    
    RETURN invoice_num;
END//
DELIMITER ;

SET FOREIGN_KEY_CHECKS = 1;

-- Données par défaut - Catégories de dépenses
INSERT IGNORE INTO expense_categories (name, description) VALUES
('Achat médicaments', 'Achat de stock pharmaceutique'),
('Maintenance équipements', 'Réparation et maintenance du matériel médical'),
('Fournitures bureau', 'Papeterie et fournitures administratives'),
('Électricité', 'Factures d\'électricité'),
('Eau', 'Factures d\'eau'),
('Internet/Téléphone', 'Frais de télécommunications'),
('Carburant', 'Essence et transport'),
('Nettoyage', 'Produits et services de nettoyage'),
('Sécurité', 'Services de sécurité'),
('Autres', 'Autres dépenses diverses');

-- Données par défaut - Types d'examens
INSERT IGNORE INTO exam_types (name, description, base_price, duration_minutes, department) VALUES
('Consultation générale', 'Consultation médicale standard', 5000, 30, 'Médecine générale'),
('Prise de tension', 'Mesure de la tension artérielle', 2000, 10, 'Cardiologie'),
('Test de glycémie', 'Test du taux de sucre dans le sang', 3000, 15, 'Laboratoire'),
('Pansement', 'Soins de pansement', 1500, 15, 'Soins infirmiers'),
('Injection', 'Administration d\'injection', 2500, 10, 'Soins infirmiers'),
('Vaccination', 'Administration de vaccins', 8000, 20, 'Prévention');

-- Données par défaut - Médicaments de base
INSERT IGNORE INTO medications (name, description, category, unit_price, stock_quantity, min_stock_level, supplier) VALUES
('Paracétamol 500mg', 'Antalgique et antipyrétique', 'Antalgiques', 250, 100, 20, 'Pharmacie Centrale'),
('Amoxicilline 500mg', 'Antibiotique à large spectre', 'Antibiotiques', 500, 50, 10, 'Pharmacie Centrale'),
('Aspirine 100mg', 'Antiagrégant plaquettaire', 'Cardiologie', 150, 80, 15, 'Pharmacie Centrale'),
('Oméprazole 20mg', 'Inhibiteur de la pompe à protons', 'Gastroentérologie', 300, 60, 12, 'Pharmacie Centrale'),
('Metformine 500mg', 'Antidiabétique oral', 'Diabète', 400, 40, 8, 'Pharmacie Centrale');

-- Création du premier utilisateur administrateur par défaut
-- Mot de passe: admin123 (à changer en production)
INSERT IGNORE INTO users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@caisse-medicale.com', 'YWRtaW4xMjM=', 'Administrateur Système', 'admin');

-- =====================================================
-- SCHEMA MYSQL COMPLET - PRÊT POUR PRODUCTION
-- =====================================================
