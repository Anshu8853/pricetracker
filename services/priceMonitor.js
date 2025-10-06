const Product = require('../models/Product');
const User = require('../models/User');
const { scrapeProduct } = require('./scraper');
const { sendPriceDropEmail } = require('./emailService');

// Check all products and send alerts
const checkPriceDrops = async () => {
  try {
    console.log('🔍 Starting price drop check...');
    
    // Get all products that need to be scraped
    const products = await Product.find({ scrapingEnabled: true });
    console.log(`📊 Checking ${products.length} products...`);

    for (const product of products) {
      try {
        // Scrape latest price
        const scrapedData = await scrapeProduct(product.url);
        
        if (!scrapedData || !scrapedData.currentPrice) {
          console.log(`⚠️ Failed to scrape: ${product.name}`);
          continue;
        }

        const oldPrice = product.currentPrice;
        const newPrice = scrapedData.currentPrice;

        // Update product
        product.addPriceToHistory(newPrice);
        product.availability = scrapedData.availability || product.availability;
        await product.save();

        console.log(`✅ Updated: ${product.name} - ₹${oldPrice} → ₹${newPrice}`);

        // Check if price dropped
        if (newPrice < oldPrice) {
          console.log(`💰 Price drop detected for: ${product.name}`);
          await notifyUsersAboutPriceDrop(product, oldPrice, newPrice);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error processing product ${product.name}:`, error.message);
      }
    }

    console.log('✅ Price check completed');
  } catch (error) {
    console.error('Price monitoring error:', error);
  }
};

// Notify users about price drops
const notifyUsersAboutPriceDrop = async (product, oldPrice, newPrice) => {
  try {
    // Find all users who have this product in wishlist
    const users = await User.find({
      'wishlist.product': product._id,
      emailNotifications: true
    });

    for (const user of users) {
      const wishlistItem = user.wishlist.find(
        item => item.product.toString() === product._id.toString()
      );

      if (!wishlistItem || !wishlistItem.notificationEnabled) {
        continue;
      }

      // Check if price meets target
      if (newPrice <= wishlistItem.targetPrice) {
        console.log(`📧 Sending email to ${user.email} for ${product.name}`);
        await sendPriceDropEmail(user, product, oldPrice, newPrice, wishlistItem.targetPrice);
      }
    }
  } catch (error) {
    console.error('Error notifying users:', error);
  }
};

module.exports = { checkPriceDrops, notifyUsersAboutPriceDrop };
