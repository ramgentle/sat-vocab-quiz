import { useState, useEffect } from 'react';
import api from '../../services/api';
import './QuizSetup.css';

const WORD_COUNTS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function QuizSetup({ onStart, loading, error }) {
  const [wordCount, setWordCount] = useState(10);
  const [letterFilter, setLetterFilter] = useState('');
  const [letterStats, setLetterStats] = useState({});
  const [totalWords, setTotalWords] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, countRes] = await Promise.all([
          api.get('/words/stats/letters'),
          api.get('/words/count')
        ]);
        const stats = {};
        statsRes.data.forEach(s => { stats[s._id] = s.count; });
        setLetterStats(stats);
        setTotalWords(countRes.data.count);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);

  const availableWords = letterFilter ? (letterStats[letterFilter] || 0) : totalWords;

  const handleLetterChange = (letter) => {
    setLetterFilter(letter);
    const available = letter ? (letterStats[letter] || 0) : totalWords;
    if (wordCount > available) {
      const validCounts = WORD_COUNTS.filter(c => c <= available);
      setWordCount(validCounts.length > 0 ? validCounts[validCounts.length - 1] : 10);
    }
  };

  const handleStart = () => {
    onStart(wordCount, letterFilter || null);
  };

  return (
    <div className="quiz-setup">
      <h2>Quiz Setup</h2>
      <p className="setup-description">
        Test your vocabulary knowledge! Choose the number of words and optionally
        filter by starting letter.
      </p>

      {error && <div className="error-message">{error}</div>}

      <div className="setup-section">
        <label>Filter by Letter (Optional)</label>
        <div className="letter-grid">
          <button
            className={letterFilter === '' ? 'letter-btn active' : 'letter-btn'}
            onClick={() => handleLetterChange('')}
          >
            All ({totalWords})
          </button>
          {LETTERS.map(letter => (
            <button
              key={letter}
              className={[
                'letter-btn',
                letterFilter === letter ? 'active' : '',
                (letterStats[letter] || 0) < 10 ? 'limited' : ''
              ].join(' ')}
              onClick={() => handleLetterChange(letter)}
              title={(letterStats[letter] || 0) + ' words'}
            >
              {letter}
              <span className="letter-count">{letterStats[letter] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="setup-section">
        <label>Number of Words {letterFilter ? '(' + availableWords + ' available)' : ''}</label>
        <div className="word-count-grid">
          {WORD_COUNTS.map(count => (
            <button
              key={count}
              className={wordCount === count ? 'count-btn active' : 'count-btn'}
              onClick={() => setWordCount(count)}
              disabled={count > availableWords}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <button
        className="start-btn"
        onClick={handleStart}
        disabled={loading || wordCount > availableWords}
      >
        {loading ? 'Loading...' : 'Start Quiz'}
      </button>
    </div>
  );
}
