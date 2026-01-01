import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          SAT Vocab Master
        </Link>

        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/quiz" className="nav-link">Quiz</Link>
              <Link to="/flashcards" className="nav-link">Flashcards</Link>
              <div className="user-menu">
                <img
                  src={user.profilePicture || '/default-avatar.png'}
                  alt={user.displayName}
                  className="user-avatar"
                />
                <span className="user-name">{user.displayName}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="nav-link login-link">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
