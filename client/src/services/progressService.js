import api from './api';

export const progressService = {
  getProgress: async () => {
    const response = await api.get('/progress');
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/progress/statistics');
    return response.data;
  },

  getWordsLearned: async () => {
    const response = await api.get('/progress/words');
    return response.data;
  },

  getProgressByLetter: async (letter) => {
    const response = await api.get(`/progress/letter/${letter}`);
    return response.data;
  },

  getAllLettersProgress: async () => {
    const response = await api.get('/progress/letters');
    return response.data;
  }
};
