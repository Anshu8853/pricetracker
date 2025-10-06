const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  platform: {
    type: String,
    enum: ['amazon', 'flipkart'],
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number
  },
  currency: {
    type: String,
    default: 'INR'
  },
  imageUrl: {
    type: String
  },
  availability: {
    type: String,
    enum: ['In Stock', 'Out of Stock', 'Unknown'],
    default: 'Unknown'
  },
  priceHistory: [{
    price: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  lowestPrice: {
    type: Number
  },
  highestPrice: {
    type: Number
  },
  lastScraped: {
    type: Date,
    default: Date.now
  },
  scrapingEnabled: {
    type: Boolean,
    default: true
  },
  metadata: {
    rating: Number,
    reviews: Number,
    category: String,
    brand: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update price statistics
ProductSchema.methods.updatePriceStats = function() {
  if (this.priceHistory.length > 0) {
    const prices = this.priceHistory.map(h => h.price);
    this.lowestPrice = Math.min(...prices);
    this.highestPrice = Math.max(...prices);
  }
};

// Add price to history
ProductSchema.methods.addPriceToHistory = function(price) {
  this.priceHistory.push({ price, date: new Date() });
  this.currentPrice = price;
  this.lastScraped = new Date();
  this.updatePriceStats();
};

module.exports = mongoose.model('Product', ProductSchema);
