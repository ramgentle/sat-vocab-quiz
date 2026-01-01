import { useQuiz } from '../hooks/useQuiz';
import QuizSetup from '../components/quiz/QuizSetup';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizResults from '../components/quiz/QuizResults';
import './QuizMode.css';

export default function QuizMode() {
  const {
    status,
    currentQuestion,
    currentQuestionIndex,
    questions,
    answers,
    results,
    error,
    isFirstQuestion,
    isLastQuestion,
    startQuiz,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    completeQuiz,
    resetQuiz
  } = useQuiz();

  return (
    <div className="quiz-mode">
      {status === 'setup' && (
        <QuizSetup
          onStart={startQuiz}
          loading={false}
          error={error}
        />
      )}

      {status === 'loading' && (
        <div className="quiz-loading">
          <div className="loader"></div>
          <p>Loading quiz...</p>
        </div>
      )}

      {(status === 'active' || status === 'submitting') && currentQuestion && (
        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={answers[currentQuestion.wordId]}
          onAnswer={submitAnswer}
          onNext={nextQuestion}
          onPrevious={previousQuestion}
          isFirst={isFirstQuestion}
          isLast={isLastQuestion}
          onComplete={completeQuiz}
        />
      )}

      {status === 'completed' && results && (
        <QuizResults
          results={results}
          onRetry={() => startQuiz(questions.length, null)}
          onNewQuiz={resetQuiz}
        />
      )}
    </div>
  );
}
