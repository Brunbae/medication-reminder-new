import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>Rappel Médicaments</Link>
      <ul className={styles.navList}>
        <li>
          <Link to="/" className={location.pathname === '/' ? styles.active : ''}>
            Accueil
          </Link>
        </li>
        <li>
          <Link to="/rappels" className={location.pathname === '/rappels' ? styles.active : ''}>
            Programmer
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? styles.active : ''}>
            Tableau de Bord
          </Link>
        </li>
        <li>
          <Link to="/login" className={location.pathname === '/login' ? styles.active : ''}>
            Connexion
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
