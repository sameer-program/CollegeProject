# Vercel Deployment Guide for DKN Platform

## Prerequisites

1. GitHub account
2. Vercel account (sign up at https://vercel.com)
3. MongoDB Atlas account
4. Your project code pushed to GitHub

## Step 1: Prepare Your Code

1. Ensure your project is pushed to a GitHub repository
2. Make sure all dependencies are listed in `package.json`
3. Test your application locally with `npm run build`

## Step 2: Set Up MongoDB Atlas

1. Go to https://cloud.mongodb.com
2. Create a new cluster (or use existing)
3. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `CollegeProject` or your database name

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. **Sign in to Vercel**
   - Go to https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (or leave default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

4. **Set Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/CollegeProject
   NEXTAUTH_URL=https://your-project.vercel.app
   NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-in-production
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   NODE_ENV=production
   ```
   
   **Important:**
   - Replace `your-project.vercel.app` with your actual Vercel domain
   - Generate secure secrets for `NEXTAUTH_SECRET` and `JWT_SECRET`
   - You can generate secrets using: `openssl rand -base64 32`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (usually 2-3 minutes)

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project or create new
   - Set environment variables when prompted
   - Confirm deployment

4. **Set Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   vercel env add NEXTAUTH_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add JWT_SECRET
   vercel env add NODE_ENV
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Step 4: Initialize Database

After deployment, you need to initialize the database:

### Option A: Run Script Locally

1. Update your local `.env.local` with production MongoDB URI
2. Run:
   ```bash
   npm run init-db
   ```

### Option B: Use MongoDB Compass or Atlas UI

1. Connect to your MongoDB Atlas cluster
2. Manually create the collections and insert initial data
3. Or use MongoDB Atlas Data Explorer to import data

### Option C: Create API Endpoint for Initialization

Create a one-time initialization endpoint (remove after use):

```typescript
// app/api/init/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
// ... import initialization logic
```

**⚠️ Important:** Remove or protect this endpoint after initialization!

## Step 5: Configure Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Step 6: Verify Deployment

1. Visit your Vercel deployment URL
2. Test login functionality
3. Verify all features work correctly
4. Check that database connections are working

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `NEXTAUTH_URL` | Your application URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Secret for NextAuth | Generate with `openssl rand -base64 32` |
| `JWT_SECRET` | Secret for JWT tokens | Generate with `openssl rand -base64 32` |
| `NODE_ENV` | Environment mode | `production` |

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify TypeScript compilation passes locally
4. Check for missing environment variables

### Database Connection Issues

1. Verify MongoDB Atlas IP whitelist includes Vercel IPs (or 0.0.0.0/0 for testing)
2. Check connection string format
3. Verify database user has correct permissions
4. Check MongoDB Atlas network access settings

### Authentication Not Working

1. Verify `NEXTAUTH_URL` matches your deployment URL
2. Check `NEXTAUTH_SECRET` is set correctly
3. Ensure cookies are enabled in browser
4. Check browser console for errors

### Environment Variables Not Working

1. Redeploy after adding environment variables
2. Check variable names match exactly (case-sensitive)
3. Verify variables are set for "Production" environment
4. Restart deployment if needed

## Continuous Deployment

Vercel automatically deploys on every push to your main branch:

1. Push code to GitHub
2. Vercel detects changes
3. Automatically builds and deploys
4. You receive email notification

## Production Checklist

- [ ] All environment variables set
- [ ] MongoDB Atlas configured and accessible
- [ ] Database initialized with sample data
- [ ] Application builds successfully
- [ ] All features tested and working
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Error monitoring set up (optional)

## Security Notes

1. **Never commit secrets** to GitHub
2. **Use strong secrets** for production
3. **Enable MongoDB Atlas IP whitelist** (restrict to Vercel IPs if possible)
4. **Use MongoDB Atlas database users** with limited permissions
5. **Regularly update dependencies** for security patches

## Support

- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/

---

**Your application will be live at:** `https://your-project-name.vercel.app`


