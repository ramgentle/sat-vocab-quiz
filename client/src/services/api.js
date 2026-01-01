import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add session token to all requests
api.interceptors.request.use((config) => {
  const sessionToken = localStorage.getItem('sessionToken');
  if (sessionToken) {
    config.headers['x-session-token'] = sessionToken;
  }
  return config;
});

export default api;
