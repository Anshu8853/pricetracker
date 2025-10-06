// Manual script to scrape and update all products
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');
const { scrapeProduct } = require('../services/scraper');

const updateAllProducts = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');

    const products = await Product.find({ scrapingEnabled: true });
    console.log(`📊 Found ${products.length} products to update`);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`\n[${i + 1}/${products.length}] Processing: ${product.name}`);

      try {
        const scrapedData = await scrapeProduct(product.url);
        
        if (scrapedData && scrapedData.currentPrice) {
          product.addPriceToHistory(scrapedData.currentPrice);
          product.availability = scrapedData.availability || product.availability;
          await product.save();
          
          console.log(`✅ Updated: ${product.name} - ₹${scrapedData.currentPrice}`);
        } else {
          console.log(`⚠️ Failed to scrape: ${product.name}`);
        }

        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        console.error(`❌ Error: ${error.message}`);
      }
    }

    console.log('\n✅ All products updated');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateAllProducts();
