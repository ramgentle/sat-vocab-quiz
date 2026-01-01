import { useState, useEffect } from 'react';
import './QuizQuestion.css';

export default function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  onComplete
}) {
  const [showResult, setShowResult] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    setShowResult(!!selectedAnswer);
    setHasAnswered(!!selectedAnswer);
  }, [questionNumber, selectedAnswer]);

  const handleAnswer = (wordId, option) => {
    if (showResult) return;
    onAnswer(wordId, option);
    setShowResult(true);
    setHasAnswered(true);
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  const getOptionClass = (option) => {
    let classes = 'option-btn';

    if (showResult) {
      if (option === question.correctAnswer) {
        classes += ' correct';
      } else if (option === selectedAnswer && option !== question.correctAnswer) {
        classes += ' incorrect';
      }
    } else if (selectedAnswer === option) {
      classes += ' selected';
    }

    return classes;
  };

  return (
    <div className="quiz-question">
      <div className="question-header">
        <span className="question-number">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="part-of-speech">{question.partOfSpeech}</span>
      </div>

      <div className="question-progress">
        <div
          className="progress-fill"
          style={{ width: ((questionNumber / totalQuestions) * 100) + '%' }}
        />
      </div>

      <div className="question-content">
        <h3 className="definition">{question.definition}</h3>
        <p className="instruction">Select the word that matches this definition:</p>
      </div>

      <div className="options-grid">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={getOptionClass(option)}
            onClick={() => handleAnswer(question.wordId, option)}
            disabled={showResult}
          >
            <span className="option-letter">{String.fromCharCode(65 + index)}</span>
            <span className="option-word">{option}</span>
            {showResult && option === question.correctAnswer && (
              <span className="check-mark">OK</span>
            )}
            {showResult && option === selectedAnswer && option !== question.correctAnswer && (
              <span className="x-mark">X</span>
            )}
          </button>
        ))}
      </div>

      {showResult && (
        <div className={isCorrect ? 'result-feedback correct' : 'result-feedback incorrect'}>
          {isCorrect ? (
            <p>Correct! Well done.</p>
          ) : (
            <p>
              Incorrect. The correct answer is <strong>{question.correctAnswer}</strong>.
            </p>
          )}
        </div>
      )}

      <div className="question-navigation">
        <button
          className="nav-btn prev"
          onClick={onPrevious}
          disabled={isFirst}
        >
          Previous
        </button>

        {isLast ? (
          <button
            className="nav-btn complete"
            onClick={onComplete}
            disabled={!hasAnswered}
          >
            Complete Quiz
          </button>
        ) : (
          <button
            className="nav-btn next"
            onClick={onNext}
            disabled={!showResult}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
