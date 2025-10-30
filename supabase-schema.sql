-- Supabase Database Schema for Dream of Strokes
-- Run this in your Supabase SQL Editor

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  artist_contact TEXT NOT NULL,
  price TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  sold BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index on featured products for faster queries
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

-- Create index on sold products for faster queries
CREATE INDEX IF NOT EXISTS idx_products_sold ON products(sold);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Create index on artist for filtering
CREATE INDEX IF NOT EXISTS idx_products_artist ON products(artist);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON products
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated insert/update/delete
-- For now, we'll allow all operations (you can restrict this later)
CREATE POLICY "Allow all operations" ON products
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert sample data from products.json
INSERT INTO products (id, title, artist, artist_contact, price, category, image, description, featured, sold)
VALUES 
  (1, 'Arabic Calligraphy (Black & White)', 'Rohan Shahzad', '923354581567', '50,000.00', 'Calligraphy', 'images/products/rohan c1 (copy).jpeg', 'An elegant acrylic painting that showcases the beauty of Arabic script through bold black and white strokes. The artwork highlights the rhythm and flow of traditional calligraphy, creating a stunning visual statement that celebrates Islamic art and cultural heritage.', true, false),
  (2, 'Islamic Calligraphy Canvas', 'Rohan Shahzad', '923354581567', '45,000.00', 'Calligraphy', 'images/products/rohan c2 (copy).jpeg', 'A beautiful Islamic calligraphy piece featuring intricate Arabic script on canvas. This artwork combines traditional calligraphic techniques with contemporary styling.', true, false),
  (3, 'Arabic Script Art', 'Fasih-ur-Rehman', '923158773306', '40,000.00', 'Calligraphy', 'images/products/fasih c1.png', 'A stunning display of Arabic calligraphy expertise. This piece showcases the artistic beauty of Islamic script with precision and elegance.', false, false),
  (4, 'Still Life Composition', 'Ahmad Abbas', '923279784423', '35,000.00', 'Still Life', 'images/products/ahmad s1.png', 'A classic still life painting featuring everyday objects arranged with artistic precision. The use of light and shadow creates depth and dimension.', false, false)
ON CONFLICT (id) DO NOTHING;

