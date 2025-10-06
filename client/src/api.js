import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Products API
export const productsAPI = {
  trackProduct: (url) => api.post('/products/track', { url }),
  getAll: () => api.get('/products'),
  getOne: (id) => api.get(`/products/${id}`),
  refresh: (id) => api.put(`/products/${id}/refresh`),
  delete: (id) => api.delete(`/products/${id}`),
};

// Wishlist API
export const wishlistAPI = {
  getAll: () => api.get('/wishlist'),
  add: (productId, targetPrice) => api.post('/wishlist', { productId, targetPrice }),
  update: (productId, data) => api.put(`/wishlist/${productId}`, data),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};

// User API
export const userAPI = {
  updateSettings: (data) => api.put('/user/settings', data),
};

export default api;
