// Vercel Serverless Function to upload images to Supabase Storage
import { createClient } from '@supabase/supabase-js';

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
    // Read raw body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    console.log('Received buffer size:', buffer.length);
    
    // Parse multipart manually
    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(.+)$/);
    
    if (!boundaryMatch) {
      console.error('No boundary found in content-type:', contentType);
      return res.status(400).json({
        success: false,
        message: 'Invalid content type - no boundary found'
      });
    }
    
    const boundary = '--' + boundaryMatch[1];
    console.log('Using boundary:', boundary);
    
    const parts = buffer.toString('binary').split(boundary);
    console.log('Found parts:', parts.length);
    
    let fileBuffer = null;
    let fileName = 'image.jpg';
    let mimeType = 'image/jpeg';
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.includes('Content-Disposition') && part.includes('filename=')) {
        console.log('Found file part at index:', i);
        
        // Extract filename
        const filenameMatch = part.match(/filename="([^"]+)"/);
        if (filenameMatch) {
          fileName = filenameMatch[1];
          console.log('Filename:', fileName);
        }
        
        // Extract mime type
        const mimeMatch = part.match(/Content-Type: ([^\r\n]+)/);
        if (mimeMatch) {
          mimeType = mimeMatch[1].trim();
          console.log('MIME type:', mimeType);
        }
        
        // Extract file data
        const dataStart = part.indexOf('\r\n\r\n');
        if (dataStart !== -1) {
          const dataEnd = part.lastIndexOf('\r\n');
          const fileData = part.substring(dataStart + 4, dataEnd);
          fileBuffer = Buffer.from(fileData, 'binary');
          console.log('File buffer size:', fileBuffer.length);
        }
      }
    }
    
    if (!fileBuffer || fileBuffer.length === 0) {
      console.error('No file buffer found or buffer is empty');
      return res.status(400).json({
        success: false,
        message: 'No image file provided or file is empty'
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

