import api from '../lib/axios';

export const userService = {
  // Земање податоци за профил
  getUserProfile: async (username: string) => {
    const res = await api.get(`/users/profile/${username}`);
    return res.data;
  },
  
  // Следење корисник
  followUser: async (userId: string) => {
    const res = await api.post(`/users/follow/${userId}`);
    return res.data;
  },

  // Ажурирање на профил (испраќа FormData со слики и текст)
  updateProfile: async (formData: FormData) => {
    const res = await api.patch('/users/profile', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data' 
      }
    });
    return res.data;
  }
};