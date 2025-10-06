import React, { useState, useEffect } from 'react';
import { wishlistAPI } from '../api';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await wishlistAPI.getAll();
      setWishlist(response.data.wishlist);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    if (window.confirm('Remove this product from wishlist?')) {
      try {
        await wishlistAPI.remove(productId);
        fetchWishlist();
        alert('Removed from wishlist ❌');
      } catch (err) {
        alert('Failed to remove from wishlist');
      }
    }
  };

  const handleUpdatePrice = async (productId, currentTarget) => {
    const newPrice = prompt('Enter new target price:', currentTarget);
    if (newPrice && !isNaN(newPrice)) {
      try {
        await wishlistAPI.update(productId, { targetPrice: parseFloat(newPrice) });
        fetchWishlist();
        alert('Target price updated! ✅');
      } catch (err) {
        alert('Failed to update price');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>💝 My Wishlist</h1>
        <p style={{ color: '#666' }}>
          Products you're watching for price drops
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <h2>💝 Wishlist is Empty</h2>
          <p>Add products from the dashboard to track price drops!</p>
        </div>
      ) : (
        <div className="products-grid">
          {wishlist.map((item) => {
            const product = item.product;
            if (!product) return null;

            const isPriceDropped = product.currentPrice <= item.targetPrice;
            
            return (
              <div key={product._id} className="product-card">
                {product.imageUrl && (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="product-image"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <div className="product-platform">{product.platform}</div>
                <div className="product-name">{product.name}</div>
                <div className="product-price">₹{product.currentPrice}</div>
                
                <div style={{ margin: '15px 0', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                    <strong>Target Price:</strong> ₹{item.targetPrice}
                  </p>
                  {isPriceDropped && (
                    <p style={{ color: '#28a745', fontWeight: '600', fontSize: '14px' }}>
                      🎉 Price Dropped! Buy Now!
                    </p>
                  )}
                  {!isPriceDropped && (
                    <p style={{ color: '#666', fontSize: '14px' }}>
                      ₹{(product.currentPrice - item.targetPrice).toFixed(2)} above target
                    </p>
                  )}
                </div>

                <div className="product-actions">
                  <button 
                    className="btn-small btn-primary"
                    onClick={() => window.open(product.url, '_blank')}
                  >
                    🛒 Buy Now
                  </button>
                  <button 
                    className="btn-small btn-success"
                    onClick={() => handleUpdatePrice(product._id, item.targetPrice)}
                  >
                    ✏️ Edit Price
                  </button>
                  <button 
                    className="btn-small btn-danger"
                    onClick={() => handleRemove(product._id)}
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
