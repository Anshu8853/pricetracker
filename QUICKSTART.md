# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### Step 2: Configure Environment

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/pricetracker
JWT_SECRET=your_secret_key_12345
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
CLIENT_URL=http://localhost:3000
SCRAPE_INTERVAL_HOURS=6
```

### Step 3: Setup MongoDB

- **Option 1:** Install MongoDB locally
- **Option 2:** Use MongoDB Atlas (free cloud): https://cloud.mongodb.com

### Step 4: Setup Gmail for Notifications

1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password in EMAIL_PASS

### Step 5: Run the Application

```bash
# Terminal 1: Start Backend
npm run dev

# Terminal 2: Start Frontend
cd client
npm start
```

### Step 6: Test the App

1. Open http://localhost:3000
2. Register a new account
3. Add a product URL from Amazon or Flipkart
4. Set price alerts and enjoy!

## 📝 Sample Product URLs for Testing

### Amazon India

- https://www.amazon.in/dp/B0D1XD1ZV3
- https://www.amazon.in/dp/B0CTHCQKBF

### Flipkart

- https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485a48549

## 🎯 Key Features

- ✅ Track prices from Amazon & Flipkart
- ✅ Beautiful dashboard with price charts
- ✅ Email alerts on price drops
- ✅ Wishlist management
- ✅ Price history tracking
- ✅ Automated price updates every 6 hours

## 🔧 Troubleshooting

- **MongoDB Error:** Ensure MongoDB is running
- **Email Error:** Check Gmail App Password
- **Scraping Error:** Verify product URL is correct

For detailed testing guide, see TESTING.md

Happy Price Tracking! 🛍️
