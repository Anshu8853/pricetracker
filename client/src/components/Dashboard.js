import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI, wishlistAPI } from '../api';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [productUrl, setProductUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [targetPrice, setTargetPrice] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data.products);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await wishlistAPI.getAll();
      setWishlist(response.data.wishlist);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  const handleTrackProduct = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await productsAPI.trackProduct(productUrl);
      setProductUrl('');
      fetchProducts();
      alert('Product added successfully! 🎉');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to track product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = (product) => {
    setSelectedProduct(product);
    setTargetPrice(product.currentPrice.toString());
    setShowModal(true);
  };

  const confirmAddToWishlist = async () => {
    try {
      await wishlistAPI.add(selectedProduct._id, parseFloat(targetPrice));
      setShowModal(false);
      fetchWishlist();
      alert('Added to wishlist! 💝');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  const handleRefresh = async (productId) => {
    try {
      await productsAPI.refresh(productId);
      fetchProducts();
      alert('Price updated! ✅');
    } catch (err) {
      alert('Failed to refresh price');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(productId);
        fetchProducts();
        alert('Product deleted ❌');
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product?._id === productId);
  };

  const stats = {
    totalProducts: products.length,
    inWishlist: wishlist.length,
    avgPrice: products.length > 0 
      ? (products.reduce((sum, p) => sum + p.currentPrice, 0) / products.length).toFixed(2)
      : 0
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Track products from Amazon and Flipkart
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleTrackProduct} className="track-form">
          <input
            type="url"
            className="track-input"
            placeholder="Paste Amazon or Flipkart product URL here..."
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            required
          />
          <button type="submit" className="btn-track" disabled={loading}>
            {loading ? '🔍 Tracking...' : '➕ Track Product'}
          </button>
        </form>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Products</h3>
          <div className="stat-value">{stats.totalProducts}</div>
        </div>
        <div className="stat-card">
          <h3>In Wishlist</h3>
          <div className="stat-value">{stats.inWishlist}</div>
        </div>
        <div className="stat-card">
          <h3>Average Price</h3>
          <div className="stat-value">₹{stats.avgPrice}</div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <h2>🔍 No Products Yet</h2>
          <p>Start by adding a product URL from Amazon or Flipkart above!</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
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
              {product.lowestPrice && (
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Lowest: ₹{product.lowestPrice} | Highest: ₹{product.highestPrice}
                </p>
              )}
              <div className="product-actions">
                <button 
                  className="btn-small btn-primary"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  📊 Details
                </button>
                {!isInWishlist(product._id) && (
                  <button 
                    className="btn-small btn-success"
                    onClick={() => handleAddToWishlist(product)}
                  >
                    💝 Wishlist
                  </button>
                )}
                <button 
                  className="btn-small btn-primary"
                  onClick={() => handleRefresh(product._id)}
                >
                  🔄
                </button>
                <button 
                  className="btn-small btn-danger"
                  onClick={() => handleDelete(product._id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add to Wishlist</h2>
              <p>{selectedProduct?.name}</p>
            </div>
            <div className="form-group">
              <label>Target Price (₹)</label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Enter your target price"
                min="0"
                step="0.01"
              />
              <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                Current Price: ₹{selectedProduct?.currentPrice}
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn" onClick={confirmAddToWishlist}>
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
