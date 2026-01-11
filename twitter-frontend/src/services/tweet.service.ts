// import api from '../lib/axios';

// export const tweetService = {
//   async getAllTweets() {
//     return (await api.get('/tweets')).data;
//   },

//   async createTweet(content: string, image?: File | null) {
//     const formData = new FormData();
//     formData.append('content', content);
//     if (image) formData.append('image', image);

//     return (await api.post('/tweets', formData)).data;
//   },

//   async getHomeFeed(page = 1, limit = 10) {
//     return (await api.get(`/tweets/feed?page=${page}&limit=${limit}`)).data;
//   },

//   async toggleLike(tweetId: number) {
//     return (await api.post(`/tweets/${tweetId}/like`)).data;
//   },

//   async createReply(parentId: number, content: string) {
//     // Праќаме како JSON бидејќи обично replies немаат слики веднаш
//     return (await api.post('/tweets', { content, parentId })).data;
//   },

//   async getTweetWithReplies(id: string | number) {
//     return (await api.get(`/tweets/${id}/details`)).data;
//   },

//   async retweet(tweetId: number) {
//     return (await api.post(`/tweets/${tweetId}/retweet`)).data;
//   }
// };

import api from '../lib/axios';

export const tweetService = {
  async getAllTweets() {
    return (await api.get('/tweets')).data;
  },

  async createTweet(content: string, image?: File | null) {
    const formData = new FormData();
    formData.append('content', content);
    if (image) formData.append('image', image);

    return (await api.post('/tweets', formData)).data;
  },

  async getHomeFeed(page = 1, limit = 10) {
    return (await api.get(`/tweets/feed?page=${page}&limit=${limit}`)).data;
  },

  async getUserTweets(username: string) {
    // Оваа рута мора да одговара на @Get('user/:username') во бекенд контролерот
    return (await api.get(`/tweets/user/${username}`)).data;
  },

  async toggleLike(tweetId: number) {
    return (await api.post(`/tweets/${tweetId}/like`)).data;
  },

  async createReply(parentId: number, content: string) {
    return (await api.post('/tweets', { content, parentId })).data;
  },

  async getTweetWithReplies(id: string | number) {
    return (await api.get(`/tweets/${id}/details`)).data;
  },

  async retweet(tweetId: number) {
    return (await api.post(`/tweets/${tweetId}/retweet`)).data;
  },
  async deleteTweet(id: string) {
  const response = await api.delete(`/tweets/${id}`);
  return response.data;
}
};