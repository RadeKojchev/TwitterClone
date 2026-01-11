import api from '../lib/axios';

export const authService = {
  async register(data: any) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(data: any) {
    const response = await api.post('/auth/login', data);
    // Го зачувуваме токенот за да можеме да правиме заштитени барања
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};