# 🚀 DEPLOY YOUR PRICE TRACKER - STEP BY STEP

## ✅ Step 1: Code Pushed to GitHub ✅

Your code is now live at: **https://github.com/Anshu8853/pricetracker**

---

## 📋 Next: Deploy to Make it PUBLIC

### **STEP 1: Setup MongoDB Atlas (5 minutes)**

1. **Go to MongoDB Atlas**

   - Visit: https://cloud.mongodb.com
   - Click "Try Free" or "Sign Up"
   - Sign up with Google/GitHub (fastest)

2. **Create FREE Cluster**

   - Click "Build a Database"
   - Select **FREE** tier (M0 Sandbox)
   - Choose region: **Mumbai (ap-south-1)** (closest to India)
   - Cluster Name: `pricetracker`
   - Click "Create Cluster"

3. **Create Database User**

   - Click "Database Access" in left menu
   - Click "Add New Database User"
   - Authentication: **Password**
   - Username: `pricetracker`
   - Password: Click "Autogenerate Secure Password" (SAVE THIS!)
   - Database User Privileges: **Read and write to any database**
   - Click "Add User"

4. **Setup Network Access**

   - Click "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere"
   - Confirm with `0.0.0.0/0`
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left menu
   - Click "Connect" button on your cluster
   - Click "Connect your application"
   - Copy the connection string (looks like):
   ```
   mongodb+srv://pricetracker:<password>@pricetracker.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with the password you saved
   - Add database name at the end: `/pricetracker`
   - Final format:
   ```
   mongodb+srv://pricetracker:YOUR_PASSWORD@pricetracker.xxxxx.mongodb.net/pricetracker?retryWrites=true&w=majority
   ```
   - **SAVE THIS CONNECTION STRING!**

---

### **STEP 2: Deploy Backend on Render.com (10 minutes)**

1. **Go to Render**

   - Visit: https://render.com
   - Click "Get Started for Free"
   - Sign up with **GitHub** (easiest)
   - Authorize Render to access your repositories

2. **Create New Web Service**

   - Click "New +" button (top right)
   - Select "Web Service"
   - Click "Build and deploy from a Git repository"
   - Click "Next"

3. **Connect Repository**

   - Find "Anshu8853/pricetracker"
   - Click "Connect"

4. **Configure Service**

   - **Name:** `pricetracker-api` (or any name you like)
   - **Region:** Singapore (closest to India)
   - **Branch:** `main`
   - **Root Directory:** (leave empty)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** **Free**

5. **Add Environment Variables**
   Click "Advanced" then scroll to "Environment Variables"

   Add these one by one (click "+ Add Environment Variable" for each):

   ```
   NODE_ENV = production

   MONGO_URI = mongodb+srv://pricetracker:YOUR_PASSWORD@pricetracker.xxxxx.mongodb.net/pricetracker?retryWrites=true&w=majority

   JWT_SECRET = pricetracker_secret_key_12345_change_this_in_production

   EMAIL_SERVICE = gmail

   EMAIL_USER = your-email@gmail.com

   EMAIL_PASS = your-gmail-app-password

   CLIENT_URL = http://localhost:3000

   PORT = 5000

   SCRAPE_INTERVAL_HOURS = 6
   ```

   **Note:**

   - Replace `MONGO_URI` with your actual connection string from Step 1
   - Replace `EMAIL_USER` with your Gmail
   - Replace `EMAIL_PASS` with your Gmail App Password (see below)
   - We'll update `CLIENT_URL` later with your frontend URL

6. **Get Gmail App Password**

   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification" if not enabled
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Click "Generate"
   - Copy the 16-character password
   - Use this as `EMAIL_PASS`

7. **Deploy**

   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Watch the logs for any errors
   - Once you see "✅ MongoDB Connected" and "🚀 Server running", it's ready!

8. **Save Your Backend URL**
   - Your backend URL will be: `https://pricetracker-api.onrender.com`
   - **SAVE THIS URL!** You'll need it for the frontend

---

### **STEP 3: Deploy Frontend on Vercel (5 minutes)**

1. **Update Production Environment**
   First, update the API URL in your code:

   - Edit file: `client\.env.production`
   - Change to:

   ```
   REACT_APP_API_URL=https://pricetracker-api.onrender.com/api
   ```

   - Commit and push:

   ```bash
   cd "c:\Users\ANSHUL VERMA\Downloads\pricetracker"
   git add .
   git commit -m "Update API URL for production"
   git push origin main
   ```

