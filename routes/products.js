const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { scrapeProduct } = require('../services/scraper');

// @route   POST /api/products/track
// @desc    Add a new product to track
// @access  Private
router.post('/track', auth, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'Product URL is required' });
    }

    // Check if product already exists
    let product = await Product.findOne({ url });

    if (product) {
      return res.status(200).json({ 
        message: 'Product already being tracked',
        product 
      });
    }

    // Scrape product details
    console.log('🔍 Scraping product:', url);
    const productData = await scrapeProduct(url);

    if (!productData) {
      return res.status(400).json({ message: 'Failed to scrape product details' });
    }

    // Create new product
    product = new Product(productData);
    product.addPriceToHistory(productData.currentPrice);
    await product.save();

    res.status(201).json({
      message: 'Product added successfully',
      product
    });
  } catch (error) {
    console.error('Track product error:', error);
    res.status(500).json({ message: 'Error tracking product' });
  }
});

// @route   GET /api/products
// @desc    Get all tracked products
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product with price history
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// @route   PUT /api/products/:id/refresh
// @desc    Manually refresh product price
// @access  Private
router.put('/:id/refresh', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Scrape latest price
    const productData = await scrapeProduct(product.url);
    
    if (productData && productData.currentPrice) {
      product.addPriceToHistory(productData.currentPrice);
      product.availability = productData.availability || product.availability;
      product.imageUrl = productData.imageUrl || product.imageUrl;
      await product.save();
    }

    res.json({ 
      message: 'Product refreshed successfully',
      product 
    });
  } catch (error) {
    console.error('Refresh product error:', error);
    res.status(500).json({ message: 'Error refreshing product' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router;
