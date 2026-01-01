import api from './api';

export const quizService = {
  startQuiz: async (wordCount, letterFilter = null, complexityFilter = null, mode = 'quiz') => {
    const response = await api.post('/quiz/start', {
      wordCount,
      letterFilter,
      complexityFilter,
      mode
    });
    return response.data;
  },

  getQuizSession: async (sessionId) => {
    const response = await api.get(`/quiz/${sessionId}`);
    return response.data;
  },

  completeQuiz: async (sessionId, answers) => {
    const response = await api.post(`/quiz/${sessionId}/complete`, { answers });
    return response.data;
  },

  getQuizHistory: async (page = 1, limit = 10) => {
    const response = await api.get(`/quiz/history?page=${page}&limit=${limit}`);
    return response.data;
  }
};
