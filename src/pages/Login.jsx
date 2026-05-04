import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.css'; // ⚡ Import CSS Modules

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Connexion réussie !');
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.loginIcon}>
            <img src="/assets/pill-icon.svg" alt="Icône de pilule" />
          </div>
          <h1>Connexion</h1>
          <p className={styles.loginSubtitle}>Gérez vos rappels de médicaments</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Adresse e-mail</label>
            <input
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.formOptions}>
            <label className={styles.rememberMe}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Se souvenir de moi
            </label>
            <Link to="/forgot-password" className={styles.forgotLink}>
              Mot de passe oublié ?
            </Link>
          </div>

          <button type="submit" className={styles.authBtn}>Se connecter</button>
        </form>

        <div className={styles.authFooter}>
          Pas encore de compte ? <Link to="/register">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
