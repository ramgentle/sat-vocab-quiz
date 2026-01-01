import { useState } from 'react';
import '../quiz/QuizSetup.css';

const WORD_COUNTS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function FlashcardSetup({ onStart, loading, error }) {
  const [wordCount, setWordCount] = useState(10);
  const [letterFilter, setLetterFilter] = useState('');

  const handleStart = () => {
    onStart(wordCount, letterFilter || null);
  };

  return (
    <div className="quiz-setup">
      <h2>Flashcard Setup</h2>
      <p className="setup-description">
        Study vocabulary with flashcards! Click a card to flip it and reveal
        the definition and example sentences.
      </p>

      {error && <div className="error-message">{error}</div>}

      <div className="setup-section">
        <label>Number of Words</label>
        <div className="word-count-grid">
          {WORD_COUNTS.map(count => (
            <button
              key={count}
              className={`count-btn ${wordCount === count ? 'active' : ''}`}
              onClick={() => setWordCount(count)}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <div className="setup-section">
        <label>Filter by Letter (Optional)</label>
        <div className="letter-grid">
          <button
            className={`letter-btn ${letterFilter === '' ? 'active' : ''}`}
            onClick={() => setLetterFilter('')}
          >
            All
          </button>
          {LETTERS.map(letter => (
            <button
              key={letter}
              className={`letter-btn ${letterFilter === letter ? 'active' : ''}`}
              onClick={() => setLetterFilter(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      <button
        className="start-btn"
        onClick={handleStart}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Start Flashcards'}
      </button>
    </div>
  );
}
