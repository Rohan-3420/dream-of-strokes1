# Dream of Strokes - Admin Panel Guide

## 🔐 Access Admin Panel

**URL:** `admin.html`  
**Password:** `Opensimsim`

## 📦 How to Add Products

### Step 1: Login
1. Open `admin.html` in your browser
2. Enter password: `Opensimsim`
3. Click "Login"

### Step 2: Upload Product Image
1. Place your product image in the `images/products/` folder
2. Remember the exact filename (e.g., `my-painting.jpg`)

### Step 3: Fill Product Form
Fill in all required fields:

- **Product Title**: Name of the artwork (e.g., "Arabic Calligraphy")
- **Artist**: Select from dropdown (Rohan, Ahmad, Fasih, Talha)
- **Price (PKR)**: Enter price without "Rs." (e.g., 50,000.00)
- **Category**: Select category (Calligraphy, Still Life, Scenery, Mosaic)
- **Image Path**: Enter path to image (e.g., `images/products/my-painting.jpg`)
- **Description**: Write a detailed description of the artwork
- **Featured Product**: Check this box if you want it featured on homepage

### Step 4: Add Product
1. Click "Add Product" button
2. Product will appear in the list below
3. Product is automatically available on the website!

## 🎨 Managing Products

### View Product
- Click "View" button to see how the product looks on the website

### Delete Product
- Click "Delete" button to remove a product
- Confirm deletion when prompted

## 📱 How Products Appear on Website

Once added, products will automatically show up on:
- **Homepage**: Featured products (if "Featured" is checked)
- **Artwork Gallery** (`artwork.html`): All products in the gallery
- **Product Page** (`product.html?id=X`): Individual product details

## 💾 Data Storage

- All products are stored in your browser's **localStorage**
- Data persists even after closing the browser
- Each browser has its own data (not shared across devices)

## 🔄 Updating Existing Products

Currently, to update a product:
1. Delete the old product
2. Add a new product with updated information

## ⚠️ Important Notes

1. **Image Path Format**: Always use `images/products/filename.jpg` format
2. **Price Format**: Enter numbers only (e.g., 50,000.00)
3. **Don't Forget**: Upload image to `images/products/` folder BEFORE adding product
4. **Logout**: Click "Logout" when done to secure the admin panel

## 🆘 Troubleshooting

**Problem**: Image not showing on website
- **Solution**: Check image path is correct and file exists in `images/products/`

**Problem**: Product not appearing in gallery
- **Solution**: Refresh the artwork.html page

**Problem**: Forgot password
- **Solution**: Password is `Opensimsim`

## 🎯 Tips for Best Results

1. **Image Size**: Use high-quality images (at least 1000px width)
2. **Description**: Write detailed, engaging descriptions (3-5 sentences)
3. **Categories**: Choose the correct category for better organization
4. **Featured**: Only mark 4-6 products as "Featured" for homepage
5. **Prices**: Use consistent formatting (e.g., 50,000.00)

---

**Need Help?** Contact Rohan Shahzad: +92 335 4581567

