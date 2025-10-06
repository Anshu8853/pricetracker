const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send price drop email
const sendPriceDropEmail = async (user, product, oldPrice, newPrice, targetPrice) => {
  try {
    const transporter = createTransporter();

    const priceDropPercentage = (((oldPrice - newPrice) / oldPrice) * 100).toFixed(2);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `🎉 Price Drop Alert: ${product.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .product-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .price-box { display: flex; justify-content: space-around; margin: 20px 0; }
            .price { text-align: center; padding: 15px; }
            .old-price { color: #999; text-decoration: line-through; font-size: 18px; }
            .new-price { color: #28a745; font-size: 28px; font-weight: bold; }
            .savings { background: #28a745; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 10px 0; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Price Drop Alert!</h1>
              <p>The product you're tracking just got cheaper!</p>
            </div>
            <div class="content">
              <div class="product-info">
                <h2>${product.name}</h2>
                ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 15px 0;">` : ''}
                
                <div class="price-box">
                  <div class="price">
                    <div>Old Price</div>
                    <div class="old-price">₹${oldPrice}</div>
                  </div>
                  <div class="price">
                    <div>New Price</div>
                    <div class="new-price">₹${newPrice}</div>
                  </div>
                </div>

                <div style="text-align: center;">
                  <div class="savings">
                    💰 You Save: ₹${(oldPrice - newPrice).toFixed(2)} (${priceDropPercentage}% OFF)
                  </div>
                </div>

                <p style="text-align: center; margin-top: 20px;">
                  <strong>Your Target Price:</strong> ₹${targetPrice}<br>
                  <strong>Platform:</strong> ${product.platform.charAt(0).toUpperCase() + product.platform.slice(1)}
                </p>

                <div style="text-align: center;">
                  <a href="${product.url}" class="button">View Product →</a>
                </div>
              </div>

              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                ⏰ Hurry! Prices can change at any time. Don't miss this deal!
              </p>
            </div>

            <div class="footer">
              <p>You're receiving this email because you set a price alert for this product.</p>
              <p>To manage your alerts, log in to your Price Tracker dashboard.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: '🎉 Welcome to Price Tracker!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #667eea;">Welcome to Price Tracker!</h1>
          <p>Hi ${user.name},</p>
          <p>Thank you for signing up! You can now:</p>
          <ul>
            <li>🔍 Track prices from Amazon and Flipkart</li>
            <li>💰 Set custom price alerts</li>
            <li>📊 View price history charts</li>
            <li>📧 Get instant email notifications</li>
          </ul>
          <p>Start tracking your first product today!</p>
          <p>Happy Shopping! 🛍️</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error('Welcome email error:', error);
  }
};

module.exports = { sendPriceDropEmail, sendWelcomeEmail };
