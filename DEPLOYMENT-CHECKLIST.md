# 🚀 Deployment Checklist

Follow these steps to deploy your website to production.

---

## ✅ Step 1: Setup Supabase Database

1. Open [Supabase SQL Editor](https://app.supabase.com/project/mymqopcstupvmkutiqpu/sql)
2. Copy the entire contents of `supabase-schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** to create the database tables
5. ✅ Verify the `products` table exists in the Table Editor

---

## ✅ Step 2: Install Dependencies

```bash
npm install
```

This installs `@supabase/supabase-js` package.

---

## ✅ Step 3: Configure Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `dream-of-strokes`
3. Navigate to **Settings → Environment Variables**
4. Add these TWO variables:

| Name | Value |
|------|-------|
| `SUPABASE_URL` | `https://mymqopcstupvmkutiqpu.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your full key) |

5. Select **Production**, **Preview**, and **Development** for each
6. Click **Save**

---

## ✅ Step 4: Push to GitHub

```bash
git add .
git commit -m "Integrated Supabase database"
git push origin main
```

---

## ✅ Step 5: Verify Deployment

1. Vercel will automatically deploy from GitHub
2. Wait for deployment to complete (~2 minutes)
3. Visit your site: `https://www.dreamofstrokes.com`

---

## ✅ Step 6: Test Admin Panel

1. Go to: `https://www.dreamofstrokes.com/admin.html`
2. Enter password: `Opensimsim`
3. Try adding a test product
4. ✅ Product should save successfully
5. ✅ Check if it appears on the homepage

---

## ✅ Step 7: Verify Public Pages

- ✅ Homepage loads products
- ✅ Artwork gallery shows filters
- ✅ Product detail pages work
- ✅ Featured products carousel works
- ✅ Sold products section displays

---

## 🎉 You're Done!

Your website is now live with:
- ✅ Persistent database storage
- ✅ Real-time updates
- ✅ Automatic deployments
- ✅ No more 405 errors!

---

## 🔧 Local Development (Optional)

To test locally before deploying:

```bash
# Install Vercel CLI
npm install -g vercel

# Create .env.local file with:
# SUPABASE_URL=https://mymqopcstupvmkutiqpu.supabase.co
# SUPABASE_ANON_KEY=your_key_here

# Run local dev server
vercel dev
```

Visit: `http://localhost:3000`

---

## 📝 Notes

- Your Supabase credentials are already configured
- Database contains 4 sample products (from products.json)
- Admin password can be changed in `js/admin.js` line 2
- All changes in admin panel save to Supabase permanently
- No more filesystem limitations!

---

**Need Help?** Check the main README.md or console logs for errors.

