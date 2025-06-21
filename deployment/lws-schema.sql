
-- =====================================================
-- SCHEMA MYSQL POUR DEPLOIEMENT LWS
-- Base: afric2012609_225kcxe
-- Utilisateur: afric2012609
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) NOT NULL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'gestionnaire', 'caissier') NOT NULL DEFAULT 'caissier',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des médicaments
CREATE TABLE IF NOT EXISTS medications (
    id CHAR(36) NOT NULL PRIMARY KEY,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des types d'examens
CREATE TABLE IF NOT EXISTS exam_types (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    duration_minutes INT DEFAULT 30,
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des catégories de dépenses
CREATE TABLE IF NOT EXISTS expense_categories (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des ventes
CREATE TABLE IF NOT EXISTS sales (
    id CHAR(36) NOT NULL PRIMARY KEY,
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
    INDEX idx_sales_date (sale_date),
    INDEX idx_sales_invoice (invoice_number),
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des détails de vente
CREATE TABLE IF NOT EXISTS sale_items (
    id CHAR(36) NOT NULL PRIMARY KEY,
    sale_id CHAR(36),
    item_type ENUM('medication', 'exam') NOT NULL,
    item_id CHAR(36) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sale_items_sale_id (sale_id),
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des examens
CREATE TABLE IF NOT EXISTS exams (
    id CHAR(36) NOT NULL PRIMARY KEY,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des dépenses
CREATE TABLE IF NOT EXISTS expenses (
    id CHAR(36) NOT NULL PRIMARY KEY,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Insertion des données par défaut

-- Catégories de dépenses
INSERT IGNORE INTO expense_categories (id, name, description) VALUES
(UUID(), 'Achat médicaments', 'Achat de stock pharmaceutique'),
(UUID(), 'Maintenance équipements', 'Réparation et maintenance du matériel médical'),
(UUID(), 'Fournitures bureau', 'Papeterie et fournitures administratives'),
(UUID(), 'Électricité', 'Factures d\'électricité'),
(UUID(), 'Eau', 'Factures d\'eau'),
(UUID(), 'Internet/Téléphone', 'Frais de télécommunications'),
(UUID(), 'Carburant', 'Essence et transport'),
(UUID(), 'Nettoyage', 'Produits et services de nettoyage'),
(UUID(), 'Sécurité', 'Services de sécurité'),
(UUID(), 'Autres', 'Autres dépenses diverses');

-- Types d'examens
INSERT IGNORE INTO exam_types (id, name, description, base_price, duration_minutes, department) VALUES
(UUID(), 'Consultation générale', 'Consultation médicale standard', 5000, 30, 'Médecine générale'),
(UUID(), 'Prise de tension', 'Mesure de la tension artérielle', 2000, 10, 'Cardiologie'),
(UUID(), 'Test de glycémie', 'Test du taux de sucre dans le sang', 3000, 15, 'Laboratoire'),
(UUID(), 'Pansement', 'Soins de pansement', 1500, 15, 'Soins infirmiers'),
(UUID(), 'Injection', 'Administration d\'injection', 2500, 10, 'Soins infirmiers'),
(UUID(), 'Vaccination', 'Administration de vaccins', 8000, 20, 'Prévention');

-- Médicaments de base
INSERT IGNORE INTO medications (id, name, description, category, unit_price, stock_quantity, min_stock_level, supplier) VALUES
(UUID(), 'Paracétamol 500mg', 'Antalgique et antipyrétique', 'Antalgiques', 250, 100, 20, 'Pharmacie Centrale'),
(UUID(), 'Amoxicilline 500mg', 'Antibiotique à large spectre', 'Antibiotiques', 500, 50, 10, 'Pharmacie Centrale'),
(UUID(), 'Aspirine 100mg', 'Antiagrégant plaquettaire', 'Cardiologie', 150, 80, 15, 'Pharmacie Centrale'),
(UUID(), 'Oméprazole 20mg', 'Inhibiteur de la pompe à protons', 'Gastroentérologie', 300, 60, 12, 'Pharmacie Centrale'),
(UUID(), 'Metformine 500mg', 'Antidiabétique oral', 'Diabète', 400, 40, 8, 'Pharmacie Centrale');

-- Utilisateur administrateur par défaut
-- Mot de passe: admin123 (encodé en base64)
INSERT IGNORE INTO users (id, username, email, password_hash, full_name, role) VALUES
(UUID(), 'admin', 'admin@caisse-medicale.com', 'YWRtaW4xMjM=', 'Administrateur Système', 'admin');

-- =====================================================
-- SCHEMA COMPLETE POUR LWS - PRET POUR PRODUCTION
-- =====================================================
