import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { progressService } from '../services/progressService';
import { quizService } from '../services/quizService';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, historyData] = await Promise.all([
        progressService.getStatistics(),
        quizService.getQuizHistory(1, 5)
      ]);
      setStats(statsData);
      setHistory(historyData.sessions);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard loading">
        <div className="loader"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1>Welcome back, {user?.displayName}!</h1>
        <p>Continue your vocabulary journey</p>
      </div>

      <div className="quick-actions">
        <Link to="/quiz" className="action-card quiz">
          <span className="action-icon">📝</span>
          <span className="action-title">Start Quiz</span>
        </Link>
        <Link to="/flashcards" className="action-card flashcard">
          <span className="action-icon">🗂️</span>
          <span className="action-title">Flashcards</span>
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats?.totalQuizzesTaken || 0}</span>
          <span className="stat-label">Quizzes Taken</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats?.totalWordsStudied || 0}</span>
          <span className="stat-label">Words Studied</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats?.averageScore || 0}%</span>
          <span className="stat-label">Average Score</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats?.bestScore || 0}%</span>
          <span className="stat-label">Best Score</span>
        </div>
      </div>

      <div className="history-section">
        <h2>Recent Quizzes</h2>
        {history.length > 0 ? (
          <div className="history-list">
            {history.map((session) => (
              <div key={session._id} className="history-item">
                <div className="history-info">
                  <span className="history-date">
                    {new Date(session.completedAt).toLocaleDateString()}
                  </span>
                  <span className="history-details">
                    {session.wordCount} words
                    {session.letterFilter && ` (Letter ${session.letterFilter})`}
                  </span>
                </div>
                <div className={`history-score ${session.score.percentage >= 70 ? 'good' : 'needs-work'}`}>
                  {session.score.percentage}%
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-history">No quizzes taken yet. Start your first quiz!</p>
        )}
      </div>
    </div>
  );
}
