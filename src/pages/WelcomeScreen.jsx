import React from 'react';
import { Link } from 'react-router-dom';
import styles from './WelcomeScreen.module.css';

const WelcomeScreen = () => {
  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.overlay}>
        <div className={styles.header}>
          <h1>❤️ Bienvenue !</h1>
          <p>Votre compagnon pour ne plus oublier vos médicaments</p>
        </div>

        <div className={styles.glassButtons}>
          <Link to="/rappels" className={`${styles.glassButton} ${styles.blue}`}>
            <div className={styles.cardIcon}>💊</div>
            <h2>Rappels de Médicaments</h2>
            <p>Gérez vos prises</p>
          </Link>
          <Link to="/dashboard" className={`${styles.glassButton} ${styles.green}`}>
            <div className={styles.cardIcon}>📈</div>
            <h2>Suivi de Santé</h2>
            <p>Suivez votre santé</p>
          </Link>
          <Link to="/conseils" className={`${styles.glassButton} ${styles.orange}`}>
            <div className={styles.cardIcon}>💡</div>
            <h2>Astuces &amp; Conseils</h2>
            <p>Obtenez des infos utiles</p>
          </Link>
        </div>

        <Link to="/rappels">
          <button className={styles.startButton}>Démarrer</button>
        </Link>

        <div className={styles.footerLinks}>
          <Link to="/login">Connexion</Link>
          <span>|</span>
          <Link to="/register">Créer un Compte</Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
