# 🧪 Testing Guide - E-commerce Price Tracker

## Prerequisites Setup

### 1. MongoDB Setup

You have two options:

#### Option A: Local MongoDB (Recommended for Development)

1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Update `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/pricetracker
```

#### Option B: MongoDB Atlas (Cloud - Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Get connection string and update `.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pricetracker
```

### 2. Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password
3. Update `.env` file:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
```

## Testing Workflow

### Phase 1: Backend Testing

#### Start the Backend Server

```bash
# Terminal 1 - Backend
cd "c:\Users\ANSHUL VERMA\Downloads\pricetracker"
npm run dev
```

You should see:

```
✅ MongoDB Connected
🚀 Server running on port 5000
```

#### Test API Endpoints with Sample Requests

**1. Register a User**

```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

Expected Response:

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUz...",
  "user": {...}
}
```

**2. Login**

```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

**3. Track a Product** (Replace TOKEN with your JWT token)

```bash
# Amazon Product Example
curl -X POST http://localhost:5000/api/products/track ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"url\":\"https://www.amazon.in/dp/B0EXAMPLE\"}"

# Flipkart Product Example
curl -X POST http://localhost:5000/api/products/track ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"url\":\"https://www.flipkart.com/product/p/example\"}"
```

### Phase 2: Frontend Testing

#### Start the Frontend

```bash
# Terminal 2 - Frontend
cd "c:\Users\ANSHUL VERMA\Downloads\pricetracker\client"
npm start
```

Browser will open at: http://localhost:3000

#### Frontend Test Checklist

**1. Authentication Flow**

- [ ] Click "Register here" link
- [ ] Fill in registration form (Name, Email, Password)
- [ ] Submit and verify redirect to dashboard
- [ ] Logout
- [ ] Login with same credentials
- [ ] Verify successful login

**2. Dashboard Features**

- [ ] View empty dashboard message
- [ ] Paste Amazon/Flipkart product URL
- [ ] Click "Track Product"
- [ ] Wait for scraping to complete
- [ ] Verify product card appears with:
  - Product name
  - Product image
  - Current price
  - Platform badge (Amazon/Flipkart)

**3. Product Actions**

- [ ] Click "Details" - view price history chart
- [ ] Click "Back to Dashboard"
- [ ] Click "Wishlist" button on a product
- [ ] Set target price (try below current price)
- [ ] Click "Add to Wishlist"
- [ ] Click refresh button to update price

**4. Wishlist Features**

- [ ] Navigate to Wishlist page
- [ ] Verify product appears with target price
- [ ] Check price drop indicator (if price dropped)
- [ ] Click "Edit Price" to change target
- [ ] Click "Buy Now" to open product page
- [ ] Click "Remove" to delete from wishlist

**5. Navigation**

- [ ] Test all navbar links
- [ ] Verify logout functionality
- [ ] Check redirect to login when logged out

### Phase 3: Scraping Testing

#### Test Product URLs

**Amazon India Products (Use these for testing):**

```
https://www.amazon.in/dp/B0D1XD1ZV3
https://www.amazon.in/dp/B0CTHCQKBF
https://www.amazon.in/dp/B0CX23V2ZK
```

**Flipkart Products:**

```
https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485a48549
https://www.flipkart.com/samsung-galaxy-s23-5g-cream-128-gb/p/itm209b90e8efcf1
```

#### Manual Scraping Test

```bash
# Update a specific product URL in scripts/scrapeProducts.js
# Then run:
npm run scrape
```

### Phase 4: Email Notification Testing

**Setup:**

1. Add product to track
2. Add to wishlist with target price ABOVE current price
3. Manually update product price to below target
4. Trigger price check

**Manual Price Check:**

```bash
node -e "require('./services/priceMonitor').checkPriceDrops()"
```

**Expected:**

- Email sent to your registered email
- Check inbox/spam folder
- Email should contain:
  - Product name and image
  - Old price vs New price
  - Savings amount
  - "Buy Now" button

### Phase 5: Automated Testing

#### Test Cron Job (runs every 6 hours by default)

```javascript
// In server.js, temporarily change to run every minute:
cron.schedule("* * * * *", async () => {
  console.log("🔍 Running scheduled price check...");
  await checkPriceDrops();
});
```

## Common Issues & Solutions

### Issue 1: MongoDB Connection Error

**Error:** `MongooseServerSelectionError`
**Solution:**

- Check MongoDB is running: `services.msc` → MongoDB Server
- Verify MONGO_URI in `.env`
- For Atlas: Check IP whitelist (allow 0.0.0.0/0 for testing)

### Issue 2: Scraping Fails

**Error:** `Failed to scrape product details`
**Solutions:**

- Verify URL is correct (Amazon.in or Flipkart.com)
- Website may have changed HTML structure
- Check internet connection
- Try with `headless: false` in scraper.js for debugging

### Issue 3: Email Not Sending

**Error:** `Invalid login`
**Solutions:**

- Verify Gmail App Password (not regular password)
- Enable 2FA on Gmail account
- Check EMAIL_USER and EMAIL_PASS in `.env`
- Test with Gmail only (other providers need different config)

### Issue 4: CORS Error in Frontend

**Error:** `Access-Control-Allow-Origin`
**Solution:**

- Backend should have CORS enabled (already in server.js)
- Check frontend API_URL in client/.env
- Restart both servers

### Issue 5: Token Expired

**Solution:**

- Logout and login again
- Token expires after 7 days

## Performance Testing

### Load Testing (Optional)

```bash
# Install Apache Bench
# Test registration endpoint
ab -n 100 -c 10 -T "application/json" -p register.json http://localhost:5000/api/auth/register
```

## Sample Test Data

### register.json

```json
{ "name": "Load Test", "email": "load@test.com", "password": "test123" }
```

## Production Checklist

Before deploying:

- [ ] Change JWT_SECRET to strong random string
- [ ] Update MongoDB to production database
- [ ] Configure real email credentials
- [ ] Set NODE_ENV=production
- [ ] Add rate limiting
- [ ] Enable HTTPS
- [ ] Set up proper logging
- [ ] Configure backup schedule
- [ ] Add monitoring (e.g., PM2)

## Useful Commands

```bash
# Backend
npm start              # Production mode
npm run dev           # Development mode with nodemon
npm run scrape        # Manual product update

# Frontend
npm start             # Start development server
npm run build         # Build for production
npm test              # Run tests

# Database
mongosh              # Open MongoDB shell
use pricetracker     # Switch to database
db.products.find()   # View all products
db.users.find()      # View all users

# Clear all data
db.products.deleteMany({})
db.users.deleteMany({})
```

## Success Metrics

Your application is working correctly if:
✅ Users can register and login
✅ Products can be tracked from Amazon/Flipkart
✅ Product details are scraped correctly
✅ Price history is displayed
✅ Wishlist functionality works
✅ Email notifications are sent on price drops
✅ Cron job runs automatically
✅ UI is responsive and functional

## Next Steps

1. **Add More Features:**

   - Price drop percentage alerts
   - SMS notifications via Twilio
   - Browser extension
   - Mobile app with React Native

2. **Improve Scraping:**

   - Add more e-commerce platforms
   - Handle anti-bot measures better
   - Implement proxy rotation

3. **Enhance Security:**

   - Rate limiting
   - Input sanitization
   - CSRF protection
   - Secure headers

4. **Deploy:**
   - Backend: Heroku, Railway, Render
   - Frontend: Vercel, Netlify
   - Database: MongoDB Atlas

Happy Testing! 🎉
