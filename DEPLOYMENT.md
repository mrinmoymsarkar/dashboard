# Vercel Deployment Guide

This guide will walk you through deploying the Indian Stock Market Dashboard to Vercel.

## Prerequisites

1. **GitHub Account**: Your code should be pushed to a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

## Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Ensure your code is committed and pushed to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Verify your repository structure**:
   ```
   stock-market/
   └── dashboard/
       ├── src/
       ├── package.json
       ├── next.config.ts
       └── ...
   ```

### Step 2: Deploy via Vercel Dashboard

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "New Project"**

3. **Import your GitHub repository**:
   - Select your repository from the list
   - Click "Import"

4. **Configure the project settings**:
   - **Framework Preset**: `Next.js` (should auto-detect)
   - **Root Directory**: `dashboard` ⚠️ **IMPORTANT**: Set this to `dashboard`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. **Environment Variables** (if needed):
   - Click "Environment Variables"
   - Add any required variables
   - For this project, no environment variables are required by default

6. **Click "Deploy"**

### Step 3: Verify Deployment

1. **Wait for the build to complete** (usually 2-3 minutes)

2. **Check the deployment URL** provided by Vercel

3. **Test the application**:
   - Stock search functionality
   - Chart display
   - Theme toggle
   - Real-time data updates (polling mode)

## Important Configuration Notes

### Root Directory Setting

⚠️ **CRITICAL**: Set the Root Directory to `dashboard` in your Vercel project settings. This is because your Next.js application is located in the `dashboard` subdirectory, not in the root of your repository.

### WebSocket vs Polling

- **Local Development**: Uses WebSocket server for real-time data
- **Vercel Production**: Automatically falls back to API polling every 30 seconds
- **No Configuration Needed**: The app handles this automatically

### API Routes

All API routes work on Vercel:
- `/api/search` - Stock search
- `/api/quote` - Stock quotes and historical data
- `/api/stocks/realtime` - Real-time data for polling

## Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check that Root Directory is set to `dashboard`
   - Verify all dependencies are in `package.json`
   - Check build logs for specific errors

2. **API Errors**:
   - Yahoo Finance API might have rate limits
   - Check Vercel function logs for API errors

3. **No Real-time Data**:
   - This is expected on Vercel (uses polling instead of WebSocket)
   - Data updates every 30 seconds

### Performance Optimization

1. **Enable Edge Functions** (optional):
   - Go to Project Settings → Functions
   - Enable Edge Functions for better performance

2. **Configure Caching**:
   - API routes are configured with appropriate cache headers
   - Static assets are automatically optimized

## Post-Deployment

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS settings as instructed

### Monitoring

1. **Vercel Analytics**: Enable in Project Settings
2. **Function Logs**: Monitor API performance
3. **Build Logs**: Check for any deployment issues

## Local Testing Before Deployment

Before deploying, test the production build locally:

```bash
cd dashboard
npm run build
npm run start
```

This ensures your app works correctly in production mode.

## Support

If you encounter issues:

1. Check the [Vercel Documentation](https://vercel.com/docs)
2. Review the build logs in your Vercel dashboard
3. Check the function logs for API errors
4. Verify your repository structure matches the expected layout

## Success Indicators

Your deployment is successful when:

✅ Build completes without errors  
✅ Application loads at the Vercel URL  
✅ Stock search works  
✅ Charts display correctly  
✅ Theme toggle functions  
✅ Real-time data updates (polling mode)  

The app will show "Polling Mode" in the status indicator, which is the expected behavior on Vercel. 