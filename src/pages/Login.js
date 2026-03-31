import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem('user', JSON.stringify(response));
      setIsError(false);
      setMessage('✅ Connexion réussie !');
      setTimeout(() => { window.location.href = '/dashboard'; }, 1000);
    } catch (error) {
      setIsError(true);
      setMessage('❌ Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="login-container">
      <div className="auth-card">
        <div className="auth-icon">🔐</div>
        <h1>Connexion</h1>
        <p className="auth-subtitle">Accédez à vos rappels de médicaments</p>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Adresse email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="auth-btn">Se connecter</button>
        </form>

        {message && (
          <p className={isError ? 'error-msg' : 'success-msg'}>{message}</p>
        )}

        <div className="auth-footer">
          Pas encore de compte ?{' '}
          <Link to="/register">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
