-- ==========================================
-- CPNS Tryout Platform Database Schema & Seed
-- Target: MySQL (5.7+ / 8.0+)
-- ==========================================

CREATE DATABASE IF NOT EXISTS `wildan_tryout` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `wildan_tryout`;

-- --------------------------------------------------------
-- 1. Table: users
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'user') DEFAULT 'user',
  `is_active` BOOLEAN DEFAULT TRUE,
  `phone_number` VARCHAR(20) DEFAULT NULL,
  `registration_number` VARCHAR(100) DEFAULT NULL UNIQUE,
  `avatar` VARCHAR(500) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. Table: categories
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Table: tryouts
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tryouts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `duration` INT NOT NULL COMMENT 'duration in minutes',
  `total_questions` INT DEFAULT 0,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `category` ENUM('Tryout', 'Kelas Online', 'E-Book', 'Bundling') NOT NULL DEFAULT 'Tryout',
  `image_url` LONGTEXT DEFAULT NULL,
  `original_price` INT DEFAULT 0,
  `discount_percentage` INT DEFAULT 0,
  `price` INT DEFAULT 0,
  `benefits` JSON DEFAULT NULL,
  `shield_award` JSON DEFAULT NULL,
  `scoring_type` ENUM('BINARY', 'WEIGHTED_1_5', 'WEIGHTED_1_4') NOT NULL DEFAULT 'BINARY',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. Table: questions
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `questions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tryout_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `question` TEXT NOT NULL,
  `option_a` TEXT NOT NULL,
  `option_b` TEXT NOT NULL,
  `option_c` TEXT NOT NULL,
  `option_d` TEXT NOT NULL,
  `option_e` TEXT NOT NULL,
  `correct_answer` VARCHAR(5) NOT NULL,
  `option_weights` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`tryout_id`) REFERENCES `tryouts` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. Table: attempts
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `attempts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `tryout_id` INT NOT NULL,
  `score` INT DEFAULT 0,
  `started_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `finished_at` DATETIME DEFAULT NULL,
  `status` ENUM('ongoing', 'completed') DEFAULT 'ongoing',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tryout_id`) REFERENCES `tryouts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. Table: answers
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `answers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `attempt_id` INT NOT NULL,
  `question_id` INT NOT NULL,
  `selected_answer` VARCHAR(5) DEFAULT NULL,
  `is_correct` BOOLEAN DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- PLACEHOLDER TABLES FOR FUTURE RP812 MILLION UPGRADE
-- ========================================================

-- --------------------------------------------------------
-- 7. Table: packages (Placeholder)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `packages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `description` TEXT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 8. Table: transactions
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` INT NOT NULL,
  `tryout_id` INT NOT NULL,
  `amount` VARCHAR(50) NOT NULL,
  `status` ENUM('pending', 'success', 'failed') DEFAULT 'pending',
  `payment_method` VARCHAR(255) DEFAULT NULL,
  `proof_image` LONGTEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tryout_id`) REFERENCES `tryouts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 9. Table: payments (Placeholder)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `transaction_id` INT NOT NULL,
  `payment_gateway_ref` VARCHAR(255) DEFAULT NULL,
  `status` VARCHAR(50) DEFAULT 'pending',
  `payload` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 10. Table: videos (Placeholder)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `videos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `category_id` INT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================================
-- DATA SEEDING (INITIAL VALUES)
-- ========================================================

-- Seed Categories
INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) 
VALUES 
(1, 'TWK', NOW(), NOW()),
(2, 'TIU', NOW(), NOW()),
(3, 'TKP', NOW(), NOW())
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Seed Users
-- Hashed passwords represent 'admin123' and 'user123' respectively (using bcrypt)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `is_active`, `created_at`, `updated_at`) 
VALUES 
(1, 'Admin Wildan', 'admin@wildan.com', '$2a$10$.Z..6PUwTQK0Fp3qC7CnHO.QX9rWSl2kkkRwg2kKN2aT0DJ53wuAa', 'admin', 1, NOW(), NOW()),
(2, 'Candidate User', 'user@wildan.com', '$2a$10$pZSvQPdkM6XMNlGUaWWU6.zXtK9fFWSa5XsHt3UDKx/Q4TMWlTcGS', 'user', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `email`=VALUES(`email`);

-- Seed Tryouts
INSERT INTO `tryouts` (`id`, `title`, `description`, `duration`, `total_questions`, `status`, `created_at`, `updated_at`) 
VALUES 
(1, 'Tryout Akbar CPNS 2026', 'Paket simulasi ujian CPNS SKD yang terdiri dari TWK, TIU, dan TKP.', 100, 3, 'active', NOW(), NOW())
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- Seed Questions
-- Question 1: TWK (Category 1)
-- Question 2: TIU (Category 2)
-- Question 3: TKP (Category 3 - with JSON option weights)
INSERT INTO `questions` (`id`, `tryout_id`, `category_id`, `question`, `option_a`, `option_b`, `option_c`, `option_d`, `option_e`, `correct_answer`, `option_weights`, `created_at`, `updated_at`) 
VALUES 
(
  1, 
  1, 
  1, 
  'Lagu kebangsaan Indonesia Raya diciptakan oleh...', 
  'W.R. Supratman', 
  'Kusbini', 
  'Ibu Soed', 
  'Ismail Marzuki', 
  'C. Simanjuntak', 
  'a', 
  NULL, 
  NOW(), 
  NOW()
),
(
  2, 
  1, 
  2, 
  'Tentukan suku berikutnya dari deret: 1, 3, 6, 10, 15, ...', 
  '19', 
  '20', 
  '21', 
  '22', 
  '25', 
  'c', 
  NULL, 
  NOW(), 
  NOW()
),
(
  3, 
  1, 
  3, 
  'Ketika Anda menghadapi tugas yang sangat menumpuk dan mendekati batas waktu (deadline), sikap Anda adalah...', 
  'Menyelesaikan seadanya yang penting selesai tepat waktu.', 
  'Menunda-nunda pekerjaan hingga mendekati hari akhir karena terbiasa bekerja di bawah tekanan.', 
  'Membuat skala prioritas, merencanakan jadwal kerja, dan fokus menyelesaikan satu per satu secara detail.', 
  'Membagi tugas dengan rekan kerja lain dan meminta bantuan mereka agar cepat beres.', 
  'Mengeluhkan banyaknya pekerjaan kepada atasan dan meminta tambahan waktu pengerjaan.', 
  'c', 
  '{"a": 3, "b": 1, "c": 5, "d": 4, "e": 2}', 
  NOW(), 
  NOW()
)
ON DUPLICATE KEY UPDATE `question`=VALUES(`question`);
