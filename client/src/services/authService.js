import api from './api';

export const authService = {
  getCurrentUser: async () => {
    const response = await api.get('/auth/user');
    return { user: response.data };
  },

  logout: async () => {
    const response = await api.get('/auth/logout');
    return response.data;
  },

  checkAuth: async () => {
    const response = await api.get('/auth/user');
    return response.data;
  },

  getGoogleLoginUrl: () => {
    return '#';
  }
};
