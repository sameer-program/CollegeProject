# 🚀 Vercel Deployment Guide

## Fixed Issues

### 1. NEXTAUTH_URL Configuration
- ✅ Automatically detects Vercel production URL
- ✅ Uses `VERCEL_URL` environment variable when available
- ✅ Falls back to hardcoded production URL: `https://sameerrai-nine.vercel.app`
- ✅ Uses `http://localhost:3000` for local development

### 2. Cookie Configuration
- ✅ Secure cookies enabled for HTTPS (production)
- ✅ Proper cookie names for production (`__Secure-` prefix)
- ✅ SameSite policy set to `lax` for better compatibility

### 3. Middleware Updates
- ✅ Excludes `/api/auth` routes from authentication checks
- ✅ Only protects specific API routes that need authentication

## Environment Variables in Vercel

The following environment variables are **automatically set** by the code:

- `NEXTAUTH_SECRET`: Hardcoded (for demo purposes)
- `NEXTAUTH_URL`: Auto-detected from Vercel

### Optional: Manual Environment Variables

If you want to override, you can set these in Vercel Dashboard:

1. Go to your Vercel project → Settings → Environment Variables
2. Add:
   - `NEXTAUTH_URL`: `https://sameerrai-nine.vercel.app`
   - `NEXTAUTH_SECRET`: (your secret - currently hardcoded)

## MongoDB Atlas Configuration

**IMPORTANT**: For production, you need to:

1. **Whitelist Vercel IPs** in MongoDB Atlas:
   - Go to MongoDB Atlas → Network Access
   - Click "Add IP Address"
   - Add `0.0.0.0/0` (allows all IPs) OR add Vercel's IP ranges
   - **Note**: `0.0.0.0/0` is less secure but works for demo purposes

2. **Database Connection**:
   - MongoDB URI is hardcoded in `lib/db/connect.ts`
   - Make sure the database is accessible from Vercel's servers

## Deployment Steps

1. **Push to Git** (if using Git integration):
   ```bash
   git add .
   git commit -m "Fix Vercel deployment issues"
   git push
   ```

2. **Deploy on Vercel**:
   - Vercel will automatically detect Next.js
   - Build should complete successfully
   - Check deployment logs for any errors

3. **Verify Deployment**:
   - Visit: `https://sameerrai-nine.vercel.app`
   - Should redirect to `/login`
   - Login with credentials from `ALL_CREDENTIALS.md`
   - Should redirect to appropriate dashboard

## Troubleshooting

### Issue: Still redirecting to login after authentication

**Solution**:
1. Clear browser cookies for the Vercel domain
2. Check Vercel deployment logs for errors
3. Verify `NEXTAUTH_URL` is set correctly in Vercel environment variables
4. Check MongoDB connection (make sure IP is whitelisted)

### Issue: "Invalid credentials" error

**Solution**:
1. Make sure database is initialized: Run `npm run init-db` locally or use MongoDB Atlas shell
2. Verify users exist in database
3. Check MongoDB connection string

### Issue: Cookies not working

**Solution**:
1. Verify the domain is using HTTPS (Vercel provides this automatically)
2. Check browser console for cookie errors
3. Try in incognito mode to rule out cookie conflicts

## Testing Production

1. **Login Test**:
   - Go to: `https://sameerrai-nine.vercel.app/login`
   - Use: `controller@dkn.com` / `password123`
   - Should redirect to: `/dashboard/controller`

2. **Direct Dashboard Access**:
   - Go to: `https://sameerrai-nine.vercel.app/dashboard/controller`
   - If not logged in, should redirect to login with callback URL
   - After login, should access dashboard

## Files Changed

1. `lib/auth/env-init.ts` - Auto-detects Vercel URL
2. `lib/auth/config.ts` - Production cookie configuration
3. `middleware.ts` - Excludes auth API routes from protection
4. `vercel.json` - Vercel configuration (optional)

---

**The deployment should now work correctly!** 🎉
