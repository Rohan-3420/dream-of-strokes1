// Vercel Serverless Function to upload images to Supabase Storage
import { createClient } from '@supabase/supabase-js';
import Busboy from 'busboy';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for file uploads
  },
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }
  
  // Check environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return res.status(500).json({
      success: false,
      message: 'Supabase credentials not configured'
    });
  }
  
  // Initialize Supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  
  try {
    // Parse multipart form data with Busboy
    const busboy = Busboy({ headers: req.headers });
    
    let fileBuffer = null;
    let fileName = null;
    let mimeType = null;
    
    // Wait for file upload
    await new Promise((resolve, reject) => {
      busboy.on('file', (fieldname, file, info) => {
        const { filename, mimeType: fileMimeType } = info;
        fileName = filename;
        mimeType = fileMimeType;
        
        const chunks = [];
        file.on('data', (data) => {
          chunks.push(data);
        });
        
        file.on('end', () => {
          fileBuffer = Buffer.concat(chunks);
        });
      });
      
      busboy.on('finish', resolve);
      busboy.on('error', reject);
      
      req.pipe(busboy);
    });
    
    if (!fileBuffer || !fileName) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const ext = fileName.split('.').pop() || 'jpg';
    const uniqueFileName = `product-${timestamp}.${ext}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(uniqueFileName, fileBuffer, {
        contentType: mimeType || 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(error.message || 'Failed to upload to Supabase Storage');
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(uniqueFileName);
    
    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: urlData.publicUrl,
      fileName: uniqueFileName
    });
    
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image'
    });
  }
}

