import Flashcard from './Flashcard';
import './FlashcardDeck.css';

export default function FlashcardDeck({
  currentCard,
  currentIndex,
  totalCards,
  isFlipped,
  onFlip,
  onNext,
  onPrevious,
  onShuffle,
  onReset,
  isFirst,
  isLast
}) {
  const progress = ((currentIndex + 1) / totalCards) * 100;

  return (
    <div className="flashcard-deck">
      <div className="deck-header">
        <span className="card-counter">
          Card {currentIndex + 1} of {totalCards}
        </span>
        <button className="shuffle-btn" onClick={onShuffle}>
          Shuffle
        </button>
      </div>

      <div className="deck-progress">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="deck-card">
        <Flashcard card={currentCard} isFlipped={isFlipped} onFlip={onFlip} />
      </div>

      <div className="deck-controls">
        <button
          className="control-btn prev"
          onClick={onPrevious}
          disabled={isFirst}
        >
          Previous
        </button>
        <button
          className="control-btn next"
          onClick={onNext}
          disabled={isLast}
        >
          Next
        </button>
      </div>

      {isLast && (
        <div className="deck-complete">
          <p>You've reviewed all cards!</p>
          <button className="reset-btn" onClick={onReset}>
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
