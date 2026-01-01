import api from './api';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.success) {
      localStorage.setItem('sessionToken', response.data.sessionToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/user');
    if (response.data.isAuthenticated) {
      return { user: response.data };
    }
    return { user: null };
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('user');
    return { message: 'Logged out' };
  },

  checkAuth: async () => {
    const response = await api.get('/auth/user');
    return response.data;
  },

  isLoggedIn: () => {
    return !!localStorage.getItem('sessionToken');
  },

  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
