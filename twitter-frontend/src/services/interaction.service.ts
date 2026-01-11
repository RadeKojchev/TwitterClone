import api from '../lib/axios';

export const interactionService = {
  async toggleLike(tweetId: string) {
    return (await api.post(`/interactions/like/${tweetId}`)).data;
  },

  async retweet(tweetId: string) {
    return (await api.post(`/interactions/retweet/${tweetId}`)).data;
  },

  async reply(tweetId: string, content: string) {
    return (await api.post(`/interactions/reply/${tweetId}`, { content })).data;
  }
};