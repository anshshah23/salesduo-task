-- Migration to add original data columns to optimization_history table
USE salesduo_db;

ALTER TABLE optimization_history 
ADD COLUMN original_title TEXT AFTER product_id,
ADD COLUMN original_bullet_points JSON AFTER original_title,
ADD COLUMN original_description TEXT AFTER original_bullet_points,
ADD COLUMN product_details JSON AFTER original_description;
