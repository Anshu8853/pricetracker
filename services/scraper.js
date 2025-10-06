const puppeteer = require('puppeteer');

// Detect platform from URL
const detectPlatform = (url) => {
  if (url.includes('amazon.')) return 'amazon';
  if (url.includes('flipkart.')) return 'flipkart';
  return null;
};

// Scrape Amazon product
const scrapeAmazon = async (page, url) => {
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const data = await page.evaluate(() => {
      // Product name
      const nameElement = document.querySelector('#productTitle');
      const name = nameElement ? nameElement.textContent.trim() : '';

      // Price - try multiple selectors
      let price = null;
      const priceSelectors = [
        '.a-price-whole',
        '#priceblock_ourprice',
        '#priceblock_dealprice',
        '.a-price .a-offscreen'
      ];

      for (const selector of priceSelectors) {
        const priceElement = document.querySelector(selector);
        if (priceElement) {
          const priceText = priceElement.textContent.trim();
          const priceMatch = priceText.replace(/[₹,]/g, '').match(/[\d.]+/);
          if (priceMatch) {
            price = parseFloat(priceMatch[0]);
            break;
          }
        }
      }

      // Image
      const imageElement = document.querySelector('#landingImage, #imgBlkFront');
      const imageUrl = imageElement ? imageElement.src : '';

      // Availability
      const availabilityElement = document.querySelector('#availability span');
      const availability = availabilityElement 
        ? availabilityElement.textContent.includes('In stock') ? 'In Stock' : 'Out of Stock'
        : 'Unknown';

      // Rating
      const ratingElement = document.querySelector('.a-icon-star span');
      const rating = ratingElement ? parseFloat(ratingElement.textContent) : null;

      return { name, price, imageUrl, availability, rating };
    });

    return {
      name: data.name,
      currentPrice: data.price,
      imageUrl: data.imageUrl,
      availability: data.availability,
      platform: 'amazon',
      url,
      metadata: {
        rating: data.rating
      }
    };
  } catch (error) {
    console.error('Amazon scraping error:', error.message);
    return null;
  }
};

// Scrape Flipkart product
const scrapeFlipkart = async (page, url) => {
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const data = await page.evaluate(() => {
      // Product name
      const nameElement = document.querySelector('.B_NuCI, .VU-ZEz');
      const name = nameElement ? nameElement.textContent.trim() : '';

      // Price
      let price = null;
      const priceElement = document.querySelector('._30jeq3, ._1_WHN1');
      if (priceElement) {
        const priceText = priceElement.textContent.trim();
        const priceMatch = priceText.replace(/[₹,]/g, '').match(/[\d.]+/);
        if (priceMatch) {
          price = parseFloat(priceMatch[0]);
        }
      }

      // Image
      const imageElement = document.querySelector('._396cs4 img, ._2r_T1I img');
      const imageUrl = imageElement ? imageElement.src : '';

      // Availability
      const availabilityElement = document.querySelector('._16FRp0');
      const availability = availabilityElement 
        ? 'In Stock'
        : 'Unknown';

      // Rating
      const ratingElement = document.querySelector('._3LWZlK');
      const rating = ratingElement ? parseFloat(ratingElement.textContent) : null;

      return { name, price, imageUrl, availability, rating };
    });

    return {
      name: data.name,
      currentPrice: data.price,
      imageUrl: data.imageUrl,
      availability: data.availability,
      platform: 'flipkart',
      url,
      metadata: {
        rating: data.rating
      }
    };
  } catch (error) {
    console.error('Flipkart scraping error:', error.message);
    return null;
  }
};

// Main scraping function
const scrapeProduct = async (url) => {
  const platform = detectPlatform(url);
  
  if (!platform) {
    console.error('Unsupported platform');
    return null;
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Set user agent to avoid bot detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    let productData;
    if (platform === 'amazon') {
      productData = await scrapeAmazon(page, url);
    } else if (platform === 'flipkart') {
      productData = await scrapeFlipkart(page, url);
    }

    await browser.close();
    return productData;
  } catch (error) {
    console.error('Scraping error:', error);
    if (browser) await browser.close();
    return null;
  }
};

module.exports = { scrapeProduct, detectPlatform };
