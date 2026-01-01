import { useState, useEffect } from 'react';
import api from '../../services/api';
import './QuizSetup.css';

const WORD_COUNTS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 'all'];
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const COMPLEXITY_OPTIONS = [
  { value: 'all', label: 'All Levels' },
  { value: 'simple', label: 'Simple' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

export default function QuizSetup({ onStart, loading, error }) {
  const [wordCount, setWordCount] = useState(10);
  const [letterFilter, setLetterFilter] = useState('');
  const [complexityFilter, setComplexityFilter] = useState('all');
  const [letterStats, setLetterStats] = useState({});
  const [complexityStats, setComplexityStats] = useState({});
  const [totalWords, setTotalWords] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, countRes, complexityRes] = await Promise.all([
          api.get('/words/stats/letters'),
          api.get('/words/count'),
          api.get('/words/stats/complexity')
        ]);
        const stats = {};
        statsRes.data.forEach(s => { stats[s._id] = s.count; });
        setLetterStats(stats);
        setTotalWords(countRes.data.count);
        setComplexityStats(complexityRes.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);

  // Calculate available words based on filters
  // Note: This is an approximation since we don't have combined letter+complexity stats from API
  const getAvailableWords = () => {
    if (letterFilter && complexityFilter !== 'all') {
      // Rough estimate: assume even distribution
      const letterCount = letterStats[letterFilter] || 0;
      const complexityRatio = (complexityStats[complexityFilter] || 0) / totalWords;
      return Math.floor(letterCount * complexityRatio) || 0;
    }
    if (letterFilter) return letterStats[letterFilter] || 0;
    if (complexityFilter !== 'all') return complexityStats[complexityFilter] || 0;
    return totalWords;
  };
  const availableWords = getAvailableWords();

  const handleLetterChange = (letter) => {
    setLetterFilter(letter);
  };

  const handleComplexityChange = (complexity) => {
    setComplexityFilter(complexity);
  };

  // Adjust word count when available words change
  useEffect(() => {
    if (wordCount !== 'all' && wordCount > availableWords && availableWords > 0) {
      const validCounts = WORD_COUNTS.filter(c => c !== 'all' && c <= availableWords);
      setWordCount(validCounts.length > 0 ? validCounts[validCounts.length - 1] : 10);
    }
  }, [letterFilter, complexityFilter, availableWords, wordCount]);

  const handleStart = () => {
    const count = wordCount === 'all' ? availableWords : wordCount;
    onStart(count, letterFilter || null, complexityFilter !== 'all' ? complexityFilter : null);
  };

  return (
    <div className="quiz-setup">
      <h2>Quiz Setup</h2>
      <p className="setup-description">
        Test your vocabulary knowledge! Choose the number of words and optionally
        filter by starting letter or difficulty level.
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
        <label>Difficulty Level (Optional)</label>
        <div className="complexity-grid">
          {COMPLEXITY_OPTIONS.map(option => (
            <button
              key={option.value}
              className={complexityFilter === option.value ? 'complexity-btn active' : 'complexity-btn'}
              onClick={() => handleComplexityChange(option.value)}
            >
              {option.label}
              {option.value !== 'all' && (
                <span className="complexity-count">{complexityStats[option.value] || 0}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="setup-section">
        <label>Number of Words {(letterFilter || complexityFilter !== 'all') ? '(' + availableWords + ' available)' : ''}</label>
        <div className="word-count-grid">
          {WORD_COUNTS.map(count => (
            <button
              key={count}
              className={wordCount === count ? 'count-btn active' : 'count-btn'}
              onClick={() => setWordCount(count)}
              disabled={count !== 'all' && count > availableWords}
            >
              {count === 'all' ? `All (${availableWords})` : count}
            </button>
          ))}
        </div>
      </div>

      <button
        className="start-btn"
        onClick={handleStart}
        disabled={loading || (wordCount !== 'all' && wordCount > availableWords)}
      >
        {loading ? 'Loading...' : 'Start Quiz'}
      </button>
    </div>
  );
}
