// Vercel Serverless Function to upload images to Supabase Storage
import { createClient } from '@supabase/supabase-js';

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
    // Read raw body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    // Parse multipart manually
    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(.+)$/);
    
    if (!boundaryMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid content type'
      });
    }
    
    const boundary = '--' + boundaryMatch[1];
    const parts = buffer.toString('binary').split(boundary);
    
    let fileBuffer = null;
    let fileName = 'image.jpg';
    let mimeType = 'image/jpeg';
    
    for (const part of parts) {
      if (part.includes('Content-Disposition') && part.includes('filename=')) {
        // Extract filename
        const filenameMatch = part.match(/filename="([^"]+)"/);
        if (filenameMatch) {
          fileName = filenameMatch[1];
        }
        
        // Extract mime type
        const mimeMatch = part.match(/Content-Type: ([^\r\n]+)/);
        if (mimeMatch) {
          mimeType = mimeMatch[1];
        }
        
        // Extract file data
        const dataStart = part.indexOf('\r\n\r\n');
        if (dataStart !== -1) {
          const dataEnd = part.lastIndexOf('\r\n');
          const fileData = part.substring(dataStart + 4, dataEnd);
          fileBuffer = Buffer.from(fileData, 'binary');
        }
      }
    }
    
    if (!fileBuffer) {
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

