import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import './Login.css';

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p>Sign in to track your progress and continue learning</p>
        <GoogleLoginButton />
      </div>
    </div>
  );
}
