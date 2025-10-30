// Vercel Serverless Function to upload images to Supabase Storage
import { createClient } from '@supabase/supabase-js';
import multiparty from 'multiparty';
import fs from 'fs';

// CRITICAL: Disable Vercel's automatic body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
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
    // Parse multipart form data using multiparty
    const form = new multiparty.Form();
    
    const parseForm = () => {
      return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) {
            reject(err);
            return;
          }
          resolve({ fields, files });
        });
      });
    };
    
    const { fields, files } = await parseForm();
    
    console.log('Parsed files:', files);
    
    // Check if image file was uploaded
    if (!files.image || !files.image[0]) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }
    
    const uploadedFile = files.image[0];
    console.log('File details:', {
      originalFilename: uploadedFile.originalFilename,
      size: uploadedFile.size,
      path: uploadedFile.path
    });
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const fileType = uploadedFile.headers['content-type'];
    
    if (!validTypes.includes(fileType)) {
      // Clean up temp file
      fs.unlinkSync(uploadedFile.path);
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed.'
      });
    }
    
    // Validate file size (max 5MB)
    if (uploadedFile.size > 5 * 1024 * 1024) {
      // Clean up temp file
      fs.unlinkSync(uploadedFile.path);
      return res.status(400).json({
        success: false,
        message: 'File size must be less than 5MB'
      });
    }
    
    // Read file buffer
    const fileBuffer = fs.readFileSync(uploadedFile.path);
    
    // Generate unique filename
    const timestamp = Date.now();
    const ext = uploadedFile.originalFilename.split('.').pop() || 'jpg';
    const uniqueFileName = `product-${timestamp}.${ext}`;
    
    console.log('Uploading to Supabase:', uniqueFileName);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(uniqueFileName, fileBuffer, {
        contentType: fileType,
        cacheControl: '3600',
        upsert: false
      });
    
    // Clean up temp file
    fs.unlinkSync(uploadedFile.path);
    
    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(error.message || 'Failed to upload to Supabase Storage');
    }
    
    console.log('Upload successful:', data);
    
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
