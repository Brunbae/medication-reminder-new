import React from 'react';
import { Link } from 'react-router-dom';
import './WelcomeScreen.css';

const WelcomeScreen = () => {
  return (
    <div className="welcome-container">
      <div className="overlay">
        <div className="header">
          <h1>❤️ Bienvenue !</h1>
          <p>Votre compagnon pour ne plus oublier vos médicaments</p>
        </div>

        <div className="glass-buttons">
          <Link to="/rappels" className="glass-button blue">
            <div className="card-icon">💊</div>
            <h2>Rappels de Médicaments</h2>
            <p>Gérez vos prises</p>
          </Link>
          <Link to="/dashboard" className="glass-button green">
            <div className="card-icon">📈</div>
            <h2>Suivi de Santé</h2>
            <p>Suivez votre santé</p>
          </Link>
          <Link to="/register" className="glass-button orange">
            <div className="card-icon">💡</div>
            <h2>Astuces &amp; Conseils</h2>
            <p>Obtenez des infos utiles</p>
          </Link>
        </div>

        <Link to="/rappels">
          <button className="start-button">Démarrer</button>
        </Link>

        <Link to="/conseils" className="glass-button orange"></Link>

        <div className="footer-links">
          <Link to="/login">Connexion</Link>
          <span>|</span>
          <Link to="/register">Créer un Compte</Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
