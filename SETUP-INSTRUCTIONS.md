# File-Based Storage Setup

## Overview
Your website now uses **file-based storage** instead of localStorage. All product data is stored in `products.json` and managed through a PHP backend.

## What Changed

### Before:
- Products stored in browser's localStorage
- Data lost when clearing browser cache
- Each user had their own local copy

### After:
- Products stored in `products.json` file
- Data persists on the server
- All users see the same products
- Changes made in admin panel are saved permanently

## How It Works

1. **Reading Products**: All pages now fetch products from `products.json`
   - `product.js` - Individual product pages
   - `gallery.js` - Homepage and artwork gallery
   - `admin.js` - Admin panel

2. **Saving Products**: Admin panel uses `save-products.php` to write changes
   - When you add/edit/delete a product, it sends data to PHP
   - PHP updates `products.json` on the server
   - Changes are immediately visible to all users

## Requirements

### To Run Locally:
You need a **local PHP server** because browsers can't write files directly. 

**Option 1: Using PHP's Built-in Server**
```bash
cd /Users/hammadshahzad/Documents/GitHub/dream-of-strokes
php -S localhost:8000
```
Then visit: `http://localhost:8000`

**Option 2: Using XAMPP/WAMP/MAMP**
- Place project in the `htdocs` (XAMPP) or `www` (WAMP) folder
- Access via: `http://localhost/dream-of-strokes`

### To Deploy:
Upload to any web hosting with PHP support:
- Shared hosting (GoDaddy, Bluehost, etc.)
- VPS with PHP installed
- GitHub Pages won't work (no PHP support)

## File Permissions
Make sure `products.json` is writable by the web server:
```bash
chmod 644 products.json
```

## Troubleshooting

### Products not loading?
- Check browser console for errors
- Verify `products.json` exists and has valid JSON
- Make sure you're running through a web server (not opening HTML files directly)

### Can't save products in admin?
- Verify `save-products.php` exists
- Check file permissions on `products.json`
- Look at browser's Network tab for error responses
- Ensure PHP is working (create a test file with `<?php phpinfo(); ?>`)

## Admin Access
- URL: `admin.html`
- Password: `Opensimsim` (change in `admin.js` line 2)

## Important Notes
- Always backup `products.json` before making bulk changes
- The PHP script validates data before saving
- Review functionality has been removed from the site

