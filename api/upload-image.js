// Vercel Serverless Function to upload images to Supabase Storage
import { createClient } from '@supabase/supabase-js';

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
  
  // Initialize Supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  
  try {
    // Parse multipart form data
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    // Parse form data
    const boundary = req.headers['content-type'].split('boundary=')[1];
    const parts = buffer.toString('binary').split(`--${boundary}`);
    
    let fileBuffer = null;
    let fileName = null;
    let contentType = null;
    
    for (const part of parts) {
      if (part.includes('Content-Disposition: form-data; name="image"')) {
        // Extract filename
        const fileNameMatch = part.match(/filename="(.+?)"/);
        if (fileNameMatch) {
          fileName = fileNameMatch[1];
        }
        
        // Extract content type
        const contentTypeMatch = part.match(/Content-Type: (.+?)\r\n/);
        if (contentTypeMatch) {
          contentType = contentTypeMatch[1];
        }
        
        // Extract file content
        const contentStart = part.indexOf('\r\n\r\n') + 4;
        const contentEnd = part.lastIndexOf('\r\n');
        fileBuffer = Buffer.from(part.slice(contentStart, contentEnd), 'binary');
        break;
      }
    }
    
    if (!fileBuffer || !fileName) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const ext = fileName.split('.').pop();
    const uniqueFileName = `product-${timestamp}.${ext}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(uniqueFileName, fileBuffer, {
        contentType: contentType,
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw error;
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

