import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { productsAPI } from '../api';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getOne(id);
      setProduct(response.data.product);
    } catch (err) {
      console.error('Error fetching product:', err);
      alert('Failed to load product');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) return null;

  // Prepare chart data
  const chartData = product.priceHistory.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    price: item.price
  }));

  return (
    <div className="product-details">
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      <div className="product-details-card">
        <div className="product-header">
          <div>
            {product.imageUrl && (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="product-image-large"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
          </div>
          <div className="product-info">
            <h1>{product.name}</h1>
            <div className="product-platform">{product.platform}</div>
            <div className="price-large">₹{product.currentPrice}</div>
            
            <div className="price-stats">
              <div className="price-stat">
                <div className="price-stat-label">Lowest Price</div>
                <div className="price-stat-value">₹{product.lowestPrice || product.currentPrice}</div>
              </div>
              <div className="price-stat">
                <div className="price-stat-label">Highest Price</div>
                <div className="price-stat-value">₹{product.highestPrice || product.currentPrice}</div>
              </div>
              <div className="price-stat">
                <div className="price-stat-label">Availability</div>
                <div className="price-stat-value" style={{ fontSize: '16px' }}>
                  {product.availability}
                </div>
              </div>
            </div>

            <button 
              className="btn" 
              onClick={() => window.open(product.url, '_blank')}
              style={{ marginTop: '20px' }}
            >
              🛒 Buy on {product.platform.charAt(0).toUpperCase() + product.platform.slice(1)}
            </button>
          </div>
        </div>

        {chartData.length > 1 && (
          <div style={{ marginTop: '40px' }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>📈 Price History</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  dot={{ fill: '#667eea', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div style={{ marginTop: '30px' }}>
          <h3 style={{ color: '#666', marginBottom: '10px' }}>Product Details</h3>
          <p><strong>Last Updated:</strong> {new Date(product.lastScraped).toLocaleString()}</p>
          <p><strong>Added:</strong> {new Date(product.createdAt).toLocaleString()}</p>
          {product.metadata?.rating && (
            <p><strong>Rating:</strong> ⭐ {product.metadata.rating}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
