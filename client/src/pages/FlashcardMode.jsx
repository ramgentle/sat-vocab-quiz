import { useFlashcard } from '../hooks/useFlashcard';
import FlashcardSetup from '../components/flashcard/FlashcardSetup';
import FlashcardDeck from '../components/flashcard/FlashcardDeck';
import './FlashcardMode.css';

export default function FlashcardMode() {
  const {
    status,
    words,
    currentCard,
    currentIndex,
    isFlipped,
    isFirstCard,
    isLastCard,
    error,
    startFlashcards,
    flipCard,
    nextCard,
    previousCard,
    shuffleCards,
    resetFlashcards
  } = useFlashcard();

  return (
    <div className="flashcard-mode">
      {status === 'setup' && (
        <FlashcardSetup
          onStart={startFlashcards}
          loading={false}
          error={error}
        />
      )}

      {status === 'loading' && (
        <div className="flashcard-loading">
          <div className="loader"></div>
          <p>Loading flashcards...</p>
        </div>
      )}

      {status === 'active' && currentCard && (
        <FlashcardDeck
          currentCard={currentCard}
          currentIndex={currentIndex}
          totalCards={words.length}
          isFlipped={isFlipped}
          onFlip={flipCard}
          onNext={nextCard}
          onPrevious={previousCard}
          onShuffle={shuffleCards}
          onReset={resetFlashcards}
          isFirst={isFirstCard}
          isLast={isLastCard}
        />
      )}
    </div>
  );
}
