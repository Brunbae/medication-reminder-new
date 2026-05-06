import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';

const API_URL = "https://medication-reminder-backend-production.up.railway.app/api/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/forgot-password`, { email });
      setIsError(false);
      setSent(true);
      setMessage('✅ Email de réinitialisation envoyé !');
    } catch (error) {
      setIsError(true);
      setMessage('❌ Aucun compte trouvé avec cet email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.loginIcon}>🔑</div>
          <h1>Mot de passe oublié</h1>
          <p className={styles.loginSubtitle}>Entrez votre email pour réinitialiser</p>
        </div>
        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Adresse e-mail</label>
              <input type="email" placeholder="exemple@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            {message && <div className={isError ? styles.errorMsg : styles.successMsg}>{message}</div>}
            <button type="submit" className={styles.authBtn} disabled={loading}>
              {loading ? '⏳ Envoi...' : '📧 Envoyer le lien'}
            </button>
          </form>
        ) : (
          <div className={styles.successMsg} style={{textAlign:'center',padding:'20px'}}>{message}</div>
        )}
        <div className={styles.authFooter}>
          <Link to="/login">← Retour à la connexion</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;