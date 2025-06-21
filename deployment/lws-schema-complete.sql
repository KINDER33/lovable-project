
-- =====================================================
-- SCHEMA MYSQL COMPLET POUR DEPLOIEMENT LWS OPTIMISE
-- Base: afric2012609_225kcxe
-- Utilisateur: afric2012609
-- Date: 2025-06-08
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

-- Catégories de dépenses par défaut
INSERT INTO `expense_categories` (`id`, `name`, `description`) VALUES
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

-- Types d'examens par défaut
INSERT INTO `exam_types` (`id`, `name`, `description`, `base_price`, `duration_minutes`, `department`) VALUES
(UUID(), 'Consultation générale', 'Consultation médicale standard', 5000.00, 30, 'Médecine générale'),
(UUID(), 'Prise de tension', 'Mesure de la tension artérielle', 2000.00, 10, 'Cardiologie'),
(UUID(), 'Test de glycémie', 'Test du taux de sucre dans le sang', 3000.00, 15, 'Laboratoire'),
(UUID(), 'Pansement', 'Soins de pansement', 1500.00, 15, 'Soins infirmiers'),
(UUID(), 'Injection', 'Administration d\'injection', 2500.00, 10, 'Soins infirmiers'),
(UUID(), 'Vaccination', 'Administration de vaccins', 8000.00, 20, 'Prévention');

-- Médicaments par défaut
INSERT INTO `medications` (`id`, `name`, `description`, `category`, `unit_price`, `stock_quantity`, `min_stock_level`, `supplier`) VALUES
(UUID(), 'Paracétamol 500mg', 'Antalgique et antipyrétique', 'Antalgiques', 250.00, 100, 20, 'Pharmacie Centrale'),
(UUID(), 'Amoxicilline 500mg', 'Antibiotique à large spectre', 'Antibiotiques', 500.00, 50, 10, 'Pharmacie Centrale'),
(UUID(), 'Aspirine 100mg', 'Antiagrégant plaquettaire', 'Cardiologie', 150.00, 80, 15, 'Pharmacie Centrale'),
(UUID(), 'Oméprazole 20mg', 'Inhibiteur de la pompe à protons', 'Gastroentérologie', 300.00, 60, 12, 'Pharmacie Centrale'),
(UUID(), 'Metformine 500mg', 'Antidiabétique oral', 'Diabète', 400.00, 40, 8, 'Pharmacie Centrale'),
(UUID(), 'Ibuprofène 400mg', 'Anti-inflammatoire non stéroïdien', 'Anti-inflammatoires', 350.00, 75, 15, 'Pharmacie Centrale'),
(UUID(), 'Dexamethasone 4mg', 'Corticoïde', 'Anti-inflammatoires', 800.00, 30, 5, 'Pharmacie Centrale'),
(UUID(), 'Captopril 25mg', 'Inhibiteur de l\'enzyme de conversion', 'Cardiologie', 450.00, 60, 10, 'Pharmacie Centrale');

-- Utilisateur administrateur par défaut
-- Mot de passe: admin123 (encodé en base64)
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `full_name`, `role`) VALUES
(UUID(), 'admin', 'admin@caisse-medicale.com', 'YWRtaW4xMjM=', 'Administrateur Système', 'admin');

-- =====================================================
-- OPTIMISATIONS POUR LWS
-- =====================================================

-- Configuration des variables MySQL pour LWS
SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';
SET SESSION time_zone = '+00:00';

-- =====================================================
-- SCHEMA COMPLET POUR LWS - VERSION OPTIMISEE
-- Toutes les tables, index et données par défaut inclus
-- Prêt pour la production
-- =====================================================
