# 🚀 Vercel Deployment Guide

## Quick Deploy to Vercel

Your project is ready for Vercel deployment! Follow these steps:

---

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** and connect with your GitHub account
3. Authorize Vercel to access your GitHub repositories

### Step 2: Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Find and select `pricetracker` from your repository list
3. Click **"Import"**

### Step 3: Configure Project Settings

#### For Backend Deployment:
- **Framework Preset**: Other
- **Root Directory**: `./` (leave as root)
- **Build Command**: `npm install`
- **Output Directory**: Leave empty
- **Install Command**: `npm install`

#### Environment Variables (CRITICAL):
Add these in the Vercel dashboard under "Environment Variables":

```env
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_key_min_32_chars
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=https://your-frontend-url.vercel.app
PORT=3000
```

**Important Notes:**
- Get `MONGODB_URI` from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get `EMAIL_PASS` from Gmail App Passwords (not your regular Gmail password)
- Update `CLIENT_URL` after deploying frontend (see Step 4)

### Step 4: Deploy Frontend Separately
Since you have a monorepo (backend + React frontend), deploy them separately:

#### Deploy Frontend:
1. Click **"Add New..."** → **"Project"** again
2. Import `pricetracker` repository again
3. **Framework Preset**: Create React App
4. **Root Directory**: `client`
5. **Build Command**: `npm run build`
6. **Output Directory**: `build`
7. **Install Command**: `npm install`

#### Frontend Environment Variables:
```env
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

**Update After Backend Deployment:**
- Once your backend is deployed, copy its URL (e.g., `https://pricetracker-backend.vercel.app`)
- Add it as `REACT_APP_API_URL` in your frontend environment variables
- Redeploy the frontend

### Step 5: Update CORS and URLs
After both deployments:

1. Update `CLIENT_URL` in backend environment variables with your frontend URL
2. Redeploy backend to apply CORS changes
3. Test your application!

---

## Option 2: Deploy via Vercel CLI

### Install Vercel CLI
```powershell
npm install -g vercel
```

### Login to Vercel
```powershell
vercel login
```

### Deploy Backend
```powershell
# From project root
vercel --prod
```

### Deploy Frontend
```powershell
# Navigate to client folder
cd client
vercel --prod
```

### Set Environment Variables via CLI
```powershell
vercel env add MONGODB_URI production
vercel env add JWT_SECRET production
vercel env add EMAIL_USER production
vercel env add EMAIL_PASS production
vercel env add CLIENT_URL production
```

---

## MongoDB Atlas Setup (Required)

Your app needs a MongoDB database. Here's how to set it up:

### 1. Create MongoDB Atlas Account
- Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Sign up for free (M0 Sandbox is free forever)

### 2. Create a Cluster
- Choose **AWS** or **Google Cloud**
- Select a region close to your users
- Cluster Name: `PriceTracker` (or any name)

### 3. Create Database User
- Go to **Database Access** → **Add New Database User**
- Username: `pricetracker`
- Password: Generate a strong password (save it!)
- Built-in Role: **Read and write to any database**

### 4. Whitelist IP Addresses
- Go to **Network Access** → **Add IP Address**
- Click **"Allow Access from Anywhere"** (0.0.0.0/0)
- This is needed for Vercel's dynamic IPs

### 5. Get Connection String
- Go to **Database** → **Connect**
- Choose **"Connect your application"**
- Copy the connection string
- Replace `<password>` with your database user password
- Replace `<dbname>` with `pricetracker`

**Example:**
```
mongodb+srv://pricetracker:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/pricetracker?retryWrites=true&w=majority
```

---

## Gmail App Password Setup (Required)

For email notifications to work:

### 1. Enable 2-Factor Authentication
- Go to [myaccount.google.com/security](https://myaccount.google.com/security)
- Enable **2-Step Verification**

### 2. Generate App Password
- Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- App: **Mail**
- Device: **Other (Custom name)** → Enter "Price Tracker"
- Click **Generate**
- Copy the 16-character password (no spaces)
- Use this as `EMAIL_PASS` in environment variables

---

## Post-Deployment Checklist

- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] MongoDB Atlas connection working
- [ ] Environment variables set correctly
- [ ] `CLIENT_URL` updated in backend
- [ ] `REACT_APP_API_URL` updated in frontend
- [ ] CORS configured correctly
- [ ] Test user registration
- [ ] Test product tracking
- [ ] Test price monitoring
- [ ] Test email notifications
- [ ] Check Vercel logs for errors

---

## Testing Your Deployment

### 1. Test Backend API
```powershell
# Replace with your backend URL
curl https://your-backend-url.vercel.app/api/health
```

### 2. Test Frontend
- Open your frontend URL in a browser
- Register a new account
- Add a product to track
- Check if price monitoring works

### 3. Monitor Vercel Logs
- Go to Vercel Dashboard → Your Project → **Logs**
- Check for any errors or warnings
- Monitor function execution times

---

## Common Issues & Solutions

### Issue 1: MongoDB Connection Timeout
**Solution:** 
- Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string format
- Verify database user credentials

### Issue 2: CORS Errors
**Solution:**
- Update `CLIENT_URL` in backend environment variables
- Redeploy backend after updating
- Check browser console for exact error

### Issue 3: Email Not Sending
**Solution:**
- Verify Gmail App Password (not regular password)
- Check `EMAIL_USER` and `EMAIL_PASS` are correct
- Ensure 2FA is enabled on Gmail account

### Issue 4: Functions Timing Out
**Solution:**
- Puppeteer might be too heavy for Vercel serverless functions
- Consider using a lighter scraping solution or external service
- Or deploy backend to Render/Railway instead

### Issue 5: Build Failures
**Solution:**
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

---

## Alternative: Deploy Backend to Render

If Puppeteer causes issues on Vercel (serverless limitations), deploy backend to Render:

1. Go to [render.com](https://render.com)
2. Create a **Web Service**
3. Connect your GitHub repo
4. Use `render.yaml` configuration (already included)
5. Set environment variables in Render dashboard
6. Deploy!

Then update `REACT_APP_API_URL` in your Vercel frontend to point to Render backend.

---

## URLs After Deployment

**Backend:** `https://your-backend-name.vercel.app`  
**Frontend:** `https://your-frontend-name.vercel.app`  
**MongoDB:** `mongodb+srv://...`

Update these in your environment variables!

---

## Support & Documentation

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas Docs:** [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **GitHub Repo:** [github.com/Anshu8853/pricetracker](https://github.com/Anshu8853/pricetracker)

---

## Next Steps

1. ✅ Push code to GitHub (DONE)
2. 🚀 Deploy to Vercel (follow steps above)
3. 🗄️ Set up MongoDB Atlas
4. 📧 Configure Gmail App Password
5. 🔧 Update environment variables
6. ✅ Test deployment
7. 🎉 Share your live app!

---

**Ready to deploy? Start with Option 1 above!** 🚀
