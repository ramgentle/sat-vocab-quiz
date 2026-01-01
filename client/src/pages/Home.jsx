import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <h1>Master SAT Vocabulary</h1>
        <p className="hero-subtitle">
          Learn 1000+ essential SAT words through interactive quizzes and flashcards
        </p>
        {user ? (
          <div className="hero-actions">
            <Link to="/quiz" className="hero-btn primary">Start Quiz</Link>
            <Link to="/flashcards" className="hero-btn secondary">Flashcards</Link>
          </div>
        ) : (
          <Link to="/login" className="hero-btn primary">Get Started</Link>
        )}
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h3>Quiz Mode</h3>
          <p>Test your knowledge with multiple-choice questions. Get instant feedback and track your progress.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🗂️</div>
          <h3>Flashcards</h3>
          <p>Study words at your own pace with flip cards showing definitions and example sentences.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Progress Tracking</h3>
          <p>Monitor your learning journey with detailed statistics and score history.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔤</div>
          <h3>Filter by Letter</h3>
          <p>Focus on specific letters or study all words. Customize your learning experience.</p>
        </div>
      </section>

      <section className="stats">
        <div className="stat-item">
          <span className="stat-number">1000+</span>
          <span className="stat-label">SAT Words</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">A-Z</span>
          <span className="stat-label">Letter Filters</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">10-100</span>
          <span className="stat-label">Words per Session</span>
        </div>
      </section>
    </div>
  );
}
