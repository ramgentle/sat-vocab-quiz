import { useState, useCallback } from 'react';
import { wordService } from '../services/wordService';

const initialState = {
  status: 'setup',
  words: [],
  currentIndex: 0,
  isFlipped: false,
  error: null
};

export function useFlashcard() {
  const [state, setState] = useState(initialState);

  const startFlashcards = useCallback(async (wordCount, letterFilter) => {
    setState(prev => ({ ...prev, status: 'loading', error: null }));

    try {
      const words = await wordService.getRandomWords(wordCount, letterFilter);
      setState(prev => ({
        ...prev,
        status: 'active',
        words,
        currentIndex: 0,
        isFlipped: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'setup',
        error: error.response?.data?.error || 'Failed to load flashcards'
      }));
    }
  }, []);

  const flipCard = useCallback(() => {
    setState(prev => ({ ...prev, isFlipped: !prev.isFlipped }));
  }, []);

  const nextCard = useCallback(() => {
    setState(prev => {
      if (prev.currentIndex < prev.words.length - 1) {
        return { ...prev, currentIndex: prev.currentIndex + 1, isFlipped: false };
      }
      return prev;
    });
  }, []);

  const previousCard = useCallback(() => {
    setState(prev => {
      if (prev.currentIndex > 0) {
        return { ...prev, currentIndex: prev.currentIndex - 1, isFlipped: false };
      }
      return prev;
    });
  }, []);

  const shuffleCards = useCallback(() => {
    setState(prev => {
      const shuffled = [...prev.words].sort(() => Math.random() - 0.5);
      return { ...prev, words: shuffled, currentIndex: 0, isFlipped: false };
    });
  }, []);

  const resetFlashcards = useCallback(() => {
    setState(initialState);
  }, []);

  const currentCard = state.words[state.currentIndex];
  const isLastCard = state.currentIndex === state.words.length - 1;
  const isFirstCard = state.currentIndex === 0;
  const progress = state.words.length > 0
    ? Math.round(((state.currentIndex + 1) / state.words.length) * 100)
    : 0;

  return {
    ...state,
    currentCard,
    isLastCard,
    isFirstCard,
    progress,
    startFlashcards,
    flipCard,
    nextCard,
    previousCard,
    shuffleCards,
    resetFlashcards
  };
}
