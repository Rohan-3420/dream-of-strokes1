# Dream of Strokes

**Handcrafted Paintings by Talented Pakistani Artists**

A beautiful art gallery website showcasing original paintings from 4 talented Pakistani artists specializing in calligraphy, still life, scenery, and mosaic artwork.

---

## 🚀 Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Hosting**: Vercel (with GitHub integration)
- **Database**: Supabase (PostgreSQL)
- **API**: Vercel Serverless Functions

---

## 📦 Setup Instructions

### 1. **Clone the Repository**

```bash
git clone https://github.com/YOUR_USERNAME/dream-of-strokes.git
cd dream-of-strokes
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Setup Supabase Database**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project (or use existing)
3. Navigate to **SQL Editor**
4. Run the SQL script from `supabase-schema.sql`

This will create:
- `products` table with all necessary columns
- Indexes for performance
- Row Level Security policies
- Sample data from your current products

### 4. **Configure Environment Variables**

#### For Local Development:
Create a `.env.local` file (already exists):
```
SUPABASE_URL=https://mymqopcstupvmkutiqpu.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

#### For Vercel Production:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add these variables:
   - `SUPABASE_URL`: `https://mymqopcstupvmkutiqpu.supabase.co`
   - `SUPABASE_ANON_KEY`: Your Supabase anon key

### 5. **Run Locally**

```bash
# Using Vercel CLI (recommended)
npm install -g vercel
vercel dev
```

Visit: `http://localhost:3000`

---

## 🌐 Deployment

### Automatic Deployment (Recommended)

1. **Push to GitHub:**
```bash
git add .
git commit -m "Initial commit with Supabase integration"
git push origin main
```

2. **Connect to Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variables (see step 4 above)
   - Click "Deploy"

3. **Done!** Vercel will automatically deploy on every push to `main`

### Manual Deployment

```bash
vercel --prod
```

---

## 🔐 Admin Panel

- **URL**: `https://yourdomain.com/admin.html`
- **Password**: `Opensimsim` (change in `js/admin.js` line 2)

### Admin Features:
- ✅ Add new products
- ✅ Edit existing products
- ✅ Delete products
- ✅ Mark products as featured
- ✅ Mark products as sold
- ✅ Real-time updates (saved to Supabase)

---

## 📁 Project Structure

```
dream-of-strokes/
├── api/
│   ├── get-products.js      # Fetch products from Supabase
│   └── save-products.js     # Save/update/delete products
├── css/                     # Stylesheets
├── images/                  # Product & artist images
├── includes/
│   ├── header.html         # Reusable header
│   └── footer.html         # Reusable footer
├── js/
│   ├── admin.js            # Admin panel logic
│   ├── gallery.js          # Product gallery
│   ├── product.js          # Product detail page
│   ├── components.js       # Header/footer loader
│   └── script.js           # General scripts
├── index.html              # Homepage
├── artwork.html            # Gallery page
├── product.html            # Product detail page
├── admin.html              # Admin panel
├── about.html              # About artists
├── contact.html            # Contact page
├── package.json            # Dependencies
├── vercel.json             # Vercel configuration
└── supabase-schema.sql     # Database schema
```

---

## 🎨 Features

### Public Website
- 🖼️ Dynamic product gallery with filters (category, artist)
- ⭐ Featured products carousel on homepage
- 🏷️ Sold products gallery
- 📱 Fully responsive design
- 🔍 Product detail pages with WhatsApp integration
- 📤 Social media sharing
- 👥 Meet the artists page
- 📧 Contact information

### Admin Panel
- 🔒 Password-protected access
- 📝 CRUD operations for products
- 🗂️ Category management
- 👨‍🎨 Artist management
- ⚡ Real-time database sync
- 📊 Product count display

---

## 🔧 Configuration

### Change Admin Password

Edit `js/admin.js` line 2:
```javascript
const ADMIN_PASSWORD = 'YourNewPassword';
```

### Update Supabase Credentials

Update environment variables in Vercel dashboard or `.env.local` file.

---

## 🐛 Troubleshooting

### Products not loading?
- Check browser console for errors
- Verify Supabase connection in Vercel logs
- Ensure environment variables are set correctly

### Can't save products?
- Verify Supabase credentials
- Check Vercel function logs
- Ensure Row Level Security policies are correct in Supabase

### 405 Method Not Allowed?
- Make sure environment variables are set in Vercel
- Redeploy the project after adding variables

---

## 👨‍💻 Artists

- **Rohan Shahzad** - Lead Artist & Web Developer
- **Ahmad Abbas** - Calligraphy Specialist
- **Fasih-ur-Rehman** - Calligraphy Expert
- **Talha Abuzar** - Mosaic Specialist

---

## 📞 Contact

- **Website**: [www.dreamofstrokes.com](https://www.dreamofstrokes.com)
- **Email**: dreamofstrokes@gmail.com
- **Instagram**: [@dream_of_strokes](https://www.instagram.com/dream_of_strokes)
- **Facebook**: [Dream of Strokes](https://www.facebook.com/share/1Fi6vQ2dS7/)
- **TikTok**: [@dream.of.strokes](https://www.tiktok.com/@dream.of.strokes)

---

## 📝 License

© 2025 Dream of Strokes. All Rights Reserved.

**Designed & Developed by Rohan Shahzad**

