import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await AuthService.login(email, password);
      setIsError(false);
      setMessage('✅ Connexion réussie !');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      setIsError(true);
      setMessage('❌ Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.loginIcon}>💊</div>
          <h1>Connexion</h1>
          <p className={styles.loginSubtitle}>Gérez vos rappels de médicaments</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Adresse e-mail</label>
            <input type="email" placeholder="exemple@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label>Mot de passe</label>
            <input type="password" placeholder="Votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className={styles.formOptions}>
            <Link to="/forgot-password" className={styles.forgotLink}>Mot de passe oublié ?</Link>
          </div>
          {message && <div className={isError ? styles.errorMsg : styles.successMsg}>{message}</div>}
          <button type="submit" className={styles.authBtn} disabled={loading}>
            {loading ? '⏳ Connexion...' : 'Se connecter'}
          </button>
        </form>
        <div className={styles.authFooter}>
          Pas encore de compte ? <Link to="/register">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;