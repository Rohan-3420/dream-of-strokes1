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
  console.log('=== UPLOAD IMAGE API CALLED ===');
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }
  
  // Check environment variables
  console.log('Checking environment variables...');
  console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
  console.log('SUPABASE_ANON_KEY exists:', !!process.env.SUPABASE_ANON_KEY);
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase credentials');
    return res.status(500).json({
      success: false,
      message: 'Supabase credentials not configured'
    });
  }
  
  console.log('✅ Environment variables verified');
  
  // Initialize Supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  
  try {
    console.log('🔄 Starting multipart form parsing...');
    
    // Parse multipart form data using multiparty
    const form = new multiparty.Form();
    
    const parseForm = () => {
      return new Promise((resolve, reject) => {
        console.log('📋 Multiparty parsing initiated');
        form.parse(req, (err, fields, files) => {
          if (err) {
            console.error('❌ Multiparty parsing error:', err);
            reject(err);
            return;
          }
          console.log('✅ Multiparty parsing completed');
          resolve({ fields, files });
        });
      });
    };
    
    const { fields, files } = await parseForm();
    
    console.log('📦 Parsed fields:', JSON.stringify(fields));
    console.log('📁 Parsed files:', JSON.stringify(Object.keys(files)));
    
    // Check if image file was uploaded
    if (!files.image || !files.image[0]) {
      console.error('❌ No image file found in request');
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }
    
    const uploadedFile = files.image[0];
    console.log('📄 File details:', {
      originalFilename: uploadedFile.originalFilename,
      size: uploadedFile.size,
      sizeInMB: (uploadedFile.size / 1024 / 1024).toFixed(2) + ' MB',
      path: uploadedFile.path,
      headers: uploadedFile.headers
    });
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const fileType = uploadedFile.headers['content-type'];
    
    console.log('🔍 Validating file type:', fileType);
    
    if (!validTypes.includes(fileType)) {
      console.error('❌ Invalid file type:', fileType);
      // Clean up temp file
      fs.unlinkSync(uploadedFile.path);
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed.'
      });
    }
    
    console.log('✅ File type valid');
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    console.log('🔍 Validating file size:', uploadedFile.size, 'bytes (max:', maxSize, 'bytes)');
    
    if (uploadedFile.size > maxSize) {
      console.error('❌ File too large:', uploadedFile.size, 'bytes');
      // Clean up temp file
      fs.unlinkSync(uploadedFile.path);
      return res.status(400).json({
        success: false,
        message: 'File size must be less than 5MB'
      });
    }
    
    console.log('✅ File size valid');
    
    // Read file buffer
    console.log('📖 Reading file buffer from:', uploadedFile.path);
    const fileBuffer = fs.readFileSync(uploadedFile.path);
    console.log('✅ File buffer read, size:', fileBuffer.length, 'bytes');
    
    // Generate unique filename
    const timestamp = Date.now();
    const ext = uploadedFile.originalFilename.split('.').pop() || 'jpg';
    const uniqueFileName = `product-${timestamp}.${ext}`;
    
    console.log('📝 Generated unique filename:', uniqueFileName);
    console.log('☁️ Uploading to Supabase Storage bucket: product-images');
    
    // Upload to Supabase Storage
    const uploadOptions = {
      contentType: fileType,
      cacheControl: '3600',
      upsert: false
    };
    console.log('Upload options:', uploadOptions);
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(uniqueFileName, fileBuffer, uploadOptions);
    
    // Clean up temp file
    console.log('🧹 Cleaning up temp file');
    fs.unlinkSync(uploadedFile.path);
    
    if (error) {
      console.error('❌ Supabase upload error:', JSON.stringify(error, null, 2));
      throw new Error(error.message || 'Failed to upload to Supabase Storage');
    }
    
    console.log('✅ Upload successful to Supabase');
    console.log('Upload data:', JSON.stringify(data, null, 2));
    
    // Get public URL
    console.log('🔗 Getting public URL...');
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(uniqueFileName);
    
    console.log('✅ Public URL generated:', urlData.publicUrl);
    
    const response = {
      success: true,
      message: 'Image uploaded successfully',
      url: urlData.publicUrl,
      fileName: uniqueFileName
    };
    
    console.log('📤 Sending success response:', JSON.stringify(response));
    
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('💥 CRITICAL ERROR in upload handler');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image',
      errorDetails: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
