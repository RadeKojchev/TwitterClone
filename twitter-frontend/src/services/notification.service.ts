// import api from '../lib/axios';

// export const notificationService = {
//   async getNotifications() {
//     return (await api.get('/notifications')).data;
//   },

//   async markAllAsRead() {
//     return (await api.post('/notifications/read-all')).data;
//   }
// };

import api from '../lib/axios';

export const notificationService = {
  async getNotifications() {
    return (await api.get('/notifications')).data;
  },

  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  },

  async markAllAsRead() {
    return (await api.post('/notifications/read-all')).data;
  }
};