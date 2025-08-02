// services/api.js
import axios from 'axios';

const api = axios.create({
baseURL: 'https://student-managment-297u.onrender.com/api',

  withCredentials: true,
});

// Attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
