import api from './api';

export const wordService = {
  getAllWords: async (page = 1, limit = 50) => {
    const response = await api.get(`/words?page=${page}&limit=${limit}`);
    return response.data;
  },

  getWordById: async (id) => {
    const response = await api.get(`/words/${id}`);
    return response.data;
  },

  getWordsByLetter: async (letter) => {
    const response = await api.get(`/words/letter/${letter}`);
    return response.data;
  },

  getRandomWords: async (count, letter = null) => {
    const params = new URLSearchParams({ count });
    if (letter) params.append('letter', letter);
    const response = await api.get(`/words/random?${params}`);
    return response.data;
  },

  getWordCount: async () => {
    const response = await api.get('/words/count');
    return response.data;
  },

  getLetterStats: async () => {
    const response = await api.get('/words/stats/letters');
    return response.data;
  }
};
