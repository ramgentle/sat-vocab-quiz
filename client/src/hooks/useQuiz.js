import { useState, useCallback } from 'react';
import { quizService } from '../services/quizService';

const initialState = {
  status: 'setup',
  sessionId: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  results: null,
  error: null
};

export function useQuiz() {
  const [state, setState] = useState(initialState);

  const startQuiz = useCallback(async (wordCount, letterFilter, complexityFilter) => {
    setState(prev => ({ ...prev, status: 'loading', error: null }));

    try {
      const data = await quizService.startQuiz(wordCount, letterFilter, complexityFilter);
      setState(prev => ({
        ...prev,
        status: 'active',
        sessionId: data.sessionId,
        questions: data.questions,
        currentQuestionIndex: 0,
        answers: {}
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'setup',
        error: error.response?.data?.error || 'Failed to start quiz'
      }));
    }
  }, []);

  const submitAnswer = useCallback((wordId, answer) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [wordId]: answer }
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    setState(prev => {
      if (prev.currentQuestionIndex < prev.questions.length - 1) {
        return { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 };
      }
      return prev;
    });
  }, []);

  const previousQuestion = useCallback(() => {
    setState(prev => {
      if (prev.currentQuestionIndex > 0) {
        return { ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 };
      }
      return prev;
    });
  }, []);

  const completeQuiz = useCallback(async () => {
    setState(prev => ({ ...prev, status: 'submitting' }));

    try {
      const results = await quizService.completeQuiz(state.sessionId, state.answers);
      setState(prev => ({
        ...prev,
        status: 'completed',
        results
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'active',
        error: error.response?.data?.error || 'Failed to submit quiz'
      }));
    }
  }, [state.sessionId, state.answers]);

  const resetQuiz = useCallback(() => {
    setState(initialState);
  }, []);

  const currentQuestion = state.questions[state.currentQuestionIndex];
  const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;
  const isFirstQuestion = state.currentQuestionIndex === 0;
  const answeredCount = Object.keys(state.answers).length;
  const progress = state.questions.length > 0
    ? Math.round((answeredCount / state.questions.length) * 100)
    : 0;

  return {
    ...state,
    currentQuestion,
    isLastQuestion,
    isFirstQuestion,
    answeredCount,
    progress,
    startQuiz,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    completeQuiz,
    resetQuiz
  };
}
