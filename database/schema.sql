CREATE DATABASE IF NOT EXISTS salesduo_db;
USE salesduo_db;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asin VARCHAR(20) NOT NULL UNIQUE,
    original_title TEXT NOT NULL,
    original_bullet_points JSON,
    original_description TEXT,
    product_details JSON,
    optimized_title TEXT,
    optimized_bullet_points JSON,
    optimized_description TEXT,
    keywords JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_asin (asin)
);

CREATE TABLE IF NOT EXISTS optimization_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    original_title TEXT,
    original_bullet_points JSON,
    original_description TEXT,
    product_details JSON,
    optimized_title TEXT,
    optimized_bullet_points JSON,
    optimized_description TEXT,
    keywords JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_created_at (created_at)
);