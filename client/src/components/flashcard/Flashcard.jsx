import './Flashcard.css';

export default function Flashcard({ card, isFlipped, onFlip }) {
  return (
    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={onFlip}>
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <span className="card-label">Word</span>
          <h2 className="card-word">{card.word}</h2>
          <span className="card-pos">{card.partOfSpeech}</span>
          <p className="flip-hint">Click to reveal definition</p>
        </div>
        <div className="flashcard-back">
          <span className="card-label">Definition</span>
          <p className="card-definition">{card.definition}</p>
          <div className="card-sentences">
            <strong>Examples:</strong>
            <ul>
              {card.sentences.map((sentence, index) => (
                <li key={index}>{sentence}</li>
              ))}
            </ul>
          </div>
          <p className="flip-hint">Click to see word</p>
        </div>
      </div>
    </div>
  );
}
