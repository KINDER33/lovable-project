
-- =====================================================
-- SCHEMA MYSQL POUR DEPLOIEMENT LWS PRODUCTION
-- Base: afric2012609_225kcxe
-- Utilisateur: afric2012609
-- DONNEES PAR DEFAUT INCLUSES
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Supprimer les tables existantes si elles existent
DROP TABLE IF EXISTS `sale_items`;
DROP TABLE IF EXISTS `sales`;
DROP TABLE IF EXISTS `exams`;
DROP TABLE IF EXISTS `expenses`;
DROP TABLE IF EXISTS `user_sessions`;
DROP TABLE IF EXISTS `user_actions`;
DROP TABLE IF EXISTS `medications`;
DROP TABLE IF EXISTS `exam_types`;
DROP TABLE IF EXISTS `expense_categories`;
DROP TABLE IF EXISTS `users`;

-- Table des utilisateurs
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL PRIMARY KEY,
    `username` VARCHAR(50) UNIQUE NOT NULL,
    `email` VARCHAR(100) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'gestionnaire', 'caissier') NOT NULL DEFAULT 'caissier',
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX `idx_users_username` (`username`),
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des médicaments
CREATE TABLE `medications` (
    `id` CHAR(36) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `category` VARCHAR(100),
    `unit_price` DECIMAL(10,2) NOT NULL DEFAULT 0,
    `stock_quantity` INT NOT NULL DEFAULT 0,
    `min_stock_level` INT DEFAULT 10,
    `supplier` VARCHAR(255),
    `expiry_date` DATE,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX `idx_medications_name` (`name`),
    INDEX `idx_medications_category` (`category`),
    INDEX `idx_medications_stock` (`stock_quantity`),
    INDEX `idx_medications_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des types d'examens
CREATE TABLE `exam_types` (
    `id` CHAR(36) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `base_price` DECIMAL(10,2) NOT NULL DEFAULT 0,
    `duration_minutes` INT DEFAULT 30,
    `department` VARCHAR(100),
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX `idx_exam_types_name` (`name`),
    INDEX `idx_exam_types_department` (`department`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des catégories de dépenses
CREATE TABLE `expense_categories` (
    `id` CHAR(36) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX `idx_expense_categories_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des ventes
CREATE TABLE `sales` (
    `id` CHAR(36) NOT NULL PRIMARY KEY,
    `invoice_number` VARCHAR(50) UNIQUE NOT NULL,
    `customer_name` VARCHAR(255),
    `total_amount` DECIMAL(10,2) NOT NULL DEFAULT 0,
    `payment_method` VARCHAR(50) DEFAULT 'cash',
    `sale_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `cashier_name` VARCHAR(255),
    `user_id` CHAR(36),
    `notes` TEXT,
    `is_cancelled` BOOLEAN DEFAULT FALSE,
    `cancelled_at` TIMESTAMP NULL,
    `cancellation_reason` TEXT,
    
    INDEX `idx_sales_date` (`sale_date`),
    INDEX `idx_sales_invoice` (`invoice_number`),
    INDEX `idx_sales_cashier` (`cashier_name`),
    INDEX `idx_sales_cancelled` (`is_cancelled`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des détails de vente
CREATE TABLE `sale_items` (
    `id` CHAR(36) NOT NULL PRIMARY KEY,
    `sale_id` CHAR(36) NOT NULL,
    `item_type` ENUM('medication', 'exam') NOT NULL,
    `item_id` CHAR(36) NOT NULL,
    `item_name` VARCHAR(255) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `unit_price` DECIMAL(10,2) NOT NULL,
    `total_price` DECIMAL(10,2) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX `idx_sale_items_sale_id` (`sale_id`),
    INDEX `idx_sale_items_type` (`item_type`),
    FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des examens
CREATE TABLE `exams` (
    `id` CHAR(36) NOT NULL PRIMARY KEY,
    `exam_type_id` CHAR(36),
    `patient_name` VARCHAR(255) NOT NULL,
    `patient_age` VARCHAR(10),
    `price` DECIMAL(10,2) NOT NULL,
    `notes` TEXT,
    `exam_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `sale_id` CHAR(36),
    `user_id` CHAR(36),
    `is_cancelled` BOOLEAN DEFAULT FALSE,
    
    INDEX `idx_exams_date` (`exam_date`),
    INDEX `idx_exams_patient` (`patient_name`),
    FOREIGN KEY (`exam_type_id`) REFERENCES `exam_types`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des dépenses
CREATE TABLE `expenses` (
    `id` CHAR(36) NOT NULL PRIMARY KEY,
    `expense_category_id` CHAR(36),
    `category_name` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `description` TEXT,
    `supplier` VARCHAR(255),
    `expense_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `receipt_number` VARCHAR(100),
    `user_id` CHAR(36),
    `is_cancelled` BOOLEAN DEFAULT FALSE,
    `cancelled_at` TIMESTAMP NULL,
    `cancellation_reason` TEXT,
    
    INDEX `idx_expenses_date` (`expense_date`),
    INDEX `idx_expenses_category` (`category_name`),
    FOREIGN KEY (`expense_category_id`) REFERENCES `expense_categories`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- INSERTION DES DONNEES PAR DEFAUT
-- =====================================================

-- Utilisateur administrateur par défaut
INSERT INTO `users` (id, username, email, password_hash, full_name, role) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'admin', 'admin@caisse-medicale.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrateur', 'admin');

-- Médicaments de base
INSERT INTO `medications` (id, name, description, category, unit_price, stock_quantity, min_stock_level, supplier) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Paracétamol 500mg', 'Antalgique et antipyrétique', 'Antalgiques', 2.50, 100, 20, 'Pharma Plus'),
('550e8400-e29b-41d4-a716-446655440002', 'Amoxicilline 500mg', 'Antibiotique à large spectre', 'Antibiotiques', 5.00, 50, 10, 'Pharma Plus'),
('550e8400-e29b-41d4-a716-446655440003', 'Aspirine 100mg', 'Antiagrégant plaquettaire', 'Antalgiques', 1.75, 80, 15, 'Pharma Plus'),
('550e8400-e29b-41d4-a716-446655440004', 'Oméprazole 20mg', 'Inhibiteur de la pompe à protons', 'Gastro-entérologie', 3.25, 40, 10, 'Pharma Plus');

-- Types d'examens de base
INSERT INTO `exam_types` (id, name, description, base_price, duration_minutes, department) VALUES 
('550e8400-e29b-41d4-a716-446655440005', 'Consultation générale', 'Consultation médicale générale', 15000, 30, 'Médecine générale'),
('550e8400-e29b-41d4-a716-446655440006', 'Prise de tension', 'Mesure de la tension artérielle', 2000, 10, 'Soins infirmiers'),
('550e8400-e29b-41d4-a716-446655440007', 'Test de glycémie', 'Mesure du taux de glucose sanguin', 3000, 15, 'Analyses'),
('550e8400-e29b-41d4-a716-446655440008', 'Vaccination', 'Administration de vaccins', 5000, 20, 'Soins infirmiers');

-- Catégories de dépenses de base
INSERT INTO `expense_categories` (id, name, description) VALUES 
('550e8400-e29b-41d4-a716-446655440009', 'Achat médicaments', 'Achat de stock de médicaments'),
('550e8400-e29b-41d4-a716-446655440010', 'Fournitures bureau', 'Fournitures de bureau et papeterie'),
('550e8400-e29b-41d4-a716-446655440011', 'Électricité/Eau', 'Factures d\'électricité et d\'eau'),
('550e8400-e29b-41d4-a716-446655440012', 'Maintenance équipements', 'Entretien et réparation des équipements');

-- =====================================================
-- VERSION PRODUCTION LWS - PRETE A L'EMPLOI
-- =====================================================