2. **Go to Vercel**

   - Visit: https://vercel.com
   - Click "Sign Up"
   - Sign up with **GitHub** (easiest)
   - Authorize Vercel

3. **Import Project**

   - Click "Add New..." → "Project"
   - Find "Anshu8853/pricetracker"
   - Click "Import"

4. **Configure Project**

   - **Framework Preset:** Create React App
   - **Root Directory:** Click "Edit" → Select `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

5. **Add Environment Variable**

   - Click "Environment Variables"
   - Add:
     - **Name:** `REACT_APP_API_URL`
     - **Value:** `https://pricetracker-api.onrender.com/api`
   - Click "Add"

6. **Deploy**

   - Click "Deploy"
   - Wait 2-5 minutes
   - ✅ Your app will be LIVE!

7. **Get Your Public URL**
   - After deployment, you'll get a URL like:
   - `https://pricetracker-xxxxxx.vercel.app`
   - **THIS IS YOUR PUBLIC APP URL!** 🎉

---

### **STEP 4: Update Backend with Frontend URL**

1. **Update CLIENT_URL on Render**
   - Go back to Render dashboard
   - Click your "pricetracker-api" service
   - Click "Environment" in left menu
   - Find `CLIENT_URL`
   - Update value to your Vercel URL: `https://pricetracker-xxxxxx.vercel.app`
   - Click "Save Changes"
   - Your backend will automatically redeploy

---

## 🎉 YOUR APP IS NOW PUBLIC!

### **Your Live URLs:**

- **Frontend:** https://pricetracker-xxxxxx.vercel.app
- **Backend API:** https://pricetracker-api.onrender.com
- **GitHub Repo:** https://github.com/Anshu8853/pricetracker

### **Test Your App:**

1. Open your Vercel URL
2. Register a new account
3. Login
4. Add a product URL from Amazon/Flipkart
5. Track prices!

---

## 📱 Share Your App

Add to:

- ✅ Portfolio website
- ✅ Resume/CV
- ✅ LinkedIn projects section
- ✅ GitHub README with live demo link

---

## ⚠️ Important Notes

### **Render Free Tier:**

- Backend sleeps after 15 min of inactivity
- First request after sleep takes ~30 seconds
- 750 hours/month (enough for 24/7 if you upgrade or keep it active)

### **Keep Backend Active (Optional):**

Use a service to ping your API every 14 minutes:

- Go to: https://cron-job.org
- Create free account
- Add job to ping: `https://pricetracker-api.onrender.com/api/health`
- Schedule: Every 14 minutes

### **Vercel Free Tier:**

- Perfect for frontend
- 100GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Global CDN

---

## 🔧 Updating Your App

Whenever you make changes:

```bash
cd "c:\Users\ANSHUL VERMA\Downloads\pricetracker"
git add .
git commit -m "Description of changes"
git push origin main
```

Both Vercel and Render will automatically redeploy! ✨

---

## 🆘 Troubleshooting

### **Backend not starting:**

- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

### **Frontend can't connect to backend:**

- Check `REACT_APP_API_URL` in Vercel
- Verify backend is running (visit backend URL/api/health)
- Check browser console for CORS errors
- Ensure `CLIENT_URL` on Render matches your Vercel URL

### **Database connection failed:**

- Check MongoDB Network Access allows 0.0.0.0/0
- Verify password in connection string is correct
- Ensure database name is added to connection string

### **Email not sending:**

- Verify Gmail App Password (not regular password)
- Check 2FA is enabled on Gmail
- Look in spam folder

---

## 🎯 Success Checklist

- [✅] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] Can register/login
- [ ] Can track products
- [ ] Email notifications work
- [ ] App is accessible publicly

---

## 🎊 CONGRATULATIONS!

Your E-commerce Price Tracker is now **LIVE and PUBLIC**! 🌍

Anyone in the world can now access your app and use it to track prices!

**Share your success:**

- Update GitHub README with live demo link
- Add screenshots
- Share on LinkedIn
- Add to your portfolio

---

**Need help? Check the deployment logs or ask for assistance!**

**Your app is ready to impress! 🚀**
