
-- =====================================================
-- SCHEMA MYSQL VIERGE POUR DEPLOIEMENT LWS
-- Base: afric2012609_225kcxe
-- Utilisateur: afric2012609
-- AUCUNE DONNEE PAR DEFAUT - SYSTEME VIERGE
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
-- AUCUNE DONNEE PAR DEFAUT - SYSTEME COMPLETEMENT VIERGE
-- Prêt pour la configuration initiale via l'interface
-- =====================================================
