const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// @route   POST /api/wishlist
// @desc    Add product to wishlist
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { productId, targetPrice } = req.body;

    if (!productId || !targetPrice) {
      return res.status(400).json({ message: 'Product ID and target price are required' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.userId);

    // Check if already in wishlist
    const existingItem = user.wishlist.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      // Update target price
      existingItem.targetPrice = targetPrice;
    } else {
      // Add to wishlist
      user.wishlist.push({
        product: productId,
        targetPrice,
        notificationEnabled: true
      });
    }

    await user.save();

    res.json({ 
      message: 'Product added to wishlist',
      wishlist: user.wishlist 
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
});

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('wishlist.product');
    
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
});

// @route   DELETE /api/wishlist/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    user.wishlist = user.wishlist.filter(
      item => item.product.toString() !== req.params.productId
    );

    await user.save();

    res.json({ 
      message: 'Product removed from wishlist',
      wishlist: user.wishlist 
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
});

// @route   PUT /api/wishlist/:productId
// @desc    Update wishlist item (target price, notifications)
// @access  Private
router.put('/:productId', auth, async (req, res) => {
  try {
    const { targetPrice, notificationEnabled } = req.body;
    const user = await User.findById(req.userId);
    
    const wishlistItem = user.wishlist.find(
      item => item.product.toString() === req.params.productId
    );

    if (!wishlistItem) {
      return res.status(404).json({ message: 'Product not in wishlist' });
    }

    if (targetPrice !== undefined) {
      wishlistItem.targetPrice = targetPrice;
    }
    
    if (notificationEnabled !== undefined) {
      wishlistItem.notificationEnabled = notificationEnabled;
    }

    await user.save();

    res.json({ 
      message: 'Wishlist item updated',
      wishlist: user.wishlist 
    });
  } catch (error) {
    console.error('Update wishlist error:', error);
    res.status(500).json({ message: 'Error updating wishlist' });
  }
});

module.exports = router;
