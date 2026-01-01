import { useState } from 'react';
import './QuizResults.css';

export default function QuizResults({ results, onRetry, onNewQuiz }) {
  const [showReview, setShowReview] = useState(false);
  const { score, reviewData } = results;

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#22c55e';
    if (percentage >= 60) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="quiz-results">
      <div className="results-header">
        <h2>Quiz Complete!</h2>
      </div>

      <div className="score-card">
        <div
          className="score-circle"
          style={{ borderColor: getScoreColor(score.percentage) }}
        >
          <span className="score-percentage">{score.percentage}%</span>
        </div>
        <div className="score-details">
          <div className="score-item correct">
            <span className="score-label">Correct</span>
            <span className="score-value">{score.correct}</span>
          </div>
          <div className="score-item incorrect">
            <span className="score-label">Incorrect</span>
            <span className="score-value">{score.incorrect}</span>
          </div>
        </div>
      </div>

      <div className="results-actions">
        <button className="action-btn review" onClick={() => setShowReview(!showReview)}>
          {showReview ? 'Hide Review' : 'Review Answers'}
        </button>
        <button className="action-btn new-quiz" onClick={onNewQuiz}>
          New Quiz
        </button>
      </div>

      {showReview && (
        <div className="review-section">
          <h3>Answer Review</h3>
          <div className="review-list">
            {reviewData.map((item, index) => (
              <div
                key={index}
                className={`review-item ${item.isCorrect ? 'correct' : 'incorrect'}`}
              >
                <div className="review-header">
                  <span className={`status-badge ${item.isCorrect ? 'correct' : 'incorrect'}`}>
                    {item.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                  <span className="word-pos">{item.partOfSpeech}</span>
                </div>
                <div className="review-word">
                  <strong>{item.word}</strong>
                </div>
                <div className="review-definition">{item.definition}</div>
                {!item.isCorrect && (
                  <div className="review-answers">
                    <div className="your-answer">
                      Your answer: <span className="wrong">{item.userAnswer}</span>
                    </div>
                    <div className="correct-answer">
                      Correct answer: <span className="right">{item.correctAnswer}</span>
                    </div>
                  </div>
                )}
                <div className="review-sentences">
                  <strong>Examples:</strong>
                  <ul>
                    {item.sentences.map((sentence, i) => (
                      <li key={i}>{sentence}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
