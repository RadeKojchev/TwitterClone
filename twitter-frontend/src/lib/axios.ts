// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:3000', // Адресата на твојот NestJS сервер
// });

// api.interceptors.request.use((config) => {
//   if (typeof window !== 'undefined') {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }
//   return config;
// });

// export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Провери дали ова е портот на бекендот
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;