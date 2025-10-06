// Demo script to test the application without MongoDB
// This creates a simple in-memory demonstration

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory data stores
let users = [];
let products = [];
let userIdCounter = 1;
let productIdCounter = 1;

// Dummy token for demo
const DEMO_TOKEN = 'demo_token_12345';
const DEMO_USER = {
  id: '1',
  name: 'Demo User',
  email: 'demo@pricetracker.com',
  wishlist: []
};

// Sample products
const sampleProducts = [
  {
    _id: '1',
    name: 'Apple iPhone 15 (Black, 128 GB)',
    url: 'https://www.amazon.in/dp/B0CHX3TW6X',
    platform: 'amazon',
    currentPrice: 69900,
    imageUrl: 'https://m.media-amazon.com/images/I/71657TiFeHL._SX679_.jpg',
    availability: 'In Stock',
    priceHistory: [
      { price: 79900, date: new Date('2024-01-01') },
      { price: 75900, date: new Date('2024-01-15') },
      { price: 69900, date: new Date('2024-02-01') }
    ],
    lowestPrice: 69900,
    highestPrice: 79900,
    metadata: { rating: 4.5 }
  },
  {
    _id: '2',
    name: 'Samsung Galaxy S23 5G (Cream, 128 GB)',
    url: 'https://www.flipkart.com/samsung-galaxy-s23-5g',
    platform: 'flipkart',
    currentPrice: 54999,
    imageUrl: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/e/r/n/-original-imagqmz4zrhmybz9.jpeg',
    availability: 'In Stock',
    priceHistory: [
      { price: 64999, date: new Date('2024-01-01') },
      { price: 59999, date: new Date('2024-01-20') },
      { price: 54999, date: new Date('2024-02-05') }
    ],
    lowestPrice: 54999,
    highestPrice: 64999,
    metadata: { rating: 4.3 }
  }
];

// Routes
app.post('/api/auth/register', (req, res) => {
  res.json({
    message: 'User registered successfully',
    token: DEMO_TOKEN,
    user: DEMO_USER
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    message: 'Login successful',
    token: DEMO_TOKEN,
    user: DEMO_USER
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ user: DEMO_USER });
});

app.get('/api/products', (req, res) => {
  res.json({ products: sampleProducts });
});

app.get('/api/products/:id', (req, res) => {
  const product = sampleProducts.find(p => p._id === req.params.id);
  res.json({ product });
});

app.post('/api/products/track', (req, res) => {
  const newProduct = {
    _id: String(productIdCounter++),
    name: 'Newly Tracked Product',
    url: req.body.url,
    platform: req.body.url.includes('amazon') ? 'amazon' : 'flipkart',
    currentPrice: 9999,
    imageUrl: '',
    availability: 'In Stock',
    priceHistory: [{ price: 9999, date: new Date() }],
    lowestPrice: 9999,
    highestPrice: 9999
  };
  sampleProducts.push(newProduct);
  res.json({ message: 'Product added successfully', product: newProduct });
});

app.get('/api/wishlist', (req, res) => {
  res.json({ wishlist: [] });
});

app.post('/api/wishlist', (req, res) => {
  res.json({ message: 'Added to wishlist', wishlist: [] });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Demo server running' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🎉 DEMO MODE - Price Tracker Backend');
  console.log('='.repeat(60));
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('📝 This is a DEMO server with sample data');
  console.log('🔧 To use full features, setup MongoDB and run: npm run dev');
  console.log('='.repeat(60));
});
