// Vercel Serverless Function to get products from Supabase
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }
  
  // Initialize Supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  
  try {
    // Get all products
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Transform data to match frontend format
    const products = data.map(p => ({
      id: p.id,
      title: p.title,
      artist: p.artist,
      artistContact: p.artist_contact,
      price: p.price,
      category: p.category,
      image: p.image,
      description: p.description,
      featured: p.featured,
      sold: p.sold
    }));
    
    return res.status(200).json({
      products: products
    });
    
  } catch (error) {
    console.error('Error loading products:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to load products'
    });
  }
}

