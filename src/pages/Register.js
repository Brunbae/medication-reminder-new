import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import './Login.css';

const Register = () => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await AuthService.register({ prenom, nom, email, password });
      setIsError(false);
      setMessage('✅ Compte créé avec succès !');
      setTimeout(() => { window.location.href = '/login'; }, 1200);
    } catch (error) {
      setIsError(true);
      setMessage('❌ Erreur lors de la création du compte.');
    }
  };

  return (
    <div className="register-container">
      <div className="auth-card">
        <div className="auth-icon">👤</div>
        <h1>Créer un compte</h1>
        <p className="auth-subtitle">Commencez à gérer vos médicaments</p>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label>Prénom</label>
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Jean"
              required
            />
          </div>
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Dupont"
              required
            />
          </div>
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
          <button type="submit" className="auth-btn">Créer mon compte</button>
        </form>

        {message && (
          <p className={isError ? 'error-msg' : 'success-msg'}>{message}</p>
        )}

        <div className="auth-footer">
          Déjà un compte ?{' '}
          <Link to="/login">Se connecter</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
