# 🛍️ E-commerce Price Tracker

A full-stack web application that tracks product prices across e-commerce platforms (Amazon & Flipkart) and sends real-time price drop alerts to users.

## ✨ Features

- 🔍 **Product Tracking**: Track products from Amazon and Flipkart
- 💰 **Price Alerts**: Set custom price thresholds and get notified when prices drop
- 📊 **Price History**: View historical price trends with charts
- 🔐 **User Authentication**: Secure JWT-based authentication
- 📧 **Email Notifications**: Instant email alerts for price drops
- 🎯 **Personalized Wishlist**: Manage your favorite products
- ⏰ **Automated Scraping**: Scheduled price updates every 6 hours
- 📱 **Responsive UI**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Backend

- **Node.js & Express**: RESTful API server
- **MongoDB & Mongoose**: Database for storing products and users
- **Puppeteer**: Web scraping for Amazon and Flipkart
- **JWT**: Secure authentication
- **Nodemailer**: Email notifications
- **Node-Cron**: Scheduled tasks for price monitoring

### Frontend (Coming Soon)

- **React**: User interface
- **React Router**: Navigation
- **Axios**: API calls
- **Chart.js**: Price history visualization
- **Tailwind CSS**: Styling

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Gmail account (for email notifications)

### Setup

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd pricetracker
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` file with your credentials:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pricetracker
JWT_SECRET=your_super_secret_jwt_key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
```

**Note**: For Gmail, you need to:

- Enable 2-factor authentication
- Generate an [App Password](https://support.google.com/accounts/answer/185833)

4. **Start MongoDB** (if running locally)

```bash
mongod
```

5. **Run the server**

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 🚀 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products

- `POST /api/products/track` - Add product to track
- `GET /api/products` - Get all tracked products
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id/refresh` - Manually refresh price
- `DELETE /api/products/:id` - Delete product

### Wishlist

- `POST /api/wishlist` - Add to wishlist
- `GET /api/wishlist` - Get user wishlist
- `PUT /api/wishlist/:productId` - Update wishlist item
- `DELETE /api/wishlist/:productId` - Remove from wishlist

### User Settings

- `PUT /api/user/settings` - Update user settings

## 📖 Usage

### 1. Register/Login

Create an account or login to access the dashboard.

### 2. Track a Product

- Copy product URL from Amazon or Flipkart
- Add it through the API or frontend
- System will scrape and store product details

### 3. Set Price Alert

- Add product to wishlist
- Set your target price
- Enable notifications

### 4. Receive Alerts

- System checks prices every 6 hours
- When price drops below target, you get an email
- Email includes product details and buy link

## 🔧 Manual Price Update

To manually update all product prices:

```bash
npm run scrape
```

## 📂 Project Structure

```
pricetracker/
├── models/
│   ├── User.js              # User schema
│   └── Product.js           # Product schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── products.js          # Product routes
│   ├── wishlist.js          # Wishlist routes
│   └── user.js              # User settings routes
├── services/
│   ├── scraper.js           # Web scraping logic
│   ├── priceMonitor.js      # Price checking & alerts
│   └── emailService.js      # Email notifications
├── middleware/
│   └── auth.js              # JWT authentication
├── scripts/
│   └── scrapeProducts.js    # Manual scraping script
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
├── server.js                # Main server file
└── README.md
```

## 🎯 Supported Platforms

- ✅ Amazon India (amazon.in)
- ✅ Flipkart (flipkart.com)

## ⚠️ Important Notes

### Web Scraping

- Web scraping may break if websites update their HTML structure
- Respect website terms of service and robots.txt
- Add delays between requests to avoid rate limiting
- Some products may fail to scrape due to anti-bot measures

### Email Configuration

- Use Gmail App Passwords (not regular password)
- Enable "Less secure app access" if needed
- Check spam folder for emails

### Rate Limiting

- Default scraping interval: 6 hours
- Add delays between scraping requests
- Too frequent scraping may result in IP blocking

## 🔒 Security

- Passwords hashed with bcrypt
- JWT tokens for secure authentication
- Environment variables for sensitive data
- Input validation on all endpoints

## 🚧 Future Enhancements

- [ ] React frontend with dashboard
- [ ] Price history charts
- [ ] More e-commerce platforms (Myntra, eBay)
- [ ] Browser extension
- [ ] SMS notifications
- [ ] Price prediction using ML
- [ ] Shared wishlists
- [ ] Telegram bot integration

## 🐛 Troubleshooting

### Scraping fails

- Check if website is accessible
- Verify URL format
- Update selectors in `scraper.js` if website changed
- Try running with `headless: false` for debugging

### Email not sending

- Verify Gmail credentials
- Check App Password is correct
- Ensure 2FA is enabled on Gmail
- Check spam/junk folder

### MongoDB connection error

- Ensure MongoDB is running
- Check MONGO_URI in .env
- Verify database permissions

## 📝 License

MIT License - feel free to use for personal or commercial projects

## 👨‍💻 Author

Your Name - Portfolio Project (February 2024 - April 2024)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Happy Price Tracking! 🎉**
