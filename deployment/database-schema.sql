
-- Schéma de base de données pour Caisse Médicale
-- Compatible MySQL et MariaDB

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'caissier') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des médicaments
CREATE TABLE IF NOT EXISTS medications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    stock_quantity INT NOT NULL DEFAULT 0,
    min_stock_level INT DEFAULT 10,
    supplier VARCHAR(100),
    expiry_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des types d'examens
CREATE TABLE IF NOT EXISTS exam_types (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    department VARCHAR(50),
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    duration_minutes INT DEFAULT 30,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des catégories de dépenses
CREATE TABLE IF NOT EXISTS expense_categories (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des ventes
CREATE TABLE IF NOT EXISTS sales (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    invoice_number VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(100),
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    payment_method VARCHAR(20) DEFAULT 'cash',
    cashier_name VARCHAR(100),
    user_id CHAR(36),
    notes TEXT,
    is_cancelled BOOLEAN DEFAULT FALSE,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des articles de vente
CREATE TABLE IF NOT EXISTS sale_items (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    sale_id CHAR(36),
    item_id CHAR(36) NOT NULL,
    item_type VARCHAR(20) NOT NULL, -- 'medication' ou 'exam'
    item_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des examens
CREATE TABLE IF NOT EXISTS exams (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    exam_type_id CHAR(36),
    sale_id CHAR(36),
    patient_name VARCHAR(100) NOT NULL,
    patient_age VARCHAR(10),
    price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    user_id CHAR(36),
    is_cancelled BOOLEAN DEFAULT FALSE,
    exam_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des dépenses
CREATE TABLE IF NOT EXISTS expenses (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    expense_category_id CHAR(36),
    category_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    supplier VARCHAR(100),
    receipt_number VARCHAR(50),
    description TEXT,
    user_id CHAR(36),
    is_cancelled BOOLEAN DEFAULT FALSE,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP NULL,
    expense_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des sessions utilisateur
CREATE TABLE IF NOT EXISTS user_sessions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des actions utilisateur (log)
CREATE TABLE IF NOT EXISTS user_actions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36),
    action_type VARCHAR(50) NOT NULL,
    table_name VARCHAR(50),
    record_id CHAR(36),
    description TEXT,
    amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les performances
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_invoice ON sales(invoice_number);
CREATE INDEX idx_medications_name ON medications(name);
CREATE INDEX idx_medications_category ON medications(category);
CREATE INDEX idx_exam_types_name ON exam_types(name);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- Données de base par défaut
INSERT IGNORE INTO expense_categories (id, name, description) VALUES
(UUID(), 'Achat médicaments', 'Achat de nouveaux médicaments et fournitures'),
(UUID(), 'Fournitures bureau', 'Papeterie, imprimantes, matériel de bureau'),
(UUID(), 'Électricité/Eau', 'Factures d\'électricité et d\'eau'),
(UUID(), 'Maintenance équipements', 'Réparation et maintenance du matériel médical');

INSERT IGNORE INTO exam_types (id, name, description, department, base_price, duration_minutes) VALUES
(UUID(), 'Consultation générale', 'Consultation médicale générale', 'Médecine générale', 25.00, 30),
(UUID(), 'Prise de tension', 'Mesure de la tension artérielle', 'Cardiologie', 5.00, 10),
(UUID(), 'Test de glycémie', 'Test du taux de sucre dans le sang', 'Diabétologie', 8.00, 15),
(UUID(), 'Vaccination', 'Administration de vaccins', 'Prévention', 15.00, 20);

-- Compte administrateur par défaut (mot de passe: admin123)
INSERT IGNORE INTO users (id, username, email, password_hash, full_name, role) VALUES
(UUID(), 'admin', 'admin@caisse-medicale.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrateur', 'admin');
