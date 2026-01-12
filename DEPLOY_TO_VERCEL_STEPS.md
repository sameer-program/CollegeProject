# Step-by-Step: Deploy CollegeProject to Vercel

## ✅ Prerequisites Checklist

Before starting, make sure you have:
- [x] Project on GitHub (you have this: `CollegeProject`)
- [ ] Vercel account (we'll create this)
- [ ] MongoDB Atlas account (we'll verify this)
- [ ] All code pushed to GitHub

---

## Step 1: Create Vercel Account

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Click **"Sign Up"** (top right)

2. **Sign Up with GitHub**
   - Click **"Continue with GitHub"**
   - Authorize Vercel to access your GitHub account
   - Complete the sign-up process

3. **Verify Email** (if required)
   - Check your email and verify your account

---

## Step 2: Import Your GitHub Project

1. **Go to Vercel Dashboard**
   - After signing in, you'll see the Vercel dashboard
   - Click **"Add New..."** button (top right)
   - Select **"Project"**

2. **Find Your Repository**
   - You'll see a list of your GitHub repositories
   - Search for **"CollegeProject"**
   - Click **"Import"** next to your repository

3. **Configure Project Settings**
   
   Vercel will auto-detect Next.js, but verify these settings:
   
   - **Framework Preset:** `Next.js` ✅
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)
   - **Install Command:** `npm install` (auto-filled)

   **⚠️ DO NOT CLICK DEPLOY YET!** We need to set environment variables first.

---

## Step 3: Set Up Environment Variables

**Before deploying, you MUST set these environment variables:**

1. **In the Vercel import screen, look for "Environment Variables" section**
   - Click **"Environment Variables"** or look for the section

2. **Add Each Variable One by One:**

   Click **"Add"** for each of these:

   ### Variable 1: MONGODB_URI
   - **Key:** `MONGODB_URI`
   - **Value:** Your MongoDB connection string
     - Format: `mongodb+srv://username:password@cluster.mongodb.net/CollegeProject`
     - Get this from MongoDB Atlas (see Step 4 if you don't have it)
   - **Environment:** Select all (Production, Preview, Development)
   - Click **"Save"**

   ### Variable 2: NEXTAUTH_URL
   - **Key:** `NEXTAUTH_URL`
   - **Value:** `https://college-project.vercel.app` (or your project name)
     - **Note:** You'll get the actual URL after first deployment, but use this format for now
     - You can update it later
   - **Environment:** Select all
   - Click **"Save"**

   ### Variable 3: NEXTAUTH_SECRET
   - **Key:** `NEXTAUTH_SECRET`
   - **Value:** Generate a random secret
     - **Option A:** Use this online tool: https://generate-secret.vercel.app/32
     - **Option B:** Run in terminal: `openssl rand -base64 32`
     - **Option C:** Use any long random string (at least 32 characters)
   - **Environment:** Select all
   - Click **"Save"**

   ### Variable 4: JWT_SECRET
   - **Key:** `JWT_SECRET`
   - **Value:** Generate another random secret (different from NEXTAUTH_SECRET)
     - Use same method as above
   - **Environment:** Select all
   - Click **"Save"**

   ### Variable 5: NODE_ENV
   - **Key:** `NODE_ENV`
   - **Value:** `production`
   - **Environment:** Select all
   - Click **"Save"**

3. **Verify All Variables Are Added**
   - You should see 5 environment variables listed
   - Double-check spelling and values

---

## Step 4: Get MongoDB Connection String (If Needed)

If you don't have your MongoDB connection string:

1. **Go to MongoDB Atlas**
   - Visit: https://cloud.mongodb.com
   - Sign in to your account

2. **Get Connection String**
   - Click **"Connect"** on your cluster
   - Choose **"Connect your application"**
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

3. **Modify Connection String**
   - Replace `<username>` with your MongoDB username
   - Replace `<password>` with your MongoDB password
   - Add database name: Replace `?retryWrites=true&w=majority` with `/CollegeProject?retryWrites=true&w=majority`
   - Final format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/CollegeProject?retryWrites=true&w=majority`

4. **Whitelist Vercel IPs**
   - In MongoDB Atlas, go to **"Network Access"**
   - Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (for testing)
     - Or add specific Vercel IPs (0.0.0.0/0 allows all)
   - Click **"Confirm"**

---

## Step 5: Deploy to Vercel

1. **Go Back to Vercel Import Screen**
   - Make sure all environment variables are added
   - Review project settings

2. **Click "Deploy"**
   - Click the **"Deploy"** button at the bottom
   - Wait for the build to complete (2-5 minutes)

3. **Watch the Build Process**
   - You'll see build logs in real-time
   - Look for any errors
   - Build should complete successfully

4. **Get Your Deployment URL**
   - After successful deployment, you'll see:
     - **"Congratulations! Your project has been deployed"**
     - Your URL will be: `https://college-project-xxxxx.vercel.app`
     - Copy this URL!

---

## Step 6: Update NEXTAUTH_URL (Important!)

1. **Go to Project Settings**
   - Click on your project name in Vercel dashboard
   - Go to **"Settings"** tab
   - Click **"Environment Variables"**

2. **Update NEXTAUTH_URL**
   - Find `NEXTAUTH_URL` in the list
   - Click **"Edit"**
   - Change value to your actual deployment URL: `https://college-project-xxxxx.vercel.app`
   - Click **"Save"**

3. **Redeploy**
   - Go to **"Deployments"** tab
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**
   - This ensures the new NEXTAUTH_URL is used

---

## Step 7: Initialize Database

After deployment, you need to populate your database:

### Option A: Run Script Locally (Recommended)

1. **Update Local Environment**
   - In your local project, update `.env.local`:
     ```
     MONGODB_URI=your-mongodb-connection-string
     NEXTAUTH_URL=https://your-deployment-url.vercel.app
     NEXTAUTH_SECRET=your-secret
     JWT_SECRET=your-secret
     NODE_ENV=production
     ```

2. **Run Initialization**
   ```bash
   npm run init-db
   ```

3. **Verify**
   - Check MongoDB Atlas to see if collections are created
   - You should see: users, knowledgeresources, etc.

### Option B: Use MongoDB Atlas UI

1. **Connect to MongoDB Atlas**
   - Use MongoDB Compass or Atlas Data Explorer
   - Manually create collections and insert data
   - Or import from a JSON file

### Option C: Create Temporary API Endpoint

1. **Create initialization endpoint** (one-time use):
   ```typescript
   // app/api/init-db/route.ts
   import { NextResponse } from 'next/server';
   import connectDB from '@/lib/db/connect';
   // ... add your init-db logic here
   ```

2. **Call the endpoint once:**
   - Visit: `https://your-app.vercel.app/api/init-db`
   - Wait for completion
   - **Delete this endpoint immediately after use!**

---

## Step 8: Test Your Deployment

1. **Visit Your Site**
   - Go to: `https://your-project.vercel.app`
   - You should see your application

2. **Test Login**
   - Go to login page
   - Try logging in with test credentials:
     - Email: `consultant@dkn.com`
     - Password: `password123`
   - (Make sure database is initialized first!)

3. **Test Features**
   - Navigate through different dashboards
   - Test creating knowledge resources
   - Verify all features work

---

## Step 9: Set Up Automatic Deployments

Vercel automatically deploys when you push to GitHub:

1. **Push Changes to GitHub**
   ```bash
   git add .
   git commit -m "Update project"
   git push origin main
   ```

2. **Vercel Auto-Deploys**
   - Vercel detects the push
   - Automatically builds and deploys
   - You'll get an email notification

3. **View Deployments**
   - Go to Vercel dashboard
   - Click on your project
   - See all deployments in "Deployments" tab

---

## Troubleshooting Common Issues

### Issue 1: Build Fails

**Symptoms:** Build fails with errors

**Solutions:**
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify TypeScript compiles locally: `npm run build`
4. Check for missing files or imports

### Issue 2: "Cannot connect to MongoDB"

**Symptoms:** Application loads but can't connect to database

**Solutions:**
1. Verify `MONGODB_URI` is correct in Vercel environment variables
2. Check MongoDB Atlas Network Access (whitelist IPs)
3. Verify database user has correct permissions
4. Check connection string format

### Issue 3: "Authentication not working"

**Symptoms:** Can't login or session issues

**Solutions:**
1. Verify `NEXTAUTH_URL` matches your deployment URL exactly
2. Check `NEXTAUTH_SECRET` is set
3. Clear browser cookies and try again
4. Redeploy after updating environment variables

### Issue 4: "Environment variables not working"

**Symptoms:** Variables not being read

**Solutions:**
1. Redeploy after adding environment variables
2. Check variable names are exact (case-sensitive)
3. Ensure variables are set for "Production" environment
4. Restart deployment

### Issue 5: "Database not initialized"

**Symptoms:** No users, can't login

**Solutions:**
1. Run `npm run init-db` locally with production MongoDB URI
2. Or manually create users in MongoDB Atlas
3. Verify collections exist in database

---

## Quick Reference: Environment Variables

Copy-paste ready format (replace with your values):

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/CollegeProject?retryWrites=true&w=majority
NEXTAUTH_URL=https://your-project-name.vercel.app
NEXTAUTH_SECRET=your-32-character-random-secret-here
JWT_SECRET=your-different-32-character-random-secret-here
NODE_ENV=production
```

---

## Next Steps After Deployment

1. ✅ **Test all features**
2. ✅ **Initialize database**
3. ✅ **Update NEXTAUTH_URL with actual URL**
4. ✅ **Set up custom domain** (optional)
5. ✅ **Monitor deployment logs**
6. ✅ **Set up error tracking** (optional)

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **MongoDB Atlas:** https://www.mongodb.com/docs/atlas/

---

## Summary Checklist

- [ ] Created Vercel account
- [ ] Imported GitHub repository
- [ ] Set all 5 environment variables
- [ ] Configured MongoDB Atlas network access
- [ ] Deployed to Vercel
- [ ] Updated NEXTAUTH_URL with actual URL
- [ ] Initialized database
- [ ] Tested deployment
- [ ] Verified all features work

**Your app will be live at:** `https://your-project-name.vercel.app`

Good luck with your deployment! 🚀

