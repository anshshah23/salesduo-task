-- PostgreSQL Schema for Supabase
-- Note: Database creation is handled by Supabase, just run the table creation

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    asin VARCHAR(20) NOT NULL UNIQUE,
    original_title TEXT NOT NULL,
    original_bullet_points JSONB,
    original_description TEXT,
    product_details JSONB,
    optimized_title TEXT,
    optimized_bullet_points JSONB,
    optimized_description TEXT,
    keywords JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on asin for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_asin ON products(asin);

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS optimization_history (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    original_title TEXT,
    original_bullet_points JSONB,
    original_description TEXT,
    product_details JSONB,
    optimized_title TEXT,
    optimized_bullet_points JSONB,
    optimized_description TEXT,
    keywords JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create indexes for optimization_history
CREATE INDEX IF NOT EXISTS idx_optimization_history_product_id ON optimization_history(product_id);
CREATE INDEX IF NOT EXISTS idx_optimization_history_created_at ON optimization_history(created_at);